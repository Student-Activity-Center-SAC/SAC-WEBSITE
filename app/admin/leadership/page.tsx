'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, User, GripVertical } from 'lucide-react';

const ROLE_ORDER = [
  'Deputy Director', 'President', 'Vice President',
  'Domain Secretary', 'Domain Joint Secretary',
  'Division Secretary', 'Division Joint Secretary',
  'Faculty Mentor', 'Faculty In-Charge',
  'Club Lead', 'Club Co-Lead',
  'Secretary', 'Joint Secretary' // legacy fallback
];

export default function LeadershipAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── drag state ── */
  const dragItem = useRef<{ role: string; idx: number } | null>(null);
  const [overItem, setOverItem] = useState<{ role: string; idx: number } | null>(null);

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

  /* ── grouping ── */
  function buildGrouped(list: any[]): Record<string, any[]> {
    const g: Record<string, any[]> = {};
    list.forEach(m => {
      if (!g[m.role]) g[m.role] = [];
      g[m.role].push(m);
    });
    return g;
  }

  const grouped = buildGrouped(members);
  const extraRoles = Object.keys(grouped).filter(r => !ROLE_ORDER.includes(r));
  const orderedRoles = [...ROLE_ORDER.filter(r => grouped[r]?.length > 0), ...extraRoles];

  /* ── drag handlers ── */
  function onDragStart(role: string, idx: number) {
    dragItem.current = { role, idx };
  }

  function onDragOver(e: React.DragEvent, role: string, idx: number) {
    e.preventDefault();
    const d = dragItem.current;
    if (!d || d.role !== role) return; // only allow within same category
    setOverItem({ role, idx });
  }

  function onDrop(e: React.DragEvent, role: string, toIdx: number) {
    e.preventDefault();
    const d = dragItem.current;
    if (!d || d.role !== role || d.idx === toIdx) { endDrag(); return; }

    // Reorder within the category
    const catMembers = [...(grouped[role] ?? [])];
    const [moved] = catMembers.splice(d.idx, 1);
    catMembers.splice(toIdx, 0, moved);

    // Rebuild the full list preserving category order, reassign sort_order globally
    const newFull: any[] = [];
    orderedRoles.forEach(r => {
      const arr = r === role ? catMembers : (grouped[r] ?? []);
      newFull.push(...arr);
    });
    const reordered = newFull.map((m, i) => ({ ...m, sort_order: i }));
    setMembers(reordered);
    endDrag();

    fetch('/api/admin/leadership', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: reordered.map(m => ({ id: m.id, sort_order: m.sort_order })) }),
    })
      .then(r => r.json())
      .then(d => { if (!d.success) toast.error('Failed to save order'); else toast.success('Order saved'); })
      .catch(() => toast.error('Failed to save order'));
  }

  function endDrag() {
    dragItem.current = null;
    setOverItem(null);
  }

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
          <p className="font-semibold mb-2" style={{ color: '#71717A' }}>No council members yet</p>
          <Link href="/admin/leadership/new" className="text-sm font-bold" style={{ color: '#8B0000' }}>Add a member →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orderedRoles.map(role => {
            const cat = buildGrouped(members)[role] ?? [];
            return (
              <div key={role}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-3 px-1">
                  <h2 className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: '#8B0000' }}>
                    {role}s
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: '#fff0f0', color: '#8B0000' }}>
                    {cat.length}
                  </span>
                  <span className="text-xs ml-1" style={{ color: '#C4C4C7' }}>
                    — drag <GripVertical size={10} className="inline" /> to reorder
                  </span>
                </div>

                {/* Members list */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
                  {cat.map((m: any, i: number) => {
                    const isDragging = dragItem.current?.role === role && dragItem.current?.idx === i;
                    const isOver = overItem?.role === role && overItem?.idx === i && dragItem.current?.idx !== i;
                    return (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={() => onDragStart(role, i)}
                        onDragOver={e => onDragOver(e, role, i)}
                        onDrop={e => onDrop(e, role, i)}
                        onDragEnd={endDrag}
                        className="flex items-center gap-3 px-4 py-4 transition-colors"
                        style={{
                          borderBottom: i < cat.length - 1 ? '1px solid #F0F0F0' : 'none',
                          borderTop: isOver ? '2px solid #8B0000' : '2px solid transparent',
                          opacity: isDragging ? 0.4 : 1,
                          background: isDragging ? '#fdf2f2' : 'transparent',
                        }}>

                        {/* Grip handle */}
                        <div className="cursor-grab active:cursor-grabbing shrink-0 p-1 rounded hover:bg-gray-100"
                             style={{ color: '#D1D1D6', touchAction: 'none' }}>
                          <GripVertical size={15} />
                        </div>

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ background: '#F7F7F8' }}>
                          {m.photo
                            ? <img src={m.photo} alt="" className="w-full h-full" style={{ objectFit: 'cover' }} />
                            : <div className="w-full h-full flex items-center justify-center">
                                <User size={14} style={{ color: '#A1A1AA' }} />
                              </div>}
                        </div>

                        {/* Name + subtitle */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{m.name}</p>
                          <p className="text-xs truncate" style={{ color: '#A1A1AA' }}>
                            {m.subtitle ?? m.club_lead ?? m.designation ?? (m.year_of_study ? `${m.year_of_study} · ${m.branch}` : '')}
                          </p>
                        </div>

                        {/* Actions */}
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
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
