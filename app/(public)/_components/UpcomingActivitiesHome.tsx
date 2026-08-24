'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FadeIn } from './FadeIn';

const UPSTREAM = 'https://sacactivities.kluniversity.in/api/public/activities/upcoming';

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};

interface Activity {
  code: string;
  title: string;
  domain: string;
  category: string;
  venue: string;
  activity_date: string;
}

function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

export function UpcomingActivitiesHome() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchWithTimeout(UPSTREAM)
      .then(r => r.json())
      .then(d => setActivities(Array.isArray(d.activities) ? d.activities.slice(0, 5) : []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: '#faf6f1' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-24 lg:py-32">
        <FadeIn className="mb-12">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Calendar</p>
          <h2
            className="font-display font-medium leading-[1.07]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
            Upcoming Activities
          </h2>
        </FadeIn>

        <FadeIn>
          <div style={{ borderTop: '1px solid var(--hairline)' }}>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="py-5" style={{ borderBottom: '1px solid var(--hairline)' }}>
                  <div className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(25,19,19,0.06)' }} />
                </div>
              ))
            ) : activities.length === 0 ? (
              <div className="py-16 text-center" style={{ color: 'rgba(25,19,19,0.4)' }}>
                <p className="font-display font-medium text-xl mb-1">No upcoming activities</p>
                <p className="text-sm">Check back soon or visit the activities page.</p>
              </div>
            ) : activities.map(act => {
              const date  = new Date(act.activity_date);
              const color = DOMAIN_COLORS[act.domain] ?? '#970003';
              return (
                <div key={act.code}
                  className="group flex items-start gap-6 py-5"
                  style={{ borderBottom: '1px solid var(--hairline)' }}>
                  {/* Date stamp */}
                  <div className="shrink-0 text-center"
                    style={{ minWidth: '3.5rem', background: '#970003', borderRadius: '0.375rem', padding: '8px 10px' }}>
                    <div className="font-display font-medium text-xl leading-none" style={{ color: '#fff' }}>
                      {date.getDate()}
                    </div>
                    <div className="text-[10px] font-semibold tracking-wider uppercase mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {date.toLocaleString('en-IN', { month: 'short' })}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg leading-snug mb-1" style={{ color: '#191313' }}>
                      {act.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'rgba(25,19,19,0.4)' }}>
                      <span className="font-bold text-[10px] uppercase tracking-wider" style={{ color }}>{act.domain}</span>
                      {act.category && <><span>·</span><span className="font-medium">{act.category}</span></>}
                      {act.venue && <><span>·</span><span>{act.venue}</span></>}
                    </div>
                  </div>
                  {/* CTA */}
                  <a href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                    className="text-xs font-semibold shrink-0 mt-1 transition-all opacity-0 group-hover:opacity-100 inline-flex items-center gap-1"
                    style={{ color: '#970003' }}>
                    Register <ArrowUpRight size={12} />
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href="/activities?tab=upcoming"
              className="inline-flex items-center gap-2 font-semibold text-sm"
              style={{ color: '#970003' }}>
              View all activities <ArrowRight size={14} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
