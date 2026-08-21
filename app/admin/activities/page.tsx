'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Filter } from 'lucide-react';

const DOMAINS = ['all', 'TEC', 'LCH', 'ESO', 'HWB', 'IIE'];
const DOMAIN_COLOR: Record<string, string> = {
  TEC: '#8B0000', LCH: '#B91C1C', HWB: '#7C0000', ESO: '#991B1B', IIE: '#C53030',
};

export default function ActivitiesAdminPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [domain, setDomain]         = useState('all');
  const [clubSlug, setClubSlug]     = useState('all');
  const [clubs, setClubs]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

  // Load clubs for the selected domain
  useEffect(() => {
    setClubSlug('all');
    if (domain === 'all') { setClubs([]); return; }
    fetch(`/api/admin/clubs?domain=${domain}`)
      .then(r => r.json())
      .then(j => setClubs(j.data ?? []));
  }, [domain]);

  // Load activities whenever domain or club filter changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (domain   !== 'all') params.set('domain',    domain);
    if (clubSlug !== 'all') params.set('club_slug', clubSlug);
    const url = `/api/admin/activities${params.toString() ? `?${params}` : ''}`;
    fetch(url)
      .then(r => r.json())
      .then(j => { setActivities(j.data ?? []); setLoading(false); });
  }, [domain, clubSlug]);

  function reload() {
    setLoading(true);
    const params = new URLSearchParams();
    if (domain   !== 'all') params.set('domain',    domain);
    if (clubSlug !== 'all') params.set('club_slug', clubSlug);
    const url = `/api/admin/activities${params.toString() ? `?${params}` : ''}`;
    fetch(url).then(r => r.json()).then(j => { setActivities(j.data ?? []); setLoading(false); });
  }

  async function del(code: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch('/api/admin/activities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    toast.success('Deleted');
    reload();
  }

  const activeColor = domain !== 'all' ? DOMAIN_COLOR[domain] : '#8B0000';
  const selectedClub = clubs.find(c => c.slug === clubSlug);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Activities</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            {activities.length} activities
            {domain !== 'all' && ` in ${domain}`}
            {selectedClub && ` · ${selectedClub.name}`}
          </p>
        </div>
        <Link href="/admin/activities/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
              style={{ background: '#8B0000', color: '#fff' }}>
          <Plus size={14} /> New Activity
        </Link>
      </div>

      {/* Domain filter */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Filter size={13} style={{ color: '#71717A' }} />
        {DOMAINS.map(d => (
          <button key={d} onClick={() => setDomain(d)}
                  className="px-3 py-1 rounded-full text-xs font-black transition-all border"
                  style={{
                    background:  domain === d ? (d === 'all' ? '#8B0000' : DOMAIN_COLOR[d]) : '#fff',
                    color:       domain === d ? '#fff' : (d === 'all' ? '#374151' : DOMAIN_COLOR[d] ?? '#374151'),
                    borderColor: domain === d ? 'transparent' : '#E4E4E7',
                  }}>
            {d === 'all' ? 'All' : d}
          </button>
        ))}
      </div>

      {/* Club filter — visible only when a domain is selected */}
      {domain !== 'all' && clubs.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6 pl-5">
          <span className="text-xs font-semibold" style={{ color: '#A1A1AA' }}>Club:</span>
          <button
            onClick={() => setClubSlug('all')}
            className="px-3 py-1 rounded-full text-xs font-bold transition-all border"
            style={{
              background:  clubSlug === 'all' ? activeColor : '#fff',
              color:       clubSlug === 'all' ? '#fff' : activeColor,
              borderColor: clubSlug === 'all' ? 'transparent' : '#E4E4E7',
            }}>
            All clubs
          </button>
          {clubs.map(c => (
            <button key={c.slug} onClick={() => setClubSlug(c.slug)}
                    className="px-3 py-1 rounded-full text-xs font-bold transition-all border"
                    style={{
                      background:  clubSlug === c.slug ? activeColor : '#fff',
                      color:       clubSlug === c.slug ? '#fff' : activeColor,
                      borderColor: clubSlug === c.slug ? 'transparent' : '#E4E4E7',
                    }}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold mb-2" style={{ color: '#71717A' }}>No activities</p>
          <Link href="/admin/activities/new" className="text-sm font-bold" style={{ color: '#8B0000' }}>Add the first activity →</Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          {activities.map((a, i) => {
            const color = DOMAIN_COLOR[a.domain] ?? '#8B0000';
            return (
              <div key={a.code}
                   className="flex items-center gap-4 px-5 py-4"
                   style={{ borderBottom: i < activities.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: '#0D0D0D' }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>
                    <span className="font-black" style={{ color }}>{a.domain}</span>
                    {' · '}{a.club_slug}
                    {' · '}{a.difficulty}
                    {a.month && <>{' · '}{a.month}{a.week ? `, ${a.week}` : ''}</>}
                    {a.activity_date && <>{' · '}{new Date(a.activity_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/activities/${a.code}`}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                    <Pencil size={14} style={{ color: '#71717A' }} />
                  </Link>
                  <button onClick={() => del(a.code, a.title)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-50">
                    <Trash2 size={14} style={{ color: '#8B0000' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
