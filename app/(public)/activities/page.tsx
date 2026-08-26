'use client';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star, ExternalLink, FileText, ImageOff } from 'lucide-react';

const UPSTREAM = 'https://sacactivities.kluniversity.in/api/public/activities';

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};
const DOMAIN_BG: Record<string, string> = {
  TEC: '#EFF6FF', LCH: '#F5F3FF', HWB: '#ECFDF5', ESO: '#FFFBEB', IIE: '#FEF2F2',
};
const DOMAIN_LABEL: Record<string, string> = {
  TEC: 'Technology', LCH: 'Liberal Arts & Culture', HWB: 'Health & Wellbeing', ESO: 'Social Outreach', IIE: 'Innovation',
};
const DIFF_COLOR: Record<string, string> = {
  Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444',
};

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
}

interface Report {
  status: string;
  poster_url: string | null;
}

interface Activity {
  code: string;
  title: string;
  description: string;
  domain: string;
  category: string;
  difficulty: string;
  sdc_credits: number;
  activity_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  poster_url: string | null;
  report: Report | null;
}

/* ── Activity Card ─────────────────────────────────────────────────── */
function ActivityCard({ act, completed }: { act: Activity; completed: boolean }) {
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isTruncated, setIsTruncated]   = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);
  const color = DOMAIN_COLORS[act.domain] ?? '#8B0000';
  const bg    = DOMAIN_BG[act.domain]     ?? '#FFF0F0';
  
  const rawPoster = act.poster_url || act.report?.poster_url;
  const poster = rawPoster
    ? (rawPoster.startsWith('http') ? rawPoster : `https://sacactivities.kluniversity.in${rawPoster}`)
    : null;
  const hasReport = completed && !!act.report;

  useLayoutEffect(() => {
    const el = descRef.current;
    if (el && !expandedDesc) setIsTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [act.description, expandedDesc]);

  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-lg"
      style={{ background: '#fff', borderColor: '#E4E4E7' }}>

      {/* ── Card header: poster or placeholder — always same height ── */}
      <div className="relative h-44 overflow-hidden shrink-0">
        {poster ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={act.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))' }} />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: bg }}>
            <ImageOff size={22} style={{ color: `${color}80` }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: `${color}90` }}>
              Poster unavailable
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: poster ? color : '#fff', color: poster ? '#fff' : color, boxShadow: poster ? 'none' : `0 0 0 1px ${color}30` }}>
            {act.domain}
          </span>
          {completed && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: poster ? 'rgba(0,0,0,0.45)' : '#fff', color: poster ? '#fff' : '#52525B', boxShadow: poster ? 'none' : '0 0 0 1px #E4E4E7' }}>
              Completed
            </span>
          )}
        </div>
      </div>

      {/* ── Body — identical structure for every card ── */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full" style={{ background: bg, color }}>
            {act.domain} · {DOMAIN_LABEL[act.domain] ?? act.domain}
          </span>
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                style={{ borderColor: `${DIFF_COLOR[act.difficulty] ?? '#6B7280'}40`, color: DIFF_COLOR[act.difficulty] ?? '#6B7280' }}>
            {act.difficulty}
          </span>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: '#FFF7ED', color: '#D97706' }}>
            <Star size={9} /> {act.sdc_credits} SAMAM Points
          </span>
          {!completed && (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A' }}>
              Upcoming
            </span>
          )}
        </div>

        {/* Title + category */}
        <div>
          <h2 className="font-bold text-base leading-snug mb-0.5" style={{ color: '#0D0D0D' }}>{act.title}</h2>
          <p className="text-xs font-semibold" style={{ color }}>{act.category}</p>
        </div>

        {/* Description */}
        <div className="flex-1">
          <p ref={descRef} className={`text-sm leading-relaxed ${expandedDesc ? '' : 'line-clamp-2'}`} style={{ color: '#71717A' }}>
            {act.description}
          </p>
          {(isTruncated || expandedDesc) && (
            <button
              onClick={() => setExpandedDesc(v => !v)}
              className="text-xs font-bold mt-1 transition-opacity hover:opacity-70"
              style={{ color }}>
              {expandedDesc ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-xs pt-3" style={{ borderTop: '1px solid #F4F4F5', color: '#A1A1AA' }}>
          <span className="flex items-center gap-1.5">
            <Calendar size={11} style={{ color }} />
            <span style={{ color: '#52525B' }}>{fmtDate(act.activity_date)}</span>
          </span>
          {(act.start_time || act.end_time) && (
            <span className="flex items-center gap-1.5">
              <Clock size={11} style={{ color }} />
              <span style={{ color: '#52525B' }}>{fmt12(act.start_time)}{act.end_time ? ` – ${fmt12(act.end_time)}` : ''}</span>
            </span>
          )}
          {act.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color }} />
              <span className="truncate" style={{ color: '#52525B' }}>{act.venue}</span>
            </span>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-1">
          {!completed && (
            <a
              href="https://sacactivities.kluniversity.in/auth/login"
              target="_blank" rel="noopener"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: color, color: '#fff' }}>
              Register <ExternalLink size={10} />
            </a>
          )}
          {hasReport && (
            <Link
              href={`/activities/report/${encodeURIComponent(act.code)}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-gray-50 border"
              style={{ borderColor: '#E4E4E7', color: '#52525B' }}>
              <FileText size={11} style={{ color }} />
              View Report
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────── */
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
