'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload, X, Move } from 'lucide-react';

interface Club { id: string; name: string; }
interface Props { initial?: any; mode: 'create' | 'edit'; clubs?: Club[]; }
type Category = 'Deputy Director' | 'Faculty' | 'President' | 'Vice President' | 'Club Lead' | 'Domain Leadership' | 'Division Leadership';

const CATEGORIES: { label: string; sub?: string; cat: Category }[] = [
  { label: 'Executive Leadership', sub: 'Presidents of KL SAC', cat: 'President' },
  { label: 'Vice Presidents',      sub: 'Domain & division leadership', cat: 'Vice President' },
  { label: 'Domain Leadership',    sub: 'Domain Secretaries', cat: 'Domain Leadership' },
  { label: 'Division Leadership',  sub: 'Division Secretaries', cat: 'Division Leadership' },
  { label: 'Club Mentors & In-Charges', sub: 'Faculty Mentors / In-Charges', cat: 'Faculty' },
  { label: 'Club Leadership',      sub: 'Leads and Co-Leads', cat: 'Club Lead' },
  { label: 'Deputy Directors of SAC', cat: 'Deputy Director' },
];
const FACULTY_ROLES = ['Faculty Mentor', 'Faculty In-Charge'];
const SECRETARY_ROLES = ['Secretary', 'Joint Secretary'];
const CLUB_ROLES = ['Club Lead', 'Club Co-Lead'];

function autoId(role: string) {
  return role.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);
}

