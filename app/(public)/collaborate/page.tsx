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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.03]"
            style={{ background: '#8B0000', color: '#ffffff' }}>
            Get in Touch
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Collaboration Areas ──────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn>
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-10" style={{ color: '#8B0000' }}>
              Ways to Collaborate
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: '#E4E4E7' }}>
            {COLLAB_AREAS.map(area => (
              <FadeIn key={area.title}>
                <div className="flex flex-col h-full p-8" style={{ background: '#fff' }}>
                  <area.icon size={28} className="mb-5" style={{ color: '#8B0000' }} />
                  <h3 className="font-black text-lg mb-3" style={{ color: '#0D0D0D', letterSpacing: '-0.01em' }}>
                    {area.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>
                    {area.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Who Collaborates ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-10" style={{ color: '#A1A1AA' }}>
              Who We Work With
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                'Technology Companies',
                'Startups & VC Firms',
                'NGOs & Non-Profits',
                'Government Bodies',
                'International Universities',
                'Creative Agencies',
              ].map(type => (
                <div
                  key={type}
                  className="p-4 rounded-xl text-center"
                  style={{ background: '#fff', border: '1px solid #E4E4E7' }}>
                  <p className="text-xs font-bold leading-snug" style={{ color: '#3F3F46' }}>{type}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Engagement Process ───────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn>
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-10" style={{ color: '#8B0000' }}>
              How It Works
            </p>
          </FadeIn>

          <div className="max-w-2xl" style={{ borderTop: '1px solid #E4E4E7' }}>
            {ENGAGEMENT_STEPS.map(step => (
              <FadeIn key={step.num}>
                <div className="flex gap-8 py-8" style={{ borderBottom: '1px solid #E4E4E7' }}>
                  <span
                    className="font-black text-3xl leading-none shrink-0 pt-0.5"
                    style={{ color: '#E8E8EC', width: '3rem', fontVariantNumeric: 'tabular-nums' }}>
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-black text-lg mb-2" style={{ color: '#0D0D0D', letterSpacing: '-0.01em' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>
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
      <section style={{ background: '#8B0000' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <h2
                  className="font-display font-medium text-2xl sm:text-3xl mb-2 leading-tight"
                  style={{ color: '#fff', letterSpacing: '-0.02em' }}>
                  Ready to collaborate with KL SAC?
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Reach out and our team will connect you to the right domain or club.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:bg-white/90 shrink-0"
                style={{ background: '#fff', color: '#8B0000' }}>
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

