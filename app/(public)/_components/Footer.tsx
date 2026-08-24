import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { DOMAINS } from '@/lib/content/domains';

const NAVIGATE = [
  { href: '/about',         label: 'About SAC'      },
  { href: '/clubs',         label: 'All Clubs'       },
  { href: '/activities',     label: 'Activities'      },
  // { href: '/stories',       label: 'Student Stories' },
  { href: '/achievements',  label: 'Achievements'    },
  { href: '/news',          label: 'News'            },
  { href: '/publications',  label: 'Publications'    },
];

const ENGAGE = [
  { href: '/leadership',   label: 'Leadership'          },
  { href: '/collaborate',  label: 'Collaborate with SAC' },
  { href: '/contact',      label: 'Contact Us'           },
];

export default function Footer() {
  return (
    <footer style={{ background: '#150404', color: '#fff' }}>

      {/* ── Main columns ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

        {/* Brand */}
        <div>
          <div className="mb-6">
            <span className="inline-flex items-center" style={{ background: '#fff', borderRadius: '0.875rem', padding: '8px 12px' }}>
              <Image
                src="/logo.png"
                alt="KL SAC — Student Activity Center, KL University"
                height={32}
                width={150}
                style={{ objectFit: 'contain' }}
              />
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
            Student Activity Center<br />
            KL University, Vaddeswaram, Guntur<br />
            Andhra Pradesh — 522 302
          </p>

          <p className="kicker mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Tomorrow's Leaders
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/kl_sac/" target="_blank" rel="noopener" aria-label="Instagram"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ background: 'rgba(255,255,255,0.08)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(255,255,255,0.6)" stroke="none"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/sac-klef/posts/?feedView=all" target="_blank" rel="noopener" aria-label="LinkedIn"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ background: 'rgba(255,255,255,0.08)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@SAC__KLEF" target="_blank" rel="noopener" aria-label="YouTube"
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
               style={{ background: 'rgba(255,255,255,0.08)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0A0A0F"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="kicker mb-5"
              style={{ color: 'rgba(255,255,255,0.35)' }}>Navigate</h4>
          <ul className="space-y-3">
            {NAVIGATE.map(l => (
              <li key={l.href}>
                <Link href={l.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Domains */}
        <div>
          <h4 className="kicker mb-5"
              style={{ color: 'rgba(255,255,255,0.35)' }}>Domains</h4>
          <ul className="space-y-3">
            {DOMAINS.map(d => (
              <li key={d.code} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.42)' }}>
                <span className="font-black text-xs shrink-0" style={{ color: d.color }}>{d.code}</span>
                <span>{d.shortName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Engage */}
        <div>
          <h4 className="kicker mb-5"
              style={{ color: 'rgba(255,255,255,0.35)' }}>Engage</h4>
          <ul className="space-y-3 mb-8">
            {ENGAGE.map(l => (
              <li key={l.href}>
                <Link href={l.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.42)' }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Register for clubs and manage your student journey.
            </p>
            <Link href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-[1.03]"
                  style={{ background: '#970003', color: '#fff' }}>
              Student Dashboard
              <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
           style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
          © {new Date().getFullYear()} KL University — Student Activity Center. All rights reserved.
        </p>
        <p className="text-xs text-center sm:text-right" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Designed &amp; Developed by{' '}
          <a href="https://www.linkedin.com/in/rohith-venkata-sai-pinnamaneni/" target="_blank" rel="noopener"
             className="transition-colors hover:text-white"
             style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
            Rohith Pinnamaneni
          </a>
          {' '}&amp;{' '}
          <a href="https://www.linkedin.com/in/singananischal/" target="_blank" rel="noopener"
             className="transition-colors hover:text-white"
             style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
            Nischal Singana
          </a>
        </p>
      </div>
    </footer>
  );
}

