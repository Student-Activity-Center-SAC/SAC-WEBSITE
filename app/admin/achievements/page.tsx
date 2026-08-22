'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Trophy, ArrowUp, ArrowDown, AlertCircle, Save } from 'lucide-react';

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  International: { bg: 'rgba(139,0,0,0.08)', color: '#8B0000' },
  National:      { bg: 'rgba(139,0,0,0.08)', color: '#8B0000' },
  State:         { bg: '#FEF3C7',            color: '#92400E' },
  University:    { bg: '#F4F4F5',            color: '#52525B' },
};

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [reordering, setReordering]     = useState(false);
  const [achStats, setAchStats]         = useState({ national: '', state: '', university: '' });
  const [savingStats, setSavingStats]   = useState(false);

  async function load() {
    const [r, sr] = await Promise.all([
      fetch('/api/admin/achievements'),
      fetch('/api/admin/stats'),
    ]);
    const d  = await r.json();
    const sd = await sr.json();
    setAchievements(d.data ?? []);
    setNeedsMigration(d.needsMigration ?? false);
    const sm: Record<string, number> = {};
    (sd.data ?? []).forEach((s: any) => { sm[s.key] = s.value; });
    setAchStats({
      national:   sm['ach_national']   ? String(sm['ach_national'])   : '',
      state:      sm['ach_state']      ? String(sm['ach_state'])      : '',
      university: sm['ach_university'] ? String(sm['ach_university']) : '',
    });
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function saveAchStats() {
    setSavingStats(true);
    try {
      const updates = [
        { key: 'ach_national',   value: parseInt(achStats.national)   || 0 },
        { key: 'ach_state',      value: parseInt(achStats.state)      || 0 },
        { key: 'ach_university', value: parseInt(achStats.university) || 0 },
      ];
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to save stats');
      toast.success('Recognition stats saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingStats(false);
    }
  }

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch('/api/admin/achievements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    toast.success('Deleted');
    load();
  }

  async function move(index: number, direction: 'up' | 'down') {
    const next = [...achievements];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setAchievements(next);
    setReordering(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: next.map(a => a.id) }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d.needsMigration) setNeedsMigration(true);
        throw new Error(d.error);
      }
      toast.success('Order saved');
    } catch (err: any) {
      toast.error(err.message);
      load();
    } finally {
      setReordering(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Achievements</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Recognitions, wins, and milestones. Use ↑↓ to set the display order.</p>
        </div>
        <Link href="/admin/achievements/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#8B0000', color: '#fff' }}>
          <Plus size={14} /> Add Achievement
        </Link>
      </div>

      {/* Recognition Stats Card */}
      <div className="rounded-2xl border p-6 mb-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <h2 className="font-black text-base mb-0.5" style={{ color: '#0D0D0D' }}>Homepage Recognition Stats</h2>
        <p className="text-sm mb-4" style={{ color: '#71717A' }}>These counts appear in the public Achievements section on the homepage.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {([
            { label: 'National',   key: 'national'   as const },
            { label: 'State',      key: 'state'      as const },
            { label: 'University', key: 'university' as const },
          ]).map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs font-bold mb-1" style={{ color: '#0D0D0D' }}>{label}</label>
              <input
                type="number" min="0"
                value={achStats[key]}
                onChange={e => setAchStats(s => ({ ...s, [key]: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#E4E4E7', background: '#F7F7F8' }}
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <button onClick={saveAchStats} disabled={savingStats}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#8B0000', color: '#fff' }}>
          <Save size={13} /> {savingStats ? 'Saving…' : 'Save Stats'}
        </button>
      </div>

      {/* Migration banner */}
      {needsMigration && (
        <div className="mb-6 rounded-2xl border p-4 flex gap-3"
             style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#92400e' }}>Run this SQL in MySQL to enable ordering:</p>
            <code className="text-xs block mt-1 p-2 rounded font-mono" style={{ background: '#fef3c7', color: '#78350f' }}>
              ALTER TABLE achievements ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
            </code>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : achievements.length === 0 ? (
        <div className="rounded-2xl border p-16 text-center" style={{ borderColor: '#E4E4E7' }}>
          <Trophy size={32} className="mx-auto mb-3" style={{ color: '#D1D1D6' }} />
          <p className="font-semibold mb-1" style={{ color: '#0D0D0D' }}>No achievements yet</p>
          <p className="text-sm mb-4" style={{ color: '#A1A1AA' }}>Add awards, qualifications, and milestones earned by SAC students.</p>
          <Link href="/admin/achievements/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: '#8B0000', color: '#fff' }}>
            <Plus size={14} /> Add first achievement
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          {achievements.map((a, i) => {
            const ls = LEVEL_COLORS[a.level] ?? LEVEL_COLORS.University;
            return (
              <div key={a.id}
                   className="flex items-center gap-3 px-4 py-3.5"
                   style={{ borderBottom: i < achievements.length - 1 ? '1px solid #F0F0F0' : 'none' }}>

                {/* Order arrows — hidden on small mobile */}
                <div className="hidden sm:flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => move(i, 'up')} disabled={i === 0 || reordering}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 transition-opacity"
                          title="Move up">
                    <ArrowUp size={12} style={{ color: '#71717A' }} />
                  </button>
                  <button onClick={() => move(i, 'down')} disabled={i === achievements.length - 1 || reordering}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 transition-opacity"
                          title="Move down">
                    <ArrowDown size={12} style={{ color: '#71717A' }} />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                     style={{ background: a.photo ? '#fff' : ls.bg, overflow: 'hidden' }}>
                  {a.photo
                    ? <img src={a.photo} alt="" className="w-full h-full object-cover" />
                    : <Trophy size={16} style={{ color: ls.color }} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm truncate block" style={{ color: '#0D0D0D' }}>{a.title}</span>
                  <span className="text-xs" style={{ color: '#A1A1AA' }}>
                    <span className="font-bold px-1.5 py-0.5 rounded-full mr-1.5"
                          style={{ background: ls.bg, color: ls.color }}>
                      {a.level}
                    </span>
                    {a.domain_code} · {a.club_name} · {a.year}
                  </span>
                </div>

                {/* Edit + Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/achievements/${a.id}`}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                    <Pencil size={14} style={{ color: '#71717A' }} />
                  </Link>
                  <button onClick={() => del(a.id, a.title)}
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
