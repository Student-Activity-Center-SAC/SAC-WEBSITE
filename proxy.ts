import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('sac_admin')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const payload = await verifyToken(token);
  const role = payload?.role as string | undefined;
  const validRoles = ['sac_admin', 'admin', 'club_lead'];
  if (!payload || !role || !validRoles.includes(role)) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
