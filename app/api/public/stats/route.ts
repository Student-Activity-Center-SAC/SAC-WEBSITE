import { NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';

export async function GET() {
  const [{ data: statsRows }, { count: clubCount }, { count: domainCount }] = await Promise.all([
    db.from('sac_stats').select('*'),
    db.from('clubs').select('*', { count: 'exact', head: true }),
    db.from('domains').select('*', { count: 'exact', head: true }),
  ]);

  const manual: Record<string, number> = {};
  (statsRows ?? []).forEach((r: any) => { manual[r.key] = r.value; });

  return NextResponse.json({
    success: true,
    data: {
      clubs:      clubCount  ?? 0,
      domains:    domainCount ?? 0,
      students:   manual.students   ?? 0,
      activities: manual.activities ?? 0,
    },
  });
}
