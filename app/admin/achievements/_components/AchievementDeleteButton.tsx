'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function AchievementDeleteButton({ id, title }: { id: string; title: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function del() {
    if (!confirm(`Delete "${title}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/achievements', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Achievement deleted.');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={del} disabled={loading}
      className="p-1.5 rounded-lg transition-all hover:bg-red-50 disabled:opacity-50"
      style={{ color: '#EF4444' }}>
      <Trash2 size={14} />
    </button>
  );
}
