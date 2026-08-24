import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Navigation } from 'lucide-react';
import { FadeIn } from '../_components/FadeIn';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with KL SAC — general enquiries, collaboration, media, and student support.',
};

const ENQUIRY_TYPES = [
  {
    title: 'General Enquiries',
    desc: 'Questions about SAC, its programmes, domains, or clubs.',
    href: 'mailto:sac@kluniversity.in',
  },
  {
    title: 'Industry Collaboration',
    desc: 'Partnerships, sponsorships, mentorships, and project briefs.',
    href: '/collaborate',
  },
  {
    title: 'Media & Press',
    desc: 'Interview requests, press releases, and institutional statements.',
    href: 'mailto:director_sac@kluniversity.in',
  },
  {
    title: 'Student Support',
    desc: 'For KL students with questions about their club or activity participation.',
    href: 'https://sacactivities.kluniversity.in',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-4" style={{ color: '#970003' }}>
            Contact
          </p>
          <h1
            className="font-display font-medium leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em' }}>
            Talk to SAC.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '52ch' }}>
            Whether you're a student, parent, industry partner, or media representative — we're here.
          </p>
        </div>
      </section>

      {/* ─── Contact Grid ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* Left: Contact info */}
            <div className="lg:col-span-1">
              <FadeIn>
                <p className="kicker mb-6" style={{ color: '#970003' }}>
                  Reach Us
                </p>

                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(151,0,3,0.08)' }}>
                      <MapPin size={16} style={{ color: '#970003' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: '#191313' }}>Location</p>
                      <p className="text-sm" style={{ color: 'rgba(25,19,19,0.55)' }}>
                        KL University<br />
                        Vaddeswaram, Guntur<br />
                        Andhra Pradesh — 522302
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(151,0,3,0.08)' }}>
                      <Mail size={16} style={{ color: '#970003' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: '#191313' }}>Email</p>
                      <a href="mailto:sac@kluniversity.in" className="text-sm block hover:underline" style={{ color: 'rgba(25,19,19,0.55)' }}>
                        sac@kluniversity.in
                      </a>
                      <a href="mailto:director_sac@kluniversity.in" className="text-sm block hover:underline" style={{ color: 'rgba(25,19,19,0.55)' }}>
                        director_sac@kluniversity.in
                      </a>
                    </div>
                  </div>
                </div>

                {/* Student dashboard CTA */}
                <div
                  className="mt-10 p-6 rounded-2xl"
                  style={{ background: 'rgba(151,0,3,0.04)', border: '1px solid rgba(151,0,3,0.12)' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#191313' }}>
                    Are you a KL student?
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(25,19,19,0.5)' }}>
                    For club registration and activity details — use the Student Dashboard.
                  </p>
                  <Link
                    href="https://sacactivities.kluniversity.in/auth/login"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: '#970003' }}>
                    Open Student Dashboard
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right: Enquiry types */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <p className="kicker mb-6" style={{ color: '#970003' }}>
                  Enquiry Types
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {ENQUIRY_TYPES.map(item => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group p-5 rounded-2xl transition-all hover:shadow-lg"
                      style={{ border: '1px solid var(--hairline)', background: '#fff' }}>
                      <h3 className="font-semibold text-sm mb-1.5 transition-colors" style={{ color: '#191313' }}>
                        <span className="group-hover:opacity-70 transition-opacity">{item.title}</span>
                      </h3>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(25,19,19,0.5)' }}>
                        {item.desc}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-1.5"
                        style={{ color: '#970003' }}>
                        Reach out <ArrowUpRight size={11} />
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Visit campus panel */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--hairline)' }}>
                  <div
                    className="relative px-7 py-8 sm:px-8 sm:py-9"
                    style={{ background: 'linear-gradient(135deg, #faf6f1 0%, #f3ece4 100%)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: '#fff', boxShadow: '0 2px 10px -2px rgba(25,19,19,0.1)' }}>
                          <Navigation size={18} style={{ color: '#970003' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-base mb-1" style={{ color: '#191313' }}>
                            Visit the Campus
                          </p>
                          <p className="text-sm" style={{ color: 'rgba(25,19,19,0.55)' }}>
                            KL University, Vaddeswaram — Guntur, Andhra Pradesh 522302
                          </p>
                        </div>
                      </div>
                      <Link
                        href="https://maps.google.com/?q=KL+University+Vaddeswaram"
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.03] shrink-0"
                        style={{ background: '#970003', color: '#fff' }}>
                        Open in Maps
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
