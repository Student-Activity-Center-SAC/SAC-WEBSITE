import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase-admin';

export async function GET() {
  const { data } = await supabase.from('site_settings').select('*').order('key');
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const updates: { key: string; value: string }[] = await req.json();
  const rows = updates.map(u => ({ ...u, updated_at: new Date().toISOString() }));
  const { error: e } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/stories');
  return NextResponse.json({ success: true });
}
