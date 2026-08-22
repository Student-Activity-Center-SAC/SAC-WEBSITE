import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'misc';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const ext  = file.name.split('.').pop() ?? 'bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const dir  = join(process.cwd(), 'public', 'uploads', folder);
    const filePath = join(dir, name);

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ success: true, url: `/uploads/${folder}/${name}` });
  } catch (err: any) {
    console.error('[upload] file write error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Upload failed — check server write permissions' },
      { status: 500 }
    );
  }
}