// ── Crop Modal ─────────────────────────────────────────────────────────────────
const CROP_W = 280;
const CROP_H = 350; // 4:5 aspect ratio (same as CouncilGrid MemberCard)
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function CropModal({ src, onConfirm, onCancel }: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const [scale,  setScale]  = useState(1);
  const [natW,   setNatW]   = useState(0);
  const [natH,   setNatH]   = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last     = useRef({ x: 0, y: 0 });
  const imgEl    = useRef<HTMLImageElement>(null);

  // Called once the <img> finishes loading — compute scale to fill the box
  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const scaleW = CROP_W / img.naturalWidth;
    const scaleH = CROP_H / img.naturalHeight;
    const s = Math.max(scaleW, scaleH); // cover the crop box
    setNatW(img.naturalWidth);
    setNatH(img.naturalHeight);
    setScale(s);
    setOffset({ x: 0, y: 0 });
  }

  const rW   = natW * scale;           // rendered width
  const rH   = natH * scale;           // rendered height
  const minX = Math.min(CROP_W - rW, 0);
  const minY = Math.min(CROP_H - rH, 0);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setOffset(o => ({ x: clamp(o.x + dx, minX, 0), y: clamp(o.y + dy, minY, 0) }));
  };
  const onPointerUp = () => { dragging.current = false; };

  function confirm() {
    const img = imgEl.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500; // 4:5 ratio for output
    const ctx = canvas.getContext('2d')!;
    const srcX    = (-offset.x) / scale;
    const srcY    = (-offset.y) / scale;
    const srcW    = CROP_W / scale;
    const srcH    = CROP_H / scale;
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 400, 500);
    canvas.toBlob(b => b && onConfirm(b), 'image/jpeg', 0.92);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
         style={{ background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">
        <div className="px-6 pt-5 pb-3 flex items-center justify-between"
             style={{ borderBottom: '1px solid #F0F0F0' }}>
          <div>
            <p className="font-black text-base" style={{ color: '#0D0D0D' }}>Crop Photo</p>
            <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>Drag to reposition · 4:5 Portrait crop</p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100">
            <X size={15} style={{ color: '#71717A' }} />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col items-center gap-4">
          {/* Crop box */}
          <div
            className="relative overflow-hidden rounded-2xl select-none"
            style={{
              width: CROP_W, height: CROP_H,
              background: '#F4F4F5',
              border: '2px solid #8B0000',
              cursor: natW > 0 ? 'grab' : 'default',
            }}
            onPointerDown={natW > 0 ? onPointerDown : undefined}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}>

            {/* Always render img — onLoad sets dimensions */}
            <img
              ref={imgEl}
              src={src}
              alt="crop preview"
              onLoad={onImgLoad}
              draggable={false}
              style={{
                position:      'absolute',
                width:          natW > 0 ? rW   : '100%',
                height:         natW > 0 ? rH   : '100%',
                objectFit:      natW > 0 ? undefined : 'cover',
                left:           natW > 0 ? offset.x : 0,
                top:            natW > 0 ? offset.y : 0,
                pointerEvents: 'none',
                userSelect:    'none',
                display:       'block',
              }}
            />

            {/* Grid lines */}
            {natW > 0 && (
              <div className="absolute inset-0 pointer-events-none" style={{
                background:
                  'repeating-linear-gradient(transparent,transparent calc(33.33% - 1px),rgba(255,255,255,0.3) calc(33.33% - 1px),rgba(255,255,255,0.3) 33.33%),' +
                  'repeating-linear-gradient(90deg,transparent,transparent calc(33.33% - 1px),rgba(255,255,255,0.3) calc(33.33% - 1px),rgba(255,255,255,0.3) 33.33%)',
              }} />
            )}
          </div>

          <p className="text-xs flex items-center gap-1.5" style={{ color: '#A1A1AA' }}>
            <Move size={11} /> Drag to reposition
          </p>
        </div>

        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onCancel}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#E4E4E7', color: '#71717A' }}>
            Cancel
          </button>
          <button onClick={confirm} disabled={natW === 0}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: '#8B0000' }}>
            Use this crop
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────────
export default function MemberForm({ initial, mode, clubs = [] }: Props) {
  const router = useRouter();
  const [saving,     setSaving]    = useState(false);
  const [uploading,  setUploading] = useState(false);
  const [cropSrc,    setCropSrc]   = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initial?.photo ?? '');
  const pendingFile = useRef<File | null>(null);
  const blobUrlRef  = useRef<string | null>(null);

  const initCat: Category | null = initial
    ? initial.role === 'Deputy Director'  ? 'Deputy Director'
    : initial.role === 'Faculty Mentor' || initial.role === 'Faculty In-Charge' ? 'Faculty'
    : initial.role === 'President'        ? 'President'
    : initial.role === 'Vice President'   ? 'Vice President'
    : initial.role === 'Domain Secretary' || initial.role === 'Domain Joint Secretary' ? 'Domain Leadership'
    : initial.role === 'Division Secretary' || initial.role === 'Division Joint Secretary' ? 'Division Leadership'
    : initial.role === 'Club Lead' || initial.role === 'Club Co-Lead' ? 'Club Lead'
    : null
    : null;

  const [category,    setCategory]    = useState<Category | null>(initCat);
  const [facultyRole, setFacultyRole] = useState<string>((initial?.role && FACULTY_ROLES.includes(initial.role)) ? initial.role : 'Faculty Mentor');
  const [secRole,     setSecRole]     = useState<string>((initial?.role && typeof initial.role === 'string' && initial.role.includes('Joint')) ? 'Joint Secretary' : 'Secretary');
  const [clubRole,    setClubRole]    = useState<string>((initial?.role && CLUB_ROLES.includes(initial.role)) ? initial.role : 'Club Lead');
  const [clubName,    setClubName]    = useState<string>(initial?.club_lead ?? '');
  const [name,        setName]        = useState(initial?.name     ?? '');
  const [subtitle,    setSubtitle]    = useState(initial?.subtitle ?? '');
  const [linkedin,    setLinkedin]    = useState(initial?.linkedin ?? '');
  const [photo,       setPhoto]       = useState(initial?.photo    ?? '');

  // File selected → show crop modal
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      toast.error(`"${file.name}" is ${mb} MB — max allowed is ${MAX_MB} MB`);
      e.target.value = '';
      return;
    }
    pendingFile.current = file;
    const reader = new FileReader();
    reader.onload = ev => setCropSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  // After crop confirmed → show preview immediately, then upload
  async function onCropConfirm(blob: Blob) {
    setCropSrc(null);

    // Revoke previous blob URL to avoid memory leaks
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const localUrl = URL.createObjectURL(blob);
    blobUrlRef.current = localUrl;
    setPreviewUrl(localUrl); // show immediately without waiting for upload

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', blob, 'photo.jpg');
      fd.append('folder', 'council');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      let d: any;
      try { d = await res.json(); } catch { throw new Error('Server error — check PM2 logs'); }
      if (!res.ok) throw new Error(d?.error ?? 'Upload failed');
      setPhoto(d.url);
      setPreviewUrl(d.url);
      URL.revokeObjectURL(localUrl);
      blobUrlRef.current = null;
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.message ?? 'unknown error'));
      // keep blob URL preview so the user can see their selection
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category)    return toast.error('Select a category');
    if (!name.trim()) return toast.error('Name is required');
    if (category === 'Club Lead' && !clubName) return toast.error('Select a club');

    let role: string = category as string;
    if (category === 'Faculty') role = facultyRole;
    if (category === 'Club Lead') role = clubRole;
    if (category === 'Domain Leadership') role = `Domain ${secRole}`;
    if (category === 'Division Leadership') role = `Division ${secRole}`;

    const payload = {
      id:           initial?.id ?? autoId(role as string),
      name:         name.trim(),
      role:         role as string,
      subtitle:     subtitle.trim() || null,
      linkedin:     linkedin.trim() || null,
      photo:        photo || null,
      club_lead:    category === 'Club Lead' ? clubName : null,
      is_faculty:   category === 'Faculty',
      sort_order:   initial?.sort_order ?? 0,
      year_of_study: null,
      branch:        null,
      journey:       null,
      achievements:  '[]',
      clubs_list:    '[]',
      designation:   null,
    };

    setSaving(true);
    try {
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
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">

        {/* ── Step 1: Category ── */}
        <div>
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#8B0000' }}>
            Step 1 — Select Category
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map(c => (
              <button key={c.cat} type="button"
                      onClick={() => { setCategory(c.cat); setClubName(''); }}
                      className="text-left px-5 py-4 rounded-2xl border-2 transition-all"
                      style={{
                        borderColor: category === c.cat ? '#8B0000' : '#E4E4E7',
                        background:  category === c.cat ? '#8B000008' : '#F7F7F8',
                      }}>
                <p className="font-black text-sm leading-tight" style={{ color: '#0D0D0D' }}>{c.label}</p>
                {c.sub && <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{c.sub}</p>}
              </button>
            ))}
          </div>
        </div>

        {/* Faculty sub-type */}
        {category === 'Faculty' && (
          <div>
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>Faculty Role</p>
            <div className="flex gap-3">
              {FACULTY_ROLES.map(r => (
                <button key={r} type="button" onClick={() => setFacultyRole(r)}
                        className="px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                        style={{
                          borderColor: facultyRole === r ? '#8B0000' : '#E4E4E7',
                          background:  facultyRole === r ? '#8B000010' : '#F7F7F8',
                          color:       facultyRole === r ? '#8B0000'   : '#71717A',
                        }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Secretary sub-type */}
        {(category === 'Domain Leadership' || category === 'Division Leadership') && (
          <div>
            <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>Role Title</p>
            <div className="flex gap-3">
              {SECRETARY_ROLES.map(r => (
                <button key={r} type="button" onClick={() => setSecRole(r)}
                        className="px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                        style={{
                          borderColor: secRole === r ? '#8B0000' : '#E4E4E7',
                          background:  secRole === r ? '#8B000010' : '#F7F7F8',
                          color:       secRole === r ? '#8B0000'   : '#71717A',
                        }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Club picker & sub-type */}
        {category === 'Club Lead' && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>Role Title</p>
              <div className="flex gap-3">
                {CLUB_ROLES.map(r => (
                  <button key={r} type="button" onClick={() => setClubRole(r)}
                          className="px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                          style={{
                            borderColor: clubRole === r ? '#8B0000' : '#E4E4E7',
                            background:  clubRole === r ? '#8B000010' : '#F7F7F8',
                            color:       clubRole === r ? '#8B0000'   : '#71717A',
                          }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>Select Club</p>
              {clubs.length === 0
                ? <p className="text-sm" style={{ color: '#A1A1AA' }}>No clubs found in database.</p>
                : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                    {clubs.map(c => (
                      <button key={c.id} type="button" onClick={() => setClubName(c.name)}
                              className="text-left px-3 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all"
                              style={{
                                borderColor: clubName === c.name ? '#8B0000' : '#E4E4E7',
                                background:  clubName === c.name ? '#8B000010' : '#F7F7F8',
                                color:       clubName === c.name ? '#8B0000'   : '#3F3F46',
                              }}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {category && (
          <div className="flex flex-col gap-5">
            <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: '#8B0000' }}>
              Step 2 — Member Details
            </p>

            <Field label="Full Name *">
              <input required value={name} onChange={e => setName(e.target.value)}
                     className={inp} style={sty} placeholder="e.g. Ravi Kumar" />
            </Field>

            <Field label="Description (optional — shown below role)">
              <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                     className={inp} style={sty}
                     placeholder="e.g. Administration & Student Engagement" />
            </Field>

            <Field label="LinkedIn URL (optional)">
              <input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                     className={inp} style={sty} placeholder="https://linkedin.com/in/..." />
            </Field>

            <Field label="Photo (optional)">
              <p className="text-xs mb-2" style={{ color: '#A1A1AA' }}>
                4:5 Portrait ratio (e.g. 400×500 px) recommended · Crop tool will enforce ratio
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {previewUrl && (
                  <div className="relative">
                    <img src={previewUrl} alt="preview"
                         className="w-20 h-24 rounded-xl object-cover border"
                         style={{ borderColor: '#E4E4E7' }} />
                    {uploading && (
                      <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                           style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <span className="text-white text-[10px] font-bold">Saving…</span>
                      </div>
                    )}
                    <button type="button" onClick={() => {
                      setPhoto('');
                      setPreviewUrl('');
                      if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
                    }}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: '#8B0000' }}>
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                )}
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors hover:bg-gray-50"
                       style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
                  <Upload size={13} />
                  {uploading ? 'Uploading…' : photo ? 'Change photo' : 'Upload photo'}
                  <input type="file" accept="image/*" className="hidden"
                         onChange={onFileChange} disabled={uploading} />
                </label>
              </div>
            </Field>
          </div>
        )}

        {category && (
          <button type="submit" disabled={saving || uploading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
                  style={{ background: '#8B0000', color: '#fff' }}>
            <Save size={14} />
            {saving ? 'Saving…' : uploading ? 'Uploading photo…' : mode === 'create' ? 'Add Member' : 'Save Changes'}
          </button>
        )}
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
