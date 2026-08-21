'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BarChart2, Newspaper, Zap,
  BookOpen, LogOut, ExternalLink,
  Users, Building2, BookMarked, Settings, Globe, Trophy,
} from 'lucide-react';

const links = [
  { href: '/admin',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/stats',         label: 'Stats',         icon: BarChart2       },
  { href: '/admin/news',          label: 'News',          icon: Newspaper       },
  { href: '/admin/stories',       label: 'Stories',       icon: BookMarked      },
  { href: '/admin/achievements',  label: 'Achievements',  icon: Trophy          },
  { href: '/admin/activities',    label: 'Activities',    icon: Zap             },
  { href: '/admin/clubs',         label: 'Clubs',         icon: Building2       },
  { href: '/admin/domains',       label: 'Domains',       icon: Globe           },
  { href: '/admin/leadership',    label: 'Leadership',    icon: Users           },
  { href: '/admin/publications',  label: 'Publications',  icon: BookOpen        },
  { href: '/admin/settings',      label: 'Settings',      icon: Settings        },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router   = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const active = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <header className="border-b sticky top-0 z-50"
            style={{ background: '#fff', borderColor: '#E4E4E7' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/admin" className="font-black text-base shrink-0" style={{ color: '#8B0000' }}>
            ⚡ KL SAC Admin
          </Link>
          <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto">
            {links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                    style={{
                      background: active(href) ? '#fff0f0' : 'transparent',
                      color:      active(href) ? '#8B0000' : '#71717A',
                    }}>
                <Icon size={13} /> {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" target="_blank"
                className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                style={{ color: '#71717A' }}>
            <ExternalLink size={12} /> Site
          </Link>
          <button onClick={logout}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold transition-colors"
                  style={{ color: '#8B0000' }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
