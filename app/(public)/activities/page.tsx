'use client';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star, ExternalLink, FileText, ImageOff } from 'lucide-react';

import { Activity, ActivityCard, DOMAIN_COLORS, DOMAIN_LABEL } from '../_components/ActivityCard';

const UPSTREAM = 'https://sacactivities.kluniversity.in/api/public/activities';

function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

const DOMAINS = ['all', 'TEC', 'LCH', 'HWB', 'ESO', 'IIE'];

export default function ActivitiesPage() {
  const [tab, setTab]       = useState<'upcoming' | 'completed'>('completed');
  const [domain, setDomain] = useState('all');
  const [upcoming, setUpcoming] = useState<Activity[]>([]);
  const [completed, setCompleted] = useState<Activity[]>([]);
  const [loadingU, setLoadingU] = useState(true);
  const [loadingC, setLoadingC] = useState(true);
  const [errorU, setErrorU]     = useState(false);
  const [errorC, setErrorC]     = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'upcoming') setTab('upcoming');
  }, []);

  useEffect(() => {
    fetchWithTimeout(`${UPSTREAM}/upcoming`)
      .then(r => r.json())
      .then(d => {
        if (d.error || !Array.isArray(d.activities)) { setErrorU(true); setUpcoming([]); }
        else setUpcoming(d.activities);
        setLoadingU(false);
      })
      .catch(() => { setErrorU(true); setLoadingU(false); });

    fetchWithTimeout(`${UPSTREAM}/completed`)
      .then(r => r.json())
      .then(d => {
        if (d.error || !Array.isArray(d.activities)) { setErrorC(true); setCompleted([]); }
        else setCompleted(d.activities);
        setLoadingC(false);
      })
      .catch(() => { setErrorC(true); setLoadingC(false); });
  }, []);

  const list    = tab === 'upcoming' ? upcoming : completed;
  const loading = tab === 'upcoming' ? loadingU : loadingC;
  const hasError = tab === 'upcoming' ? errorU : errorC;
  const visible = domain === 'all' ? list : list.filter(a => a.domain === domain);

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Campus Life</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '20ch' }}>
            Activities & Workshops
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '54ch' }}>
            Hands-on workshops, inter-club competitions, and co-curricular activities spanning all five SAC domains.
            Every activity earns SAMAM points toward your student development record.
          </p>
        </div>
      </section>

      {/* ── Tabs + Filter ── */}
      <div className="sticky top-[64px] z-30" style={{ background: '#fff', borderBottom: '1px solid #E4E4E7' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-3 flex flex-wrap items-center justify-between gap-3">

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#F7F7F8' }}>
            {(['upcoming', 'completed'] as const).map(t => {
              const count = t === 'upcoming' ? upcoming.length : completed.length;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all capitalize"
                  style={{
                    background: tab === t ? '#fff' : 'transparent',
                    color: tab === t ? '#0D0D0D' : '#71717A',
                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}>
                  {t}
                  {!loadingU && !loadingC && count > 0 && (
                    <span className="ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full"
                          style={{ background: tab === t ? '#970003' : '#E4E4E7', color: tab === t ? '#fff' : '#71717A' }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Domain filter */}
          <div className="flex flex-wrap gap-1.5">
            {DOMAINS.map(d => {
              const color  = DOMAIN_COLORS[d] ?? '#970003';
              const active = domain === d;
              return (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className="px-3 py-1 rounded-full text-xs font-bold transition-all border"
                  style={{
                    background:  active ? (d === 'all' ? '#970003' : color) : 'transparent',
                    color:       active ? '#fff' : (d === 'all' ? '#52525B' : color),
                    borderColor: active ? 'transparent' : (d === 'all' ? '#E4E4E7' : `${color}50`),
                  }}>
                  {d === 'all' ? 'All' : d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="w-full px-6 sm:px-12 xl:px-20 py-10 pb-24" style={{ background: '#F7F7F8', minHeight: '60vh' }}>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border h-72 animate-pulse" style={{ background: '#E4E4E7' }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-28">
            <Calendar size={40} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
            <p className="font-bold text-base mb-1" style={{ color: '#52525B' }}>
              {hasError
                ? `Couldn't load ${tab} activities right now.`
                : list.length === 0
                  ? (tab === 'upcoming' ? 'No upcoming activities scheduled yet.' : 'No completed activities yet.')
                  : 'No activities in this domain.'}
            </p>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>
              {hasError
                ? 'Please try again in a moment.'
                : list.length === 0 && tab === 'upcoming'
                  ? 'Check back soon — activities are added regularly.'
                  : 'Try selecting a different domain.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold mb-6" style={{ color: '#A1A1AA' }}>
              {visible.length} {visible.length === 1 ? 'activity' : 'activities'}{domain !== 'all' ? ` · ${DOMAIN_LABEL[domain] ?? domain}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((act, i) => (
                <ActivityCard key={`${act.code}-${i}`} act={act} completed={tab === 'completed'} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
