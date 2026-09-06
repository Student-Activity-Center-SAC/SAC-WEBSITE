'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';
import { compressImageIfTooLarge } from '../../_utils/upload-helper';

const LEVELS = ['International', 'National', 'State', 'University'] as const;
const DOMAIN_CODES = ['TEC', 'LCH', 'ESO', 'HWB', 'IIE'] as const;

const inputCls = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
const inputStyle = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
const focusStyle = { borderColor: '#8B0000' } as React.CSSProperties;

// Field must be defined outside AchievementForm — if defined inside, React
// recreates a new component type on every state change, unmounting and
// remounting the input each keystroke and losing focus.
function Field({ label, hint, textarea, value, onChange }: {
  label: string;
  hint?: string;
  textarea?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-0.5" style={{ color: '#0D0D0D' }}>{label}</label>
      {hint && <p className="text-xs mb-1.5" style={{ color: '#A1A1AA' }}>{hint}</p>}
      {textarea ? (
        <textarea rows={4} value={value}
          onChange={e => onChange(e.target.value)}
          className={inputCls + ' resize-none'}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, inputStyle)} />
      ) : (
        <input type="text" value={value}
          onChange={e => onChange(e.target.value)}
          className={inputCls}
          style={inputStyle}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, inputStyle)} />
      )}
    </div>
  );
}

function genId(title: string) {
  return 'ach-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) + '-' + Date.now().toString(36);
}

type Props = { achievement?: any };

export default function AchievementForm({ achievement }: Props) {
  const isNew = !achievement;
  const router = useRouter();
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);



  const [form, setForm] = useState({
    id:           achievement?.id           ?? '',
    title:        achievement?.title        ?? '',
    level:        achievement?.level        ?? 'National',
    club_name:    achievement?.club_name    ?? '',
    domain_code:  achievement?.domain_code  ?? 'TEC',
    organization: achievement?.organization ?? '',
    year:         achievement?.year         ?? String(new Date().getFullYear()),
    description:  achievement?.description  ?? '',
    photo:        achievement?.photo        ?? '',
  });

  useEffect(() => {
    fetch(`/api/admin/clubs?domain=${form.domain_code}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClubs(data.data);
        }
      });
  }, [form.domain_code]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const processedFile = await compressImageIfTooLarge(file);
      const fd = new FormData();
      fd.append('file', processedFile);
      fd.append('folder', 'achievements');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const text = await res.text();
      let d;
      try {
        d = JSON.parse(text);
      } catch (e) {
        if (res.status === 413) throw new Error('File is too large to upload (exceeds server limit).');
        throw new Error(`Upload failed (${res.status}): Server returned an invalid response.`);
      }
      if (!res.ok) throw new Error(d?.error || 'Upload failed');
      set('photo', d.url);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function save() {
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, id: form.id.trim() || genId(form.title) };
      const res = await fetch('/api/admin/achievements', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? 'Save failed'); }
      toast.success(isNew ? 'Achievement added.' : 'Achievement updated.');
      router.push('/admin/achievements');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl flex flex-col gap-5">
      <Field label="Title" hint="Full achievement title as it should appear on the page"
             value={form.title} onChange={v => set('title', v)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1" style={{ color: '#0D0D0D' }}>Level</label>
          <select value={form.level} onChange={e => set('level', e.target.value)}
            className={inputCls} style={inputStyle}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-1" style={{ color: '#0D0D0D' }}>Domain</label>
          <select value={form.domain_code} onChange={e => set('domain_code', e.target.value)}
            className={inputCls} style={inputStyle}>
            {DOMAIN_CODES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1" style={{ color: '#0D0D0D' }}>Club / Team Name</label>
          <select value={form.club_name} onChange={e => set('club_name', e.target.value)}
            className={inputCls} style={inputStyle}>
            <option value="">Select a Club</option>
            {clubs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <Field label="Year" value={form.year} onChange={v => set('year', v)} />
      </div>

      <Field label="Presenting Organisation"
             hint="Who awarded or organised this — competition body, company, institution"
             value={form.organization} onChange={v => set('organization', v)} />
      <Field label="Description"
             hint="2–4 sentences about the achievement and its significance"
             textarea value={form.description} onChange={v => set('description', v)} />
      {/* Photo */}
      <div>
        <label className="block text-sm font-bold mb-0.5" style={{ color: '#0D0D0D' }}>Photo</label>
        <p className="text-xs mb-1.5" style={{ color: '#A1A1AA' }}>Optional · Square or 4:3 · Event photo or trophy shot</p>
        <div className="flex flex-col gap-2">
          {form.photo && (
            <img src={form.photo} alt="preview"
                 className="w-32 h-32 rounded-xl object-cover"
                 style={{ border: '1px solid #E4E4E7' }} />
          )}
          <input type="text" value={form.photo}
            onChange={e => set('photo', e.target.value)}
            className={inputCls} style={inputStyle} placeholder="Paste URL or upload below"
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => Object.assign(e.target.style, inputStyle)} />
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors hover:bg-gray-50 w-fit"
                 style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
            <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#8B0000', color: '#fff' }}>
          <Save size={14} /> {saving ? 'Saving…' : isNew ? 'Add Achievement' : 'Save Changes'}
        </button>
        <button onClick={() => router.push('/admin/achievements')}
          className="px-6 py-3 rounded-xl font-bold text-sm border transition-all hover:bg-gray-50"
          style={{ borderColor: '#E4E4E7', color: '#71717A' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
