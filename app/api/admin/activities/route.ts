import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET(req: NextRequest) {
  const domain   = req.nextUrl.searchParams.get('domain');
  const clubSlug = req.nextUrl.searchParams.get('club_slug');
  let query = db.from('activities').select('*').order('activity_date', { ascending: false });
  if (domain   && domain   !== 'all') query = query.eq('domain',    domain);
  if (clubSlug && clubSlug !== 'all') query = query.eq('club_slug', clubSlug);
  const { data } = await query;
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await db.from('activities').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/activities');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { code, ...rest } = await req.json();
  const { error: e } = await db.from('activities').update(rest).eq('code', code);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/activities');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { code } = await req.json();
  await db.from('activities').delete().eq('code', code);
  revalidatePath('/activities');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
