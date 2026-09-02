import { NextResponse } from 'next/server';

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    const res = await fetch('https://sacactivities.kluniversity.in/api/public/activities/upcoming', {
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
