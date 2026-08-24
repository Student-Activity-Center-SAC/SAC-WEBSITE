import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown, Camera } from 'lucide-react';
import { DOMAINS } from '@/lib/content/domains';
import { DEMO_CLUBS } from '@/lib/demo-data';
import { FadeIn } from './_components/FadeIn';
import StatCounter from './_components/StatCounter';
import { db } from '@/lib/query-builder';
import { PartnersMarquee } from './_components/PartnersMarquee';
import { UpcomingActivitiesHome } from './_components/UpcomingActivitiesHome';
import { LatestNewsCarousel } from './_components/LatestNewsCarousel';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'KL SAC — Student Activity Center, KL University',
  description:
    'KL SAC is KL University\'s Student Activity Center — 24 clubs, 5 domains, one mission: to develop the complete student.',
};

const JOURNEY_STEPS = [
  { title: 'Discover',    description: 'Explore your interests across five domains and twenty-five clubs. Find the community that matches who you are — or who you want to become.' },
  { title: 'Participate', description: 'Join activities, competitions, workshops, and programmes that go beyond the curriculum. Every participation builds real-world experience.' },
  { title: 'Develop',     description: 'Build competencies that employers and institutions recognise — technical, creative, leadership, and interpersonal skills that define the complete professional.' },
  { title: 'Lead',        description: 'Take responsibility within your club — as a coordinator, team leader, or domain representative. Leadership at SAC is earned through performance, not appointment.' },
  { title: 'Create',      description: 'Build something that matters: a product, a performance, a project, a venture. SAC gives you the platform, the mentors, and the collaborators you need.' },
  { title: 'Impact',      description: 'Carry your experience beyond campus — in your career, your community, and your commitment to the values KL SAC instilled in you.' },
];

