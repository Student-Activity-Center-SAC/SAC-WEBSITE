import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { DOMAINS } from '@/lib/content/domains';
import { DEMO_CLUBS, DOMAIN_META } from '@/lib/demo-data';
import { FadeIn } from './_components/FadeIn';
import { getHomepageEvents } from '@/lib/data/homepage';
import { supabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'KL SAC — Student Activity Center, KL University',
  description:
    'KL SAC is KL University\'s Student Activity Center — 25 clubs, 5 domains, one mission: to develop the complete student.',
};

const JOURNEY_STEPS = [
  { title: 'Discover',     description: 'Explore your interests across five domains and twenty-five clubs. Find the community that matches who you are — or who you want to become.' },
  { title: 'Participate',  description: 'Join activities, competitions, workshops, and programmes that go beyond the curriculum. Every participation builds real-world experience.' },
  { title: 'Develop',      description: 'Build competencies that employers and institutions recognise — technical, creative, leadership, and interpersonal skills that define the complete professional.' },
  { title: 'Lead',         description: 'Take responsibility within your club — as a coordinator, team leader, or domain representative. Leadership at SAC is earned through performance, not appointment.' },
  { title: 'Create',       description: 'Build something that matters: a product, a performance, a project, a venture. SAC gives you the platform, the mentors, and the collaborators you need.' },
  { title: 'Impact',       description: 'Carry your experience beyond campus — in your career, your community, and your commitment to the values KL SAC instilled in you.' },
];

