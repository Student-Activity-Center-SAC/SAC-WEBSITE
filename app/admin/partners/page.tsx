'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, X, ExternalLink, Pencil } from 'lucide-react';
import { compressImageIfTooLarge } from '../_utils/upload-helper';

export default function PartnersAdminPage() {
  const [partners, setPartners]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [editing, setEditing]     = useState<string | null>(null);

  const EMPTY = { id: '', partner_name: '', partner_image: '', partner_link: '', sort_order: 0 };
  const [form, setForm] = useState({ ...EMPTY });

  async function load() {
    setLoading(true);
    const r = await fetch('/api/admin/partners');
    const d = await r.json();
    setPartners(d.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function startEdit(p: any) {
    setForm({ ...p });
    setEditing(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setForm({ ...EMPTY });
    setEditing(null);
    setShowForm(false);
  }

  async function uploadLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const processedFile = await compressImageIfTooLarge(file);
      const fd = new FormData();
      fd.append('file', processedFile);
      fd.append('folder', 'partners');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      set('partner_image', data.url);
      toast.success('Logo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.partner_name.trim()) return toast.error('Partner name is required');
    if (!form.partner_image.trim()) return toast.error('Logo image is required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        sort_order: editing ? form.sort_order : partners.length,
      };
      if (!payload.id) payload.id = form.partner_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const res = await fetch('/api/admin/partners', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success(editing ? 'Partner updated!' : 'Partner added!');
      cancel();
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string, name: string) {
    if (!confirm(`Remove "${name}" from partners?`)) return;
    await fetch('/api/admin/partners', {
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
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
            Partners & Collaborators
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            Logos shown in the scrolling marquee on the homepage. Logos are display-only — not clickable by visitors.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => { setForm({ ...EMPTY }); setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
            style={{ background: '#8B0000', color: '#fff' }}>
            <Plus size={14} /> Add Partner
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black" style={{ color: '#0D0D0D' }}>
              {editing ? 'Edit Partner' : 'Add Partner'}
            </h2>
            <button onClick={cancel} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X size={16} style={{ color: '#71717A' }} />
            </button>
          </div>

          <form onSubmit={save} className="flex flex-col gap-4">
            <Field label="Partner / Organisation Name *">
              <input
                required
                value={form.partner_name}
                onChange={e => set('partner_name', e.target.value)}
                placeholder="e.g. Google, NASSCOM, TCS"
                className={inp} style={is} />
            </Field>

            <Field label="Logo Image *">
              <div className="flex flex-col gap-2">
                {form.partner_image && (
                  <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: '#E4E4E7' }}>
                    <img src={form.partner_image} alt="preview"
                      className="h-10 object-contain" style={{ maxWidth: '120px' }} />
                    <p className="text-xs truncate flex-1" style={{ color: '#71717A' }}>{form.partner_image}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={form.partner_image}
                    onChange={e => set('partner_image', e.target.value)}
                    placeholder="Paste image URL or upload below"
                    className={`${inp} flex-1`} style={is} />
                  <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border cursor-pointer text-sm font-semibold hover:bg-gray-50 shrink-0"
                    style={{ borderColor: '#E4E4E7', color: uploading ? '#A1A1AA' : '#0D0D0D' }}>
                    <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={uploadLogo} disabled={uploading} />
                  </label>
                </div>
              </div>
            </Field>

            <Field label="Website URL (for admin reference only — not shown to visitors)">
              <input
                value={form.partner_link}
                onChange={e => set('partner_link', e.target.value)}
                placeholder="https://example.com"
                className={inp} style={is} />
            </Field>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" disabled={saving || uploading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50"
                style={{ background: '#8B0000', color: '#fff' }}>
                {saving ? 'Saving…' : (editing ? 'Update Partner' : 'Add Partner')}
              </button>
              <button type="button" onClick={cancel}
                className="px-6 py-3 rounded-xl font-bold text-sm border"
                style={{ borderColor: '#E4E4E7', color: '#3F3F46' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : partners.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold mb-1" style={{ color: '#71717A' }}>No partners yet</p>
          <p className="text-sm" style={{ color: '#A1A1AA' }}>Add partner logos to show them in the homepage marquee.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          {partners.map((p, i) => (
            <div key={p.id}
              className="flex items-center gap-4 px-5 py-4"
              style={{ borderBottom: i < partners.length - 1 ? '1px solid #F0F0F0' : 'none' }}>

              {/* Logo preview */}
              <div className="w-24 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden p-2"
                style={{ borderColor: '#E4E4E7', background: '#F7F7F8' }}>
                {p.partner_image ? (
                  <img src={p.partner_image} alt={p.partner_name}
                    className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#A1A1AA' }}>No logo</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{p.partner_name}</p>
                {p.partner_link && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#A1A1AA' }}>{p.partner_link}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {p.partner_link && (
                  <a href={p.partner_link} target="_blank" rel="noopener"
                    className="p-2 rounded-lg border hover:bg-gray-50"
                    style={{ borderColor: '#E4E4E7' }}
                    title="Visit website">
                    <ExternalLink size={13} style={{ color: '#71717A' }} />
                  </a>
                )}
                <button onClick={() => startEdit(p)}
                  className="p-2 rounded-lg border hover:bg-gray-50"
                  style={{ borderColor: '#E4E4E7' }}>
                  <Pencil size={13} style={{ color: '#71717A' }} />
                </button>
                <button onClick={() => del(p.id, p.partner_name)}
                  className="p-2 rounded-lg hover:bg-red-50">
                  <Trash2 size={13} style={{ color: '#8B0000' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div className="mt-6 p-4 rounded-xl" style={{ background: '#fff0f0', border: '1px solid #fccfcf' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#8B0000' }}>Display note</p>
        <p className="text-xs leading-relaxed" style={{ color: '#71717A' }}>
          Partner logos appear as a scrolling marquee on the homepage. Logos are displayed in full colour and are not clickable by website visitors.
          The "Website URL" field is for your reference only and is not shown publicly.
        </p>
      </div>
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

const inp = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-red-300';
const is  = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
