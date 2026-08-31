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
      const payload = { ...form, category: 'General', slug: form.slug || slugify(form.title.split(' ').slice(0,5).join(' ')) };
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
      {/* Description */}
      <Field label="Description *">
        <textarea required rows={4} value={form.title}
               onChange={e => { set('title', e.target.value); if (!initial) set('slug', slugify(e.target.value.split(' ').slice(0,5).join(' '))); }}
               className={input} style={inputStyle} placeholder="Enter a brief description or announcement..." />
      </Field>

      {/* Slug */}
      <Field label="Slug (URL)">
        <input value={form.slug} onChange={e => set('slug', slugify(e.target.value))}
               className={input} style={inputStyle} placeholder="auto-generated from title" />
      </Field>



      {/* Photo */}
      <Field label="Cover photo">
        <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>Upload article/event cover image</p>
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
          aspect={undefined}
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
