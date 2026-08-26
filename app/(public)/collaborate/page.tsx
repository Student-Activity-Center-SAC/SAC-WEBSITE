import Link from 'next/link';
import { ArrowUpRight, Building2, GraduationCap, Globe2, HeartHandshake } from 'lucide-react';
import { FadeIn } from '../_components/FadeIn';

export const metadata = {
  title: 'Collaborate',
  description: 'Partner with KL SAC — industry collaboration, mentorship, and external engagement opportunities.',
};

const COLLAB_AREAS = [
  {
    icon: Building2,
    title: 'Industry Partnerships',
    desc: 'Sponsor activities, host workshops, provide live project briefs, or offer internship pathways for students engaged through SAC clubs.',
  },
  {
    icon: GraduationCap,
    title: 'Mentorship & Masterclasses',
    desc: 'Senior professionals and domain experts engage directly with student clubs through talks, panel discussions, and mentorship programs.',
  },
  {
    icon: HeartHandshake,
    title: 'CSR & Social Outreach',
    desc: 'Partner with the Extension & Social Outreach domain for community programmes, skilling initiatives, and rural engagement.',
  },
  {
    icon: Globe2,
    title: 'International Exchange',
    desc: 'Connect KL SAC student clubs with global peer institutions for joint projects, cultural exchange, and collaborative competitions.',
  },
];

const ENGAGEMENT_STEPS = [
  {
    num: '01',
    title: 'Express Interest',
    desc: 'Send an inquiry through the contact form. Our team will respond within 3 working days to understand your goals.',
  },
  {
    num: '02',
    title: 'Define Scope',
    desc: 'We align your objectives with the appropriate SAC domain or club. Activities, mentorship, sponsorships, and project briefs are all possible.',
  },
  {
    num: '03',
    title: 'Formalise Engagement',
    desc: "A formal MOU or engagement letter is signed through KL University's established processes.",
  },
  {
    num: '04',
    title: 'Engage & Impact',
    desc: 'The collaboration runs — with SAC student teams delivering outcomes and your team gaining visibility and talent access.',
  },
];

const PARTNER_TYPES = [
  'Technology Companies',
  'Startups & VC Firms',
  'NGOs & Non-Profits',
  'Government Bodies',
  'International Universities',
  'Creative Agencies',
];

export default function CollaboratePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Collaborate</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
            Build With Our Students.
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '56ch' }}>
            KL SAC is a bridge between university and the world outside. If you're an industry partner, NGO, government body, or international institution — there's a way to work together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-[1.03]"
            style={{ background: '#970003', color: '#ffffff' }}>
            Get in Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Collaboration Areas ──────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="mb-10">
            <p className="kicker mb-5" style={{ color: '#970003' }}>Ways to Collaborate</p>
            <h2
              className="font-display font-medium leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em', maxWidth: '28ch' }}>
              Four ways to work with our students.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COLLAB_AREAS.map((area, i) => (
              <FadeIn key={area.title} delay={i * 0.06}>
                <div
                  className="flex flex-col h-full p-7 rounded-2xl transition-shadow hover:shadow-lg"
                  style={{ background: '#fff', border: '1px solid var(--hairline)', boxShadow: '0 2px 16px -8px rgba(25,19,19,0.06)' }}>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0"
                    style={{ background: 'rgba(151,0,3,0.08)' }}>
                    <area.icon size={22} style={{ color: '#970003' }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2.5" style={{ color: '#191313', letterSpacing: '-0.01em' }}>
                    {area.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>
                    {area.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who Collaborates ─────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <p className="kicker mb-10" style={{ color: '#970003' }}>Who We Work With</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PARTNER_TYPES.map(type => (
                <div
                  key={type}
                  className="flex flex-col items-center gap-2.5 p-5 rounded-2xl text-center transition-all hover:shadow-md"
                  style={{ background: '#fff', border: '1px solid var(--hairline)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#970003' }} />
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#191313' }}>{type}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Engagement Process ───────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="mb-2">
            <p className="kicker mb-10" style={{ color: '#970003' }}>How It Works</p>
          </FadeIn>

          <div className="max-w-2xl" style={{ borderTop: '1px solid var(--hairline)' }}>
            {ENGAGEMENT_STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.05}>
                <div className="flex gap-8 py-8" style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <span
                    className="font-display font-medium text-3xl leading-none shrink-0 pt-0.5"
                    style={{ color: 'rgba(151,0,3,0.18)', width: '3rem', fontVariantNumeric: 'tabular-nums' }}>
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-semibold text-lg mb-2" style={{ color: '#191313', letterSpacing: '-0.01em' }}>
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #7a0002 0%, #970003 55%, #6a0002 100%)' }}>
        <div
          className="absolute -top-32 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,255,255,0.06)', filter: 'blur(70px)' }}
          aria-hidden="true" />
        <div
          className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.15)', filter: 'blur(60px)' }}
          aria-hidden="true" />

        <div className="relative z-10 w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="kicker mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>Get Started</p>
                <h2
                  className="font-display font-medium mb-2 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
                  Ready to collaborate with KL SAC?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.06rem' }}>
                  Reach out and our team will connect you to the right domain or club.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-[1.03] shrink-0"
                style={{ background: '#fff', color: '#970003' }}>
                Contact SAC
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
