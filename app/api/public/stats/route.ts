import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';

export async function GET() {
  const [{ data: statsRows }, { count: clubCount }, { count: domainCount }] = await Promise.all([
    supabase.from('sac_stats').select('*'),
    supabase.from('clubs').select('*', { count: 'exact', head: true }),
    supabase.from('domains').select('*', { count: 'exact', head: true }),
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
