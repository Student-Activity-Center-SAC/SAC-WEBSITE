import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { NEWS_ARTICLES, PUBLICATIONS } from '@/lib/content/site-content';
import { ACTIVITIES } from '@/lib/content/activities';

export async function POST(req: NextRequest) {
  const key = req.headers.get('x-setup-key');
  if (key !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  // ── Stats ────────────────────────────────────────────────────────────────
  const { error: statsErr } = await supabase.from('sac_stats').upsert([
    { key: 'students',    value: 8500, label: 'Students Enrolled', suffix: '+' },
    { key: 'clubs',       value: 25,   label: 'Active Clubs',       suffix: ''  },
    { key: 'activities',  value: 400,  label: 'Annual Activities',  suffix: '+' },
    { key: 'achievements',value: 150,  label: 'Achievements',       suffix: '+' },
  ], { onConflict: 'key' });
  results.stats = statsErr ? statsErr.message : 'ok';

  // ── News articles ────────────────────────────────────────────────────────
  const newsRows = NEWS_ARTICLES.map(a => ({
    slug:      a.slug,
    title:     a.title,
    excerpt:   a.excerpt,
    body:      a.body,
    category:  a.category,
    date:      a.date,
    featured:  a.featured,
    photo_url: a.photo ?? null,
  }));
  const { error: newsErr } = await supabase
    .from('news_articles')
    .upsert(newsRows, { onConflict: 'slug' });
  results.news = newsErr ? newsErr.message : `${newsRows.length} articles`;

  // ── Publications ─────────────────────────────────────────────────────────
  const pubRows = PUBLICATIONS.map((p, i) => ({
    id:                 p.id,
    title:              p.title,
    type:               p.type,
    year:               p.year,
    description:        p.description,
    pdf_url:            p.url ?? null,
    download_available: p.downloadAvailable,
    sort_order:         i + 1,
  }));
  const { error: pubErr } = await supabase
    .from('publications')
    .upsert(pubRows, { onConflict: 'id' });
  results.publications = pubErr ? pubErr.message : `${pubRows.length} publications`;

  // ── Activities ───────────────────────────────────────────────────────────
  // Insert in batches of 100 to avoid payload limits
  const BATCH = 100;
  let actInserted = 0;
  let actError: string | null = null;

  for (let i = 0; i < ACTIVITIES.length; i += BATCH) {
    const batch = ACTIVITIES.slice(i, i + BATCH).map(a => ({
      code:          a.code,
      club_slug:     a.clubSlug,
      domain:        a.domain,
      title:         a.title,
      description:   a.description,
      competencies:  a.competencies,
      activity_date: a.activity_date,
      venue:         a.venue,
      time_slot:     a.time ?? null,
      difficulty:    a.difficulty,
      sdc_credits:   a.sdc_credits,
    }));

    const { error } = await supabase
      .from('activities')
      .upsert(batch, { onConflict: 'code' });

    if (error) { actError = error.message; break; }
    actInserted += batch.length;
  }
  results.activities = actError ?? `${actInserted} activities`;

  return NextResponse.json({ success: true, results });
}
