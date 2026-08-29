'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload, X, Crop, ZoomIn, ZoomOut, RotateCw, Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
const inputStyle = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;

interface CropOptions { aspectRatio: number; label: string; targetWidth: number; targetHeight: number; }

function CropModal({ src, options, onCancel, onApply }: { src: string; options: CropOptions; onCancel: () => void; onApply: (blob: Blob) => void; }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  let PREVIEW_W = 400;
  let PREVIEW_H = Math.round(PREVIEW_W / options.aspectRatio);
  if (PREVIEW_H > 400) { PREVIEW_H = 400; PREVIEW_W = Math.round(PREVIEW_H * options.aspectRatio); }

  const onLoad = useCallback(() => { setImgLoaded(true); setZoom(1); setOffset({ x: 0, y: 0 }); }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); setDragging(true); dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: dragStart.current.ox + (e.clientX - dragStart.current.mx), y: dragStart.current.oy + (e.clientY - dragStart.current.my) });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp);
    return () => { window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('mouseup', onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  function apply() {
    const img = imgRef.current; if (!img || !imgLoaded) return;
    const canvas = document.createElement('canvas'); canvas.width = options.targetWidth; canvas.height = options.targetHeight;
    const ctx = canvas.getContext('2d')!;

    const naturalAr = img.naturalWidth / img.naturalHeight;
    let renderedW: number, renderedH: number;
    if (naturalAr > options.aspectRatio) { renderedH = PREVIEW_H * zoom; renderedW = renderedH * naturalAr; }
    else { renderedW = PREVIEW_W * zoom; renderedH = renderedW / naturalAr; }

    const baseX = (PREVIEW_W - renderedW) / 2 + offset.x;
    const baseY = (PREVIEW_H - renderedH) / 2 + offset.y;

    const scaleX = img.naturalWidth / renderedW; const scaleY = img.naturalHeight / renderedH;
    const srcX = -baseX * scaleX; const srcY = -baseY * scaleY;
    const srcW = PREVIEW_W * scaleX; const srcH = PREVIEW_H * scaleY;

    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, options.targetWidth, options.targetHeight);
    canvas.toBlob(blob => { if (blob) onApply(blob); }, 'image/png');
  }

  const naturalAr = imgRef.current ? imgRef.current.naturalWidth / imgRef.current.naturalHeight : 1;
  let renderedW: number, renderedH: number;
  if (naturalAr > options.aspectRatio) { renderedH = PREVIEW_H * zoom; renderedW = renderedH * naturalAr; }
  else { renderedW = PREVIEW_W * zoom; renderedH = renderedW / naturalAr; }
  const baseX = (PREVIEW_W - renderedW) / 2 + offset.x; const baseY = (PREVIEW_H - renderedH) / 2 + offset.y;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E4E4E7' }}>
          <div>
            <h3 className="font-black text-base" style={{ color: '#0D0D0D' }}><Crop size={14} className="inline mr-1.5 mb-0.5" /> Crop Image</h3>
            <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{options.label} · {options.targetWidth}×{options.targetHeight}px</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-100"><X size={16} /></button>
        </div>
        <div className="px-5 pt-4">
          <div ref={containerRef} className="relative overflow-hidden rounded-xl mx-auto select-none" style={{ width: PREVIEW_W, height: PREVIEW_H, background: '#1a1a1a', cursor: dragging ? 'grabbing' : 'grab', border: '2px solid #8B0000' }} onMouseDown={onMouseDown}>
            <img ref={imgRef} src={src} alt="" onLoad={onLoad} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1 }} />
            {imgLoaded && <img src={src} alt="preview" draggable={false} style={{ position: 'absolute', width: renderedW, height: renderedH, left: baseX, top: baseY, userSelect: 'none' }} />}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '2px solid rgba(255,255,255,0.3)', borderRadius: 10 }} />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button onClick={() => { setZoom(z => Math.max(0.5, z - 0.1)); setOffset({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><ZoomOut size={14} /></button>
            <input type="range" min={0.5} max={3} step={0.05} value={zoom} onChange={e => { setZoom(Number(e.target.value)); setOffset({ x: 0, y: 0 }); }} className="flex-1 accent-red-800" />
            <button onClick={() => { setZoom(z => Math.min(3, z + 0.1)); setOffset({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><ZoomIn size={14} /></button>
            <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"><RotateCw size={13} /></button>
            <span className="text-xs tabular-nums w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 mt-4" style={{ borderTop: '1px solid #E4E4E7' }}>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border hover:bg-gray-50">Cancel</button>
          <button onClick={apply} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: '#8B0000' }}>Apply & Upload</button>
        </div>
      </div>
    </div>
  );
}

export default function AdvisoryBoardClient({ initialMembers }: { initialMembers: any[] }) {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({ name: '', role: '', photo_url: '' });
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [pendingInput, setPendingInput] = useState<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  function resetForm() {
    setForm({ name: '', role: '', photo_url: '' });
    setEditingId(null);
  }

  function editMember(m: any) {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, photo_url: m.photo_url || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteMember(id: number) {
    if (!confirm('Delete this member?')) return;
    try {
      const res = await fetch('/api/admin/advisory-board', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Member deleted');
      setMembers(m => m.filter(x => x.id !== id));
      router.refresh();
    } catch (e: any) { toast.error(e.message); }
  }

  async function save() {
    if (!form.name || !form.role) return toast.error('Name and Role are required');
    setLoading(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...form, id: editingId };
      const res = await fetch('/api/admin/advisory-board', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      
      toast.success(editingId ? 'Member updated' : 'Member added');
      resetForm();
      router.refresh();
      // Optimistic update
      if (editingId) {
        setMembers(m => m.map(x => x.id === editingId ? { ...x, ...form } : x));
      } else {
        setMembers([...members, { ...form, id: data.data?.id }]);
      }
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }

  async function openCrop(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setCropSrc(URL.createObjectURL(file)); setCropFile(file); setPendingInput(e.target);
  }

  async function uploadBlob(blob: Blob) {
    setCropSrc(null); if (pendingInput) { pendingInput.value = ''; setPendingInput(null); }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', blob, 'cropped.png'); fd.append('folder', 'advisory');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setForm(f => ({ ...f, photo_url: d.url }));
      toast.success('Photo uploaded');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  }

  async function move(idx: number, dir: -1 | 1) {
    const arr = [...members];
    if (idx + dir < 0 || idx + dir >= arr.length) return;
    const temp = arr[idx]; arr[idx] = arr[idx + dir]; arr[idx + dir] = temp;
    setMembers(arr);
    const orderedIds = arr.map(a => a.id);
    fetch('/api/admin/advisory-board', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderedIds })
    }).then(res => { if (!res.ok) toast.error('Reorder failed'); else router.refresh(); });
  }

  return (
    <div className="max-w-4xl">
      {cropSrc && cropFile && (
        <CropModal src={cropSrc} options={{ aspectRatio: 4/5, label: 'Profile Photo', targetWidth: 600, targetHeight: 750 }}
          onCancel={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); if (pendingInput) pendingInput.value = ''; }}
          onApply={uploadBlob} />
      )}

      <div className="mb-8 p-6 rounded-2xl bg-white" style={{ border: '1px solid #E4E4E7' }}>
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Member' : 'Add Board Member'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Role</label>
            <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls} style={inputStyle} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Photo</label>
          <p className="text-xs text-gray-500 mb-2">Will be cropped to 4:5 ratio (portrait).</p>
          <div className="flex items-end gap-4">
            {form.photo_url && <img src={form.photo_url} className="w-24 h-30 object-cover rounded-xl border border-gray-200" style={{ aspectRatio: '4/5' }} />}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border hover:bg-gray-50">
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Photo'}
                <input type="file" accept="image/*" className="hidden" onChange={openCrop} disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={save} disabled={loading} className="px-6 py-2.5 bg-red-800 text-white rounded-xl text-sm font-bold hover:opacity-90">
            {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Member'}
          </button>
          {editingId && <button onClick={resetForm} className="px-6 py-2.5 border rounded-xl text-sm font-bold hover:bg-gray-50">Cancel</button>}
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Current Members ({members.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {members.map((m, i) => (
          <div key={m.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col">
            <div className="relative aspect-[4/5] bg-gray-100">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Photo</div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => editMember(m)} className="p-1.5 bg-white/90 rounded hover:bg-white text-gray-700"><Edit2 size={12} /></button>
                <button onClick={() => deleteMember(m.id)} className="p-1.5 bg-white/90 rounded hover:bg-red-50 text-red-600"><Trash2 size={12} /></button>
              </div>
            </div>
            <div className="p-3 text-center flex-1 flex flex-col justify-center">
              <p className="font-bold text-sm leading-tight text-gray-900 mb-1">{m.name}</p>
              <p className="text-xs font-semibold text-red-700">{m.role}</p>
            </div>
            <div className="border-t border-gray-100 flex divide-x divide-gray-100">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="flex-1 py-1.5 flex justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowLeft size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === members.length - 1} className="flex-1 py-1.5 flex justify-center text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowRight size={14} /></button>
            </div>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 10 - members.length) }).map((_, i) => (
          <div key={`placeholder-${i}`} className="rounded-2xl border-2 border-dashed border-gray-200 aspect-[4/5] flex items-center justify-center text-gray-400 text-sm font-semibold">
            Placeholder
          </div>
        ))}
      </div>
    </div>
  );
}
