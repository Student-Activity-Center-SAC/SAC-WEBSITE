import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

// ── Brute-force protection ────────────────────────────────────────────────────
// In-memory sliding window. Resets on deploy, which is acceptable for a single
// PM2 instance; move to Redis if the app is ever scaled horizontally.
//
// Two independent limiters are enforced:
//  - by IP:       cheap first line of defense, but `x-forwarded-for` is
//                 client-suppliable when there's no trusted reverse proxy in
//                 front of this app overwriting it, so it alone is spoofable.
//  - by username: not spoofable via headers (an attacker can't change which
//                 account they're trying to break into), so this is what
//                 actually bounds brute force against one admin account even
//                 if the IP limiter is defeated. Given a generous longer
//                 fuse than the IP limiter to keep accidental lockout of a
//                 legitimate admin (e.g. a third party hammering their
//                 username) unlikely.
const MAX_ATTEMPTS_IP       = 5;
const WINDOW_MS_IP          = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_USER     = 10;
const WINDOW_MS_USER        = 30 * 60 * 1000; // 30 minutes

const ipAttempts   = new Map<string, { count: number; first: number }>();
const userAttempts = new Map<string, { count: number; first: number }>();

function checkLimit(
  store: Map<string, { count: number; first: number }>,
  key: string,
  max: number,
  windowMs: number,
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const rec = store.get(key);

  if (!rec || now - rec.first > windowMs) {
    store.set(key, { count: 1, first: now });
    return { allowed: true, retryAfter: 0 };
  }
  rec.count++;
  if (rec.count > max) {
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - rec.first)) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

function clearAttempts(ip: string, username: string) {
  ipAttempts.delete(ip);
  userAttempts.delete(username.toLowerCase());
}

// Periodically evict stale entries so the maps cannot grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [k, rec] of ipAttempts)   if (now - rec.first > WINDOW_MS_IP)   ipAttempts.delete(k);
  for (const [k, rec] of userAttempts) if (now - rec.first > WINDOW_MS_USER) userAttempts.delete(k);
}, WINDOW_MS_USER).unref?.();

function clientIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  try {
    const body = await req.json().catch(() => ({}));
    const { username, password } = body;

    const usernameKey = typeof username === 'string' ? username.toLowerCase() : '';

    const ipCheck = checkLimit(ipAttempts, ip, MAX_ATTEMPTS_IP, WINDOW_MS_IP);
    const userCheck = usernameKey
      ? checkLimit(userAttempts, usernameKey, MAX_ATTEMPTS_USER, WINDOW_MS_USER)
      : { allowed: true, retryAfter: 0 };

    if (!ipCheck.allowed || !userCheck.allowed) {
      const retryAfter = Math.max(ipCheck.retryAfter, userCheck.retryAfter);
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } },
      );
    }

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password)
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });


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

    clearAttempts(ip, username);

    const token = await signToken({
      username: admin.username,
      name: admin.name,
      role: admin.role || 'admin',
      club_name: admin.club_name || null,
    });

    const res = NextResponse.json({ success: true, name: admin.name });
    res.cookies.set('sac_admin', token, {
      httpOnly: true,
      secure:   false,
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
