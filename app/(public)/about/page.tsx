import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase-admin';
import { FadeIn } from '../_components/FadeIn';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About',
  description: 'Learn about the KL University Student Activity Center — its clubs, domains, and mission.',
};

const PHILOSOPHY = [
  {
    code: 'DEVELOP',
    heading: 'Develop the whole person.',
    body: 'Academic excellence alone does not produce leaders. KL SAC exists to develop the dimensions of a student that a degree programme cannot — creative expression, physical resilience, entrepreneurial thinking, civic responsibility, and the interpersonal intelligence that makes professionals effective and memorable.',
  },
  {
    code: 'INTEGRATE',
    heading: 'Integrate co-curricular life with career readiness.',
    body: 'Every activity at SAC earns SDC (Student Development Credits) and builds a verifiable record of co-curricular achievement. When students graduate, their SAC experience is not an afterthought — it is a demonstrated portfolio of skills, leadership, and impact that employers and institutions recognise.',
  },
  {
    code: 'SERVE',
    heading: 'Serve beyond the campus.',
    body: "KL SAC's Extension & Social Outreach domain ensures that the benefits of a KL University education extend beyond the campus gates. Our students engage in community service, heritage conservation, civic leadership, and value-based education that makes them responsible citizens, not just skilled professionals.",
  },
];

