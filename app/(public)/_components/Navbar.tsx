'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';

type NavDomain = {
  slug: string;
  code: string;
  short_name: string;
  tagline: string;
  color: string;
  accent_bg: string;
};

const NAV_LINKS = [
  { href: '/about',         label: 'About'        },
  { href: '/activities',     label: 'Activities'    },
  { href: '/stories',       label: 'Stories'       },
  { href: '/achievements',  label: 'Achievements'  },
  { href: '/news',          label: 'News'          },
];

export default function Navbar({ domains, totalClubs }: { domains: NavDomain[]; totalClubs: number }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [domainsOpen,  setDomainsOpen]  = useState(false);
  const [mobileDomainsOpen, setMobileDomainsOpen] = useState(false);
  const pathname  = usePathname();
  const isHome    = pathname === '/';
  const glass     = isHome && !scrolled;
  const dropRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setDomainsOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDomainsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDomainsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);
  const isDomainsActive = pathname.startsWith('/domains') || pathname.startsWith('/clubs');

  const linkColor = (active: boolean) =>
    glass
      ? active ? '#fff' : 'rgba(255,255,255,0.72)'
      : active ? '#8B0000' : '#3F3F46';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height:         '72px',
          background:     glass ? 'transparent' : 'rgba(255,255,255,0.97)',
          backdropFilter: glass ? 'none'        : 'blur(20px)',
          boxShadow:      glass ? 'none'        : '0 1px 0 rgba(0,0,0,0.07)',
        }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 flex h-full items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="shrink-0 transition-opacity hover:opacity-80"
            aria-label="KL SAC Home">
            <Image
              src="/logo.png"
              alt="KL SAC — Student Activity Center, KL University"
              height={38}
              width={170}
              style={{
                height: '38px',
                width: 'auto',
                objectFit: 'contain',
                filter: glass ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.3s',
              }}
              priority
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">

            {/* Domains dropdown */}
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDomainsOpen(v => !v)}
                aria-expanded={domainsOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover:bg-black/5"
                style={{ color: linkColor(isDomainsActive) }}>
                Domains
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200"
                  style={{ transform: domainsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                {isDomainsActive && !glass && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: '#8B0000' }} />
                )}
              </button>

              {domainsOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] rounded-2xl border shadow-2xl overflow-hidden animate-scale-in"
                  style={{ background: '#fff', borderColor: '#E4E4E7' }}>
                  <div className="px-5 pt-4 pb-2">
                    <p className="text-xs font-black tracking-[0.18em] uppercase" style={{ color: '#A1A1AA' }}>
                      {domains.length > 0 ? `${domains.length} Domains` : 'Domains'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-px p-2 pt-0" style={{ background: '#F4F4F5' }}>
                    {domains.map(d => (
                      <Link
                        key={d.code}
                        href={`/domains/${d.slug}`}
                        onClick={() => setDomainsOpen(false)}
                        className="flex gap-3 p-3 rounded-xl transition-colors group"
                        style={{ background: '#fff' }}>
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-black text-xs"
                          style={{ background: d.accent_bg, color: d.color }}>
                          {d.code}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm leading-tight text-gray-900 group-hover:text-gray-700 truncate">
                            {d.short_name}
                          </p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: '#71717A' }}>
                            {d.tagline}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #E4E4E7' }}>
                    <Link
                      href="/domains"
                      onClick={() => setDomainsOpen(false)}
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">
                      View all domains →
                    </Link>
                    <Link
                      href="/clubs"
                      onClick={() => setDomainsOpen(false)}
                      className="text-xs font-bold hover:opacity-75 transition-opacity"
                      style={{ color: '#8B0000' }}>
                      {totalClubs > 0 ? `Browse all ${totalClubs} clubs →` : 'Browse clubs →'}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard links */}
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover:bg-black/5"
                style={{ color: linkColor(isActive(l.href)) }}>
                {l.label}
                {isActive(l.href) && !glass && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" style={{ background: '#8B0000' }} />
                )}
              </Link>
            ))}
          </nav>

          {/* ── CTA ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="https://sacactivities.kluniversity.in"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background:  glass ? 'rgba(255,255,255,0.15)' : '#8B0000',
                color:       '#fff',
                backdropFilter: glass ? 'blur(8px)' : 'none',
                border:      glass ? '1px solid rgba(255,255,255,0.25)' : 'none',
              }}>
              Student Dashboard
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: glass ? '#fff' : '#1F2937' }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.4)' }} />
        </div>
      )}
      <div
        className="fixed top-0 right-0 bottom-0 z-40 w-80 lg:hidden flex flex-col transition-transform duration-300"
        style={{
          background:  '#fff',
          transform:   menuOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow:   '-4px 0 40px rgba(0,0,0,0.12)',
        }}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E4E4E7', height: '72px' }}>
          <Image
            src="/logo.png"
            alt="KL SAC"
            height={32}
            width={140}
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
          />
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} style={{ color: '#71717A' }} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1">
          {/* Domains section */}
          <button
            onClick={() => setMobileDomainsOpen(v => !v)}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-bold text-left transition-colors"
            style={{
              background:  isDomainsActive ? '#FFF0F0' : 'transparent',
              color:       isDomainsActive ? '#8B0000' : '#0D0D0D',
            }}>
            Domains & Clubs
            <ChevronDown
              size={16}
              className="transition-transform"
              style={{ transform: mobileDomainsOpen ? 'rotate(180deg)' : 'none', color: '#71717A' }} />
          </button>

          {mobileDomainsOpen && (
            <div className="pl-3 flex flex-col gap-1 mb-1">
              {domains.map(d => (
                <Link
                  key={d.code}
                  href={`/domains/${d.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-50">
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center font-black text-[10px] shrink-0"
                    style={{ background: d.accent_bg, color: d.color }}>
                    {d.code}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{d.short_name}</span>
                </Link>
              ))}
              <Link
                href="/clubs"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold mt-1"
                style={{ color: '#8B0000' }}>
                {totalClubs > 0 ? `View all ${totalClubs} clubs →` : 'View all clubs →'}
              </Link>
            </div>
          )}

          {/* Standard links */}
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 rounded-xl text-sm font-bold transition-colors"
              style={{
                background:  isActive(l.href) ? '#FFF0F0' : 'transparent',
                color:       isActive(l.href) ? '#8B0000' : '#0D0D0D',
              }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #E4E4E7' }}>
          <Link
            href="https://sacactivities.kluniversity.in"
            target="_blank"
            rel="noopener"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: '#8B0000', color: '#fff' }}>
            Student Dashboard
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}

