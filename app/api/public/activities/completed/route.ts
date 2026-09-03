import { NextResponse } from 'next/server';
import { fetchSamamActivities } from '@/lib/samam-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchSamamActivities('/api/public/activities/completed');
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
