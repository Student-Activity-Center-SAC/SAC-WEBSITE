import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function POST() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });
  return NextResponse.json({ success: true });
}
