import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');
  let query = supabase.from('clubs').select('*').order('sort_order', { ascending: true });
  if (domain && domain !== 'all') query = query.eq('domain_code', domain);
  const { data } = await query;
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await supabase.from('clubs').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  const { count } = await supabase.from('clubs').select('*', { count: 'exact', head: true });
  await supabase.from('sac_stats').upsert({ key: 'clubs', value: count ?? 0, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  revalidatePath('/clubs');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { slug, ...rest } = await req.json();
  const { error: e } = await supabase.from('clubs')
    .update({ ...rest, updated_at: new Date().toISOString() }).eq('slug', slug);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/clubs');
  revalidatePath(`/clubs/${slug}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { slug } = await req.json();
  const { error: e } = await supabase.from('clubs').delete().eq('slug', slug);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });

  const { count } = await supabase.from('clubs').select('*', { count: 'exact', head: true });
  await supabase.from('sac_stats').upsert({ key: 'clubs', value: count ?? 0, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  revalidatePath('/clubs');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
