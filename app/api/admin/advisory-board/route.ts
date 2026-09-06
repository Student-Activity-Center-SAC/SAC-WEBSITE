import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  const { data, error } = await db
    .from('advisory_board')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (session?.role === 'club_lead') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await db.from('advisory_board').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/leadership');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (session?.role === 'club_lead') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id, ...rest } = await req.json();
  const { error: e } = await db.from('advisory_board').update(rest).eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/leadership');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (session?.role === 'club_lead') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { orderedIds } = await req.json() as { orderedIds: string[] };
  const updates = orderedIds.map((id, i) =>
    db.from('advisory_board').update({ sort_order: i }).eq('id', id)
  );
  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 400 });

  revalidatePath('/leadership');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (session?.role === 'club_lead') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { id } = await req.json();
  const { error: e } = await db.from('advisory_board').delete().eq('id', id);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/leadership');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