export default async function HomePage() {
  const [events, storiesRes, settingsRes, newsRes, domainsRes, clubsRes, statsRes] = await Promise.all([
    getHomepageEvents(5),
    supabase.from('stories').select('slug, title, student_name, student_year, club_name, domain_code, excerpt, photo, homepage_order').gt('homepage_order', 0).order('homepage_order', { ascending: true }),
    supabase.from('site_settings').select('key, value'),
    supabase.from('news_articles').select('slug, title, excerpt, photo_url, category, date').gt('homepage_order', 0).order('homepage_order', { ascending: true }).limit(3),
    supabase.from('domains').select('slug, code, name, tagline, color, accent_bg').order('sort_order', { ascending: true }),
    supabase.from('clubs').select('domain_code, slug, name'),
    supabase.from('sac_stats').select('key, value'),
  ]);

  const stories = storiesRes.data ?? [];
  const newsArticles = newsRes.data ?? [];
  const domains = domainsRes.data ?? [];
  const settingsMap: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((s: any) => { if (s.value) settingsMap[s.key] = s.value; });
  const heroVideoUrl = settingsMap['hero_video_url'] || '/hero.mp4';
  const featuredStory = stories.find(s => s.homepage_order === 1) ?? null;
  const sideStories   = stories.filter(s => (s.homepage_order ?? 0) > 1).slice(0, 2);

  const clubCountByDomain: Record<string, number> = {};
  const clubNameMap: Record<string, string> = {};
  (clubsRes.data ?? []).forEach((c: any) => {
    clubCountByDomain[c.domain_code] = (clubCountByDomain[c.domain_code] ?? 0) + 1;
    if (c.slug) clubNameMap[c.slug] = c.name;
  });
  const totalClubs = Object.values(clubCountByDomain).reduce((a, b) => a + b, 0);

  const sacStatsMap: Record<string, number> = {};
  (statsRes.data ?? []).forEach((s: any) => { sacStatsMap[s.key] = s.value; });
  const statStudents   = sacStatsMap['students']   ?? 0;
  const statActivities = sacStatsMap['activities'] ?? 0;

  const today   = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter((e: any) => e.activity_date >= today).slice(0, 5);

  return (
    <>
      {/* ══════════════════════════════════════════════════════════ HERO ══ */}
      <section
        className="relative flex items-center justify-start overflow-hidden"
        style={{ minHeight: '100svh', background: '#0A0A0F' }}>

        {/* Video background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideoUrl}
          aria-hidden="true"
        />

        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(5,5,8,0.88) 0%, rgba(5,5,8,0.65) 45%, rgba(5,5,8,0.25) 75%, rgba(5,5,8,0.1) 100%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to top, rgba(5,5,8,0.6) 0%, transparent 100%)' }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-12 xl:px-20 w-full pt-24 pb-20">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
              <span
                className="h-px w-8"
                style={{ background: '#8B0000' }} />
              <span
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: '#8B0000' }}>
                KL University · Student Activity Center
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-black leading-[1.05] mb-6 animate-fade-up"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: '#FFFFFF', letterSpacing: '-0.025em' }}>
              Student Life.
              <br />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>Beyond the</span>
              <br />
              Classroom.
            </h1>

            {/* Body */}
            <p
              className="text-lg sm:text-xl leading-relaxed mb-10 animate-fade-up delay-100"
              style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '48ch' }}>
              KL SAC is where {totalClubs > 0 ? `${totalClubs} clubs, ` : ''}{domains.length > 0 ? `${domains.length} domains` : 'five domains'}, and thousands of students come together to build something larger than a degree.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-200">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: '#8B0000', color: '#fff' }}>
                Explore SAC
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base transition-all hover:bg-white/15"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
                Browse Clubs
              </Link>
              <Link
                href="https://sacactivities.kluniversity.in"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 font-semibold text-sm transition-opacity hover:opacity-75"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                Student Dashboard
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle opacity-40">
            <ChevronDown size={22} style={{ color: '#fff' }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ AT A GLANCE ══ */}
      <section style={{ background: '#0A0A0F' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 lg:divide-x"
               style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {[
              { value: totalClubs   > 0 ? String(totalClubs)    : null,                    label: 'Active Clubs',     gold: true  },
              { value: domains.length > 0 ? String(domains.length) : null,                 label: 'Learning Domains', gold: true  },
              { value: statStudents   > 0 ? String(statStudents)   + '+' : null,           label: 'Student Members',  gold: false },
              { value: statActivities > 0 ? String(statActivities) + '+' : null,           label: 'Annual Activities',gold: false },
            ].map((s) => (
              <div key={s.label} className="px-0 lg:px-10">
                <div
                  className="font-black leading-none mb-2"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    color:    s.value ? '#fff' : '#2A2A30',
                    letterSpacing: '-0.03em',
                  }}>
                  {s.value ?? '—'}
                </div>
                <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {s.label}
                </div>
                {!s.value && (
                  <div className="text-[10px] mt-1 font-medium" style={{ color: '#3A3A44' }}>
                    Official data pending
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ WHAT HAPPENS AT SAC */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="mb-16">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
              The SAC Journey
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', letterSpacing: '-0.02em', maxWidth: '28ch' }}>
              What happens when you join KL SAC?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-0">
            {JOURNEY_STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.07}>
                <div
                  className="flex gap-6 py-8"
                  style={{ borderBottom: '1px solid #EBEBEB' }}>
                  <span
                    className="font-black shrink-0 leading-none pt-1"
                    style={{ fontSize: '2rem', color: '#E8E8EC', width: '3rem', fontVariantNumeric: 'tabular-nums' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-black text-base uppercase tracking-[0.1em] mb-2" style={{ color: '#0D0D0D' }}>
                      {step.title}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ FIVE DOMAINS ══ */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="mb-12">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
              {domains.length} Domains · {totalClubs} Clubs
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
              Every passion. One ecosystem.
            </h2>
          </FadeIn>

          <FadeIn>
            <div style={{ borderTop: '1px solid #E4E4E7' }}>
              {domains.map((d: any) => (
                <Link
                  key={d.code}
                  href={`/domains/${d.slug}`}
                  className="group flex items-center gap-4 sm:gap-8 py-5 sm:py-6 transition-all"
                  style={{ borderBottom: '1px solid #E4E4E7' }}>
                  <div
                    className="w-14 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors"
                    style={{ background: d.accent_bg, color: d.color }}>
                    {d.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base sm:text-lg leading-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                      {d.name}
                    </p>
                    <p className="text-sm mt-0.5 hidden sm:block" style={{ color: '#A1A1AA' }}>
                      {d.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold" style={{ color: '#A1A1AA' }}>
                      {clubCountByDomain[d.code] ?? 0} clubs
                    </span>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: '#D1D1D6' }} />
                </Link>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-6">
              <Link href="/domains"
                    className="inline-flex items-center gap-2 font-bold text-sm transition-colors hover:opacity-75"
                    style={{ color: '#8B0000' }}>
                View all domains <ArrowRight size={14} />
              </Link>
              <Link href="/clubs"
                    className="inline-flex items-center gap-2 font-semibold text-sm transition-colors hover:opacity-75"
                    style={{ color: '#71717A' }}>
                Browse all clubs
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ STUDENT STORIES ══ */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
                Student Stories
              </p>
              <h2
                className="font-black leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Lived experiences.<br />Real transformation.
              </h2>
            </div>
            <Link
              href="/stories"
              className="hidden sm:inline-flex items-center gap-2 font-bold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#8B0000' }}>
              All stories
              <ArrowRight size={14} />
            </Link>
          </FadeIn>

          {featuredStory ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Featured story */}
              <FadeIn className="lg:col-span-3">
                <Link href={`/stories/${featuredStory.slug}`} className="group block h-full">
                  <div
                    className="rounded-2xl overflow-hidden mb-5 relative"
                    style={{ background: 'linear-gradient(135deg, #1a0005 0%, #5b0000 100%)', aspectRatio: '1/1' }}>
                    {featuredStory.photo && (
                      <img
                        src={featuredStory.photo}
                        alt={featuredStory.title}
                        className="absolute inset-0 w-full h-full"
                        style={{ objectFit: 'cover', objectPosition: 'center center' }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6"
                         style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                      <span
                        className="text-[10px] font-black tracking-widest uppercase mb-2 inline-block"
                        style={{ color: DOMAINS.find(d => d.code === featuredStory.domain_code)?.color ?? '#8B0000' }}>
                        {featuredStory.club_name}
                      </span>
                      <h3 className="font-black text-xl leading-snug" style={{ color: '#fff' }}>
                        {featuredStory.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: '#71717A' }}>
                    {featuredStory.excerpt}
                  </p>
                  <p className="text-sm font-bold mt-3 group-hover:gap-3 flex items-center gap-2 transition-all"
                     style={{ color: '#8B0000' }}>
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
                        style={{ background: i === 0 ? 'linear-gradient(135deg, #2D0000 0%, #8B0000 100%)' : 'linear-gradient(135deg, #1a0000 0%, #7C0000 100%)', aspectRatio: '1/1' }}>
                        {story.photo && (
                          <img
                            src={story.photo}
                            alt={story.title}
                            className="absolute inset-0 w-full h-full"
                            style={{ objectFit: 'cover', objectPosition: 'center center' }}
                            loading="lazy"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4"
                             style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}>
                          <span className="text-[9px] font-black tracking-widest uppercase"
                                style={{ color: 'rgba(255,255,255,0.65)' }}>
                            {story.club_name}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-base leading-snug mb-1" style={{ color: '#0D0D0D' }}>
                        {story.title}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: '#71717A' }}>
                        {story.excerpt}
                      </p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border p-12 text-center" style={{ borderColor: '#E4E4E7' }}>
              <p className="text-sm" style={{ color: '#A1A1AA' }}>
                Add student stories from the admin panel to display them here.
              </p>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 font-bold text-sm"
              style={{ color: '#8B0000' }}>
              All student stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════ UPCOMING ACTIVITIES ══ */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
                Calendar
              </p>
              <h2
                className="font-black leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Upcoming Activities
              </h2>
            </div>
            <Link
              href="/activities"
              className="hidden sm:inline-flex items-center gap-2 font-bold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#8B0000' }}>
              Full calendar
              <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <FadeIn>
            <div style={{ borderTop: '1px solid #E4E4E7' }}>
              {upcomingEvents.length === 0 ? (
                <div className="py-16 text-center" style={{ color: '#A1A1AA' }}>
                  <p className="font-semibold">No upcoming activities at this time.</p>
                  <p className="text-sm mt-1">Check back soon or visit the activities page.</p>
                </div>
              ) : upcomingEvents.map((ev: any) => {
                const date   = new Date(ev.activity_date);
                const dmeta  = DOMAIN_META[ev.domain];
                const color  = dmeta?.color ?? '#8B0000';
                return (
                  <div
                    key={ev.code}
                    className="group flex items-start gap-6 py-5"
                    style={{ borderBottom: '1px solid #E4E4E7' }}>
                    {/* Date */}
                    <div className="w-12 shrink-0 text-center pt-0.5">
                      <div className="font-black text-2xl leading-none" style={{ color: '#0D0D0D' }}>
                        {date.getDate()}
                      </div>
                      <div className="text-[10px] font-bold uppercase mt-0.5" style={{ color: '#A1A1AA' }}>
                        {date.toLocaleString('en-IN', { month: 'short' })} {date.getFullYear().toString().slice(2)}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg leading-snug mb-1" style={{ color: '#0D0D0D' }}>
                        {ev.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: '#A1A1AA' }}>
                        <span className="font-black text-[10px] uppercase" style={{ color }}>{ev.domain}</span>
                        {clubNameMap[ev.club_slug] && <><span>·</span><span className="font-semibold">{clubNameMap[ev.club_slug]}</span></>}
                        {ev.venue && <><span>·</span><span>{ev.venue}</span></>}
                      </div>
                    </div>
                    {/* CTA */}
                    <a
                      href="https://sacactivities.kluniversity.in"
                      target="_blank"
                      rel="noopener"
                      className="text-xs font-bold shrink-0 mt-1 transition-all opacity-0 group-hover:opacity-100 inline-flex items-center gap-1"
                      style={{ color: '#8B0000' }}>
                      Register
                      <ArrowUpRight size={12} />
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 font-bold text-sm"
                style={{ color: '#8B0000' }}>
                View all activities <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ ACHIEVEMENTS ══ */}
      <section style={{ background: '#0A0A0F' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
                Recognition
              </p>
              <h2
                className="font-black leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', letterSpacing: '-0.02em' }}>
                Achievements
              </h2>
            </div>
            <Link
              href="/achievements"
              className="hidden sm:inline-flex items-center gap-2 font-bold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#8B0000' }}>
              View all
              <ArrowRight size={14} />
            </Link>
          </FadeIn>

          <FadeIn>
            {(() => {
              const levels = [
                { label: 'National',   key: 'ach_national',   bar: 'linear-gradient(90deg, #8B0000, #C41E3A)' },
                { label: 'State',      key: 'ach_state',       bar: 'linear-gradient(90deg, #78350F, #D97706)' },
                { label: 'University', key: 'ach_university',  bar: 'linear-gradient(90deg, #27272A, #71717A)' },
              ].map(l => ({ ...l, count: sacStatsMap[l.key] ?? 0 }));

              const maxCount = Math.max(...levels.map(l => l.count), 1);
              const hasAny   = levels.some(l => l.count > 0);

              if (!hasAny) {
                return (
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    No achievements added yet. Set counts in Admin → Achievements.
                  </p>
                );
              }

              return (
                <div style={{ maxWidth: '640px' }}>
                  <div className="flex flex-col gap-6">
                    {levels.map(l => {
                      const pct = l.count > 0 ? Math.round((l.count / maxCount) * 100) : 0;
                      return (
                        <div key={l.label}>
                          <div className="flex items-end justify-between mb-2.5">
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                                  style={{ color: 'rgba(255,255,255,0.38)' }}>
                              {l.label}
                            </span>
                            <span className="font-black leading-none"
                                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: l.count > 0 ? '#fff' : 'rgba(255,255,255,0.12)', letterSpacing: '-0.03em' }}>
                              {l.count > 0 ? l.count : '—'}
                            </span>
                          </div>
                          <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full"
                                 style={{ width: `${pct}%`, background: l.bar }} />
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

      {/* ══════════════════════════════════════════════ INDUSTRY TEASER ══ */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
                Industry & Collaboration
              </p>
              <h2
                className="font-black leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Where industry meets student talent.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: '#71717A' }}>
                KL SAC creates structured pathways for industry leaders, academic institutions, government bodies, and organisations to engage with KL University's student talent.
              </p>
              <Link
                href="/collaborate"
                className="inline-flex items-center gap-2 font-bold text-sm transition-opacity hover:opacity-75"
                style={{ color: '#8B0000' }}>
                Partner with SAC
                <ArrowRight size={14} />
              </Link>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Industry Mentorship', desc: 'Connect experts with students building real skills.' },
                  { title: 'Campus Hiring',        desc: 'Engage students who already demonstrate excellence.' },
                  { title: 'Research Collaboration', desc: 'Partner with student clubs on applied research.' },
                  { title: 'Sponsorship & CSR',   desc: 'Fund programmes that create long-term social impact.' },
                ].map(item => (
                  <div
                    key={item.title}
                    className="p-5 rounded-xl"
                    style={{ background: '#F7F7F8', border: '1px solid #E4E4E7' }}>
                    <p className="font-bold text-sm mb-1.5" style={{ color: '#0D0D0D' }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#71717A' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ LATEST NEWS ══ */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="flex items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
                News & Updates
              </p>
              <h2
                className="font-black leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Latest from SAC
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-2 font-bold text-sm shrink-0 mb-1 transition-opacity hover:opacity-70"
              style={{ color: '#8B0000' }}>
              All news
              <ArrowRight size={14} />
            </Link>
          </FadeIn>

          {newsArticles.length === 0 && (
            <p className="text-sm" style={{ color: '#A1A1AA' }}>
              No featured articles yet. Check "Feature on homepage" in Admin → News to show articles here.
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {newsArticles.map((article, i) => (
              <FadeIn key={article.slug} delay={i * 0.1}>
                <Link href={`/news/${article.slug}`} className="group block h-full">
                  <article
                    className="h-full rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg"
                    style={{ background: '#fff', border: '1px solid #E4E4E7' }}>
                    {/* Cover image */}
                    <div
                      className="h-44 overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #5B0000 0%, #8B0000 100%)',
                      }}>
                      {article.photo_url ? (
                        <img src={article.photo_url} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase opacity-20" style={{ color: '#fff' }}>KL SAC</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                          style={{ background: '#FFF0F0', color: '#8B0000' }}>
                          {article.category}
                        </span>
                        <span className="text-xs" style={{ color: '#A1A1AA' }}>
                          {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-base leading-snug flex-1" style={{ color: '#0D0D0D' }}>
                        {article.title}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: '#71717A' }}>
                        {article.excerpt}
                      </p>
                      <p className="text-xs font-bold flex items-center gap-1.5 transition-all group-hover:gap-2.5"
                         style={{ color: '#8B0000' }}>
                        Read more <ArrowRight size={11} />
                      </p>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ CTA ══ */}
      <section style={{ background: '#0A0A0F' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-32 text-center">
          <FadeIn>
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-6"
               style={{ color: 'rgba(255,255,255,0.3)' }}>
              KL SAC
            </p>
            <h2
              className="font-black leading-tight mb-6 mx-auto"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', color: '#fff', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
              Ready to make your university years count?
            </h2>
            <p className="text-lg mb-12 mx-auto" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '48ch' }}>
              Join one of 25 clubs, participate in activities, and build experiences that will define your career.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-[1.03] active:scale-[0.98]"
                style={{ background: '#8B0000', color: '#fff' }}>
                Explore All Clubs
                <ArrowRight size={16} />
              </Link>
              <Link
                href="https://sacactivities.kluniversity.in"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
                Student Dashboard
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

