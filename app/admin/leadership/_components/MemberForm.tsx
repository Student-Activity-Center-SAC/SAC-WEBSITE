'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Save, Upload, ChevronLeft } from 'lucide-react';

interface Club { id: string; name: string; }

interface Props {
  initial?: any;
  mode: 'create' | 'edit';
  clubs?: Club[];
}

type Category = 'Deputy Director' | 'Faculty' | 'President' | 'Vice President' | 'Club Lead';

const CATEGORIES: { label: string; sub?: string; cat: Category }[] = [
  { label: 'Deputy Directors of SAC',  cat: 'Deputy Director' },
  { label: 'Mentors & In-Charges',     cat: 'Faculty' },
  { label: 'Presidents of KL SAC',     cat: 'President' },
  { label: 'Vice Presidents',          sub: 'Domain & division leadership', cat: 'Vice President' },
  { label: 'Club Leads',               sub: `Coordinators of clubs`,         cat: 'Club Lead' },
];

const FACULTY_ROLES = ['Faculty Mentor', 'Faculty In-Charge'];

function autoId(role: string) {
  return role.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);
}

export default function MemberForm({ initial, mode, clubs = [] }: Props) {
  const router = useRouter();
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  // In edit mode, derive category from role
  const initCat: Category | null = initial
    ? initial.role === 'Deputy Director'  ? 'Deputy Director'
    : initial.role === 'Faculty Mentor' || initial.role === 'Faculty In-Charge' ? 'Faculty'
    : initial.role === 'President'        ? 'President'
    : initial.role === 'Vice President'   ? 'Vice President'
    : initial.role === 'Club Lead'        ? 'Club Lead'
    : null
    : null;

  const [category,     setCategory]     = useState<Category | null>(initCat);
  const [facultyRole,  setFacultyRole]  = useState<string>(initial?.role ?? 'Faculty Mentor');
  const [clubName,     setClubName]     = useState<string>(initial?.club_lead ?? '');
  const [name,         setName]         = useState(initial?.name       ?? '');
  const [subtitle,     setSubtitle]     = useState(initial?.subtitle   ?? '');
  const [linkedin,     setLinkedin]     = useState(initial?.linkedin   ?? '');
  const [photo,        setPhoto]        = useState(initial?.photo      ?? '');
  const [sortOrder,    setSortOrder]    = useState<number>(initial?.sort_order ?? 0);

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'council');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d   = await res.json();
      if (!res.ok) throw new Error(d.error);
      setPhoto(d.url);
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category)    return toast.error('Select a category');
    if (!name.trim()) return toast.error('Name is required');
    if (category === 'Club Lead' && !clubName) return toast.error('Select a club');

    const role = category === 'Faculty' ? facultyRole : category;

    const payload = {
      id:         initial?.id ?? autoId(role),
      name:       name.trim(),
      role,
      subtitle:   subtitle.trim() || null,
      linkedin:   linkedin.trim() || null,
      photo:      photo   || null,
      club_lead:  category === 'Club Lead' ? clubName : null,
      is_faculty: category === 'Faculty',
      sort_order: sortOrder,
      // clear unused fields
      year_of_study: null,
      branch:        null,
      journey:       null,
      achievements:  [],
      clubs_list:    [],
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">

      {/* ── Step 1: Category ── */}
      <div>
        <p className="text-xs font-black tracking-[0.2em] uppercase mb-4" style={{ color: '#8B0000' }}>
          Step 1 — Select Category
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORIES.map(c => (
            <button
              key={c.cat}
              type="button"
              onClick={() => { setCategory(c.cat); setClubName(''); }}
              className="text-left px-5 py-4 rounded-2xl border-2 transition-all"
              style={{
                borderColor:  category === c.cat ? '#8B0000' : '#E4E4E7',
                background:   category === c.cat ? '#8B000008' : '#F7F7F8',
              }}>
              <p className="font-black text-sm leading-tight" style={{ color: '#0D0D0D' }}>{c.label}</p>
              {c.sub && <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{c.sub}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 1b: Faculty sub-type ── */}
      {category === 'Faculty' && (
        <div>
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>
            Faculty Type
          </p>
          <div className="flex gap-3">
            {FACULTY_ROLES.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setFacultyRole(r)}
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

      {/* ── Step 1b: Club picker for Club Leads ── */}
      {category === 'Club Lead' && (
        <div>
          <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: '#8B0000' }}>
            Select Club
          </p>
          {clubs.length === 0 ? (
            <p className="text-sm" style={{ color: '#A1A1AA' }}>No clubs found in database.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {clubs.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClubName(c.name)}
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

          <Field label="Description (shown below role)">
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                   className={inp} style={sty}
                   placeholder="e.g. Administration & Student Engagement" />
          </Field>

          <Field label="LinkedIn URL">
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)}
                   className={inp} style={sty} placeholder="https://linkedin.com/in/..." />
          </Field>

          <Field label="Photo">
            <p className="text-xs mb-2" style={{ color: '#A1A1AA' }}>
              400 × 400 px recommended · Square · Professional headshot
            </p>
            <div className="flex items-center gap-4">
              {photo && (
                <img src={photo} alt="preview"
                     className="w-16 h-16 rounded-xl object-cover border"
                     style={{ borderColor: '#E4E4E7' }} />
              )}
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors hover:bg-gray-50"
                     style={{ borderColor: '#E4E4E7', color: '#0D0D0D' }}>
                <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload photo'}
                <input type="file" accept="image/*" className="hidden"
                       onChange={uploadPhoto} disabled={uploading} />
              </label>
              {photo && (
                <button type="button" onClick={() => setPhoto('')}
                        className="text-xs font-semibold px-3 py-2 rounded-lg"
                        style={{ background: '#FEE2E2', color: '#991B1B' }}>
                  Remove
                </button>
              )}
            </div>
          </Field>
        </div>
      )}

      {category && (
        <button type="submit" disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 w-fit"
                style={{ background: '#8B0000', color: '#fff' }}>
          <Save size={14} />
          {saving ? 'Saving…' : mode === 'create' ? 'Add Member' : 'Save Changes'}
        </button>
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

const inp = 'w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all';
const sty = { borderColor: '#E4E4E7', background: '#F7F7F8' } as React.CSSProperties;
