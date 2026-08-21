import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import { STUDENT_STORIES } from '@/lib/content/site-content';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-setup-key');
  if (key !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const rows = STUDENT_STORIES.map((s, i) => ({
    slug:         s.slug,
    title:        s.title,
    student_name: s.studentName,
    student_year: s.studentYear ?? null,
    club_name:    s.clubName ?? null,
    domain_code:  s.domainCode ?? null,
    excerpt:      s.excerpt ?? '',
    body:         s.body ?? '',
    photo:        s.photo ?? null,
    tags:         s.tags ?? [],
    featured:     i === 0,
    sort_order:   i,
  }));

  const { error } = await db.from('stories').upsert(rows, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, seeded: rows.length });
}
