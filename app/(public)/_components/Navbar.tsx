'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const NAV_LINKS_LEFT = [
  { href: '/',      label: 'Home'  },
  { href: '/about', label: 'About' },
];

const NAV_LINKS_RIGHT = [
  { href: '/leadership',   label: 'Team'         },
  { href: '/news',         label: 'News'         },
  { href: '/clubs',        label: 'Clubs'        },
  { href: '/activities',   label: 'Activities'   },
  { href: '/publications', label: 'Publications' },
  { href: 'https://svr.kluniversity.in/', label: 'SVR', external: true },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === '/';
  const glass    = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(Math.max(0, window.scrollY) > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const textColor = (active: boolean) =>
    glass
      ? active ? '#fff' : 'rgba(255,255,255,0.72)'
      : active ? '#970003' : '#3F3F46';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height:         '64px',
          background:     glass ? 'transparent' : 'rgba(255,253,251,0.95)',
          backdropFilter: glass ? 'none' : 'blur(20px)',
          boxShadow:      glass ? 'none' : '0 1px 0 rgba(25,19,19,0.08)',
        }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex h-full items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-80" aria-label="KL SAC Home">
            <Image
              src="/logo.png"
              alt="KL SAC — Student Activity Center, KL University"
              height={30}
              width={140}
              style={{
                height: '30px',
                width: 'auto',
                objectFit: 'contain',
                filter: glass ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.3s',
              }}
              priority
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">

            {/* About (before Domains) */}
            {NAV_LINKS_LEFT.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: textColor(isActive(l.href)) }}>
                {l.label}
                {isActive(l.href) && !glass && (
                  <span className="absolute -bottom-0.5 left-3 h-0.5 w-4 rounded-full" style={{ background: '#c67374' }} />
                )}
              </Link>
            ))}

            {/* Links after About */}
            {NAV_LINKS_RIGHT.map(l => (
              <Link
                key={l.label}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}
                className="relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: textColor(isActive(l.href)) }}>
                {l.label}
                {isActive(l.href) && !glass && (
                  <span className="absolute -bottom-0.5 left-3 h-0.5 w-4 rounded-full" style={{ background: '#c67374' }} />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="https://sacactivities.kluniversity.in/auth/login"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background:     glass ? 'rgba(255,255,255,0.12)' : '#970003',
                color:          '#fff',
                backdropFilter: glass ? 'blur(8px)' : 'none',
                border:         glass ? '1px solid rgba(255,255,255,0.25)' : 'none',
              }}>
              Student Dashboard
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: glass ? '#fff' : '#191313' }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(15,5,5,0.5)', backdropFilter: 'blur(4px)' }} />
        </div>
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-40 w-80 lg:hidden flex flex-col transition-transform duration-300"
        style={{
          background: '#fffdfb',
          transform:  menuOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow:  '-4px 0 48px rgba(25,19,19,0.16)',
        }}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 hairline-b" style={{ height: '64px' }}>
          <Image src="/logo.png" alt="KL SAC" height={26} width={120}
            style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />
          <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg"
            style={{ background: 'rgba(25,19,19,0.06)' }}>
            <X size={18} style={{ color: '#71717A' }} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-0.5">
          {[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT].map(l => (
            <Link key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                  {...('external' in l && l.external ? { target: '_blank', rel: 'noopener' } : {})}
                  className="px-3 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background: isActive(l.href) ? '#fdf2f2' : 'transparent',
                    color:      isActive(l.href) ? '#970003' : '#191313',
                  }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="px-4 py-4 hairline-t">
          <Link href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-semibold"
                style={{ background: '#970003', color: '#fff' }}>
            Student Dashboard
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
