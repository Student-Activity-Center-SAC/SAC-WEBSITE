import { NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await db.from('activities').select('*').order('activity_date', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const upcoming = (data || []).filter((a: any) => {
    const d = new Date(a.activity_date);
    return d > new Date() && !a.report;
  });

  return NextResponse.json({
    success: true,
    total: upcoming.length,
    activities: upcoming,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    }
  });
}
