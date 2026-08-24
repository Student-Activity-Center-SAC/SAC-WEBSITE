import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { putObject, makeKey } from '@/lib/storage';

// SVG is deliberately excluded — no upload flow in the admin needs it, and
// serving user-supplied SVGs back with an image content-type lets embedded
// <script> run in the browser (stored XSS).
const MIME_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png',  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB — covers ebook PDFs and photos
const SAFE_FOLDER = /^[a-zA-Z0-9_-]+$/;

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const formData = await req.formData();
    const file       = formData.get('file') as File;
    const rawFolder  = (formData.get('folder') as string) || 'misc';
    const folder     = SAFE_FOLDER.test(rawFolder) ? rawFolder : 'misc';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File exceeds the 25MB upload limit' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(ext in MIME_EXT)) {
      return NextResponse.json({ error: `Unsupported file type: .${ext}` }, { status: 415 });
    }

    const name        = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const key         = makeKey(folder, name);
    const contentType = MIME_EXT[ext];
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
