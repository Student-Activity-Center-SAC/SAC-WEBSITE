import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';
import { signToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password)
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

  const { data: admin } = await db
    .from('sac_admins')
    .select('*')
    .eq('username', username)
    .single();

  if (!admin)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  // Dev user first-login: if no password set yet, save whatever they type
  if (admin.username === '2400030188' && !admin.password_hash) {
    const hash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE `sac_admins` SET `password_hash` = ? WHERE `username` = ?', [hash, '2400030188']);
  } else {
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signToken({ username: admin.username, name: admin.name, role: 'sac_admin' });
  const res = NextResponse.json({ success: true, name: admin.name });
  res.cookies.set('sac_admin', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 12, path: '/' });
  return res;
}
