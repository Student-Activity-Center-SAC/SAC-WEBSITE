'use client';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, ChevronDown, ChevronUp, ExternalLink, BookOpen, Award, Lightbulb, FileText, Image as ImageIcon } from 'lucide-react';

const CDN = 'https://sacactivities.kluniversity.in';
const img = (p: string | null | undefined) =>
  p ? (p.startsWith('http') ? p : `${CDN}${p}`) : null;

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

interface Report {
  status: string;
  generated_at: string;
  overview: string;
  objectives: string;
  proceedings: string;
  key_highlights: string;
  learning_outcomes: string;
  conclusion: string;
  gallery: { url: string }[];
  poster_url: string | null;
  permission_letter_url: string | null;
  attendance_sheets: string[];
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
  report: Report | null;
}

/* ── Activity Card ─────────────────────────────────────────────────── */
function ActivityCard({ act, completed }: { act: Activity; completed: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const color  = DOMAIN_COLORS[act.domain] ?? '#8B0000';
  const bg     = DOMAIN_BG[act.domain]     ?? '#FFF0F0';
  const poster = img(act.report?.poster_url);
  const hasReport = completed && !!act.report;
  const gallery = (act.report?.gallery ?? []).map(g => img(g.url)).filter(Boolean) as string[];

  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-lg"
      style={{ background: '#fff', borderColor: '#E4E4E7' }}>

      {/* ── Card header ── */}
      {poster ? (
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt={act.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))' }} />
          <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: color, color: '#fff' }}>{act.domain}</span>
            {completed && <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}>Completed</span>}
          </div>
        </div>
      ) : (
        <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }} />
      )}

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          {!poster && (
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full" style={{ background: bg, color }}>
              {act.domain} · {DOMAIN_LABEL[act.domain] ?? act.domain}
            </span>
          )}
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
                style={{ borderColor: `${DIFF_COLOR[act.difficulty] ?? '#6B7280'}40`, color: DIFF_COLOR[act.difficulty] ?? '#6B7280' }}>
            {act.difficulty}
          </span>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: '#FFF7ED', color: '#D97706' }}>
            <Star size={9} /> {act.sdc_credits} SDC Credits
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
        <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: '#71717A' }}>{act.description}</p>

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
            <button
              onClick={() => setExpanded(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-gray-50 border"
              style={{ borderColor: '#E4E4E7', color: '#52525B' }}>
              <FileText size={11} style={{ color }} />
              {expanded ? 'Hide Report' : 'View Report'}
              {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}
        </div>

        {/* ── Expanded report ── */}
        {expanded && act.report && (
          <div className="mt-1 rounded-xl overflow-hidden" style={{ border: `1px solid ${color}25`, background: bg }}>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="p-3 border-b" style={{ borderColor: `${color}20` }}>
                <p className="text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1" style={{ color }}>
                  <ImageIcon size={10} /> Gallery
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {gallery.slice(0, 8).map((u, i) => (
                    <a key={i} href={u} target="_blank" rel="noopener" className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Report sections */}
            {[
              { icon: BookOpen,   label: 'Overview',          text: act.report.overview          },
              { icon: Lightbulb,  label: 'Key Highlights',    text: act.report.key_highlights    },
              { icon: Award,      label: 'Learning Outcomes', text: act.report.learning_outcomes  },
            ].filter(s => s.text).map(s => (
              <div key={s.label} className="p-4 border-b last:border-b-0" style={{ borderColor: `${color}15` }}>
                <p className="text-[10px] font-black tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color }}>
                  <s.icon size={10} /> {s.label}
                </p>
                <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#374151' }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        )}
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
    fetch('/api/activities-proxy?type=upcoming')
      .then(r => r.json())
      .then(d => {
        if (d.error || !Array.isArray(d.activities)) { setErrorU(true); setUpcoming([]); }
        else setUpcoming(d.activities);
        setLoadingU(false);
      })
      .catch(() => { setErrorU(true); setLoadingU(false); });

    fetch('/api/activities-proxy?type=completed')
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
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '56px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Campus Life</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '20ch' }}>
            Activities & Workshops
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '54ch' }}>
            Hands-on workshops, inter-club competitions, and co-curricular activities spanning all five SAC domains.
            Every activity earns SDC credits toward your student development record.
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
