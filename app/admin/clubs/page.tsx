'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, ChevronUp, ChevronDown } from 'lucide-react';

const DOMAIN_ORDER = ['TEC', 'LCH', 'ESO', 'HWB', 'IIE'];
const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#8B0000', LCH: '#B91C1C', ESO: '#991B1B', HWB: '#7C0000', IIE: '#C53030',
};
const DOMAIN_NAMES: Record<string, string> = {
  TEC: 'Technology',
  LCH: 'Liberal Arts & Culture',
  ESO: 'Social Outreach',
  HWB: 'Health & Wellbeing',
  IIE: 'Innovation & Entrepreneurship',
};

export default function ClubsAdminPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/clubs');
    const d = await r.json();
    setClubs(d.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const r = await fetch('/api/admin/clubs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (r.ok) { toast.success('Club deleted'); load(); }
    else toast.error('Delete failed');
  }

  async function move(domainClubs: any[], idx: number, dir: -1 | 1) {
    const a = domainClubs[idx];
    const b = domainClubs[idx + dir];
    if (!a || !b) return;
    setMoving(a.slug);
    const aOrder = a.sort_order;
    const bOrder = b.sort_order;
    setClubs(prev => prev.map(c => {
      if (c.slug === a.slug) return { ...c, sort_order: bOrder };
      if (c.slug === b.slug) return { ...c, sort_order: aOrder };
      return c;
    }));
    try {
      await Promise.all([
        fetch('/api/admin/clubs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: a.slug, sort_order: bOrder }) }),
        fetch('/api/admin/clubs', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: b.slug, sort_order: aOrder }) }),
      ]);
    } catch {
      toast.error('Reorder failed');
      load();
    } finally {
      setMoving(null);
    }
  }

  const byDomain: Record<string, any[]> = {};
  for (const c of clubs) {
    if (!byDomain[c.domain_code]) byDomain[c.domain_code] = [];
    byDomain[c.domain_code].push(c);
  }
  for (const code of DOMAIN_ORDER) {
    if (byDomain[code]) byDomain[code].sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Clubs</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            {clubs.length} clubs · Use arrows to reorder within each domain
          </p>
        </div>
        <Link href="/admin/clubs/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
              style={{ background: '#8B0000', color: '#fff' }}>
          <Plus size={14} /> New Club
        </Link>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : clubs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold mb-2" style={{ color: '#71717A' }}>No clubs yet — run the seed first</p>
          <Link href="/admin/clubs/new" className="text-sm font-bold" style={{ color: '#8B0000' }}>Add a club →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {DOMAIN_ORDER.map(code => {
            const domainClubs = byDomain[code] ?? [];
            if (!domainClubs.length) return null;
            const color = DOMAIN_COLORS[code];
            return (
              <div key={code}>
                <div className="flex items-center gap-3 mb-3 pb-2" style={{ borderBottom: `2px solid ${color}30` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                       style={{ background: `${color}15`, color }}>
                    {code}
                  </div>
                  <span className="font-black text-sm" style={{ color: '#0D0D0D' }}>{DOMAIN_NAMES[code]}</span>
                  <span className="text-xs ml-auto" style={{ color: '#A1A1AA' }}>
                    {domainClubs.length} club{domainClubs.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
                  {domainClubs.map((c, i) => (
                    <div key={c.slug}
                         className="flex items-center gap-3 px-4 py-3.5"
                         style={{ borderBottom: i < domainClubs.length - 1 ? '1px solid #F0F0F0' : 'none',
                                  opacity: moving === c.slug ? 0.5 : 1, transition: 'opacity 0.15s' }}>
                      {/* Reorder arrows */}
                      <div className="flex flex-col gap-0 shrink-0">
                        <button
                          onClick={() => move(domainClubs, i, -1)}
                          disabled={i === 0 || moving !== null}
                          className="p-1 rounded transition-colors hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move up">
                          <ChevronUp size={13} style={{ color: '#71717A' }} />
                        </button>
                        <button
                          onClick={() => move(domainClubs, i, 1)}
                          disabled={i === domainClubs.length - 1 || moving !== null}
                          className="p-1 rounded transition-colors hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move down">
                          <ChevronDown size={13} style={{ color: '#71717A' }} />
                        </button>
                      </div>

                      {/* Logo or domain badge */}
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-black overflow-hidden"
                           style={{ background: `${color}18`, color }}>
                        {c.logo_url
                          ? <img src={c.logo_url} alt="" className="w-full h-full object-contain" />
                          : code}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{c.name}</span>
                        <p className="text-xs truncate mt-0.5" style={{ color: '#A1A1AA' }}>{c.tagline}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/admin/clubs/${c.slug}`}
                              className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                          <Pencil size={14} style={{ color: '#71717A' }} />
                        </Link>
                        <button onClick={() => del(c.slug, c.name)}
                                className="p-2 rounded-lg transition-colors hover:bg-red-50">
                          <Trash2 size={14} style={{ color: '#8B0000' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 p-4 rounded-xl text-sm" style={{ background: '#FFF7ED', color: '#92400E' }}>
        <strong>First time?</strong> Run the seed to populate clubs from the existing static data:
        <code className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: '#FEF3C7' }}>
          POST /api/admin/seed/clubs-leadership
        </code>{' '}
        with header <code className="text-xs px-2 py-0.5 rounded" style={{ background: '#FEF3C7' }}>x-setup-key: KLSACsetup2026</code>
      </div>
    </div>
  );
}
