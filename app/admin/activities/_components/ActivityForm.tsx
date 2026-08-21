'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const FALLBACK_CLUBS: Record<string, { slug: string; name: string }[]> = {
  TEC: [
    { slug: 'zeroone-code-club',    name: 'ZeroOne Code Club' },
    { slug: 'cyber-security-club',  name: 'Cyber Security Club' },
    { slug: 'webapps-club',         name: 'WebApps Club' },
    { slug: 'electric-vehicle-club',name: 'Electric Vehicle Club' },
    { slug: 'automation-club',      name: 'Automation Club' },
  ],
  LCH: [
    { slug: 'swara-music-club',     name: 'Swara Music Club' },
    { slug: 'dance-club',           name: 'Dance Club' },
    { slug: 'theatre-arts-club',    name: 'Theatre Arts Club' },
    { slug: 'short-film-makers-club', name: 'Short Film Makers Club' },
    { slug: 'photography-club',     name: 'Photography Club' },
    { slug: 'arts-painting-club',   name: 'Arts / Painting Club' },
    { slug: 'handicrafts-club',     name: 'Handicrafts Club' },
    { slug: 'vastraa-fashion-club', name: 'Vastraa (Fashion) Club' },
    { slug: 'adventure-club',       name: 'Adventure Club' },
    { slug: 'kl-esports-club',      name: 'KL eSports Club' },
    { slug: 'vachas-club',          name: 'Vachas Club' },
  ],
  HWB: [
    { slug: 'safelife-club',   name: 'SafeLife Club' },
    { slug: 'yoga-club',       name: 'Yoga Club' },
    { slug: 'marathon-club',   name: 'Marathon Club' },
  ],
  ESO: [
    { slug: 'yuva-tourism-club',      name: 'Yuva Tourism Club' },
    { slug: 'spiritual-sciences-club',name: 'Spiritual Sciences Club' },
    { slug: 'kl-youth-policy-club',   name: 'KL Youth Policy Club' },
  ],
  IIE: [
    { slug: 'acic', name: 'ACIC' },
    { slug: 'tbi',  name: 'TBI'  },
  ],
};

const ALL_FALLBACK = Object.values(FALLBACK_CLUBS).flat();

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildMonthOptions() {
  const now = new Date();
  const opts: string[] = [];
  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    opts.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`);
  }
  return opts;
}
const MONTH_OPTIONS = buildMonthOptions();
const WEEK_OPTIONS  = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

interface Props { initial?: any; mode: 'create' | 'edit'; }

export default function ActivityForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [clubs, setClubs] = useState<Record<string, { slug: string; name: string }[]>>(FALLBACK_CLUBS);
  const [form, setForm] = useState({
    code:          initial?.code          ?? '',
    club_slug:     initial?.club_slug     ?? 'zeroone-code-club',
    domain:        initial?.domain        ?? 'TEC',
    title:         initial?.title         ?? '',
    description:   initial?.description   ?? '',
    competencies:  initial?.competencies  ?? '',
    month:         initial?.month         ?? MONTH_OPTIONS[0],
    week:          initial?.week          ?? 'Week 1',
    activity_date: initial?.activity_date ?? '',
    venue:         initial?.venue         ?? '',
    time_slot:     initial?.time_slot     ?? '',
    difficulty:    initial?.difficulty    ?? 'Beginner',
  });

  useEffect(() => {
    fetch('/api/admin/clubs')
      .then(r => r.json())
      .then(d => {
        const rows: any[] = d.data ?? [];
        if (rows.length === 0) return;
        const grouped: Record<string, { slug: string; name: string }[]> = {};
        rows.forEach((c: any) => {
          const dc = c.domain_code ?? 'TEC';
          if (!grouped[dc]) grouped[dc] = [];
          grouped[dc].push({ slug: c.slug, name: c.name });
        });
        setClubs(grouped);
      })
      .catch(() => {});
  }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function onDomainChange(d: string) {
    set('domain', d);
    const first = clubs[d]?.[0];
    if (first) set('club_slug', first.slug);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        activity_date: form.activity_date || null,
      };
      const res = await fetch('/api/admin/activities', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(mode === 'create' ? 'Activity added!' : 'Activity updated!');
      router.push('/admin/activities');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const clubsForDomain = clubs[form.domain] ?? ALL_FALLBACK;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {/* Code */}
      {mode === 'create' && (
        <Field label="Activity Code * (unique, e.g. ZC-A11)">
          <input required value={form.code} onChange={e => set('code', e.target.value)}
                 className={inp} style={is} placeholder="e.g. YC-A03" />
        </Field>
      )}

      {/* Domain + Club */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Domain *">
          <select value={form.domain} onChange={e => onDomainChange(e.target.value)} className={inp} style={is}>
            {['TEC','LCH','ESO','HWB','IIE'].map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Club *">
          <select value={form.club_slug} onChange={e => set('club_slug', e.target.value)} className={inp} style={is}>
            {clubsForDomain.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
      </div>

      {/* Title */}
      <Field label="Activity Title *">
        <input required value={form.title} onChange={e => set('title', e.target.value)}
               className={inp} style={is} />
      </Field>

      {/* Month + Week (required) */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Month *">
          <select required value={form.month} onChange={e => set('month', e.target.value)} className={inp} style={is}>
            {MONTH_OPTIONS.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Week *">
          <select required value={form.week} onChange={e => set('week', e.target.value)} className={inp} style={is}>
            {WEEK_OPTIONS.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>
      </div>

      {/* Date + Time (optional) */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Exact Date (optional — add later when confirmed)">
          <input type="date" value={form.activity_date}
                 onChange={e => set('activity_date', e.target.value)} className={inp} style={is} />
        </Field>
        <Field label="Time (optional)">
          <input value={form.time_slot} onChange={e => set('time_slot', e.target.value)}
                 className={inp} style={is} placeholder="e.g. 5:30 PM – 7:00 PM" />
        </Field>
      </div>

      {/* Venue */}
      <Field label="Venue">
        <input value={form.venue} onChange={e => set('venue', e.target.value)}
               className={inp} style={is} placeholder="e.g. SAC Hall, KL University" />
      </Field>

      {/* Difficulty */}
      <Field label="Difficulty">
        <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inp} style={is}>
          {['Beginner','Intermediate','Advanced'].map(d => <option key={d}>{d}</option>)}
        </select>
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                  className={inp} style={is} />
      </Field>

      {/* Competencies */}
      <Field label="Competencies (comma-separated)">
        <input value={form.competencies} onChange={e => set('competencies', e.target.value)}
               className={inp} style={is} placeholder="e.g. Leadership, Teamwork, Communication" />
      </Field>

      <button type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
              style={{ background: '#8B0000', color: '#fff' }}>
        <Save size={14} /> {saving ? 'Saving…' : mode === 'create' ? 'Add Activity' : 'Save Changes'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold" style={{ color: '#0D0D0D' }}>{label}</label>
      {children}
    </div>
  );
}

const inp = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
const is  = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
