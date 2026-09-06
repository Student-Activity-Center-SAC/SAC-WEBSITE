import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { session, error: authError } = await requireAdmin();
  if (authError || !session) return NextResponse.json({ error: authError }, { status: 401 });

  let query = db
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false });

  if (session.role === 'club_lead') {
    query = query.eq('club_name', session.club_name);
  }

  let { data, error } = await query;

  let needsMigration = false;
  if (error) {
    needsMigration = true;
    let fallbackQuery = db
      .from('achievements')
      .select('*')
      .order('year', { ascending: false });
    if (session.role === 'club_lead') {
      fallbackQuery = fallbackQuery.eq('club_name', session.club_name);
    }
    const fallback = await fallbackQuery;
    data = fallback.data;
  }

  return NextResponse.json({ success: true, data: data ?? [], needsMigration });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  
  if (session.role === 'club_lead') {
    body.club_name = session.club_name;
  }

  const { data, error: e } = await db.from('achievements').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });

  const { id, ...rest } = await req.json();
  
  let query = db.from('achievements').update(rest).eq('id', id);
  if (session.role === 'club_lead') {
    query = query.eq('club_name', session.club_name);
    rest.club_name = session.club_name;
  }

  const { error: e } = await query;
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

// Reorder: receives the full ordered list of ids, assigns sort_order 0..n
export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });

  const { orderedIds } = await req.json() as { orderedIds: string[] };
  const updates = orderedIds.map((id, i) => {
    let query = db.from('achievements').update({ sort_order: i }).eq('id', id);
    if (session.role === 'club_lead') query = query.eq('club_name', session.club_name);
    return query;
  });
  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message, needsMigration: true }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error || !session) return NextResponse.json({ error }, { status: 401 });

  const { id } = await req.json();
  
  let query = db.from('achievements').delete().eq('id', id);
  if (session.role === 'club_lead') query = query.eq('club_name', session.club_name);

  const { error: e } = await query;
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  revalidatePath('/achievements');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
