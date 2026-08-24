import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { FadeIn } from '../_components/FadeIn';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with KL SAC — general enquiries, collaboration, media, and student support.',
};

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-4" style={{ color: '#970003' }}>
            Contact
          </p>
          <h1
            className="font-display font-medium leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            Talk to SAC.
          </h1>
          <p className="text-lg" style={{ color: '#71717A', maxWidth: '52ch' }}>
            Whether you're a student, parent, industry partner, or media representative — we're here.
          </p>
        </div>
      </section>

      {/* ─── Contact Grid ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pb-24">
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
                      style={{ background: '#FEF2F2' }}>
                      <MapPin size={16} style={{ color: '#8B0000' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5" style={{ color: '#0D0D0D' }}>Location</p>
                      <p className="text-sm" style={{ color: '#71717A' }}>
                        KL University<br />
                        Vaddeswaram, Guntur<br />
                        Andhra Pradesh — 522302
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: '#FEF2F2' }}>
                      <Mail size={16} style={{ color: '#8B0000' }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5" style={{ color: '#0D0D0D' }}>Email</p>
                      <a href="mailto:sac@kluniversity.in" className="text-sm block hover:underline" style={{ color: '#71717A' }}>
                        sac@kluniversity.in
                      </a>
                      <a href="mailto:director_sac@kluniversity.in" className="text-sm block hover:underline" style={{ color: '#71717A' }}>
                        director_sac@kluniversity.in
                      </a>
                    </div>
                  </div>
                </div>

                {/* Student dashboard CTA */}
                <div
                  className="mt-10 p-6 rounded-2xl"
                  style={{ background: '#fdf2f2', border: '1px solid rgba(151,0,3,0.12)' }}>
                  <p className="font-bold text-sm mb-1" style={{ color: '#191313' }}>
                    Are you a KL student?
                  </p>
                  <p className="text-xs mb-4" style={{ color: 'rgba(25,19,19,0.5)' }}>
                    For club registration and activity details — use the Student Dashboard.
                  </p>
                  <Link
                    href="https://sacactivities.kluniversity.in/auth/login"
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 text-xs font-bold"
                    style={{ color: '#8B0000' }}>
                    Open Student Dashboard
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right: Enquiry types */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <p className="kicker mb-6" style={{ color: '#A1A1AA' }}>
                  Enquiry Types
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {[
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
                  ].map(item => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group p-5 rounded-xl transition-all hover:shadow-md"
                      style={{ border: '1px solid #E4E4E7', background: '#FAFAFA' }}>
                      <h3 className="font-black text-sm mb-1.5 group-hover:text-red-900 transition-colors" style={{ color: '#0D0D0D' }}>
                        {item.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: '#71717A' }}>
                        {item.desc}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Map placeholder */}
                <div
                  className="w-full rounded-2xl flex items-center justify-center"
                  style={{
                    height: '240px',
                    background: 'linear-gradient(135deg, #F7F7F8, #E4E4E7)',
                    border: '1px solid #E4E4E7',
                  }}>
                  <div className="text-center">
                    <MapPin size={28} className="mx-auto mb-2" style={{ color: '#D1D1D6' }} />
                    <p className="text-sm font-semibold" style={{ color: '#A1A1AA' }}>KL University, Vaddeswaram</p>
                    <Link
                      href="https://maps.google.com/?q=KL+University+Vaddeswaram"
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 text-xs font-bold mt-2 transition-opacity hover:opacity-70"
                      style={{ color: '#8B0000' }}>
                      Open in Google Maps <ArrowUpRight size={11} />
                    </Link>
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

