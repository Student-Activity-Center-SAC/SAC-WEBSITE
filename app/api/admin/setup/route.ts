import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const setupKey = req.headers.get('x-setup-key');
  if (setupKey !== process.env.ADMIN_SETUP_KEY)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { username, password, name } = await req.json();
  if (!username || !password)
    return NextResponse.json({ error: 'username and password required' }, { status: 400 });

  const hash = await bcrypt.hash(password, 12);
  const { error } = await db
    .from('sac_admins')
    .insert({ username, password_hash: hash, name: name ?? username });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, message: 'Admin created.' });
}
