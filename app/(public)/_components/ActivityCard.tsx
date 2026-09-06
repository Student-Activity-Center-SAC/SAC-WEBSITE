'use client';
import { useState, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Star, ExternalLink, FileText } from 'lucide-react';

export const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};
export const DOMAIN_BG: Record<string, string> = {
  TEC: '#EFF6FF', LCH: '#F5F3FF', HWB: '#ECFDF5', ESO: '#FFFBEB', IIE: '#FEF2F2',
};
export const DOMAIN_LABEL: Record<string, string> = {
  TEC: 'Technology', LCH: 'Liberal Arts & Culture', HWB: 'Health & Wellbeing', ESO: 'Social Outreach', IIE: 'Innovation',
};
export const DIFF_COLOR: Record<string, string> = {
  Beginner: '#10B981', Intermediate: '#F59E0B', Advanced: '#EF4444',
};

export function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export interface Report {
  status: string;
  poster_url: string | null;
}

export interface Activity {
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
  club_name?: string;
}

export function ActivityCard({ act, completed }: { act: Activity; completed: boolean }) {
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
      className="rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-lg h-full"
      style={{ background: '#fff', borderColor: '#E4E4E7' }}>

      {/* ── Card header: poster only shown if available ── */}
      {poster && (
        <div className="relative h-44 overflow-hidden shrink-0">
          <img src={poster} alt={act.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))' }} />
          <div className="absolute bottom-3 left-4 flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: color, color: '#fff' }}>
              {act.domain}
            </span>
            {completed && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}>
                Completed
              </span>
            )}
          </div>
        </div>
      )}

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
          <p className="text-xs font-semibold" style={{ color }}>{act.club_name || act.category}</p>
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
            <a
              href={`https://sacactivities.kluniversity.in/report/${encodeURIComponent(act.code)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-gray-50 border"
              style={{ borderColor: '#E4E4E7', color: '#52525B' }}>
              <FileText size={11} style={{ color }} />
              View Report & Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
