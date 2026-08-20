import { NextResponse, NextRequest } from 'next/server';
import { ACTIVITIES } from '@/lib/content/activities';

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');
  const data = domain && domain !== 'all'
    ? ACTIVITIES.filter(a => a.domain === domain)
    : ACTIVITIES;
  return NextResponse.json({ success: true, data });
}
