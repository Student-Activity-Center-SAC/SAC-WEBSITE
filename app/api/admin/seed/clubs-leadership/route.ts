import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';
import { CLUBS } from '@/lib/content/clubs';
import { STUDENT_COUNCIL } from '@/lib/content/student-council';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-setup-key');
  if (key !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // ── Clubs ─────────────────────────────────────────────────────────────────
  const clubRows = CLUBS.map((c, i) => ({
    slug:            c.slug,
    name:            c.name,
    domain_code:     c.domainCode,
    domain_slug:     c.domainSlug,
    tagline:         c.tagline,
    about:           c.about,
    purpose:         c.purpose,
    competencies:    c.competencies,
    activities_list: c.activities,
    logo_url:        null,
    sort_order:      i + 1,
  }));

  const { error: clubErr } = await db
    .from('clubs')
    .upsert(clubRows, { onConflict: 'slug' });
  results.clubs = clubErr ? clubErr.message : `${clubRows.length} clubs`;

  // ── Council members ───────────────────────────────────────────────────────
  const memberRows = STUDENT_COUNCIL.map((m, i) => ({
    id:            m.id,
    name:          m.name,
    role:          m.role,
    subtitle:      m.subtitle ?? null,
    photo:         m.photo ?? null,
    year_of_study: m.year ?? null,
    branch:        m.branch ?? null,
    linkedin:      m.linkedin ?? null,
    journey:       m.journey ?? null,
    achievements:  m.achievements ?? [],
    clubs_list:    m.clubs ?? [],
    club_lead:     m.clubLead ?? null,
    is_faculty:    m.isFaculty ?? false,
    designation:   m.designation ?? null,
    sort_order:    i + 1,
  }));

  const { error: memberErr } = await db
    .from('council_members')
    .upsert(memberRows, { onConflict: 'id' });
  results.council = memberErr ? memberErr.message : `${memberRows.length} members`;

  return NextResponse.json({ success: true, results });
}
