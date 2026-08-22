import { NextRequest, NextResponse } from 'next/server';
import { getObject } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const key = path.join('/');

  try {
    const { body, contentType } = await getObject(key);
    return new NextResponse(body, {
      headers: {
        'Content-Type':  contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new NextResponse('Not found', { status: 404 });
  }
}