export default async function HomePage() {
  const [storiesRes, settingsRes, newsRes, domainsRes, clubsRes, statsRes, partnersRes] = await Promise.all([
    db.from('stories').select('slug, title, student_name, student_year, club_name, domain_code, excerpt, photo, homepage_order').gt('homepage_order', 0).order('homepage_order', { ascending: true }),
    db.from('site_settings').select('key, value'),
    db.from('news_articles').select('slug, title, excerpt, photo_url, category, date').gt('homepage_order', 0).order('homepage_order', { ascending: true }).limit(6),
    db.from('domains').select('slug, code, name, tagline, color, accent_bg').order('sort_order', { ascending: true }),
    db.from('clubs').select('domain_code, slug, name'),
    db.from('sac_stats').select('key, value'),
    db.from('partners').select('*'),
  ]);

  const stories      = storiesRes.data ?? [];
  const newsArticles = newsRes.data ?? [];
  const domains      = domainsRes.data ?? [];
  const partners     = partnersRes.data ?? [];
  const settingsMap: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((s: any) => { if (s.value) settingsMap[s.key] = s.value; });
  const heroVideoUrl = settingsMap['hero_video_url'] || 'https://pub-2172d3960f064d32b43c4d6ba9a3135d.r2.dev/hero.mp4';
  const featuredStory = stories.find(s => s.homepage_order === 1) ?? null;
  const sideStories   = stories.filter(s => (s.homepage_order ?? 0) > 1).slice(0, 2);

  const clubCountByDomain: Record<string, number> = {};
  (clubsRes.data ?? []).forEach((c: any) => {
    clubCountByDomain[c.domain_code] = (clubCountByDomain[c.domain_code] ?? 0) + 1;
  });
  const totalClubs = Object.values(clubCountByDomain).reduce((a, b) => a + b, 0);

  const sacStatsMap: Record<string, number> = {};
  (statsRes.data ?? []).forEach((s: any) => { sacStatsMap[s.key] = s.value; });
  const statStudents   = sacStatsMap['students']   ?? 0;
  const statActivities = sacStatsMap['activities'] ?? 0;

  return (
    <>
      {/* ══════════════════════════════════════════════════════ HERO ══ */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: '100svh', background: '#150404' }}>

        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideoUrl}
          aria-hidden="true"
        />

        {/* Gradient overlay — bottom-anchored like turbo-giggle */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,2,2,0.92) 0%, rgba(15,2,2,0.55) 45%, rgba(15,2,2,0.3) 100%)' }}
          aria-hidden="true" />

        {/* Content */}
        <div className="hero-content relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 pb-16 sm:pb-24 pt-24">

          {/* Kicker */}
          <div className="kicker mb-8 animate-fade-in" style={{ color: 'rgba(255,255,255,0.55)' }}>
            KL University · Student Activity Center
          </div>

          {/* Headline */}
          <h1
            className="font-display font-medium leading-[1.06] mb-6 animate-fade-up"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.25rem)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Student Life.
            <br />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>Beyond the</span>
            <br />
            Classroom.
          </h1>

          {/* Body */}
          <p className="text-[15px] sm:text-base leading-relaxed mb-10 animate-fade-up delay-100"
            style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '48ch' }}>
            KL SAC is where 20+ clubs, {domains.length > 0 ? `${domains.length} domains` : 'five domains'}, and thousands of students come together to build something larger than a degree.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-200">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: '#970003', color: '#fff' }}>
              Explore SAC
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/clubs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.28)', color: '#fff' }}>
              Browse Clubs
            </Link>
            <Link
              href="https://sacactivities.kluniversity.in/auth/login"
              target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 font-semibold text-sm transition-opacity hover:opacity-75 border-b pb-0.5"
              style={{ color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.3)' }}>
              Student Dashboard
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle opacity-35">
          <ChevronDown size={20} style={{ color: '#fff' }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════ AT A GLANCE ══ */}
      <section style={{ background: '#faf6f1' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0"
            style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
            {[
              { value: '20+', label: 'Active Clubs',      borderCls: 'hairline border-r border-b lg:border-b-0' },
              { value: domains.length > 0 ? String(domains.length)   : '5',   label: 'Learning Domains',  borderCls: 'hairline border-b lg:border-b-0 lg:border-r' },
              { value: statStudents   > 0 ? `${statStudents}+`       : '5000+', label: 'Students Annually', borderCls: 'hairline border-r' },
              { value: statActivities > 0 ? `${statActivities}+`     : '300+', label: 'Annual Activities', borderCls: '' },
            ].map((s) => (
              <StatCounter
                key={s.label}
                value={s.value}
                label={s.label}
                duration={1800}
                className={`px-6 lg:px-10 py-8 lg:py-10 ${s.borderCls}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ WHAT HAPPENS AT SAC ══ */}
      <section style={{ background: '#fffdfb' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 lg:py-16">

          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="kicker mb-3" style={{ color: '#970003' }}>The SAC Journey</p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                What happens when<br className="hidden sm:block" /> you join KL SAC?
              </h2>
            </div>
            <p className="text-sm shrink-0" style={{ color: 'rgba(25,19,19,0.4)', maxWidth: '22ch', lineHeight: 1.6 }}>
              Six stages. One transformation.
            </p>
          </FadeIn>

          {/* ── Snake grid (desktop) ── */}
          <div className="hidden md:block">
            {/* Row 1: steps 1–3 left→right */}
            <div className="grid grid-cols-3 gap-3">
              {JOURNEY_STEPS.slice(0, 3).map((step, i) => (
                <FadeIn key={step.title} delay={i * 0.08}>
                  <div className="relative rounded-2xl p-5 h-full hover-card"
                    style={{ background: '#fff', border: '1px solid var(--hairline)', boxShadow: '0 2px 16px -6px rgba(25,19,19,0.07)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display tabular-nums text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: '#fdf2f2', color: '#970003' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {i < 2 && (
                        <span className="text-xs font-bold" style={{ color: 'rgba(151,0,3,0.25)' }}>→</span>
                      )}
                    </div>
                    <p className="font-semibold text-sm uppercase tracking-[0.08em] mb-1.5" style={{ color: '#191313' }}>
                      {step.title}
                    </p>
                    <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(25,19,19,0.48)' }}>
                      {step.description}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* U-turn connector between rows */}
            <div className="flex items-center justify-end" style={{ height: '36px', paddingRight: '0' }}>
              <div style={{ width: '33.33%', display: 'flex', alignItems: 'center', paddingRight: '12px' }}>
                <svg width="100%" height="36" viewBox="0 0 200 36" fill="none" aria-hidden="true">
                  <path d="M 0,4 Q 180,4 180,18 Q 180,32 0,32"
                    stroke="rgba(151,0,3,0.2)" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
                  <path d="M 6,26 L 0,32 L 6,38" stroke="rgba(151,0,3,0.3)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>

            {/* Row 2: steps 4–6 displayed right→left (04 under 03, 06 under 01) */}
            <div className="grid grid-cols-3 gap-3">
              {[...JOURNEY_STEPS.slice(3)].reverse().map((step, i) => {
                const realIdx = 5 - i;
                return (
                  <FadeIn key={step.title} delay={realIdx * 0.08}>
                    <div className="relative rounded-2xl p-5 h-full hover-card"
                      style={{ background: '#fff', border: '1px solid var(--hairline)', boxShadow: '0 2px 16px -6px rgba(25,19,19,0.07)' }}>
                      <div className="flex items-center justify-between mb-3">
                        {i > 0 && (
                          <span className="text-xs font-bold" style={{ color: 'rgba(151,0,3,0.25)' }}>←</span>
                        )}
                        <span className="font-display tabular-nums text-xs font-semibold px-2.5 py-1 rounded-full ml-auto"
                          style={{ background: '#fdf2f2', color: '#970003' }}>
                          {String(realIdx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="font-semibold text-sm uppercase tracking-[0.08em] mb-1.5" style={{ color: '#191313' }}>
                        {step.title}
                      </p>
                      <p className="text-[12.5px] leading-relaxed" style={{ color: 'rgba(25,19,19,0.48)' }}>
                        {step.description}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          {/* ── Mobile 2-col grid ── */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {JOURNEY_STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.06}>
                <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid var(--hairline)' }}>
                  <span className="font-display tabular-nums text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block mb-2.5"
                    style={{ background: '#fdf2f2', color: '#970003' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-semibold text-xs uppercase tracking-[0.08em] mb-1" style={{ color: '#191313' }}>
                    {step.title}
                  </p>
                  <p className="text-[11.5px] leading-relaxed" style={{ color: 'rgba(25,19,19,0.48)' }}>
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════ FIVE DOMAINS ══ */}
      <section style={{ background: '#fffdfb' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-16 lg:py-20">

          {/* Header row */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="kicker mb-3" style={{ color: '#970003' }}>
                {domains.length || 5} Domains · 20+ Clubs
              </p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Every passion. One ecosystem.
              </h2>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <Link href="/clubs"
                className="inline-flex items-center gap-1.5 font-semibold text-sm transition-opacity hover:opacity-70"
                style={{ color: '#970003' }}>
                Browse clubs <ArrowRight size={13} />
              </Link>
            </div>
          </FadeIn>

          {/* Domain rows with club pills */}
          <FadeIn>
            {(() => {
              const dbClubs = (clubsRes.data ?? []) as any[];
              const dbByDomain: Record<string, boolean> = {};
              dbClubs.forEach(c => { if (c.domain_code) dbByDomain[c.domain_code] = true; });
              const hasMappedClubs = dbClubs.some(c => c.domain_code && c.name);
              const allClubs = hasMappedClubs
                ? dbClubs
                : DEMO_CLUBS.map(c => ({ domain_code: c.domain, slug: c.name.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g,'-'), name: c.name }));
              const clubsByDomain: Record<string, { name: string; slug: string }[]> = {};
              allClubs.forEach((c: any) => {
                if (!clubsByDomain[c.domain_code]) clubsByDomain[c.domain_code] = [];
                clubsByDomain[c.domain_code].push({ name: c.name, slug: c.slug });
              });

              const domainRows = domains.length > 0 ? domains : [
                { code: 'TEC', name: 'Central Technology Clubs',              slug: 'technology',    color: '#970003', accent_bg: 'rgba(151,0,3,0.07)' },
                { code: 'LCH', name: 'Liberal Arts, Creative Arts & Hobby',   slug: 'liberal-arts',  color: '#970003', accent_bg: 'rgba(151,0,3,0.07)' },
                { code: 'ESO', name: 'Extension & Society Outreach Clubs',    slug: 'social-outreach', color: '#970003', accent_bg: 'rgba(151,0,3,0.07)' },
                { code: 'IIE', name: 'Innovation, Incubation & Entrepreneurship', slug: 'innovation', color: '#970003', accent_bg: 'rgba(151,0,3,0.07)' },
                { code: 'HWB', name: 'Health and Wellbeing Clubs',            slug: 'health-wellbeing', color: '#970003', accent_bg: 'rgba(151,0,3,0.07)' },
              ];

              return (
                <div style={{ borderTop: '1px solid var(--hairline)' }}>
                  {domainRows.map((d: any, i: number) => {
                    const clubs = clubsByDomain[d.code] ?? [];
                    return (
                      <div key={d.code}
                        className="py-4 sm:py-5"
                        style={{ borderBottom: '1px solid var(--hairline)' }}>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">

                          {/* Domain badge + name + count */}
                          <div className="flex items-center gap-3 shrink-0 sm:w-64">
                            <div
                              className="w-11 h-7 rounded flex items-center justify-center text-[10px] font-black tracking-wider shrink-0"
                              style={{ background: d.accent_bg ?? '#fdf2f2', color: d.color ?? '#970003' }}>
                              {d.code}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[13px] leading-tight" style={{ color: '#191313' }}>
                                {d.name}
                              </p>
                              <span className="text-[11px]" style={{ color: 'rgba(25,19,19,0.35)' }}>
                                {clubs.length || (clubCountByDomain[d.code] ?? 0)} clubs
                              </span>
                            </div>
                          </div>

                          {/* Club pills */}
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {clubs.length > 0 ? clubs.map((c) => (
                              <Link key={c.slug} href={`/clubs/${c.slug}`}
                                className="text-[11px] font-medium px-2.5 py-1 rounded-full transition-all hover:opacity-75"
                                style={{ background: 'rgba(25,19,19,0.055)', color: 'rgba(25,19,19,0.6)' }}>
                                {c.name}
                              </Link>
                            )) : (
                              <span className="text-[11px]" style={{ color: 'rgba(25,19,19,0.25)' }}>
                                Clubs loading…
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════ STUDENT STORIES ══ */}
      {false && (
      <section style={{ background: '#fffdfb' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="kicker mb-5" style={{ color: '#970003' }}>Student Stories</p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Lived experiences.<br />Real transformation.
              </h2>
            </div>
            <Link href="/stories"
              className="hidden sm:inline-flex items-center gap-2 font-semibold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#970003' }}>
              All stories <ArrowRight size={14} />
            </Link>
          </FadeIn>

          {featuredStory ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Featured story */}
              <FadeIn className="lg:col-span-3">
                <Link href={`/stories/${featuredStory.slug}`} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden mb-5 relative"
                    style={{ background: 'linear-gradient(135deg, #fdf2f2 0%, #fce8e8 100%)', aspectRatio: '4/3' }}>
                    {featuredStory.photo && (
                      <img src={featuredStory.photo} alt={featuredStory.title}
                        className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6"
                      style={{ background: 'linear-gradient(to top, rgba(10,2,2,0.85) 0%, transparent 100%)' }}>
                      <span className="kicker mb-2" style={{ color: '#c67374' }}>
                        {featuredStory.club_name}
                      </span>
                      <h3 className="font-display font-medium text-xl leading-snug" style={{ color: '#fff' }}>
                        {featuredStory.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>
                    {featuredStory.excerpt}
                  </p>
                  <p className="text-sm font-semibold mt-3 flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ color: '#970003' }}>
                    Read story <ArrowRight size={14} />
                  </p>
                </Link>
              </FadeIn>

              {/* Two smaller stories */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {sideStories.map((story, i) => (
                  <FadeIn key={story.slug} delay={0.1 + i * 0.1} className="flex-1">
                    <Link href={`/stories/${story.slug}`} className="group block h-full">
                      <div
                        className="rounded-xl overflow-hidden mb-4 relative"
                        style={{ background: 'linear-gradient(135deg, #fdf2f2 0%, #fce8e8 100%)', aspectRatio: '16/9' }}>
                        {story.photo && (
                          <img src={story.photo} alt={story.title}
                            className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4"
                          style={{ background: 'linear-gradient(to top, rgba(10,2,2,0.7) 0%, transparent 100%)' }}>
                          <span className="text-[10px] font-semibold tracking-widest uppercase"
                            style={{ color: 'rgba(255,255,255,0.6)' }}>
                            {story.club_name}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-base leading-snug mb-1" style={{ color: '#191313' }}>
                        {story.title}
                      </h3>
                      <p className="text-[13px] line-clamp-2" style={{ color: 'rgba(25,19,19,0.5)' }}>
                        {story.excerpt}
                      </p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-14 text-center hairline-t hairline-b"
              style={{ color: 'rgba(25,19,19,0.35)' }}>
              <p className="font-display font-medium text-2xl mb-2">Stories coming soon</p>
              <p className="text-sm">Check back soon for student stories.</p>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link href="/stories"
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: '#970003' }}>
              All student stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ════════════════════════════════════ UPCOMING ACTIVITIES ══ */}
      <UpcomingActivitiesHome />

      {/* ══════════════════════════════════════════ ACHIEVEMENTS ══ */}
      <section style={{ background: '#faf6f1' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="kicker mb-5" style={{ color: '#970003' }}>Recognition</p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Achievements
              </h2>
            </div>
            <Link href="/achievements"
              className="hidden sm:inline-flex items-center gap-2 font-semibold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#970003' }}>
              View all <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <FadeIn>
            {(() => {
              const levels = [
                { label: 'National',   key: 'ach_national',  bar: 'linear-gradient(90deg, #970003, #c67374)' },
                { label: 'State',      key: 'ach_state',     bar: 'linear-gradient(90deg, #970003 0%, #d97706 100%)' },
                { label: 'University', key: 'ach_university', bar: 'linear-gradient(90deg, rgba(151,0,3,0.3), rgba(151,0,3,0.6))' },
              ].map(l => ({ ...l, count: sacStatsMap[l.key] ?? 0 }));

              const maxCount = Math.max(...levels.map(l => l.count), 1);
              const hasAny   = levels.some(l => l.count > 0);

              if (!hasAny) {
                return (
                  <p className="text-sm" style={{ color: 'rgba(25,19,19,0.3)' }}>
                    No achievements added yet.
                  </p>
                );
              }

              return (
                <div style={{ maxWidth: '580px' }}>
                  <div className="flex flex-col gap-8">
                    {levels.map(l => {
                      const pct = l.count > 0 ? Math.round((l.count / maxCount) * 100) : 0;
                      return (
                        <div key={l.label}>
                          <div className="flex items-end justify-between mb-3">
                            <span className="kicker" style={{ color: 'rgba(25,19,19,0.4)' }}>{l.label}</span>
                            <span className="font-display font-medium leading-none"
                              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: l.count > 0 ? '#970003' : 'rgba(25,19,19,0.1)', letterSpacing: '-0.03em' }}>
                              {l.count > 0 ? l.count : '—'}
                            </span>
                          </div>
                          <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(25,19,19,0.07)' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: l.bar }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════ INDUSTRY & COLLABORATION ══ */}
      <section style={{ background: '#fffdfb' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <FadeIn>
              <p className="kicker mb-5" style={{ color: '#970003' }}>Industry & Collaboration</p>
              <h2
                className="font-display font-medium leading-[1.07] mb-6"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Where industry meets student talent.
              </h2>
              <p className="text-[15px] sm:text-base leading-relaxed mb-8" style={{ color: 'rgba(25,19,19,0.5)' }}>
                KL SAC creates structured pathways for industry leaders, academic institutions, government bodies, and organisations to engage with KL University's student talent.
              </p>
              <Link href="/collaborate"
                className="inline-flex items-center gap-2 font-semibold text-sm transition-opacity hover:opacity-75"
                style={{ color: '#970003' }}>
                Partner with SAC <ArrowRight size={14} />
              </Link>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--hairline)' }}>
                {[
                  { title: 'Industry Mentorship',    desc: 'Connect experts with students building real skills.' },
                  { title: 'Campus Hiring',           desc: 'Engage students who already demonstrate excellence.' },
                  { title: 'Research Collaboration',  desc: 'Partner with student clubs on applied research.' },
                  { title: 'Sponsorship & CSR',       desc: 'Fund programmes that create long-term social impact.' },
                ].map(item => (
                  <div key={item.title} className="p-6" style={{ background: '#fffdfb' }}>
                    <p className="font-semibold text-sm mb-2" style={{ color: '#191313' }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Partners marquee */}
          {partners.length > 0 && (
            <FadeIn delay={0.2} className="mt-20 -mx-5 sm:-mx-6">
              <p className="text-center mb-8 px-5 sm:px-6 font-black uppercase tracking-widest"
                 style={{ fontSize: '13px', color: '#8B0000', letterSpacing: '0.18em' }}>
                Partners &amp; Collaborators
              </p>
              <PartnersMarquee partners={partners} />
            </FadeIn>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════ MEET OUR LEADERSHIP ══ */}
      <section style={{ background: '#faf6f1' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="kicker mb-5" style={{ color: '#970003' }}>Governance</p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Meet our leadership
              </h2>
            </div>
            <Link href="/leadership"
              className="hidden sm:inline-flex items-center gap-2 font-semibold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#970003' }}>
              Full council <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <FadeIn>
            <div
              className="w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 px-6 text-center"
              style={{
                aspectRatio: '16/7',
                background: 'linear-gradient(135deg, #97000310 0%, #97000305 100%)',
                border: '2px dashed #97000325',
              }}>
              <Camera size={40} style={{ color: '#97000335' }} />
              <div>
                <p className="font-display font-medium" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', color: 'rgba(25,19,19,0.45)', letterSpacing: '-0.02em' }}>
                  SAC Council 2026&ndash;27
                </p>
                <p className="text-sm mt-2" style={{ color: 'rgba(25,19,19,0.35)' }}>
                  Announcing soon
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="mt-8 sm:hidden">
            <Link href="/leadership"
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: '#970003' }}>
              View full council <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ LATEST NEWS ══ */}
      <section style={{ background: '#fffdfb' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="kicker mb-5" style={{ color: '#970003' }}>News & Updates</p>
              <h2
                className="font-display font-medium leading-[1.07]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Latest from SAC
              </h2>
            </div>
            <Link href="/news"
              className="hidden sm:inline-flex items-center gap-2 font-semibold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#970003' }}>
              All news <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <FadeIn>
            <LatestNewsCarousel articles={newsArticles} />
          </FadeIn>

          <div className="mt-8 sm:hidden">
            <Link href="/news"
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: '#970003' }}>
              All news <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ CTA ══ */}
      <section className="relative noise overflow-hidden" style={{ background: '#5C0001' }}>
        {/* Floating orbs */}
        <div className="orb-a absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(40,0,1,0.6)', filter: 'blur(80px)' }} aria-hidden="true" />
        <div className="orb-b absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(150,40,40,0.2)', filter: 'blur(80px)' }} aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-28 text-center">
          <FadeIn>
            <p className="kicker justify-center mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              KL SAC
            </p>
            <h2
              className="font-display font-medium leading-[1.06] mb-6 mx-auto"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', color: '#fff', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
              Ready to make your university years count?
            </h2>
            <p className="text-[15px] sm:text-base mb-12 mx-auto" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '46ch' }}>
              Join one of 24 clubs, participate in activities, and build experiences that will define your career.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/clubs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
                style={{ background: '#fff', color: '#970003' }}>
                Explore All Clubs
                <ArrowRight size={15} />
              </Link>
              <Link href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}>
                Student Dashboard
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
