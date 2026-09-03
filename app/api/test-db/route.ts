import { NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: tables, error: e1 } = await db.rpc('get_tables').catch(() => ({ data: null, error: null }));
    const { data: activities, error: e2 } = await db.from('activities').select('*').limit(1);
    const { data: anyData, error: e3 } = await db.from('activities').select('count', { count: 'exact' });
    
    // Also try to list schema if possible, or just return what we got
    return NextResponse.json({
      activitiesCount: anyData,
      activitiesSample: activities,
      tables: tables,
      errors: [e1, e2, e3]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
