import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

// ── Brute-force protection ────────────────────────────────────────────────────
// In-memory sliding window. Resets on deploy, which is acceptable for a single
// PM2 instance; move to Redis if the app is ever scaled horizontally.
const MAX_ATTEMPTS  = 5;
const WINDOW_MS     = 15 * 60 * 1000; // 15 minutes
const attempts = new Map<string, { count: number; first: number }>();

function rateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const rec = attempts.get(ip);

  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return { allowed: true, retryAfter: 0 };
  }
  rec.count++;
  if (rec.count > MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((WINDOW_MS - (now - rec.first)) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

// Periodically evict stale entries so the map cannot grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of attempts) {
    if (now - rec.first > WINDOW_MS) attempts.delete(ip);
  }
}, WINDOW_MS).unref?.();

function clientIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const { allowed, retryAfter } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body;

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password)
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const { data: admin } = await db
      .from('sac_admins')
      .select('*')
      .eq('username', username)
      .single();

    if (!admin) {
      // Equalise response time with the bcrypt path so an attacker cannot
      // distinguish "no such user" from "wrong password".
      await bcrypt.hash(password, 12);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!admin.password_hash) {
      // First-login enrolment: the account was provisioned with a NULL hash and
      // the first password submitted becomes the account password. Guarded by
      // the rate limiter above; provisioning is admin-only (see /api/admin/setup).
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        'UPDATE `sac_admins` SET `password_hash` = ? WHERE `username` = ? AND `password_hash` IS NULL',
        [hash, admin.username],
      );
      console.warn(`[login] first-login enrolment for "${admin.username}" from ${ip}`);
    } else {
      const valid = await bcrypt.compare(password, admin.password_hash);
      if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    clearAttempts(ip);

    const token = await signToken({
      username: admin.username,
      name: admin.name,
      role: 'sac_admin',
    });

    const res = NextResponse.json({ success: true, name: admin.name });
    res.cookies.set('sac_admin', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 12,
      path:     '/',
    });
    return res;
  } catch (err: any) {
    console.error('[login]', err);
    // Never leak internal error details to the client.
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
