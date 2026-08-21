import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/query-builder';

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');

  let query = db.from('activities').select('*').order('activity_date', { ascending: false });
  if (domain && domain !== 'all') query = query.eq('domain', domain);

  const [{ data: activities, error }, { data: clubs }] = await Promise.all([
    query,
    db.from('clubs').select('slug, name'),
  ]);

  if (error) return NextResponse.json({ success: false, data: [] }, { status: 500 });

  const clubNameMap = Object.fromEntries((clubs ?? []).map((c: any) => [c.slug, c.name]));
  const data = (activities ?? []).map((a: any) => ({ ...a, club_name: clubNameMap[a.club_slug] ?? '' }));

  return NextResponse.json({ success: true, data });
}
