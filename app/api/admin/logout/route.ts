import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Attributes must match the login cookie or some browsers keep the original.
  res.cookies.set('sac_admin', '', {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   0,
    path:     '/',
  });
  return res;
}
