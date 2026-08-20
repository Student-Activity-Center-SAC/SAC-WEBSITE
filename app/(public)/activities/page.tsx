'use client';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { DOMAIN_META } from '@/lib/demo-data';

const DOMAIN_ORDER = ['all', 'TEC', 'LCH', 'ESO', 'HWB', 'IIE'];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner:     '#7C0000',
  Intermediate: '#991B1B',
  Advanced:     '#8B0000',
};

interface Activity {
  code: string;
  club_slug: string;
  club_name?: string;
  domain: string;
  title: string;
  description: string;
  competencies: string;
  activity_date: string | null;
  month?: string;
  week?: string;
  venue: string;
  time_slot?: string;
  difficulty: string;
}

export default function ActivitiesPage() {
  const [domain, setDomain] = useState('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/activities')
      .then(r => r.json())
      .then(d => { setActivities(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const visible = domain === 'all' ? activities : activities.filter(a => a.domain === domain);

  return (
    <div className="w-full px-6 sm:px-12 xl:px-20" style={{ paddingTop: '112px', paddingBottom: '80px' }}>
      <div className="mb-12 text-center">
        <span
          className="text-xs font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full inline-block mb-4"
          style={{ background: '#fff0f0', color: '#8b0000' }}>
          Activities & Workshops
        </span>
        <h1
          className="font-black mb-3"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em', color: '#0d0d0d' }}>
          Activities
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#71717a' }}>
          Browse all activities across domains. Register on the student portal to enroll.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-12">
        <div className="flex items-center gap-1.5 mr-1" style={{ color: '#71717a' }}>
          <Filter size={14} />
          <span className="text-sm font-semibold">Filter:</span>
        </div>
        {DOMAIN_ORDER.map(d => {
          const meta   = DOMAIN_META[d];
          const color  = meta?.color ?? '#8b0000';
          const isAll  = d === 'all';
          const active = domain === d;
          return (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className="px-4 py-1.5 rounded-full text-sm font-black transition-all border"
              style={{
                background:  active ? (isAll ? '#8b0000' : color) : '#fff',
                color:       active ? '#fff' : (isAll ? '#374151' : color),
                borderColor: active ? 'transparent' : (isAll ? '#e4e4e7' : `${color}40`),
                boxShadow:   active ? `0 4px 12px ${isAll ? '#8b000060' : `${color}40`}` : 'none',
              }}>
              {isAll ? 'All' : d}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-24" style={{ color: '#71717a' }}>
          <p className="font-semibold">Loading activities…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-24" style={{ color: '#71717a' }}>
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-semibold">No activities found for this domain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((act, idx) => {
            const meta      = DOMAIN_META[act.domain];
            const color     = meta?.color ?? '#8b0000';
            const diffColor = DIFFICULTY_COLOR[act.difficulty ?? 'Beginner'] ?? '#6b7280';
            const isPast    = !!act.activity_date && act.activity_date < new Date().toISOString().split('T')[0];
            return (
              <div
                key={`${act.code}__${act.club_slug}__${idx}`}
                className="rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
                style={{ background: '#fff', borderColor: '#e4e4e7', opacity: isPast ? 0.72 : 1 }}>
                <div className="h-1" style={{ background: color }} />
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                      {act.domain}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: `${diffColor}12`, color: diffColor }}>
                      {act.difficulty ?? 'Beginner'}
                    </span>
                    {isPast && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f4f4f5', color: '#71717a' }}>
                        Completed
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg leading-snug text-gray-900">{act.title}</h2>
                  {act.club_name && (
                    <p className="text-xs font-semibold -mt-1" style={{ color }}>
                      {act.club_name}
                    </p>
                  )}
                  <p className="text-sm line-clamp-2 flex-1" style={{ color: '#71717a' }}>
                    {act.description}
                  </p>
                  <div
                    className="flex flex-col gap-2 text-xs mt-auto pt-3"
                    style={{ borderTop: '1px solid #f0f0f0', color: '#71717a' }}>
                    {(act.activity_date || act.month) && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {act.activity_date
                          ? new Date(act.activity_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : `${act.month}${act.week ? ` · ${act.week}` : ''}`}
                        {act.time_slot && (
                          <span className="flex items-center gap-1 ml-1">
                            <Clock size={11} /> {act.time_slot}
                          </span>
                        )}
                      </span>
                    )}
                    {act.venue && (
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin size={12} /> {act.venue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

