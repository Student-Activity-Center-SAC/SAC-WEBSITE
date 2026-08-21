import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  const folder = (formData.get('folder') as string) || 'misc';

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const ext  = file.name.split('.').pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buf  = Buffer.from(await file.arrayBuffer());

  const { error: uploadErr } = await db.storage
    .from('sac-media')
    .upload(name, buf, { contentType: file.type, upsert: false });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  const { data } = db.storage.from('sac-media').getPublicUrl(name);
  return NextResponse.json({ success: true, url: data.publicUrl });
}
