import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('sac_admin')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'sac_admin') {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
