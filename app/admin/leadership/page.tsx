'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, User } from 'lucide-react';

const ROLE_ORDER = ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Club Lead', 'Faculty Mentor', 'Faculty In-Charge'];

export default function LeadershipAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const r = await fetch('/api/admin/leadership');
    const d = await r.json();
    setMembers(d.data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string, name: string) {
    if (!confirm(`Remove "${name}" from the council?`)) return;
    const r = await fetch('/api/admin/leadership', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (r.ok) { toast.success('Member removed'); load(); }
    else toast.error('Delete failed');
  }

  // Group by role
  const grouped: Record<string, any[]> = {};
  members.forEach(m => {
    const g = m.role;
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(m);
  });
  const orderedRoles = ROLE_ORDER.filter(r => grouped[r]?.length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
            Leadership & Council
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            Manage the Student Council — {members.length} members total.
          </p>
        </div>
        <Link href="/admin/leadership/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90"
              style={{ background: '#8B0000', color: '#fff' }}>
          <Plus size={14} /> Add Member
        </Link>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : members.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold mb-2" style={{ color: '#71717A' }}>No council members yet — run the seed first</p>
          <Link href="/admin/leadership/new" className="text-sm font-bold" style={{ color: '#8B0000' }}>Add a member →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orderedRoles.map(role => (
            <div key={role}>
              <h2 className="text-xs font-black tracking-[0.15em] uppercase mb-3 px-1"
                  style={{ color: '#8B0000' }}>
                {role}s ({grouped[role].length})
              </h2>
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
                {grouped[role].map((m: any, i: number) => (
                  <div key={m.id}
                       className="flex items-center gap-4 px-5 py-4"
                       style={{ borderBottom: i < grouped[role].length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"
                         style={{ background: '#F7F7F8' }}>
                      {m.photo
                        ? <img src={m.photo} alt="" className="w-full h-full"
                               style={{ objectFit: 'cover' }} />
                        : <div className="w-full h-full flex items-center justify-center">
                            <User size={16} style={{ color: '#A1A1AA' }} />
                          </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{m.name}</p>
                      <p className="text-xs truncate" style={{ color: '#A1A1AA' }}>
                        {m.subtitle ?? m.club_lead ?? m.designation ?? (m.year_of_study ? `${m.year_of_study} · ${m.branch}` : '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/admin/leadership/${m.id}`}
                            className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                        <Pencil size={14} style={{ color: '#71717A' }} />
                      </Link>
                      <button onClick={() => del(m.id, m.name)}
                              className="p-2 rounded-lg transition-colors hover:bg-red-50">
                        <Trash2 size={14} style={{ color: '#8B0000' }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: '#FFF7ED', color: '#92400E' }}>
        <strong>First time?</strong> Run the seed to populate from existing static data:
        <code className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: '#FEF3C7' }}>
          POST /api/admin/seed/clubs-leadership
        </code>
      </div>
    </div>
  );
}
