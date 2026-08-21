'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, { value: string; label: string; type: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      const map: typeof settings = {};
      (d.data ?? []).forEach((s: any) => { map[s.key] = { value: s.value ?? '', label: s.label, type: s.type }; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  function set(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], value } }));
  }

  async function uploadFile(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'site');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      set(key, d.url);
      toast.success('Uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  }

  async function save() {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, { value }]) => ({ key, value }));
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      toast.success('Settings saved!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm" style={{ color: '#A1A1AA' }}>Loading…</p>;

  const VIDEO_KEYS   = ['hero_video_url'];
  const TEXT_KEYS    = ['hero_title'];
  const AREA_KEYS    = ['hero_subtitle', 'about_tagline', 'home_meta_desc'];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Site Settings</h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>
        Control key content across the website. Leave a field blank to use the built-in default.
      </p>

      <div className="flex flex-col gap-6">
        {/* Hero Video */}
        <Section title="Homepage Hero" desc="The background video and text on the homepage hero section.">
          {VIDEO_KEYS.map(key => settings[key] && (
            <Field key={key} label={settings[key].label}>
              <div className="flex flex-col gap-2">
                {settings[key].value && (
                  <video src={settings[key].value} className="w-full rounded-xl max-h-32 object-cover"
                         style={{ border: '1px solid #E4E4E7' }} muted playsInline />
                )}
                <input value={settings[key].value}
                       onChange={e => set(key, e.target.value)}
                       className={inp} style={sty}
                       placeholder="Paste video URL or upload below" />
                <label className={uploadBtn}>
                  <Upload size={13} /> {uploading === key ? 'Uploading…' : 'Upload video'}
                  <input type="file" accept="video/*" className="hidden"
                         onChange={e => uploadFile(key, e)} disabled={uploading !== null} />
                </label>
              </div>
            </Field>
          ))}
          {TEXT_KEYS.map(key => settings[key] && (
            <Field key={key} label={settings[key].label}>
              <input value={settings[key].value}
                     onChange={e => set(key, e.target.value)}
                     className={inp} style={sty}
                     placeholder="Leave blank to use default" />
            </Field>
          ))}
          {AREA_KEYS.filter(k => ['hero_subtitle'].includes(k)).map(key => settings[key] && (
            <Field key={key} label={settings[key].label}>
              <textarea rows={3} value={settings[key].value}
                        onChange={e => set(key, e.target.value)}
                        className={inp} style={sty}
                        placeholder="Leave blank to use default" />
            </Field>
          ))}
        </Section>

        {/* SEO / Meta */}
        <Section title="SEO & Meta" desc="Text used in search results and social shares.">
          {AREA_KEYS.filter(k => ['home_meta_desc', 'about_tagline'].includes(k)).map(key => settings[key] && (
            <Field key={key} label={settings[key].label}>
              <textarea rows={3} value={settings[key].value}
                        onChange={e => set(key, e.target.value)}
                        className={inp} style={sty}
                        placeholder="Leave blank to use default" />
            </Field>
          ))}
        </Section>
      </div>

      <button onClick={save} disabled={saving}
              className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50"
              style={{ background: '#8B0000', color: '#fff' }}>
        <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6 flex flex-col gap-5" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
      <div>
        <h2 className="font-black text-base mb-1" style={{ color: '#0D0D0D' }}>{title}</h2>
        <p className="text-xs" style={{ color: '#71717A' }}>{desc}</p>
      </div>
      {children}
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
const sty = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
const uploadBtn = 'flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border w-fit transition-colors hover:bg-gray-50 border-gray-200 text-gray-800';
