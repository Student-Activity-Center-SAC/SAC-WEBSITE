'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, Save, Crop } from 'lucide-react';
import ImageCropModal from '../../_components/ImageCropModal';

const CATEGORY_PRESETS = ['General', 'Achievement', 'Event', 'Workshop', 'Cultural', 'Sports', 'Tech', 'Social Outreach', 'Other'];

interface Props { initial?: any; mode: 'create' | 'edit'; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewsForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const isPresetCategory = CATEGORY_PRESETS.slice(0, -1).includes(initial?.category);

  const [form, setForm] = useState({
    slug:       initial?.slug        ?? '',
    title:      initial?.title       ?? '',
    excerpt:    initial?.excerpt     ?? '',
    body:       initial?.body        ?? '',
    category:   initial?.category ? (isPresetCategory ? initial.category : 'Other') : 'General',
    customCategory: initial?.category && !isPresetCategory ? initial.category : '',
    date:       initial?.date        ?? new Date().toISOString().split('T')[0],
    featured:   initial?.featured    ?? false,
    photo_url:  initial?.photo_url   ?? '',
  });

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  async function uploadBlob(blob: Blob) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', blob, 'cover.jpg');
      fd.append('folder', 'news');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.error);
      set('photo_url', d.url);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = '';
  }

  function reCropExisting() {
    if (form.photo_url) setCropSrc(form.photo_url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const category = form.category === 'Other' ? (form.customCategory.trim() || 'Other') : form.category;
      const { customCategory, ...rest } = form;
      const payload = { ...rest, category, slug: form.slug || slugify(form.title) };
      const res = await fetch('/api/admin/news', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(mode === 'create' ? 'Article published!' : 'Article updated!');
      router.push('/admin/news');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {/* Title */}
      <Field label="Title *">
        <input required value={form.title}
               onChange={e => { set('title', e.target.value); if (!initial) set('slug', slugify(e.target.value)); }}
               className={input} style={inputStyle} />
      </Field>

      {/* Slug */}
      <Field label="Slug (URL)">
        <input value={form.slug} onChange={e => set('slug', slugify(e.target.value))}
               className={input} style={inputStyle} placeholder="auto-generated from title" />
      </Field>

      {/* Date + Category + Featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date">
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                 className={input} style={inputStyle} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={e => set('category', e.target.value)}
                  className={input} style={inputStyle}>
            {CATEGORY_PRESETS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        {form.category === 'Other' && (
          <Field label="Specify category *">
            <input required value={form.customCategory} onChange={e => set('customCategory', e.target.value)}
                   className={input} style={inputStyle} placeholder="e.g. Alumni, Partnership…" />
          </Field>
        )}
      </div>

      {/* Featured */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
               className="w-4 h-4 accent-red-800" />
        <span className="text-sm font-semibold" style={{ color: '#0D0D0D' }}>Highlight on news page (big article at top)</span>
      </label>

      {/* Excerpt */}
      <Field label="Excerpt (short summary)">
        <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                  className={input} style={inputStyle} />
      </Field>

      {/* Body */}
      <Field label="Full article body">
        <textarea rows={8} value={form.body} onChange={e => set('body', e.target.value)}
                  className={input} style={inputStyle}
                  placeholder="Use blank lines to separate paragraphs." />
      </Field>

      {/* Photo */}
      <Field label="Cover photo">
        <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>1200 × 630 px · 16:9 ratio · Article/event cover image</p>
        <div className="flex flex-col gap-2">
          {form.photo_url && (
            <div className="relative w-full max-h-48 overflow-hidden rounded-xl border" style={{ borderColor: '#E4E4E7' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.photo_url} alt="preview" className="w-full max-h-48 object-cover" />
              <button
                type="button"
                onClick={reCropExisting}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
                <Crop size={12} /> Crop & Adjust
              </button>
            </div>
          )}
          <input value={form.photo_url} onChange={e => set('photo_url', e.target.value)}
                 className={input} style={inputStyle} placeholder="Paste URL or upload below" />
          <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors hover:bg-gray-50 w-fit"
                 style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
            <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={selectFile} disabled={uploading} />
          </label>
        </div>
      </Field>

      <button type="submit" disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50 w-fit"
              style={{ background: '#8B0000', color: '#fff' }}>
        <Save size={14} /> {saving ? 'Saving…' : mode === 'create' ? 'Publish Article' : 'Save Changes'}
      </button>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={16 / 9}
          onCancel={() => setCropSrc(null)}
          onComplete={async blob => {
            setCropSrc(null);
            await uploadBlob(blob);
          }}
        />
      )}
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

const input = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
const inputStyle = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
