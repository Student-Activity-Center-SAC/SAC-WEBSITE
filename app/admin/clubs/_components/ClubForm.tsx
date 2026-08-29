'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Save, Upload, X, Image, Crop, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const DOMAINS = [
  { code: 'TEC', slug: 'technology',       label: 'TEC — Technology' },
  { code: 'LCH', slug: 'liberal-arts',     label: 'LCH — Liberal Arts, Cultural & Hobby' },
  { code: 'ESO', slug: 'social-outreach',  label: 'ESO — Extension & Social Outreach' },
  { code: 'HWB', slug: 'health-wellbeing', label: 'HWB — Health & Wellbeing' },
  { code: 'IIE', slug: 'innovation',       label: 'IIE — Innovation, Incubation & Entrepreneurship' },
];

interface Props { initial?: any; mode: 'create' | 'edit'; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function lines(arr: string[]) { return arr.join('\n'); }
function fromLines(s: string) { return s.split('\n').map(l => l.trim()).filter(Boolean); }

// ── Auto Crop Helper (for multi-upload) ───────────────────────────────────────

function autoCropAndUpload(file: File, options: CropOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = options.targetWidth;
      canvas.height = options.targetHeight;
      const ctx = canvas.getContext('2d')!;

      const naturalAr = img.naturalWidth / img.naturalHeight;
      let srcW, srcH, srcX, srcY;

      if (naturalAr > options.aspectRatio) {
        // Image is wider
        srcH = img.naturalHeight;
        srcW = img.naturalHeight * options.aspectRatio;
        srcX = (img.naturalWidth - srcW) / 2;
        srcY = 0;
      } else {
        // Image is taller
        srcW = img.naturalWidth;
        srcH = img.naturalWidth / options.aspectRatio;
        srcX = 0;
        srcY = (img.naturalHeight - srcH) / 2;
      }

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, options.targetWidth, options.targetHeight);
      canvas.toBlob(async blob => {
        if (!blob) return reject(new Error('Canvas toBlob failed'));
        const fd = new FormData();
        fd.append('file', blob, 'cropped.png');
        fd.append('folder', 'clubs');
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
          const d = await res.json();
          if (!res.ok) throw new Error(d.error);
          resolve(d.url);
        } catch (e) {
          reject(e);
        }
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// ── Crop Modal ────────────────────────────────────────────────────────────────

interface CropOptions {
  aspectRatio: number; // e.g. 1 for square, 16/5 for cover, 4/3 for gallery
  label: string;
  targetWidth: number;
  targetHeight: number;
}

interface CropModalProps {
  src: string;
  options: CropOptions;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
}

function CropModal({ src, options, onCancel, onApply }: CropModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  // Container preview size (capped at 560w or 320h)
  let PREVIEW_W = 560;
  let PREVIEW_H = Math.round(PREVIEW_W / options.aspectRatio);
  if (PREVIEW_H > 320) {
    PREVIEW_H = 320;
    PREVIEW_W = Math.round(PREVIEW_H * options.aspectRatio);
  }

  const onLoad = useCallback(() => {
    setImgLoaded(true);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  function apply() {
    const img = imgRef.current;
    if (!img || !imgLoaded) return;
    const canvas = document.createElement('canvas');
    canvas.width  = options.targetWidth;
    canvas.height = options.targetHeight;
    const ctx = canvas.getContext('2d')!;

    // Calculate how img is rendered in preview box
    const naturalAr = img.naturalWidth / img.naturalHeight;
    let renderedW: number, renderedH: number;
    if (naturalAr > options.aspectRatio) {
      renderedH = PREVIEW_H * zoom;
      renderedW = renderedH * naturalAr;
    } else {
      renderedW = PREVIEW_W * zoom;
      renderedH = renderedW / naturalAr;
    }

    // Centred offset in preview
    const baseX = (PREVIEW_W - renderedW) / 2 + offset.x;
    const baseY = (PREVIEW_H - renderedH) / 2 + offset.y;

    // Map preview crop rect → source coords
    const scaleX = img.naturalWidth / renderedW;
    const scaleY = img.naturalHeight / renderedH;
    const srcX = -baseX * scaleX;
    const srcY = -baseY * scaleY;
    const srcW = PREVIEW_W * scaleX;
    const srcH = PREVIEW_H * scaleY;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, options.targetWidth, options.targetHeight);
    canvas.toBlob(blob => { if (blob) onApply(blob); }, 'image/png');
  }

  const naturalAr = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;
  let renderedW: number, renderedH: number;
  if (naturalAr > options.aspectRatio) {
    renderedH = PREVIEW_H * zoom;
    renderedW = renderedH * naturalAr;
  } else {
    renderedW = PREVIEW_W * zoom;
    renderedH = renderedW / naturalAr;
  }
  const baseX = (PREVIEW_W - renderedW) / 2 + offset.x;
  const baseY = (PREVIEW_H - renderedH) / 2 + offset.y;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E4E4E7' }}>
          <div>
            <h3 className="font-black text-base" style={{ color: '#0D0D0D' }}>
              <Crop size={14} className="inline mr-1.5 mb-0.5" />
              Crop & Resize
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>
              {options.label} · {options.targetWidth}×{options.targetHeight}px
            </p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} style={{ color: '#71717A' }} />
          </button>
        </div>

        {/* Preview */}
        <div className="px-5 pt-4">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl mx-auto select-none"
            style={{
              width: PREVIEW_W, height: PREVIEW_H,
              background: '#1a1a1a',
              cursor: dragging ? 'grabbing' : 'grab',
              border: '2px solid #8B0000',
            }}
            onMouseDown={onMouseDown}
          >
            {/* Hidden img for measurements */}
            <img
              ref={imgRef}
              src={src}
              alt=""
              onLoad={onLoad}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1 }}
            />
            {imgLoaded && (
              <img
                src={src}
                alt="preview"
                draggable={false}
                style={{
                  position: 'absolute',
                  width: renderedW,
                  height: renderedH,
                  left: baseX,
                  top: baseY,
                  userSelect: 'none',
                }}
              />
            )}
            {/* Crop overlay grid */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: [
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              ].join(', '),
              backgroundSize: `${PREVIEW_W/3}px ${PREVIEW_H/3}px`,
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: 10,
            }} />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => { setZoom(z => Math.max(0.5, z - 0.1)); setOffset({ x: 0, y: 0 }); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
            >
              <ZoomOut size={14} style={{ color: '#71717A' }} />
            </button>
            <input
              type="range" min={0.5} max={3} step={0.05}
              value={zoom}
              onChange={e => { setZoom(Number(e.target.value)); setOffset({ x: 0, y: 0 }); }}
              className="flex-1 accent-red-800"
            />
            <button
              onClick={() => { setZoom(z => Math.min(3, z + 0.1)); setOffset({ x: 0, y: 0 }); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
            >
              <ZoomIn size={14} style={{ color: '#71717A' }} />
            </button>
            <button
              onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
              title="Reset"
            >
              <RotateCw size={13} style={{ color: '#71717A' }} />
            </button>
            <span className="text-xs tabular-nums w-10 text-right" style={{ color: '#A1A1AA' }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <p className="text-xs mt-1.5 mb-4" style={{ color: '#A1A1AA' }}>
            Drag the image to reposition · Zoom to fit more or less
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4" style={{ borderTop: '1px solid #E4E4E7' }}>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E4E4E7', color: '#71717A' }}
          >
            Cancel
          </button>
          <button
            onClick={apply}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#8B0000', color: '#fff' }}
          >
            Apply & Upload
          </button>
        </div>
        {/* Hidden canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}

// ── Crop target presets ───────────────────────────────────────────────────────

const CROP_PRESETS: Record<string, CropOptions> = {
  logo:    { aspectRatio: 1,    label: 'Logo',        targetWidth: 200,  targetHeight: 200  },
  cover:   { aspectRatio: 16/5, label: 'Cover Photo', targetWidth: 1920, targetHeight: 600  },
  gallery: { aspectRatio: 3/2,  label: 'Gallery',     targetWidth: 900,  targetHeight: 600  },
};

// ── Main ClubForm ─────────────────────────────────────────────────────────────

export default function ClubForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Crop state
  const [cropSrc, setCropSrc]       = useState<string | null>(null);
  const [cropKey, setCropKey]       = useState<string>('gallery');
  const [cropFile, setCropFile]     = useState<File | null>(null);
  const [pendingInput, setPendingInput] = useState<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    slug:            initial?.slug            ?? '',
    name:            initial?.name            ?? '',
    domain_code:     initial?.domain_code     ?? 'TEC',
    domain_slug:     initial?.domain_slug     ?? 'technology',
    tagline:         initial?.tagline         ?? '',
    about:           lines(initial?.about     ?? []),
    purpose:         initial?.purpose         ?? '',
    competencies:    lines(initial?.competencies   ?? []),
    activities_list: lines(initial?.activities_list ?? []),
    logo_url:        initial?.logo_url        ?? '',
    cover_url:       initial?.cover_url       ?? '',
    gallery:         (initial?.gallery ?? []) as string[],
    sort_order:      initial?.sort_order      ?? 0,
  });

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function setDomain(code: string) {
    const d = DOMAINS.find(x => x.code === code)!;
    setForm(f => ({ ...f, domain_code: d.code, domain_slug: d.slug }));
  }

  /** Open the crop modal for a given upload field, or auto-crop if multiple files selected */
  async function openCrop(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Auto-upload multiple gallery photos
    if (key === 'gallery' && files.length > 1) {
      setUploading('gallery');
      const toastId = toast.loading(`Uploading ${files.length} photos...`);
      try {
        const urls = await Promise.all(
          files.map(f => autoCropAndUpload(f, CROP_PRESETS.gallery))
        );
        setForm(f => ({ ...f, gallery: [...f.gallery, ...urls] }));
        toast.success(`${urls.length} photos added to gallery`, { id: toastId });
      } catch (err: any) {
        toast.error(`Error uploading photos: ${err.message}`, { id: toastId });
      } finally {
        setUploading(null);
        e.target.value = '';
      }
      return;
    }

    const file = files[0];
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropKey(key);
    setCropFile(file);
    setPendingInput(e.target);
  }

  /** After crop, upload the resulting blob */
  async function uploadBlob(blob: Blob, key: string, originalFile: File) {
    setCropSrc(null);
    if (pendingInput) { pendingInput.value = ''; setPendingInput(null); }
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append('file', blob, 'cropped.png');
      fd.append('folder', 'clubs');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (key === 'gallery') {
        setForm(f => ({ ...f, gallery: [...f.gallery, d.url] }));
        toast.success('Photo added to gallery');
      } else {
        set(key === 'logo' ? 'logo_url' : 'cover_url', d.url);
        toast.success('Uploaded');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
      if (cropSrc) URL.revokeObjectURL(cropSrc);
    }
  }

  function removeGalleryPhoto(idx: number) {
    setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }));
  }

  function moveGalleryPhoto(idx: number, dir: -1 | 1) {
    setForm(f => {
      const arr = [...f.gallery];
      if (idx + dir < 0 || idx + dir >= arr.length) return f;
      const temp = arr[idx];
      arr[idx] = arr[idx + dir];
      arr[idx + dir] = temp;
      return { ...f, gallery: arr };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...(mode === 'edit' && initial?.id ? { id: initial.id } : {}),
        ...form,
        slug:            form.slug || slugify(form.name),
        about:           fromLines(form.about),
        competencies:    fromLines(form.competencies),
        activities_list: fromLines(form.activities_list),
        sort_order:      Number(form.sort_order),
      };
      const res = await fetch('/api/admin/clubs', {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(mode === 'create' ? 'Club created!' : 'Club updated!');
      router.push('/admin/clubs');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* Crop modal */}
      {cropSrc && cropFile && (
        <CropModal
          src={cropSrc}
          options={CROP_PRESETS[cropKey] ?? CROP_PRESETS.gallery}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
            if (pendingInput) { pendingInput.value = ''; setPendingInput(null); }
          }}
          onApply={blob => uploadBlob(blob, cropKey, cropFile)}
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
        <Field label="Club Name *">
          <input required value={form.name}
                 onChange={e => { set('name', e.target.value); if (!initial) set('slug', slugify(e.target.value)); }}
                 className={inp} style={sty} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Slug (URL) *">
            <input required value={form.slug}
                   onChange={e => set('slug', slugify(e.target.value))}
                   className={inp} style={sty} placeholder="auto-generated" />
          </Field>
          <Field label="Sort Order">
            <input type="number" value={form.sort_order}
                   onChange={e => set('sort_order', e.target.value)}
                   className={inp} style={sty} />
          </Field>
        </div>

        <Field label="Domain *">
          <select value={form.domain_code} onChange={e => setDomain(e.target.value)}
                  className={inp} style={sty}>
            {DOMAINS.map(d => <option key={d.code} value={d.code}>{d.label}</option>)}
          </select>
        </Field>

        <Field label="Tagline">
          <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
                 className={inp} style={sty} placeholder="e.g. Where logic meets ambition." />
        </Field>

        <Field label="About (one paragraph per line)">
          <textarea rows={5} value={form.about} onChange={e => set('about', e.target.value)}
                    className={inp} style={sty} />
        </Field>

        <Field label="Purpose">
          <textarea rows={3} value={form.purpose} onChange={e => set('purpose', e.target.value)}
                    className={inp} style={sty} />
        </Field>

        <Field label="Competencies (one per line)">
          <textarea rows={4} value={form.competencies} onChange={e => set('competencies', e.target.value)}
                    className={inp} style={sty} placeholder={"e.g.\nCompetitive Programming\nData Structures & Algorithms"} />
        </Field>

        <Field label="Activities (one per line)">
          <textarea rows={4} value={form.activities_list} onChange={e => set('activities_list', e.target.value)}
                    className={inp} style={sty} placeholder={"e.g.\nWeekly coding challenges\nNational hackathon participation"} />
        </Field>

        {/* Logo */}
        <Field label="Logo">
          <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>200 × 200 px · Square · PNG with transparent background preferred · Will be auto-cropped to square</p>
          <div className="flex flex-col gap-2">
            {form.logo_url && (
              <div className="relative w-fit">
                <img src={form.logo_url} alt="logo preview"
                     className="w-16 h-16 rounded-xl object-contain border"
                     style={{ borderColor: '#E4E4E7', background: '#F7F7F8' }} />
                <button type="button" onClick={() => set('logo_url', '')}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: '#8B0000' }}>
                  <X size={10} style={{ color: '#fff' }} />
                </button>
              </div>
            )}
            <input value={form.logo_url} onChange={e => set('logo_url', e.target.value)}
                   className={inp} style={sty} placeholder="Paste URL or upload below" />
            <label className={uploadBtn}>
              <Upload size={13} /> {uploading === 'logo' ? 'Uploading…' : 'Upload & Crop Logo'}
              <input type="file" accept="image/*" className="hidden"
                     onChange={e => openCrop(e, 'logo')}
                     disabled={uploading !== null} />
            </label>
          </div>
        </Field>

        {/* Cover photo */}
        <Field label="Cover Photo (banner shown on club page)">
          <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>1920 × 600 px · 16:5 ratio · Will be auto-cropped</p>
          <div className="flex flex-col gap-2">
            {form.cover_url && (
              <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/5' }}>
                <img src={form.cover_url} alt="cover preview"
                     className="w-full h-full object-cover" />
                <button type="button" onClick={() => set('cover_url', '')}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <X size={12} style={{ color: '#fff' }} />
                </button>
              </div>
            )}
            <input value={form.cover_url} onChange={e => set('cover_url', e.target.value)}
                   className={inp} style={sty} placeholder="Paste URL or upload below" />
            <label className={uploadBtn}>
              <Image size={13} /> {uploading === 'cover' ? 'Uploading…' : 'Upload & Crop Cover Photo'}
              <input type="file" accept="image/*" className="hidden"
                     onChange={e => openCrop(e, 'cover')}
                     disabled={uploading !== null} />
            </label>
          </div>
        </Field>

        {/* Gallery */}
        <Field label="Gallery Photos (shown on club page)">
          <p className="text-xs mb-1" style={{ color: '#A1A1AA' }}>900 × 600 px · 3:2 ratio · Can select multiple photos. Uploads are auto-cropped to center.</p>
          <div className="flex flex-col gap-3">
            {form.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {form.gallery.map((url, i) => (
                  <div key={url} className="relative rounded-lg overflow-hidden group" style={{ aspectRatio: '3/2' }}>
                    <img src={url} alt={`gallery ${i + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button type="button" onClick={() => moveGalleryPhoto(i, -1)} disabled={i === 0}
                              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center disabled:opacity-30">
                        <ArrowLeft size={14} className="text-white" />
                      </button>
                      <button type="button" onClick={() => removeGalleryPhoto(i)}
                              className="w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center">
                        <X size={14} className="text-white" />
                      </button>
                      <button type="button" onClick={() => moveGalleryPhoto(i, 1)} disabled={i === form.gallery.length - 1}
                              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center disabled:opacity-30">
                        <ArrowRight size={14} className="text-white" />
                      </button>
                    </div>

                    <span className="absolute bottom-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm"
                          style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <label className={uploadBtn}>
              <Upload size={13} /> {uploading === 'gallery' ? 'Uploading…' : 'Add Gallery Photos'}
              <input type="file" accept="image/*" multiple className="hidden"
                     onChange={e => openCrop(e, 'gallery')}
                     disabled={uploading !== null} />
            </label>
            {form.gallery.length > 0 && (
              <p className="text-xs" style={{ color: '#A1A1AA' }}>
                {form.gallery.length} photo{form.gallery.length !== 1 ? 's' : ''} · Drag/arrows to reorder. Grid automatically adjusts based on count.
              </p>
            )}
          </div>
        </Field>

        <button type="submit" disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
                style={{ background: '#8B0000', color: '#fff' }}>
          <Save size={14} /> {saving ? 'Saving…' : mode === 'create' ? 'Create Club' : 'Save Changes'}
        </button>
      </form>
    </>
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
const uploadBtn = 'flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border w-fit transition-colors hover:bg-gray-50';

