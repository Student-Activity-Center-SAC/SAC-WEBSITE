import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  let { data, error } = await db
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false });

  let needsMigration = false;
  if (error) {
    needsMigration = true;
    const fallback = await db
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });
    data = fallback.data;
  }

  return NextResponse.json({ success: true, data: data ?? [], needsMigration });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await db.from('achievements').insert({
    ...body,
    updated_at: new Date().toISOString(),
  }).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id, ...rest } = await req.json();
  const { error: e } = await db.from('achievements')
    .update({ ...rest, updated_at: new Date().toISOString() }).eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

// Reorder: receives the full ordered list of ids, assigns sort_order 0..n
export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { orderedIds } = await req.json() as { orderedIds: string[] };
  const updates = orderedIds.map((id, i) =>
    db.from('achievements').update({ sort_order: i }).eq('id', id)
  );
  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message, needsMigration: true }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id } = await req.json();
  const { error: e } = await db.from('achievements').delete().eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
