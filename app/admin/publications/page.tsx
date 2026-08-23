'use client';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, FileText, X, Pencil, GripVertical } from 'lucide-react';

const TYPE_PRESETS = ['Magazine', 'Annual Report', 'Newsletter', 'Research', 'Other'];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const EMPTY = {
  id: '',
  title: '',
  type: 'Magazine',
  customType: '',
  year: new Date().getFullYear().toString(),
  description: '',
  pdf_url: '',
  download_available: true,
};

export default function PublicationsAdminPage() {
  const [pubs, setPubs]           = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState({ ...EMPTY });

  /* ── drag state ── */
  const dragIdx   = useRef<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  async function load() {
    const r = await fetch('/api/admin/publications');
    const d = await r.json();
    setPubs(d.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function openNew() {
    setEditingId(null);
    setForm({ ...EMPTY });
    setShowForm(true);
  }

  function openEdit(p: any) {
    const isPreset = TYPE_PRESETS.slice(0, -1).includes(p.type);
    setEditingId(p.id);
    setForm({
      id: p.id,
      title: p.title ?? '',
      type: isPreset ? p.type : 'Other',
      customType: isPreset ? '' : (p.type ?? ''),
      year: p.year ?? '',
      description: p.description ?? '',
      pdf_url: p.pdf_url ?? '',
      download_available: p.download_available ?? true,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY });
  }

  async function uploadPdf(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'publications');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      set('pdf_url', data.url);
      toast.success('PDF uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const resolvedType = form.type === 'Other' ? (form.customType.trim() || 'Other') : form.type;

      if (editingId) {
        const { customType, ...rest } = form;
        const res = await fetch('/api/admin/publications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...rest, type: resolvedType, id: editingId }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error);
        toast.success('Publication updated!');
      } else {
        const { customType, ...rest } = form;
        const res = await fetch('/api/admin/publications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...rest, type: resolvedType, id: slugify(form.title), sort_order: pubs.length }),
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error);
        toast.success('Publication added!');
      }

      cancel();
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string, title: string) {
    if (!confirm(`Remove "${title}"?`)) return;
    await fetch('/api/admin/publications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    toast.success('Removed');
    load();
  }

  /* ── drag handlers ── */
  function onDragStart(i: number) {
    dragIdx.current = i;
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    setOverIdx(i);
  }

  function onDrop(e: React.DragEvent, i: number) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) { endDrag(); return; }

    const next = [...pubs];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    const reordered = next.map((p, idx) => ({ ...p, sort_order: idx }));
    setPubs(reordered);
    endDrag();

    fetch('/api/admin/publications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: reordered.map(p => ({ id: p.id, sort_order: p.sort_order })) }),
    })
      .then(r => r.json())
      .then(d => { if (!d.success) toast.error('Failed to save order'); else toast.success('Order saved'); })
      .catch(() => toast.error('Failed to save order'));
  }

  function endDrag() {
    dragIdx.current = null;
    setOverIdx(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Publications</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Magazines, annual reports, and PDF documents.</p>
        </div>
        {!showForm ? (
          <button onClick={openNew}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
                  style={{ background: '#8B0000', color: '#fff' }}>
            <Plus size={14} /> Add Publication
          </button>
        ) : (
          <button onClick={cancel}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
                  style={{ background: '#F7F7F8', color: '#0D0D0D', border: '1px solid #E4E4E7' }}>
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      {/* ── Form (add / edit) ── */}
      {showForm && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <h2 className="font-black mb-5" style={{ color: '#0D0D0D' }}>
            {editingId ? 'Edit Publication' : 'New Publication'}
          </h2>
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Title *">
              <input required value={form.title} onChange={e => set('title', e.target.value)} className={inp} style={is} placeholder="e.g. SAC Magazine — August 2026" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Type">
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inp} style={is}>
                  {TYPE_PRESETS.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              {form.type === 'Other' && (
                <Field label="Specify type *">
                  <input required value={form.customType} onChange={e => set('customType', e.target.value)}
                         className={inp} style={is} placeholder="e.g. Brochure, Handbook…" />
                </Field>
              )}
              <Field label="Year">
                <input value={form.year} onChange={e => set('year', e.target.value)} className={inp} style={is} placeholder="2026" />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
                        className={inp} style={is} placeholder="Short summary shown on the publication card" />
            </Field>
            <Field label="PDF / URL">
              <div className="flex flex-col gap-2">
                {form.pdf_url && (
                  <a href={form.pdf_url} target="_blank" rel="noopener"
                     className="text-xs font-semibold truncate" style={{ color: '#8B0000' }}>
                    {form.pdf_url}
                  </a>
                )}
                <input value={form.pdf_url} onChange={e => set('pdf_url', e.target.value)}
                       className={inp} style={is} placeholder="Paste CDN / external URL, or upload below" />
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border hover:bg-gray-50 w-fit"
                       style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload PDF'}
                  <input type="file" accept="application/pdf" className="hidden" onChange={uploadPdf} disabled={uploading} />
                </label>
              </div>
            </Field>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving || uploading}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#8B0000', color: '#fff' }}>
                {saving ? 'Saving…' : editingId ? 'Update Publication' : 'Save Publication'}
              </button>
              <button type="button" onClick={cancel}
                      className="px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 border"
                      style={{ borderColor: '#E4E4E7', color: '#71717A' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── List ── */}
      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : pubs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold" style={{ color: '#71717A' }}>No publications yet</p>
        </div>
      ) : (
        <>
          <p className="text-xs mb-3 font-medium" style={{ color: '#A1A1AA' }}>
            Drag <GripVertical size={11} className="inline" /> to reorder — order is reflected on the website.
          </p>
          <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
            {pubs.map((p, i) => {
              const isDragging = dragIdx.current === i;
              const isOver     = overIdx === i && dragIdx.current !== i;
              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={e => onDragOver(e, i)}
                  onDrop={e => onDrop(e, i)}
                  onDragEnd={endDrag}
                  className="flex items-center gap-3 px-4 py-4 transition-colors"
                  style={{
                    borderBottom: i < pubs.length - 1 ? '1px solid #F0F0F0' : 'none',
                    borderTop: isOver ? '2px solid #8B0000' : '2px solid transparent',
                    opacity: isDragging ? 0.4 : 1,
                    cursor: 'default',
                    background: isDragging ? '#fdf2f2' : 'transparent',
                  }}>

                  {/* Drag handle */}
                  <div className="cursor-grab active:cursor-grabbing shrink-0 p-1 rounded hover:bg-gray-100"
                       style={{ color: '#D1D1D6', touchAction: 'none' }}>
                    <GripVertical size={16} />
                  </div>

                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff0f0' }}>
                    <FileText size={16} style={{ color: '#8B0000' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#0D0D0D' }}>{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{p.type} · {p.year}</p>
                  </div>

                  {p.pdf_url && (
                    <a href={p.pdf_url} target="_blank" rel="noopener"
                       className="hidden sm:inline text-xs font-semibold px-3 py-1 rounded-full border shrink-0"
                       style={{ borderColor: '#E4E4E7', color: '#8B0000' }}>
                      View PDF
                    </a>
                  )}

                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 shrink-0" title="Edit">
                    <Pencil size={14} style={{ color: '#3B82F6' }} />
                  </button>
                  <button onClick={() => del(p.id, p.title)} className="p-2 rounded-lg hover:bg-red-50 shrink-0" title="Delete">
                    <Trash2 size={14} style={{ color: '#8B0000' }} />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
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
