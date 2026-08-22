'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Upload } from 'lucide-react';

interface DomainRow {
  slug: string;
  code: string;
  name: string;
  short_name: string;
  tagline: string;
  headline: string;
  philosophy: string;
  description: string;
  color: string;
  accent_bg: string;
  text_color: string;
  competencies: string[];
  cover_url: string | null;
  gallery: string[];
}

export default function DomainForm({ domain }: { domain: DomainRow }) {
  const router = useRouter();

  const [name,        setName]        = useState(domain.name);
  const [shortName,   setShortName]   = useState(domain.short_name);
  const [tagline,     setTagline]     = useState(domain.tagline);
  const [headline,    setHeadline]    = useState(domain.headline);
  const [philosophy,  setPhilosophy]  = useState(domain.philosophy);
  const [description, setDescription] = useState(domain.description);
  const [color,       setColor]       = useState(domain.color);
  const [accentBg,    setAccentBg]    = useState(domain.accent_bg);
  const [textColor,   setTextColor]   = useState(domain.text_color);
  const [competencies, setCompetencies] = useState<string[]>(domain.competencies ?? []);
  const [newComp,     setNewComp]     = useState('');
  const [coverUrl,    setCoverUrl]    = useState(domain.cover_url ?? '');
  const [gallery,     setGallery]     = useState<string[]>(domain.gallery ?? []);
  const [uploading,   setUploading]   = useState<string | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [msg,         setMsg]         = useState('');

  async function upload(file: File, folder: string): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const json = await res.json();
    return json.url ?? null;
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('cover');
    const url = await upload(file, `domains/${domain.slug}`);
    if (url) setCoverUrl(url);
    setUploading(null);
  }

  async function addGalleryPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('gallery');
    const url = await upload(file, `domains/${domain.slug}/gallery`);
    if (url) setGallery(g => [...g, url]);
    setUploading(null);
  }

  function addCompetency() {
    const v = newComp.trim();
    if (v && !competencies.includes(v)) {
      setCompetencies(c => [...c, v]);
      setNewComp('');
    }
  }

  async function save() {
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/admin/domains', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: domain.slug,
        name, short_name: shortName, tagline, headline,
        philosophy, description, color, accent_bg: accentBg,
        text_color: textColor, competencies,
        cover_url: coverUrl || null,
        gallery,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg('Saved!');
      router.refresh();
    } else {
      const j = await res.json();
      setMsg(j.error ?? 'Error saving');
    }
  }

  const inputCls = 'w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 transition-all';
  const inputStyle = { borderColor: '#E4E4E7', background: '#FAFAFA' };
  const labelCls = 'block text-xs font-black uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Identity */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <h2 className="font-black text-base" style={{ color: '#0D0D0D' }}>Identity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={{ color: '#71717A' }}>Code</label>
            <input value={domain.code} disabled
              className={inputCls} style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: '#71717A' }}>Short Name</label>
            <input value={shortName} onChange={e => setShortName(e.target.value)}
              className={inputCls} style={inputStyle} />
          </div>
        </div>
        <div>
          <label className={labelCls} style={{ color: '#71717A' }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={{ color: '#71717A' }}>Tagline <span className="text-red-500">*</span></label>
          <input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Build. Innovate. Engineer."
            className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={{ color: '#71717A' }}>Headline</label>
          <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Where Engineers Are Made."
            className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <h2 className="font-black text-base" style={{ color: '#0D0D0D' }}>Content</h2>
        <div>
          <label className={labelCls} style={{ color: '#71717A' }}>Short Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
            className={inputCls} style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={{ color: '#71717A' }}>Philosophy / About (long paragraph)</label>
          <textarea value={philosophy} onChange={e => setPhilosophy(e.target.value)} rows={6}
            className={inputCls} style={inputStyle} />
        </div>
      </div>

      {/* Competencies */}
      <div className="rounded-2xl border p-6 space-y-4" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <h2 className="font-black text-base" style={{ color: '#0D0D0D' }}>Competencies Developed</h2>
        <div className="flex flex-wrap gap-2">
          {competencies.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: `${color}12`, color }}>
              {c}
              <button onClick={() => setCompetencies(prev => prev.filter((_, j) => j !== i))}
                      className="hover:opacity-70 transition-opacity">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newComp} onChange={e => setNewComp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCompetency())}
            placeholder="Add competency, press Enter"
            className={`flex-1 ${inputCls}`} style={inputStyle} />
          <button onClick={addCompetency}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: '#fff0f0', color: '#8B0000' }}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="rounded-2xl border p-6 space-y-4" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <div>
          <h2 className="font-black text-base" style={{ color: '#0D0D0D' }}>Cover Photo</h2>
          <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>1920 × 600 px · 16:5 ratio · Wide banner image</p>
        </div>
        {coverUrl ? (
          <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/5' }}>
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            <button onClick={() => setCoverUrl('')}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-red-300"
                 style={{ aspectRatio: '16/5', borderColor: '#E4E4E7' }}>
            {uploading === 'cover' ? (
              <span className="text-sm" style={{ color: '#A1A1AA' }}>Uploading…</span>
            ) : (
              <>
                <Upload size={22} style={{ color: '#A1A1AA' }} />
                <span className="text-xs mt-2" style={{ color: '#A1A1AA' }}>Upload cover photo</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={uploadCover} disabled={!!uploading} />
          </label>
        )}
      </div>

      {/* Gallery */}
      <div className="rounded-2xl border p-6 space-y-4" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <div>
          <h2 className="font-black text-base" style={{ color: '#0D0D0D' }}>Photo Gallery</h2>
          <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>800 × 600 px · 4:3 ratio · Domain event / activity photos</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {gallery.map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <button onClick={() => setGallery(g => g.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80">
                <X size={12} />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-red-300"
                 style={{ aspectRatio: '4/3', borderColor: '#E4E4E7' }}>
            {uploading === 'gallery' ? (
              <span className="text-xs" style={{ color: '#A1A1AA' }}>Uploading…</span>
            ) : (
              <>
                <Plus size={18} style={{ color: '#A1A1AA' }} />
                <span className="text-[10px] mt-1" style={{ color: '#A1A1AA' }}>Add photo</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={addGalleryPhoto} disabled={!!uploading} />
          </label>
        </div>
      </div>

      {/* Colors (advanced) */}
      <details className="rounded-2xl border" style={{ borderColor: '#E4E4E7' }}>
        <summary className="p-6 font-black text-base cursor-pointer" style={{ color: '#0D0D0D' }}>
          Colors (advanced)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={{ color: '#71717A' }}>Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border" style={{ borderColor: '#E4E4E7' }} />
                <input value={color} onChange={e => setColor(e.target.value)}
                  className={`flex-1 ${inputCls}`} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className={labelCls} style={{ color: '#71717A' }}>Accent BG</label>
              <input value={accentBg} onChange={e => setAccentBg(e.target.value)}
                className={inputCls} style={inputStyle} placeholder="rgba(139,0,0,0.07)" />
            </div>
            <div>
              <label className={labelCls} style={{ color: '#71717A' }}>Text Color</label>
              <input value={textColor} onChange={e => setTextColor(e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>
          </div>
        </div>
      </details>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving}
          className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#8B0000', color: '#fff' }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {msg && (
          <span className="text-sm font-semibold" style={{ color: msg === 'Saved!' ? '#16a34a' : '#dc2626' }}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
