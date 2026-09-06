import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { data } = await db.from('sac_admins').select('id, username, name, role, club_name, created_at').order('created_at', { ascending: false });
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { username, name, password, role, club_name } = await req.json();
  if (!username || !password || !name) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  
  try {
    const [result]: any = await pool.query(
      'INSERT INTO `sac_admins` (`username`, `name`, `password_hash`, `role`, `club_name`) VALUES (?, ?, ?, ?, ?)',
      [username, name, hash, role || 'admin', club_name || null]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (e: any) {
    if (e.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  // Prevent deleting oneself
  const { data: userToDelete } = await db.from('sac_admins').select('username').eq('id', id).single();
  if (userToDelete?.username === session.username) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }

  await pool.query('DELETE FROM `sac_admins` WHERE `id` = ?', [id]);
  return NextResponse.json({ success: true });
}

// Dev-only: Reset password
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });
  
  const DEV_USER = process.env.ADMIN_SQL_USER;
  if (!DEV_USER || session.username !== DEV_USER) {
    return NextResponse.json({ error: 'Forbidden. Only Dev user can reset passwords.' }, { status: 403 });
  }

  const { id, password } = await req.json();
  if (!id || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  await pool.query('UPDATE `sac_admins` SET `password_hash` = ? WHERE `id` = ?', [hash, id]);
  return NextResponse.json({ success: true });
}
