'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const MANUAL_KEYS = [
  { key: 'students',   label: 'Student Members',   suffix: '+', hint: 'Total enrolled students across all clubs' },
  { key: 'activities', label: 'Annual Activities', suffix: '+', hint: 'Total activities run per academic year'   },
];

export default function StatsAdminPage() {
  const [values,    setValues]    = useState<Record<string, number>>({});
  const [autoCounts, setAuto]     = useState<{ clubs: number; domains: number } | null>(null);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        const map: Record<string, number> = {};
        (d.data ?? []).forEach((s: any) => { map[s.key] = s.value; });
        setValues(map);
      });
    fetch('/api/public/stats')
      .then(r => r.json())
      .then(d => setAuto({ clubs: d.data?.clubs ?? 0, domains: d.data?.domains ?? 0 }));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const updates = MANUAL_KEYS.map(s => ({ key: s.key, value: values[s.key] ?? 0 }));
      const res = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Stats updated.');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
  const inputStyle = { borderColor: '#E4E4E7', background: '#F7F7F8' };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Homepage Stats
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>
        These numbers appear in the stats counter on the homepage.
      </p>

      {/* Auto-counted (read-only) */}
      <div className="rounded-2xl border p-6 mb-5" style={{ background: '#F7F7F8', borderColor: '#E4E4E7' }}>
        <p className="text-xs font-black uppercase tracking-wider mb-4" style={{ color: '#A1A1AA' }}>
          Auto-counted from your content
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
            <div className="font-black text-2xl mb-0.5" style={{ color: '#8B0000' }}>
              {autoCounts?.clubs ?? '—'}
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#0D0D0D' }}>Active Clubs</div>
            <Link href="/admin/clubs" className="text-[10px] font-bold hover:opacity-70 transition-opacity"
                  style={{ color: '#8B0000' }}>
              Add clubs →
            </Link>
          </div>
          <div className="rounded-xl border p-4" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
            <div className="font-black text-2xl mb-0.5" style={{ color: '#8B0000' }}>
              {autoCounts?.domains ?? '—'}
            </div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#0D0D0D' }}>Learning Domains</div>
            <Link href="/admin/domains" className="text-[10px] font-bold hover:opacity-70 transition-opacity"
                  style={{ color: '#8B0000' }}>
              Manage domains →
            </Link>
          </div>
        </div>
        <p className="text-[10px] mt-3" style={{ color: '#A1A1AA' }}>
          These update automatically when you add/remove clubs and domains. No manual edit needed.
        </p>
      </div>

      {/* Manual stats */}
      <div className="rounded-2xl border p-6 flex flex-col gap-5" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <p className="text-xs font-black uppercase tracking-wider" style={{ color: '#A1A1AA' }}>
          Set manually
        </p>
        {MANUAL_KEYS.map(s => (
          <div key={s.key}>
            <label className="block text-sm font-bold mb-0.5" style={{ color: '#0D0D0D' }}>
              {s.label}{s.suffix && <span style={{ color: '#8B0000' }}>{s.suffix}</span>}
            </label>
            <p className="text-xs mb-2" style={{ color: '#A1A1AA' }}>{s.hint}</p>
            <input
              type="number"
              min={0}
              value={values[s.key] ?? ''}
              onChange={e => setValues(v => ({ ...v, [s.key]: Number(e.target.value) }))}
              className={inputCls}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#8B0000')}
              onBlur={e => (e.target.style.borderColor = '#E4E4E7')}
            />
          </div>
        ))}

        <button onClick={save} disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
          style={{ background: '#8B0000', color: '#fff' }}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save Stats'}
        </button>
      </div>
    </div>
  );
}
