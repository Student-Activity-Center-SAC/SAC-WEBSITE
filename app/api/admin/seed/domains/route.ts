import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import { DOMAINS } from '@/lib/content/domains';

export async function POST(req: NextRequest) {
  if (req.headers.get('x-setup-key') !== 'KLSACsetup2026')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const rows = DOMAINS.map((d, i) => ({
    slug:        d.slug,
    code:        d.code,
    name:        d.name,
    short_name:  d.shortName,
    tagline:     d.tagline,
    headline:    d.headline,
    philosophy:  d.philosophy,
    description: d.description,
    color:       d.color,
    accent_bg:   d.accentBg,
    text_color:  d.textColor,
    competencies: d.competencies,
    cover_url:   null,
    gallery:     [],
    sort_order:  i,
  }));

  const { error } = await db.from('domains').upsert(rows, { onConflict: 'slug' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, count: rows.length });
}
