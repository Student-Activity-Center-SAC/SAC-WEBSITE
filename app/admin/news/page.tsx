'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Image as ImageIcon, ArrowUp, ArrowDown, AlertCircle, Star, Home } from 'lucide-react';

export default function NewsAdminPage() {
  const [articles, setArticles]         = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [reordering, setReordering]     = useState(false);
  const [updating, setUpdating]         = useState<string | null>(null);

  async function load() {
    const r = await fetch('/api/admin/news');
    const d = await r.json();
    setArticles(d.data ?? []);
    setNeedsMigration(d.needsMigration ?? false);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(slug: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch('/api/admin/news', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug }) });
    toast.success('Deleted');
    load();
  }

  async function move(index: number, direction: 'up' | 'down') {
    const next = [...articles];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= next.length) return;
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    setArticles(next);
    setReordering(true);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedSlugs: next.map(a => a.slug) }),
      });
      const d = await res.json();
      if (!res.ok) {
        if (d.needsMigration) setNeedsMigration(true);
        throw new Error(d.error);
      }
      toast.success('News page order saved');
    } catch (err: any) {
      toast.error(err.message);
      load();
    } finally {
      setReordering(false);
    }
  }

  async function patch(slug: string, fields: Record<string, any>) {
    setUpdating(slug);
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...fields }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  }

  function setHomepagePos(slug: string, position: number) {
    const label = position === 0 ? 'Removed from homepage' : `Set as homepage position ${position}`;
    patch(slug, { homepage_order: position }).then(() => toast.success(label));
  }

  function toggleFeatured(slug: string, current: boolean) {
    const next = !current;
    patch(slug, { featured: next }).then(() =>
      toast.success(next ? 'Set as news page highlight' : 'Removed as news page highlight')
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>News Articles</h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Articles appear on the public news page immediately after saving.</p>
        </div>
        <Link href="/admin/news/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ background: '#8B0000', color: '#fff' }}>
          <Plus size={14} /> New Article
        </Link>
      </div>

      {/* Legend */}
      <div className="mb-5 flex flex-wrap gap-4 text-xs" style={{ color: '#71717A' }}>
        <span className="flex items-center gap-1.5">
          <ArrowUp size={12} /><ArrowDown size={12} /> <strong>↑↓ arrows</strong> — order on the /news page
        </span>
        <span className="flex items-center gap-1.5">
          <Home size={12} /> <strong>HP dropdown</strong> — homepage position (Off / 1st / 2nd / 3rd)
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={12} /> <strong>★ star</strong> — big highlighted article on /news page (only one at a time)
        </span>
      </div>

      {/* Migration banner */}
      {needsMigration && (
        <div className="mb-6 rounded-2xl border p-4 flex gap-3"
             style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-bold" style={{ color: '#92400e' }}>Run this SQL in Supabase to enable ordering:</p>
            <code className="text-xs block mt-1 p-2 rounded font-mono" style={{ background: '#fef3c7', color: '#78350f' }}>
              ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;
            </code>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: '#71717A' }}>Loading…</p>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold mb-2" style={{ color: '#71717A' }}>No articles yet</p>
          <Link href="/admin/news/new" className="text-sm font-bold" style={{ color: '#8B0000' }}>Add the first article →</Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          {articles.map((a, i) => {
            const hp = a.homepage_order ?? 0;
            const isUpdating = updating === a.slug;
            return (
              <div key={a.slug}
                   className="flex items-center gap-3 px-4 py-3.5"
                   style={{ borderBottom: i < articles.length - 1 ? '1px solid #F0F0F0' : 'none',
                            opacity: isUpdating ? 0.6 : 1 }}>

                {/* News-page order arrows */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button onClick={() => move(i, 'up')} disabled={i === 0 || reordering || !!updating}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 transition-opacity"
                          title="Move up in /news page">
                    <ArrowUp size={12} style={{ color: '#71717A' }} />
                  </button>
                  <button onClick={() => move(i, 'down')} disabled={i === articles.length - 1 || reordering || !!updating}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-20 transition-opacity"
                          title="Move down in /news page">
                    <ArrowDown size={12} style={{ color: '#71717A' }} />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background: a.photo_url ? '#fff' : '#F7F7F8', overflow: 'hidden' }}>
                  {a.photo_url
                    ? <img src={a.photo_url} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={16} style={{ color: '#A1A1AA' }} />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-sm truncate block" style={{ color: '#0D0D0D' }}>{a.title}</span>
                  <span className="text-xs" style={{ color: '#A1A1AA' }}>
                    {a.category} · {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Homepage position dropdown */}
                <div className="flex items-center gap-1 shrink-0">
                  <Home size={11} style={{ color: hp > 0 ? '#8B0000' : '#A1A1AA' }} />
                  <select
                    value={hp}
                    onChange={e => setHomepagePos(a.slug, parseInt(e.target.value))}
                    disabled={isUpdating}
                    title="Homepage position"
                    className="text-[11px] font-bold rounded-lg border px-1.5 py-1 cursor-pointer outline-none"
                    style={{
                      borderColor: hp > 0 ? '#8B0000' : '#E4E4E7',
                      color:       hp > 0 ? '#8B0000' : '#A1A1AA',
                      background:  hp > 0 ? '#FFF0F0' : '#F7F7F8',
                    }}>
                    <option value={0}>Off</option>
                    <option value={1}>1st</option>
                    <option value={2}>2nd</option>
                    <option value={3}>3rd</option>
                  </select>
                </div>

                {/* News-page featured star */}
                <button
                  onClick={() => toggleFeatured(a.slug, a.featured)}
                  disabled={isUpdating}
                  title={a.featured ? 'Big highlight on /news page (click to remove)' : 'Set as big highlight on /news page'}
                  className="p-1.5 rounded-lg transition-colors hover:bg-yellow-50 shrink-0">
                  <Star size={15}
                    fill={a.featured ? '#f59e0b' : 'none'}
                    style={{ color: a.featured ? '#f59e0b' : '#D1D1D6' }} />
                </button>

                {/* Edit + Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/news/${a.slug}`}
                        className="p-2 rounded-lg transition-colors hover:bg-gray-100">
                    <Pencil size={14} style={{ color: '#71717A' }} />
                  </Link>
                  <button onClick={() => del(a.slug, a.title)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-50">
                    <Trash2 size={14} style={{ color: '#8B0000' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
