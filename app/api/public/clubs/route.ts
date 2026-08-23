import { NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';

function toSlug(name: string) {
  return name?.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') ?? '';
}

export async function GET() {
  // The `clubs` table stores club_name / club_domain / club_description /
  // club_logo; map those onto the shape the public site consumes.
  const { data, error } = await db
    .from('clubs')
    .select('*')
    .order('club_name', { ascending: true });

  if (error) {
    console.error('[public/clubs]', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }

  const clubs = (data ?? []).map((c: any, i: number) => ({
    id:          c.id,
    slug:        toSlug(c.club_name),
    name:        c.club_name,
    domain_code: c.club_domain,
    domain_slug: c.club_domain?.toLowerCase() ?? '',
    tagline:     c.club_description,
    logo_url:    c.club_logo,
    sort_order:  i + 1,
  }));

  return NextResponse.json({ success: true, data: clubs });
}
