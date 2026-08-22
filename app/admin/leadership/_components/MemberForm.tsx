'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

const ROLES = ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Club Lead', 'Faculty Mentor', 'Faculty In-Charge'];

interface Props { initial?: any; mode: 'create' | 'edit'; }

function lines(arr: string[]) { return (arr ?? []).join('\n'); }
function fromLines(s: string) { return s.split('\n').map(l => l.trim()).filter(Boolean); }

export default function MemberForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id:            initial?.id            ?? '',
    name:          initial?.name          ?? '',
    role:          initial?.role          ?? 'Secretary',
    subtitle:      initial?.subtitle      ?? '',
    photo:         initial?.photo         ?? '',
    year_of_study: initial?.year_of_study ?? '',
    branch:        initial?.branch        ?? '',
    linkedin:      initial?.linkedin      ?? '',
    journey:       initial?.journey       ?? '',
    achievements:  lines(initial?.achievements ?? []),
    clubs_list:    lines(initial?.clubs_list ?? []),
    club_lead:     initial?.club_lead     ?? '',
    is_faculty:    initial?.is_faculty    ?? false,
    designation:   initial?.designation   ?? '',
    sort_order:    initial?.sort_order    ?? 0,
  });

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'council');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.error);
      set('photo', d.url);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        achievements: fromLines(form.achievements),
        clubs_list:   fromLines(form.clubs_list),
        sort_order:   Number(form.sort_order),
        photo:        form.photo || null,
        subtitle:     form.subtitle || null,
        linkedin:     form.linkedin || null,
        journey:      form.journey || null,
        club_lead:    form.club_lead || null,
        designation:  form.designation || null,
      };
      const res = await fetch('/api/admin/leadership', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(mode === 'create' ? 'Member added!' : 'Member updated!');
      router.push('/admin/leadership');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <Field label="Member ID * (unique, e.g. p1, vp3, cl-music)">
        <input required value={form.id} onChange={e => set('id', e.target.value)}
               disabled={mode === 'edit'}
               className={inp} style={{ ...sty, opacity: mode === 'edit' ? 0.6 : 1 }}
               placeholder="e.g. vp8" />
      </Field>

      <Field label="Full Name *">
        <input required value={form.name} onChange={e => set('name', e.target.value)}
               className={inp} style={sty} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Role *">
          <select value={form.role} onChange={e => set('role', e.target.value)}
                  className={inp} style={sty}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Sort Order">
          <input type="number" value={form.sort_order}
                 onChange={e => set('sort_order', e.target.value)}
                 className={inp} style={sty} />
        </Field>
      </div>

      <Field label="Subtitle / Portfolio">
        <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
               className={inp} style={sty}
               placeholder="e.g. Administration, Strategy & Student Engagement" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Year">
          <input value={form.year_of_study} onChange={e => set('year_of_study', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. 3rd Year" />
        </Field>
        <Field label="Branch">
          <input value={form.branch} onChange={e => set('branch', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. CSE" />
        </Field>
      </div>

      <Field label="LinkedIn URL">
        <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)}
               className={inp} style={sty} placeholder="https://linkedin.com/in/..." />
      </Field>

      <Field label="Club Lead (if applicable)">
        <input value={form.club_lead} onChange={e => set('club_lead', e.target.value)}
               className={inp} style={sty} placeholder="e.g. Swara Music Club" />
      </Field>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.is_faculty}
               onChange={e => set('is_faculty', e.target.checked)}
               className="w-4 h-4 accent-red-800" />
        <span className="text-sm font-semibold" style={{ color: '#0D0D0D' }}>Faculty member</span>
      </label>

      {form.is_faculty && (
        <Field label="Designation">
          <input value={form.designation} onChange={e => set('designation', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. Assistant Professor" />
        </Field>
      )}

      <Field label="Journey / Bio">
        <textarea rows={4} value={form.journey} onChange={e => set('journey', e.target.value)}
                  className={inp} style={sty} placeholder="Their story in SAC…" />
      </Field>

      <Field label="Achievements (one per line)">
        <textarea rows={4} value={form.achievements} onChange={e => set('achievements', e.target.value)}
                  className={inp} style={sty} />
      </Field>

      <Field label="Club Memberships (one per line)">
        <textarea rows={2} value={form.clubs_list} onChange={e => set('clubs_list', e.target.value)}
                  className={inp} style={sty} placeholder="e.g.&#10;SafeLife Club&#10;Yuva Tourism Club" />
      </Field>

      <Field label="Photo">
        <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>400 × 400 px · Square · Professional headshot, face centred</p>
        <div className="flex flex-col gap-2">
          {form.photo && (
            <img src={form.photo} alt="preview"
                 className="w-20 h-20 rounded-xl object-cover border"
                 style={{ borderColor: '#E4E4E7' }} />
          )}
          <input value={form.photo} onChange={e => set('photo', e.target.value)}
                 className={inp} style={sty} placeholder="Paste URL or upload" />
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border w-fit transition-colors hover:bg-gray-50"
                 style={{ borderColor: '#E4E4E7', color: '#0D0D0D' }}>
            <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={uploadPhoto} disabled={uploading} />
          </label>
        </div>
      </Field>

      <button type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
              style={{ background: '#8B0000', color: '#fff' }}>
        <Save size={14} /> {saving ? 'Saving…' : mode === 'create' ? 'Add Member' : 'Save Changes'}
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
const sty = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
