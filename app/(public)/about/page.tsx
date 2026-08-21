import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { db } from '@/lib/query-builder';
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
    db.from('domains').select('slug, code, name, short_name, tagline, color, accent_bg').order('sort_order', { ascending: true }),
    db.from('clubs').select('domain_code'),
    db.from('sac_stats').select('*'),
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
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-6" style={{ color: '#970003' }}>About KL SAC</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '18ch' }}>
            Building Tomorrow's Leaders, Today.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '54ch' }}>
            KL SAC is KL University's Student Activity Center — the official ecosystem for student development across culture, technology, wellness, service, and entrepreneurship.
          </p>
        </div>
      </section>

      {/* ─── President's Message ─────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">

              {/* Photo + identity */}
              <div className="flex flex-col items-start">
                <div className="rounded-2xl overflow-hidden w-full mb-5"
                  style={{ aspectRatio: '3/4', maxWidth: '300px', boxShadow: '0 8px 40px -8px rgba(25,19,19,0.18)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/President%20sir.jpg"
                    alt="Er. Koneru Satyanarayana — President, KLEF"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div style={{ borderLeft: '3px solid #970003', paddingLeft: '14px' }}>
                  <p className="font-bold text-base leading-snug" style={{ color: '#191313' }}>Er. Koneru Satyanarayana</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: '#970003' }}>President — KLEF</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(25,19,19,0.4)' }}>KL University</p>
                </div>
              </div>

              {/* Message */}
              <div className="pt-1">
                <p className="kicker mb-5" style={{ color: '#970003' }}>Hon'ble KLEF President's Message</p>
                <p className="font-display leading-none mb-4" style={{ fontSize: '4rem', color: '#c67374', lineHeight: 0.8 }}>"</p>
                <blockquote
                  className="font-display font-medium leading-[1.2] mb-7"
                  style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)', color: '#191313', letterSpacing: '-0.01em' }}>
                  Excellence is not a destination — it is a lifelong commitment to growth, service, and the relentless pursuit of your highest potential.
                </blockquote>
                <div className="flex flex-col gap-4 text-[15px] leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)', maxWidth: '72ch' }}>
                  <p>
                    At KL University, we believe that education must extend far beyond the classroom. The Student Activity Centre is a testament to that belief — a living platform where students discover themselves, sharpen their talents, and develop the character that distinguishes exceptional professionals from merely competent ones.
                  </p>
                  <p>
                    Whether you join a coding club, a cultural society, or a social outreach initiative, you are not just enriching your résumé. You are shaping who you are. The friendships you build, the challenges you overcome, and the stages you perform on will define you long after your degree.
                  </p>
                  <p>
                    I encourage every student at KL University to step forward, take ownership, and lead. The SAC is here to back you every single step of the way.
                  </p>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Director's Message ──────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">

              {/* Photo + identity */}
              <div className="flex flex-col items-start">
                <div className="rounded-2xl overflow-hidden w-full mb-5"
                  style={{ aspectRatio: '3/4', maxWidth: '300px', boxShadow: '0 8px 40px -8px rgba(25,19,19,0.18)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sai%20vijay%20sir.png"
                    alt="Er. P Sai Vijay — Director, Student Activity Centre, KLEF"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div style={{ borderLeft: '3px solid #970003', paddingLeft: '14px' }}>
                  <p className="font-bold text-base leading-snug" style={{ color: '#191313' }}>Er. P Sai Vijay</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: '#970003' }}>Director, Student Activity Centre</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(25,19,19,0.4)' }}>KLEF</p>
                </div>
              </div>

              {/* Message */}
              <div className="pt-1">
                <p className="kicker mb-5" style={{ color: '#970003' }}>Hon'ble SAC Director's Message</p>
                <p className="font-display leading-none mb-4" style={{ fontSize: '4rem', color: '#c67374', lineHeight: 0.8 }}>"</p>
                <blockquote
                  className="font-display font-medium leading-[1.2] mb-7"
                  style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)', color: '#191313', letterSpacing: '-0.01em' }}>
                  Every great achievement begins with a single step — the step to say, "I will be part of something bigger than myself."
                </blockquote>
                <div className="flex flex-col gap-4 text-[15px] leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)', maxWidth: '72ch' }}>
                  <p>
                    The Student Activity Centre is not just a department — it is a living community where your curiosity meets opportunity, your talent meets purpose, and your ambitions find the support system to become reality.
                  </p>
                  <p>
                    Whether you join a coding club, a cultural society, or a social outreach initiative, you are not just enriching your résumé. You are shaping who you are. The friendships you build, the challenges you overcome, and the stages you perform on will define you long after your degree.
                  </p>
                  <p>
                    I encourage every student at KL University to step forward, take ownership, and lead. The SAC is here to back you every single step of the way.
                  </p>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── What is SAC + Stats ──────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            <FadeIn>
              <p className="kicker mb-5" style={{ color: '#970003' }}>What Is SAC?</p>
              <h2
                className="font-display font-medium leading-tight mb-7"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                The Student Activity Center.
              </h2>
              <div className="flex flex-col gap-4 text-[15px] leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)' }}>
                <p>
                  KL SAC is KL University's official co-curricular development body. It operates{clubCount > 0 ? ` ${clubCount}` : ''} student clubs across{domainCount > 0 ? ` ${domainCount}` : ''} domains — Technology, Liberal Arts & Culture, Health & Wellbeing, Social Outreach, and Innovation & Entrepreneurship.
                </p>
                <p>
                  SAC is distinct from the academic programme. Where the dashboard tracks your academic journey, SAC shapes who you become beyond it — through real activities, genuine leadership, and measurable impact.
                </p>
                <p>
                  Every student at KL University has access to SAC. Every student can build a co-curricular record that is as impressive as their academic one — and often more differentiating.
                </p>
              </div>
            </FadeIn>

            {/* Stats — clean warm cards, no dark panel, no admin notes */}
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: clubCount   > 0 ? clubCount   : 20,  suffix: '+', label: 'Active Clubs'      },
                  { value: domainCount > 0 ? domainCount : 5,   suffix: '',  label: 'Learning Domains'  },
                  { value: statsMap.students   || 5000, suffix: '+', label: 'Students Annually'  },
                  { value: statsMap.activities || 300,  suffix: '+', label: 'Annual Activities' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-6"
                    style={{ background: '#fff', border: '1px solid var(--hairline)', boxShadow: '0 2px 12px -4px rgba(25,19,19,0.06)' }}>
                    <p
                      className="font-display font-medium tabular-nums leading-none mb-2"
                      style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#970003', letterSpacing: '-0.03em' }}>
                      {s.value.toLocaleString()}{s.suffix}
                    </p>
                    <p className="text-sm font-medium" style={{ color: 'rgba(25,19,19,0.5)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn className="mb-12">
            <p className="kicker mb-4" style={{ color: '#970003' }}>Our Philosophy</p>
            <h2
              className="font-display font-medium leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#191313', letterSpacing: '-0.02em', maxWidth: '28ch' }}>
              Three beliefs that guide everything we do.
            </h2>
          </FadeIn>

          <div style={{ borderTop: '1px solid var(--hairline)' }}>
            {PHILOSOPHY.map((p, i) => (
              <FadeIn key={p.code} delay={i * 0.1}>
                <div
                  className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-12 py-10"
                  style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <div>
                    <span className="font-semibold text-xs tracking-[0.15em] uppercase" style={{ color: '#970003' }}>
                      {p.code}
                    </span>
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="font-semibold text-lg sm:text-xl mb-3" style={{ color: '#191313' }}>
                      {p.heading}
                    </h3>
                    <p className="text-[15px] leading-[1.75]" style={{ color: 'rgba(25,19,19,0.55)' }}>
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
      <section style={{ background: '#fffdfb' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn className="mb-10">
            <p className="kicker mb-4" style={{ color: '#970003' }}>Our Structure</p>
            <h2
              className="font-display font-medium leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#191313', letterSpacing: '-0.02em' }}>
              {domainCount || 5} Domains. {clubCount || 20}+ Clubs.
            </h2>
          </FadeIn>

          <FadeIn>
            {domains.length === 0 ? (
              <div className="rounded-2xl p-12 text-center" style={{ background: '#faf6f1', border: '1px solid var(--hairline)' }}>
                <p className="text-sm" style={{ color: 'rgba(25,19,19,0.3)' }}>
                  Seed domains from Admin → Domains to show them here.
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--hairline)' }}>
                {domains.map((d: any) => (
                  <Link
                    key={d.code}
                    href={`/domains/${d.slug}`}
                    className="group flex items-center gap-4 sm:gap-8 py-5 sm:py-6 transition-all"
                    style={{ borderBottom: '1px solid var(--hairline)' }}>
                    <div
                      className="w-14 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: d.accent_bg ?? '#fdf2f2', color: d.color ?? '#970003', letterSpacing: '0.1em' }}>
                      {d.code}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base sm:text-lg leading-tight group-hover:text-red-800 transition-colors" style={{ color: '#191313' }}>
                        {d.name}
                      </p>
                      <p className="text-[13px] mt-0.5 hidden sm:block" style={{ color: 'rgba(25,19,19,0.4)' }}>
                        {d.tagline}
                      </p>
                    </div>
                    <span className="text-sm font-medium shrink-0" style={{ color: 'rgba(25,19,19,0.3)' }}>
                      {clubCountByDomain[d.code] ?? 0} clubs
                    </span>
                    <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1"
                                style={{ color: 'rgba(25,19,19,0.2)' }} />
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#970003' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-medium text-2xl sm:text-3xl mb-2" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              Have questions about SAC?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)' }}>
              Reach out to our team — we're here to help.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.03]"
                  style={{ background: '#fff', color: '#970003' }}>
              Contact SAC <ArrowRight size={14} />
            </Link>
            <Link href="/clubs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:bg-white/10"
                  style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
