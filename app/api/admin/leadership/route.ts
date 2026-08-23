import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { data } = await db.from('council_members').select('*').order('sort_order', { ascending: true });
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await db.from('council_members').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/leadership');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id, updated_at: _ts, ...rest } = await req.json();
  const { error: e } = await db.from('council_members')
    .update(rest).eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/leadership');
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { order } = await req.json() as { order: { id: string; sort_order: number }[] };
  if (!Array.isArray(order)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  for (const { id, sort_order } of order) {
    await db.from('council_members').update({ sort_order }).eq('id', id);
  }

  revalidatePath('/leadership');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id } = await req.json();
  const { error: e } = await db.from('council_members').delete().eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/leadership');
  return NextResponse.json({ success: true });
}