export default async function AboutPage() {
  const [{ data: domainsData }, { data: clubsData }, { data: statsData }] = await Promise.all([
    supabase.from('domains').select('slug, code, name, short_name, tagline, color, accent_bg').order('sort_order', { ascending: true }),
    supabase.from('clubs').select('domain_code'),
    supabase.from('sac_stats').select('*'),
  ]);

  const domains = domainsData ?? [];
  const clubCount = (clubsData ?? []).length;
  const domainCount = domains.length;

  const clubCountByDomain: Record<string, number> = {};
  (clubsData ?? []).forEach((c: any) => {
    clubCountByDomain[c.domain_code] = (clubCountByDomain[c.domain_code] ?? 0) + 1;
  });

  const statsMap: Record<string, number> = {};
  (statsData ?? []).forEach((s: any) => { statsMap[s.key] = s.value; });

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0F', paddingTop: '92px', paddingBottom: '80px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-5" style={{ color: '#8B0000' }}>
            About KL SAC
          </p>
          <h1
            className="font-black leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#FFFFFF', letterSpacing: '-0.025em', maxWidth: '18ch' }}>
            Building Tomorrow's Leaders, Today.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '56ch' }}>
            KL SAC is KL University's Student Activity Center — the official ecosystem for student development across culture, technology, wellness, service, and entrepreneurship.
          </p>
        </div>
      </section>

      {/* ─── What is SAC ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <FadeIn>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: '#8B0000' }}>
                What Is SAC?
              </p>
              <h2
                className="font-black leading-tight mb-8"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                The Student Activity Center.
              </h2>
              <div className="flex flex-col gap-5 text-base leading-relaxed" style={{ color: '#71717A' }}>
                <p>
                  KL SAC is KL University's official co-curricular development body. It operates {clubCount > 0 ? clubCount : ''} student clubs across {domainCount > 0 ? domainCount : ''} domains — Technology, Liberal Arts & Culture, Health & Wellbeing, Social Outreach, and Innovation & Entrepreneurship.
                </p>
                <p>
                  SAC is distinct from the academic programme and from the student ERP (Student Dashboard). Where the dashboard tracks your academic journey, SAC shapes who you become beyond it — through real activities, genuine leadership, and measurable impact.
                </p>
                <p>
                  Every student at KL University has access to SAC. Every student can build a co-curricular record that is as impressive as their academic one — and often more differentiating.
                </p>
              </div>
            </FadeIn>

            {/* Stats panel */}
            <FadeIn delay={0.1}>
              <div className="rounded-2xl p-8 sm:p-10" style={{ background: '#0A0A0F' }}>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: clubCount   > 0 ? String(clubCount)   : null, label: 'Active Clubs',      note: clubCount === 0 ? 'Not seeded yet' : undefined },
                    { value: domainCount > 0 ? String(domainCount) : null, label: 'Learning Domains',  note: domainCount === 0 ? 'Not seeded yet' : undefined },
                    { value: statsMap.students   ? String(statsMap.students)   : null, label: 'Student Members',   note: 'Set in Admin → Stats' },
                    { value: statsMap.activities ? String(statsMap.activities) : null, label: 'Annual Activities',  note: 'Set in Admin → Stats' },
                  ].map(s => (
                    <div key={s.label}>
                      <div
                        className="font-black leading-none mb-1"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: s.value ? '#8B0000' : '#2A2A30', letterSpacing: '-0.03em' }}>
                        {s.value ?? '—'}
                      </div>
                      <div className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>{s.label}</div>
                      {!s.value && s.note && (
                        <div className="text-[10px] mt-0.5" style={{ color: '#333340' }}>{s.note}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ───────────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="mb-16">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
              Our Philosophy
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#0D0D0D', letterSpacing: '-0.02em', maxWidth: '28ch' }}>
              Three beliefs that guide everything we do.
            </h2>
          </FadeIn>

          <div style={{ borderTop: '1px solid #E4E4E7' }}>
            {PHILOSOPHY.map((p, i) => (
              <FadeIn key={p.code} delay={i * 0.1}>
                <div
                  className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-12 py-10"
                  style={{ borderBottom: '1px solid #E4E4E7' }}>
                  <div>
                    <span className="font-black text-xs tracking-[0.15em] uppercase" style={{ color: '#8B0000' }}>
                      {p.code}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="font-bold text-lg sm:text-xl mb-3" style={{ color: '#0D0D0D' }}>
                      {p.heading}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: '#71717A' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Domains ──────────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-28">
          <FadeIn className="mb-12">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
              Our Structure
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
              {domainCount} Domains. {clubCount} Clubs.
            </h2>
          </FadeIn>

          <FadeIn>
            {domains.length === 0 ? (
              <div className="rounded-2xl border p-12 text-center" style={{ borderColor: '#E4E4E7' }}>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  Seed domains from Admin → Domains to show them here.
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #E4E4E7' }}>
                {domains.map((d: any) => (
                  <Link
                    key={d.code}
                    href={`/domains/${d.slug}`}
                    className="group flex items-center gap-4 sm:gap-8 py-5 sm:py-6 transition-all"
                    style={{ borderBottom: '1px solid #E4E4E7' }}>
                    <div
                      className="w-14 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
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
                    <span className="text-sm font-semibold shrink-0" style={{ color: '#A1A1AA' }}>
                      {clubCountByDomain[d.code] ?? 0} clubs
                    </span>
                    <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1"
                                style={{ color: '#D1D1D6' }} />
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── SAC vs ERP distinction ───────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="mb-12">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#8B0000' }}>
              Two Systems, One Journey
            </p>
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
              This website vs. the Student Dashboard.
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-8 rounded-2xl" style={{ background: '#fff', border: '2px solid #E4E4E7' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#8B0000' }} />
                  <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#8B0000' }}>
                    This Website — KL SAC
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-sm" style={{ color: '#71717A' }}>
                  {[
                    'Discover what SAC is and what it offers',
                    `Explore all ${clubCount > 0 ? clubCount : ''} clubs and ${domainCount > 0 ? domainCount : ''} domains`,
                    'Read about student stories and achievements',
                    'Learn about upcoming activities',
                    'Find collaboration opportunities',
                    'Understand the SAC development framework',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span style={{ color: '#8B0000', flexShrink: 0 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl" style={{ background: '#0A0A0F', border: '2px solid #1A1A24' }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#8B0000' }} />
                  <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#8B0000' }}>
                    Student Dashboard (ERP)
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-sm mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {[
                    'Register for clubs',
                    'Enroll in activities',
                    'Track SDC (Student Development) credits',
                    'Access your AI Career Roadmap',
                    'View your activity history',
                    'Manage your student profile',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span style={{ color: '#8B0000', flexShrink: 0 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="https://sacactivities.kluniversity.in" target="_blank" rel="noopener"
                      className="inline-flex items-center gap-2 text-xs font-bold transition-opacity hover:opacity-75"
                      style={{ color: '#8B0000' }}>
                  Go to Student Dashboard <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#8B0000' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-black text-2xl sm:text-3xl mb-2" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              Have questions about SAC?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Reach out to our team — we're here to help.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
                  style={{ background: '#fff', color: '#8B0000' }}>
              Contact SAC <ArrowRight size={14} />
            </Link>
            <Link href="/clubs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
