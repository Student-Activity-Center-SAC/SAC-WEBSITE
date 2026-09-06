'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';
import { compressImageIfTooLarge } from '../../_utils/upload-helper';

const DOMAINS = [
  { code: 'TEC', label: 'TEC — Technology' },
  { code: 'LCH', label: 'LCH — Liberal Arts' },
  { code: 'HWB', label: 'HWB — Health & Wellbeing' },
  { code: 'ESO', label: 'ESO — Social Outreach' },
  { code: 'IIE', label: 'IIE — Innovation' },
];

interface Props { initial?: any; mode: 'create' | 'edit'; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function StoryForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    slug:         initial?.slug         ?? '',
    title:        initial?.title        ?? '',
    student_name: initial?.student_name ?? '',
    student_year: initial?.student_year ?? '',
    club_name:    initial?.club_name    ?? '',
    domain_code:  initial?.domain_code  ?? 'TEC',
    excerpt:      initial?.excerpt      ?? '',
    body:         initial?.body         ?? '',
    photo:        initial?.photo        ?? '',
    tags:         (initial?.tags ?? []).join(', '),
  });

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const processedFile = await compressImageIfTooLarge(file);
      const fd = new FormData();
      fd.append('file', processedFile);
      fd.append('folder', 'stories');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      set('photo', d.url);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };
      const res = await fetch('/api/admin/stories', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(mode === 'create' ? 'Story created!' : 'Story updated!');
      router.push('/admin/stories');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <Field label="Story Title *">
        <input required value={form.title}
               onChange={e => { set('title', e.target.value); if (!initial) set('slug', slugify(e.target.value)); }}
               className={inp} style={sty} />
      </Field>

      <Field label="Slug (URL) *">
        <input required value={form.slug}
               onChange={e => set('slug', slugify(e.target.value))}
               className={inp} style={sty} placeholder="auto-generated" />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Student Name *">
          <input required value={form.student_name}
                 onChange={e => set('student_name', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. Sayani Datta" />
        </Field>
        <Field label="Year / Programme">
          <input value={form.student_year}
                 onChange={e => set('student_year', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. B.Tech CSE, 4th Year" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Club Name">
          <input value={form.club_name}
                 onChange={e => set('club_name', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. ZeroOne Code Club" />
        </Field>
        <Field label="Domain">
          <select value={form.domain_code} onChange={e => set('domain_code', e.target.value)}
                  className={inp} style={sty}>
            {DOMAINS.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Excerpt (shown on cards)">
        <textarea rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                  className={inp} style={sty} placeholder="Short pull-quote or summary..." />
      </Field>

      <Field label="Full Story Body">
        <textarea rows={10} value={form.body} onChange={e => set('body', e.target.value)}
                  className={inp} style={sty} placeholder="Full story text. Use blank lines to separate paragraphs." />
      </Field>

      <Field label="Photo">
        <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>400 × 400 px · Square · Student portrait / headshot</p>
        <div className="flex flex-col gap-2">
          {form.photo && (
            <img src={form.photo} alt="preview"
                 className="w-32 h-32 rounded-xl object-cover"
                 style={{ border: '1px solid #E4E4E7' }} />
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

      <Field label="Tags (comma-separated)">
        <input value={form.tags}
               onChange={e => set('tags', e.target.value)}
               className={inp} style={sty} placeholder="e.g. Coding, Hackathon, TEC" />
      </Field>

      <button type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
              style={{ background: '#8B0000', color: '#fff' }}>
        <Save size={14} /> {saving ? 'Saving…' : mode === 'create' ? 'Create Story' : 'Save Changes'}
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
