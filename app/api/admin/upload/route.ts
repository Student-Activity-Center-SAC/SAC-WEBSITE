import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { putObject, makeKey } from '@/lib/storage';

// SVG is deliberately excluded — no upload flow in the admin needs it, and
// serving user-supplied SVGs back with an image content-type lets embedded
// <script> run in the browser (stored XSS).

// For images: accept any format the browser reports as image/*
const IMAGE_EXTS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'avif', 'heic', 'heif',
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;  // 5 MB for images
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

    const ext = (file.name.split('.').pop() ?? '').toLowerCase();
    const isPdf = ext === 'pdf';
    const isImage = file.type.startsWith('image/') || IMAGE_EXTS.has(ext);

    if (!isPdf && !isImage) {
      return NextResponse.json(
        { error: `Unsupported file type: .${ext || '?'}. Allowed: images (jpg, png, webp, etc.) or pdf.` },
        { status: 415 },
      );
    }

    // SVG blocked regardless
    if (ext === 'svg' || file.type === 'image/svg+xml') {
      return NextResponse.json({ error: 'SVG uploads are not allowed.' }, { status: 415 });
    }

    if (isImage && file.size > MAX_IMAGE_BYTES) {
      const limitMB  = Math.round(MAX_IMAGE_BYTES / 1024 / 1024);
      const sizeMB   = (file.size / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { error: `Image too large (${sizeMB} MB). Max allowed is ${limitMB} MB. Please compress it first.` },
        { status: 400 }
      );
    }

    // Derive content-type: trust browser for images, force pdf mime for pdf
    const contentType = isPdf ? 'application/pdf' : (file.type || 'image/jpeg');
    // Normalise extension so stored keys are always lowercase
    const safeExt = ext || (isPdf ? 'pdf' : 'jpg');
    const name    = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;
    const key     = makeKey(folder, name);
    const buffer  = Buffer.from(await file.arrayBuffer());

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
