import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Fetch user's current password hash
  const { data: admin } = await db.from('sac_admins').select('password_hash').eq('username', session.username).single();
  
  if (!admin || !admin.password_hash) {
    return NextResponse.json({ error: 'User not found or no password set' }, { status: 400 });
  }

  const valid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  
  try {
    await pool.query('UPDATE `sac_admins` SET `password_hash` = ? WHERE `username` = ?', [newHash, session.username]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
