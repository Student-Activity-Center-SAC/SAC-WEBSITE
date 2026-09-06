'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FadeIn } from './FadeIn';

const UPSTREAM_UPCOMING = 'https://sacactivities.kluniversity.in/api/public/activities/upcoming';
const UPSTREAM_COMPLETED = 'https://sacactivities.kluniversity.in/api/public/activities/completed';

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

interface Activity {
  code: string;
  title: string;
  domain: string;
  category: string;
  club_name?: string;
  venue: string;
  activity_date: string;
  status?: 'upcoming' | 'completed';
}

function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function UpcomingActivitiesHome() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const [nowIST] = useState(() => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })));
  const [calYear, setCalYear]   = useState(nowIST.getFullYear());
  const [calMonth, setCalMonth] = useState(nowIST.getMonth());

  useEffect(() => {
    Promise.all([
      fetchWithTimeout(UPSTREAM_UPCOMING).then(r => r.json()).catch(() => ({ activities: [] })),
      fetchWithTimeout(UPSTREAM_COMPLETED).then(r => r.json()).catch(() => ({ activities: [] }))
    ])
      .then(([upcomingData, completedData]) => {
        const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        // Normalize today to midnight IST for date-only comparison
        const todayIST = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());

        const upacts: Activity[] = Array.isArray(upcomingData.activities) ? upcomingData.activities : [];
        const comacts: Activity[] = Array.isArray(completedData.activities) ? completedData.activities : [];

        // For each upcoming activity, check if its date is actually in the past
        const up = upacts.map(a => {
          const d = new Date(a.activity_date?.slice(0, 10));
          const actDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          // If date is strictly before today, treat as completed
          const isActuallyPast = actDate < todayIST;
          return { ...a, status: isActuallyPast ? 'completed' as const : 'upcoming' as const };
        });
        const com = comacts.map(a => ({ ...a, status: 'completed' as const }));
        
        setActivities([...up, ...com]);
        // Jump calendar to the first *truly upcoming* activity
        const firstTrueUpcoming = up.find(a => a.status === 'upcoming');
        if (firstTrueUpcoming) {
          const first = new Date(firstTrueUpcoming.activity_date);
          if (!isNaN(first.getTime())) {
            setCalYear(first.getFullYear());
            setCalMonth(first.getMonth());
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Index activities by date key
  const actsByDate: Record<string, Activity[]> = {};
  activities.forEach(act => {
    const key = act.activity_date?.slice(0, 10);
    if (key) {
      if (!actsByDate[key]) actsByDate[key] = [];
      actsByDate[key].push(act);
    }
  });

  const calDays = getCalendarDays(calYear, calMonth);
  const todayKey = toDateKey(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  return (
    <section style={{ background: '#faf6f1' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 lg:py-16">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-start">
            
            {/* ── Left Column: Heading + Mini Calendar ──────────────── */}
            <div>
              <p className="kicker mb-5" style={{ color: '#970003' }}>Calendar</p>
              <h2
                className="font-display font-medium leading-[1.07] mb-8 whitespace-nowrap"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                Upcoming Activities
              </h2>

              <div className="rounded-2xl overflow-visible" style={{ background: '#fff', border: '1px solid var(--hairline)' }}>

              {/* Month nav */}
              <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--hairline)' }}>
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: 'rgba(25,19,19,0.4)' }}
                  aria-label="Previous month">
                  <ChevronLeft size={18} />
                </button>
                <span className="font-semibold text-base" style={{ color: '#191313' }}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: 'rgba(25,19,19,0.4)' }}
                  aria-label="Next month">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day-of-week headers */}
              <div className="grid grid-cols-7 px-4 pt-4 pb-2">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-semibold tracking-wide uppercase py-1"
                       style={{ color: 'rgba(25,19,19,0.28)' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 px-4 pb-5 gap-y-1" style={{ position: 'relative' }}>
                {calDays.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} className="h-11" />;
                  const dateKey = toDateKey(calYear, calMonth, day);
                  const dayActs = actsByDate[dateKey] || [];
                  const hasAct  = dayActs.length > 0;
                  const isToday = dateKey === todayKey;
                  const isPast  = dateKey < todayKey;
                  let hasUpcoming = dayActs.some(a => a.status === 'upcoming');
                  let hasCompleted = dayActs.some(a => a.status === 'completed');

                  if (hasAct && isPast) {
                    hasUpcoming = false;
                    hasCompleted = true;
                  }

                  return (
                    <div
                      key={dateKey}
                      className="relative flex items-center justify-center"
                      style={{ zIndex: hoveredDate === dateKey ? 50 : 'auto' }}
                      onMouseEnter={() => hasAct && setHoveredDate(dateKey)}
                      onMouseLeave={() => setHoveredDate(null)}>

                      {/* Day cell */}
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm transition-all select-none"
                        style={{
                          background: hasUpcoming
                            ? '#970003'
                            : hasCompleted
                              ? '#10B981'
                              : isToday
                                ? 'rgba(151,0,3,0.09)'
                                : 'transparent',
                          color: (hasUpcoming || hasCompleted)
                            ? '#fff'
                            : isPast && !isToday
                              ? 'rgba(25,19,19,0.18)'
                              : isToday
                                ? '#970003'
                                : 'rgba(25,19,19,0.72)',
                          fontWeight: hasAct || isToday ? 600 : 400,
                          cursor: hasAct ? 'default' : 'default',
                        }}>
                        {hasCompleted && !hasUpcoming ? (
                          <div className="flex items-center justify-center gap-0.5">
                            <span>{day}</span>
                            <Check size={10} strokeWidth={4} />
                          </div>
                        ) : (
                          day
                        )}
                      </div>

                      {/* Hover tooltip */}
                      {hasAct && hoveredDate === dateKey && (
                        <div
                          className="absolute bottom-full left-1/2 mb-2.5 rounded-xl shadow-2xl pointer-events-none"
                          style={{
                            transform: 'translateX(-50%)',
                            background: '#1a0404',
                            minWidth: '200px',
                            maxWidth: '250px',
                            padding: '10px 12px',
                            zIndex: 100,
                          }}>
                          {actsByDate[dateKey].map((act, j) => (
                            <div key={act.code}
                                 className={j > 0 ? 'mt-2 pt-2' : ''}
                                 style={{ borderTop: j > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                              <p className="text-xs font-semibold leading-snug" style={{ color: '#fff' }}>
                                {act.title}
                              </p>
                              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
                                {[act.domain, act.club_name || act.category, act.venue].filter(Boolean).join(' · ')}
                              </p>
                            </div>
                          ))}
                          {/* Triangle */}
                          <div style={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0, height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '6px solid #1a0404',
                          }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="px-6 py-4 flex flex-wrap items-center gap-5" style={{ borderTop: '1px solid var(--hairline)' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#970003' }} />
                  <span className="text-xs" style={{ color: 'rgba(25,19,19,0.4)' }}>Upcoming</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: '#10B981', color: '#fff' }}>
                     <Check size={8} strokeWidth={4} />
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(25,19,19,0.4)' }}>Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(151,0,3,0.09)', border: '1px solid rgba(151,0,3,0.25)' }} />
                  <span className="text-xs" style={{ color: 'rgba(25,19,19,0.4)' }}>Today</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/activities?tab=upcoming"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={{ 
                  color: '#970003', 
                  background: 'rgba(151,0,3,0.05)',
                  border: '1px solid rgba(151,0,3,0.12)'
                }}>
                View all activities <ArrowRight size={14} />
              </Link>
            </div>
            </div>

            {/* ── Activity List ──────────────────────────────────────── */}
            <div className="lg:pt-[7.5rem]">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-0" style={{ borderTop: '1px solid var(--hairline)' }}>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <div key={i} className="py-5 flex gap-6" style={{ borderBottom: '1px solid var(--hairline)' }}>
                      <div className="w-10 h-12 rounded animate-pulse shrink-0" style={{ background: 'rgba(25,19,19,0.06)' }} />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 rounded animate-pulse w-3/4" style={{ background: 'rgba(25,19,19,0.06)' }} />
                        <div className="h-3 rounded animate-pulse w-1/2" style={{ background: 'rgba(25,19,19,0.04)' }} />
                      </div>
                    </div>
                  ))
                ) : activities.filter(a => a.status === 'upcoming').length === 0 ? (
                  <div className="py-16 text-center xl:col-span-2" style={{ color: 'rgba(25,19,19,0.4)' }}>
                    <p className="font-display font-medium text-xl mb-1">No upcoming activities</p>
                    <p className="text-sm">Check back soon or visit the activities page.</p>
                  </div>
                ) : activities.filter(a => a.status === 'upcoming').slice(0, 6).map(act => {
                  const date  = new Date(act.activity_date);
                  const color = DOMAIN_COLORS[act.domain] ?? '#970003';
                  const meta  = [act.club_name || act.category, act.venue].filter(Boolean).join(' · ');
                  return (
                    <div
                      key={act.code}
                      className="group flex items-start gap-4 sm:gap-5 py-4"
                      style={{ borderBottom: '1px solid var(--hairline)' }}>

                      {/* Date stamp */}
                      <div className="shrink-0 text-center" style={{ minWidth: '2.5rem' }}>
                        <div
                          className="font-display font-medium leading-none tabular-nums"
                          style={{ fontSize: '1.4rem', color: '#970003' }}>
                          {String(date.getDate()).padStart(2, '0')}
                        </div>
                        <div
                          className="text-[10px] font-bold tracking-widest uppercase mt-0.5"
                          style={{ color: 'rgba(25,19,19,0.32)' }}>
                          {date.toLocaleString('en-IN', { month: 'short' })}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="w-px self-stretch shrink-0 mt-1" style={{ background: 'rgba(151,0,3,0.15)' }} />

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg leading-snug mb-1.5" style={{ color: '#191313' }}>
                            {act.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm mb-1"
                               style={{ color: 'rgba(25,19,19,0.4)' }}>
                            <span className="font-bold text-xs uppercase tracking-wider" style={{ color }}>
                              {act.domain}
                            </span>
                            {meta && (
                              <>
                                <span style={{ color: 'rgba(25,19,19,0.22)' }}>·</span>
                                <span>{meta}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Register CTA — appears below on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href="https://sacactivities.kluniversity.in/auth/login"
                            target="_blank" rel="noopener"
                            className="text-xs font-bold inline-flex items-center gap-1"
                            style={{ color: '#970003' }}>
                            Register now <ArrowUpRight size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
