import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url', { status: 400 });

  if (!/^https?:\/\//i.test(url))
    return new NextResponse('Invalid url', { status: 400 });

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SAC-Website/1.0)' },
    });
    if (!upstream.ok)
      return new NextResponse('Could not fetch PDF from origin', { status: 502 });

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/pdf',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new NextResponse('Proxy error', { status: 502 });
  }
}
