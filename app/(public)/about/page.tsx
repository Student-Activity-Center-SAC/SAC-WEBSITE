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
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
            The Centre for Student Excellence.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '58ch' }}>
            KL SAC is KL University's Student Activity Centre — the institution through which students discover their potential, lead with purpose, and build the skills that define remarkable careers and meaningful lives.
          </p>
        </div>
      </section>

      {/* ─── President's Message ─────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-16 items-start">

              {/* Photo + identity */}
              <div className="flex flex-col items-start lg:pt-10">
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
                  <p className="text-sm font-semibold mt-1" style={{ color: '#970003' }}>Chancellor &amp; President</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(25,19,19,0.4)' }}>KLEF</p>
                </div>
              </div>

              {/* Message */}
              <div className="pt-1">
                <p className="kicker mb-2" style={{ color: '#970003' }}>Hon'ble KLEF President's Message</p>
                <p className="font-display leading-none mb-3" style={{ fontSize: '4rem', color: '#c67374', lineHeight: 0.8 }}>“</p>
                <blockquote
                  className="font-display font-medium leading-[1.2] mb-7"
                  style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)', color: '#191313', letterSpacing: '-0.01em' }}>
                  Education at its core is not merely about acquiring degrees; it is about building character, nurturing innovation, and empowering minds to shape a better tomorrow.
                </blockquote>
                <div className="flex flex-col gap-4 text-base leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)', maxWidth: '72ch' }}>
                  <p>
                    At KL University, we have always believed in fostering a holistic environment where students can truly discover themselves. The Student Activity Centre (SAC) embodies this very vision. It is a vibrant ecosystem designed to pull you out of your comfort zones and challenge you to explore your deepest passions.
                  </p>
                  <p>
                    When you engage in co-curricular activities, you build invaluable life skills—leadership, empathy, resilience, and teamwork. These experiences do not just add weight to your resume; they profoundly shape the person you become. The memories you create here and the bonds you forge will be the foundation of your professional and personal life.
                  </p>
                  <p>
                    I invite you to make the most of this extraordinary platform. Dream big, lead with integrity, and leave an indelible mark on our community.
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
              <div className="flex flex-col items-start lg:pt-10">
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
                <p className="kicker mb-2" style={{ color: '#970003' }}>Hon'ble SAC Director's Message</p>
                <p className="font-display leading-none mb-3" style={{ fontSize: '4rem', color: '#c67374', lineHeight: 0.8 }}>“</p>
                <blockquote
                  className="font-display font-medium leading-[1.2] mb-7"
                  style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)', color: '#191313', letterSpacing: '-0.01em' }}>
                  Your university years are a canvas, and the Student Activity Centre provides the colors. How vibrantly you paint your journey is entirely in your hands.
                </blockquote>
                <div className="flex flex-col gap-4 text-base leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)', maxWidth: '72ch' }}>
                  <p>
                    Welcome to the heart of student life at KL University! The SAC is more than just a collection of clubs; it is a thriving family of creators, thinkers, artists, and leaders. It is the place where your ideas find a voice, and your talents find a stage.
                  </p>
                  <p>
                    We understand that every student is unique, which is why our domains are so diverse. Whether you're building a robot, organizing a national-level cultural fest, or dedicating your weekend to social service, you are contributing to a legacy. It's here that you'll meet your future co-founders, lifelong friends, and mentors.
                  </p>
                  <p>
                    My advice to you is simple: do not sit on the sidelines. Dive in, take on responsibilities, make mistakes, and learn from them. Our doors are always open, and our team is always here to support your ambitions. Let's create something amazing together.
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
                style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                The Student Activity Center.
              </h2>
              <div className="flex flex-col gap-4 text-base leading-[1.75]" style={{ color: 'rgba(25,19,19,0.58)' }}>
                <p>
                  KL SAC is KL University's official co-curricular development body. It operates 20+ student clubs across{domainCount > 0 ? ` ${domainCount}` : ''} domains — Technology, Liberal Arts & Culture, Health & Wellbeing, Social Outreach, and Innovation & Entrepreneurship.
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
                  { value: 20,  suffix: '+', label: 'Active Clubs'      },
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
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em', maxWidth: '28ch' }}>
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
                    <p className="text-base leading-[1.75]" style={{ color: 'rgba(25,19,19,0.55)' }}>
                      {p.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#970003' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display font-medium mb-2"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
              Have questions about SAC?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.06rem' }}>
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
