'use client';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, RefreshCw, Calendar, Layers } from 'lucide-react';

const domainColors: Record<string, string> = {
  TEC: 'bg-blue-100 text-blue-800',   CUL: 'bg-purple-100 text-purple-800',
  SPO: 'bg-green-100 text-green-800', SOC: 'bg-yellow-100 text-yellow-800',
  ART: 'bg-pink-100 text-pink-800',   LIT: 'bg-orange-100 text-orange-800',
};

interface PendingItem {
  id: string | number;
  title?: string;
  name?: string;
  domain?: string;
  category?: string;
  activity_date?: string;
  content_type: 'activity' | 'club';
}

export default function PendingPage() {
  const [data, setData] = useState<{ newActivities: PendingItem[]; newClubs: PendingItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/pending')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function decide(content_type: string, content_id: string | number, status: 'approved' | 'denied') {
    const key = `${content_type}-${content_id}`;
    setActing(key);
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type, content_id: String(content_id), status }),
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(status === 'approved' ? 'Approved — now live!' : 'Denied and hidden.');
      load();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActing(null);
    }
  }

  const allItems: PendingItem[] = [
    ...(data?.newActivities ?? []).map(a => ({ ...a, content_type: 'activity' as const })),
    ...(data?.newClubs ?? []).map(c => ({ ...c, content_type: 'club' as const })),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold mb-1">Pending Review</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            New content from the Student Portal waiting for your approval.
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--border)' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border h-24 animate-pulse"
                 style={{ background: 'var(--muted)', borderColor: 'var(--border)' }} />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border"
             style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-60" />
          <p className="font-semibold">All caught up! Nothing pending review.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {allItems.map(item => {
            const label    = item.title ?? item.name ?? '—';
            const id       = item.id;
            const key      = `${item.content_type}-${id}`;
            const isActing = acting === key;

            return (
              <div key={key} className="rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-shadow hover:shadow-md"
                   style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                       style={{ background: 'var(--muted)' }}>
                    {item.content_type === 'activity'
                      ? <Calendar size={16} style={{ color: 'var(--primary)' }} />
                      : <Layers   size={16} style={{ color: 'var(--primary)' }} />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{label}</div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                            style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                        {item.content_type}
                      </span>
                      {item.domain && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${domainColors[item.domain] ?? 'bg-gray-100 text-gray-800'}`}>
                          {item.domain}
                        </span>
                      )}
                      {item.category && (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.category}</span>
                      )}
                      {item.activity_date && (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {new Date(item.activity_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button disabled={isActing}
                          onClick={() => decide(item.content_type, id, 'approved')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                          style={{ background: '#16a34a' }}>
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button disabled={isActing}
                          onClick={() => decide(item.content_type, id, 'denied')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                          style={{ background: 'var(--primary)' }}>
                    <XCircle size={14} /> Deny
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
