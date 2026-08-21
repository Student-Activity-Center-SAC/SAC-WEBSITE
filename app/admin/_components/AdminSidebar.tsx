'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart2, Newspaper, Zap,
  BookOpen, LogOut, ExternalLink,
  Users, Building2, BookMarked, Settings, Globe, Trophy,
  Menu, X, Terminal,
} from 'lucide-react';

const DEV_USER = '2400030188';
import { useState } from 'react';

const NAV = [
  { group: 'Content',
    links: [
      { href: '/admin/news',          label: 'News',          icon: Newspaper    },
      { href: '/admin/stories',       label: 'Stories',       icon: BookMarked   },
      { href: '/admin/achievements',  label: 'Achievements',  icon: Trophy       },
      { href: '/admin/activities',    label: 'Activities',    icon: Zap          },
      { href: '/admin/publications',  label: 'Publications',  icon: BookOpen     },
    ],
  },
  { group: 'Structure',
    links: [
      { href: '/admin/clubs',         label: 'Clubs',         icon: Building2    },
      { href: '/admin/domains',       label: 'Domains',       icon: Globe        },
      { href: '/admin/leadership',    label: 'Leadership',    icon: Users        },
    ],
  },
  { group: 'Site',
    links: [
      { href: '/admin/stats',         label: 'Stats',         icon: BarChart2    },
      { href: '/admin/settings',      label: 'Settings',      icon: Settings     },
    ],
  },
];

export default function AdminSidebar({ username }: { username?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#E8E8EC' }}>
        <Link href="/admin" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="KL SAC" width={120} height={28}
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        <p className="text-[10px] font-bold mt-1.5 tracking-widest uppercase" style={{ color: '#A1A1AA' }}>
          Admin Panel
        </p>
      </div>

      {/* Dashboard */}
      <div className="px-3 pt-4 pb-1">
        <Link href="/admin" onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: active('/admin') && pathname === '/admin' ? '#8B000012' : 'transparent',
            color:      active('/admin') && pathname === '/admin' ? '#8B0000'   : '#3F3F46',
          }}>
          <LayoutDashboard size={16} />
          Dashboard
        </Link>
      </div>

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV.map(group => (
          <div key={group.group} className="mb-5">
            <p className="text-[10px] font-black tracking-[0.18em] uppercase px-3 mb-1.5 mt-4"
               style={{ color: '#C4C4CC' }}>
              {group.group}
            </p>
            {group.links.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5"
                style={{
                  background: active(href) ? '#8B000012' : 'transparent',
                  color:      active(href) ? '#8B0000'   : '#52525B',
                }}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Dev-only: SQL Executor */}
      {username === DEV_USER && (
        <div className="px-3 mb-2">
          <p className="text-[10px] font-black tracking-[0.18em] uppercase px-3 mb-1.5 mt-2"
             style={{ color: '#C4C4CC' }}>
            Dev Tools
          </p>
          <Link href="/admin/sql" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5"
            style={{
              background: active('/admin/sql') ? '#8B000012' : 'transparent',
              color:      active('/admin/sql') ? '#8B0000'   : '#52525B',
            }}>
            <Terminal size={15} />
            SQL Executor
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-5 border-t pt-4 flex flex-col gap-1" style={{ borderColor: '#E8E8EC' }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ color: '#71717A' }}>
          <ExternalLink size={14} /> View Site
        </Link>
        <button onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all w-full text-left"
          style={{ color: '#EF4444' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 z-40"
        style={{ background: '#fff', borderRight: '1px solid #E8E8EC' }}>
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
           style={{ background: '#fff', borderBottom: '1px solid #E8E8EC' }}>
        <Link href="/admin">
          <Image src="/logo.png" alt="KL SAC" width={100} height={24}
            style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        <button onClick={() => setOpen(v => !v)} className="p-2 rounded-lg"
                style={{ color: '#3F3F46' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}
             style={{ background: 'rgba(0,0,0,0.4)' }} />
      )}
      <aside
        className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col transition-transform duration-300"
        style={{
          background:  '#fff',
          borderRight: '1px solid #E8E8EC',
          transform:   open ? 'translateX(0)' : 'translateX(-100%)',
        }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#E8E8EC' }}>
          <Image src="/logo.png" alt="KL SAC" width={100} height={24}
            style={{ height: '24px', width: 'auto', objectFit: 'contain' }} />
          <button onClick={() => setOpen(false)}><X size={18} style={{ color: '#71717A' }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile top padding spacer */}
      <div className="lg:hidden h-14 w-full" />
    </>
  );
}
