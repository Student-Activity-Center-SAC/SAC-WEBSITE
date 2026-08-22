'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, FileText, X } from 'lucide-react';

const TYPES = ['Magazine', 'Annual Report', 'Newsletter', 'Research'];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function PublicationsAdminPage() {
  const [pubs, setPubs]         = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);

  const EMPTY = { id: '', title: '', type: 'Magazine', year: new Date().getFullYear().toString(), description: '', pdf_url: '', download_available: true };
  const [form, setForm] = useState({ ...EMPTY });

  async function load() {
    const r = await fetch('/api/admin/publications');
    const d = await r.json();
    setPubs(d.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

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
      const payload = { ...form, id: form.id || slugify(form.title), sort_order: pubs.length };
      const res = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success('Publication added!');
      setForm({ ...EMPTY });
      setShowForm(false);
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Publications</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Magazines, annual reports, and PDF documents.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
                style={{ background: '#8B0000', color: '#fff' }}>
          {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Publication</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <h2 className="font-black mb-4" style={{ color: '#0D0D0D' }}>New Publication</h2>
          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Title *">
              <input required value={form.title} onChange={e => set('title', e.target.value)} className={inp} style={is} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Type">
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inp} style={is}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Year">
                <input value={form.year} onChange={e => set('year', e.target.value)} className={inp} style={is} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={inp} style={is} />
            </Field>
            <Field label="PDF file">
              <div className="flex flex-col gap-2">
                {form.pdf_url && (
                  <a href={form.pdf_url} target="_blank" rel="noopener"
                     className="text-xs font-semibold truncate" style={{ color: '#8B0000' }}>
                    {form.pdf_url}
                  </a>
                )}
                <input value={form.pdf_url} onChange={e => set('pdf_url', e.target.value)}
                       className={inp} style={is} placeholder="Paste URL or upload below" />
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border hover:bg-gray-50 w-fit"
                       style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
                  <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload PDF'}
                  <input type="file" accept="application/pdf" className="hidden" onChange={uploadPdf} disabled={uploading} />
                </label>
              </div>
            </Field>
            <button type="submit" disabled={saving || uploading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
                    style={{ background: '#8B0000', color: '#fff' }}>
              {saving ? 'Saving…' : 'Save Publication'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : pubs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold" style={{ color: '#71717A' }}>No publications yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          {pubs.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-4"
                 style={{ borderBottom: i < pubs.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#fff0f0' }}>
                <FileText size={18} style={{ color: '#8B0000' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{p.type} · {p.year}</p>
              </div>
              {p.pdf_url && (
                <a href={p.pdf_url} target="_blank" rel="noopener"
                   className="text-xs font-semibold px-3 py-1 rounded-full border shrink-0"
                   style={{ borderColor: '#E4E4E7', color: '#8B0000' }}>
                  View PDF
                </a>
              )}
              <button onClick={() => del(p.id, p.title)} className="p-2 rounded-lg hover:bg-red-50 shrink-0">
                <Trash2 size={14} style={{ color: '#8B0000' }} />
              </button>
            </div>
          ))}
        </div>
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
