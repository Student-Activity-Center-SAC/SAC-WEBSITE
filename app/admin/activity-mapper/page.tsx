'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Network, Search, Loader2 } from 'lucide-react';

export default function ActivityMapperPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      // Fetch local clubs
      const clubsRes = await fetch('/api/admin/clubs');
      const clubsData = await clubsRes.json();
      setClubs(clubsData.data ?? []);

      // Fetch API categories
      const [upRes, compRes] = await Promise.all([
        fetch('https://sacactivities.kluniversity.in/api/public/activities/upcoming').catch(() => null),
        fetch('https://sacactivities.kluniversity.in/api/public/activities/completed').catch(() => null),
      ]);

      const upData = upRes ? await upRes.json().catch(() => ({})) : {};
      const compData = compRes ? await compRes.json().catch(() => ({})) : {};

      const allActivities = [
        ...(Array.isArray(upData?.activities) ? upData.activities : []),
        ...(Array.isArray(compData?.activities) ? compData.activities : [])
      ];

      const uniqueCategories = Array.from(new Set(allActivities.map((a: any) => a.category).filter(Boolean))) as string[];
      setCategories(uniqueCategories.sort());
    } catch (e: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleMapCategory(category: string, targetClubId: string) {
    if (!targetClubId) return; // unmapping is not supported here directly, it requires finding the old club and removing it.
    
    setSaving(category);
    try {
      const clubId = parseInt(targetClubId, 10);
      const targetClub = clubs.find(c => c.id === clubId);
      if (!targetClub) throw new Error('Club not found');

      // Append category if not already present
      let currentCategories = Array.isArray(targetClub.api_categories) ? [...targetClub.api_categories] : [];
      if (!currentCategories.includes(category)) {
        currentCategories.push(category);
      }

      const res = await fetch('/api/admin/clubs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: clubId,
          api_categories: currentCategories,
        }),
      });

      if (!res.ok) throw new Error('Failed to update mapping');
      toast.success(`Mapped "${category}" to ${targetClub.name}`);
      await loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save mapping');
    } finally {
      setSaving(null);
    }
  }

  async function handleUnmapCategory(category: string, sourceClubId: number) {
    setSaving(category);
    try {
      const targetClub = clubs.find(c => c.id === sourceClubId);
      if (!targetClub) throw new Error('Club not found');

      let currentCategories = Array.isArray(targetClub.api_categories) ? [...targetClub.api_categories] : [];
      currentCategories = currentCategories.filter(c => c !== category);

      const res = await fetch('/api/admin/clubs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sourceClubId,
          api_categories: currentCategories,
        }),
      });

      if (!res.ok) throw new Error('Failed to unmap');
      toast.success(`Removed mapping for "${category}"`);
      await loadData();
    } catch (e: any) {
      toast.error(e.message || 'Failed to unmap category');
    } finally {
      setSaving(null);
    }
  }

  // Find which club a category is mapped to
  function getMappedClub(category: string) {
    return clubs.find(c => Array.isArray(c.api_categories) && c.api_categories.includes(category));
  }

  const filteredCategories = categories.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  const unmapped = filteredCategories.filter(c => !getMappedClub(c));
  const mapped = filteredCategories.filter(c => getMappedClub(c));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1 flex items-center gap-2" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
            <Network size={24} style={{ color: '#8B0000' }} />
            Activity Mapper
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            Map API categories to local clubs to display their activities.
          </p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#A1A1AA' }} />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-shadow"
          style={{ background: '#fff', borderColor: '#E4E4E7' }}
          onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139,0,0,0.1)'}
          onBlur={e => e.currentTarget.style.boxShadow = 'none'}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <Loader2 size={24} className="mx-auto mb-3 animate-spin" style={{ color: '#8B0000' }} />
          <p className="text-sm font-semibold" style={{ color: '#71717A' }}>Fetching activities from Student Dashboard...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
          <p className="font-semibold" style={{ color: '#71717A' }}>No categories found in the API.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* UNMAPPED */}
          {unmapped.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#8B0000' }}>
                Unmapped Categories ({unmapped.length})
              </h2>
              <div className="rounded-xl border overflow-hidden" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
                {unmapped.map((cat, i) => (
                  <div key={cat} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                       style={{ borderBottom: i < unmapped.length - 1 ? '1px solid #F4F4F5' : 'none' }}>
                    <div className="font-semibold text-sm" style={{ color: '#191313' }}>
                      {cat}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        onChange={e => handleMapCategory(cat, e.target.value)}
                        disabled={saving === cat}
                        className="px-3 py-1.5 rounded-lg text-sm border outline-none cursor-pointer"
                        style={{ background: '#F7F7F8', borderColor: '#E4E4E7' }}>
                        <option value="">Select Club to map...</option>
                        {clubs.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      {saving === cat && <Loader2 size={16} className="animate-spin text-gray-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MAPPED */}
          {mapped.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#3F3F46' }}>
                Mapped Categories ({mapped.length})
              </h2>
              <div className="rounded-xl border overflow-hidden" style={{ background: '#F7F7F8', borderColor: '#E4E4E7' }}>
                {mapped.map((cat, i) => {
                  const club = getMappedClub(cat);
                  return (
                    <div key={cat} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                         style={{ borderBottom: i < mapped.length - 1 ? '1px solid #E4E4E7' : 'none' }}>
                      <div className="font-semibold text-sm" style={{ color: '#191313' }}>
                        {cat}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium px-2 py-1 rounded" style={{ background: '#E4E4E7', color: '#3F3F46' }}>
                          → {club?.name}
                        </span>
                        <button
                          onClick={() => handleUnmapCategory(cat, club.id)}
                          disabled={saving === cat}
                          className="text-xs font-bold text-red-600 hover:opacity-70 transition-opacity">
                          Unmap
                        </button>
                        {saving === cat && <Loader2 size={16} className="animate-spin text-gray-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
