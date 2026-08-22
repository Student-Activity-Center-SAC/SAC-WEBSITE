import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { putObject, makeKey } from '@/lib/storage';

const MIME_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png',  gif: 'image/gif',
  webp: 'image/webp', svg: 'image/svg+xml',
  pdf: 'application/pdf',
};

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const formData = await req.formData();
    const file     = formData.get('file') as File;
    const folder   = (formData.get('folder') as string) || 'misc';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ext         = file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const name        = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const key         = makeKey(folder, name);
    const contentType = MIME_EXT[ext] ?? 'application/octet-stream';
    const buffer      = Buffer.from(await file.arrayBuffer());

    await putObject(key, buffer, contentType);

    return NextResponse.json({ success: true, url: `/api/uploads/${key}` });
  } catch (err: any) {
    console.error('[upload] error:', err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? 'Upload failed' },
      { status: 500 }
    );
  }
}
