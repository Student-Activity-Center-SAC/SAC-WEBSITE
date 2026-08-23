import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { data } = await db.from('site_settings').select('*').order('key');
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const updates: { key: string; value: string; label?: string }[] = await req.json();
  if (!Array.isArray(updates))
    return NextResponse.json({ error: 'Expected an array of settings' }, { status: 400 });

  // `label` is NOT NULL with no default, so a brand-new key needs one. Derive a
  // readable fallback from the key ("hero_title" -> "Hero Title").
  // `updated_at` is maintained by MySQL (ON UPDATE CURRENT_TIMESTAMP); sending
  // a JS ISO-8601 string here is rejected with "Incorrect datetime value".
  const rows = updates.map(u => ({
    key:   u.key,
    value: u.value,
    label: u.label ?? u.key.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  }));

  const { error: e } = await db.from('site_settings').upsert(rows, { onConflict: 'key' });
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/stories');
  return NextResponse.json({ success: true });
}
