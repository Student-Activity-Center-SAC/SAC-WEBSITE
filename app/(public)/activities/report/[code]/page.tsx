import Link from 'next/link';
import {
  ArrowLeft, Download, Calendar, Clock, MapPin, Star,
  BookOpen, Target, ListChecks, Lightbulb, GraduationCap, Flag,
  Image as ImageIcon, FileCheck2, ImageOff,
} from 'lucide-react';
import { notFound } from 'next/navigation';

const CDN = 'https://sacactivities.kluniversity.in';
const asset = (p: string | null | undefined) =>
  p ? (p.startsWith('http') ? p : `${CDN}${p}`) : null;

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};
const DOMAIN_LABEL: Record<string, string> = {
  TEC: 'Technology', LCH: 'Liberal Arts & Culture', HWB: 'Health & Wellbeing', ESO: 'Social Outreach', IIE: 'Innovation',
};

function fmt12(t: string) {
  if (!t) return '';
  const [hStr, mStr] = t.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr} ${ampm}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
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
  attendance_sheets: string[];
  poster_url: string | null;
  permission_letter_url: string | null;
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

function Section({ icon: Icon, label, color, text }: { icon: any; label: string; color: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="report-section py-7" style={{ borderTop: '1px solid #ECECEC' }}>
      <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 flex items-center gap-2" style={{ color }}>
        <Icon size={13} /> {label}
      </p>
      <p className="text-[15px] leading-[1.8] whitespace-pre-line" style={{ color: '#27272A' }}>{text}</p>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  
  let act: Activity | null = null;
  try {
    const { db } = await import('@/lib/query-builder');
    const { data } = await db.from('activities').select('*').eq('code', decodeURIComponent(code)).single();
    if (data) act = data as Activity;
  } catch (error) {
    console.error('Failed to fetch report from DB:', error);
  }

  if (!act || !act.report) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '70vh', paddingTop: '92px' }}>
        <FileCheck2 size={32} className="mb-4" style={{ color: '#D1D5DB' }} />
        <p className="font-bold mb-2" style={{ color: '#0D0D0D' }}>Report not found</p>
        <p className="text-sm mb-5" style={{ color: '#71717A' }}>This activity report may no longer be available.</p>
        <Link href="/activities" className="text-sm font-semibold underline" style={{ color: '#8B0000' }}>← Back to Activities</Link>
      </div>
    );
  }

  const color  = DOMAIN_COLORS[act.domain] ?? '#8B0000';
  const poster = asset(act.report.poster_url);
  const gallery = (act.report.gallery ?? []).map(g => asset(g.url)).filter(Boolean) as string[];
  const attendance = (act.report.attendance_sheets ?? []).map(asset).filter(Boolean) as string[];
  const permissionLetter = asset(act.report.permission_letter_url);

  return (
    <div style={{ background: '#F7F7F8', minHeight: '100vh' }}>
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="no-print" style={{ paddingTop: '92px', background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/activities" className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-60" style={{ color: '#8B0000' }}>
            <ArrowLeft size={15} /> Back to Activities
          </Link>
        </div>
      </div>

      {/* ── Document ── */}
      <div className="w-full px-6 sm:px-12 xl:px-20 pb-24" style={{ marginTop: '-16px' }}>
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E4E7', boxShadow: '0 4px 32px -8px rgba(0,0,0,0.08)' }}>

          {/* Poster / placeholder banner */}
          <div className="relative h-64 overflow-hidden">
            {poster ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={poster} alt={act.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7))' }} />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: `${color}12` }}>
                <ImageOff size={28} style={{ color: `${color}80` }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: `${color}90` }}>Poster unavailable</span>
              </div>
            )}
            <div className="absolute bottom-5 left-6 right-6">
              <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full mb-2"
                    style={{ background: color, color: '#fff' }}>
                {act.domain} · {DOMAIN_LABEL[act.domain] ?? act.domain}
              </span>
              <h1 className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)', color: poster ? '#fff' : '#0D0D0D' }}>
                {act.title}
              </h1>
              <p className="text-sm font-semibold mt-1" style={{ color: poster ? 'rgba(255,255,255,0.85)' : color }}>
                {act.category}
              </p>
            </div>
          </div>

          {/* Meta strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 sm:px-10 py-6" style={{ borderBottom: '1px solid #ECECEC' }}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#A1A1AA' }}>Date</p>
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#0D0D0D' }}>
                <Calendar size={12} style={{ color }} /> {fmtDate(act.activity_date)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#A1A1AA' }}>Time</p>
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#0D0D0D' }}>
                <Clock size={12} style={{ color }} /> {fmt12(act.start_time)}{act.end_time ? ` – ${fmt12(act.end_time)}` : ''}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#A1A1AA' }}>Venue</p>
              <p className="text-sm font-bold flex items-center gap-1.5 truncate" style={{ color: '#0D0D0D' }}>
                <MapPin size={12} style={{ color }} /> {act.venue}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#A1A1AA' }}>SAMAM Points</p>
              <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#D97706' }}>
                <Star size={12} /> {act.sdc_credits} pts
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 sm:px-10 pt-7">
            <p className="text-[15px] leading-[1.8]" style={{ color: '#52525B' }}>{act.description}</p>
          </div>

          {/* Report sections */}
          <div className="px-6 sm:px-10">
            <Section icon={BookOpen}      label="Overview"          color={color} text={act.report.overview} />
            <Section icon={Target}        label="Objectives"        color={color} text={act.report.objectives} />
            <Section icon={ListChecks}    label="Proceedings"       color={color} text={act.report.proceedings} />
            <Section icon={Lightbulb}     label="Key Highlights"    color={color} text={act.report.key_highlights} />
            <Section icon={GraduationCap} label="Learning Outcomes" color={color} text={act.report.learning_outcomes} />
            <Section icon={Flag}          label="Conclusion"        color={color} text={act.report.conclusion} />
          </div>

          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="report-section px-6 sm:px-10 py-7" style={{ borderTop: '1px solid #ECECEC' }}>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3 flex items-center gap-2" style={{ color }}>
                <ImageIcon size={13} /> Gallery
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gallery.map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noopener" className="block no-print-hover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u} alt="" className="w-full aspect-[4/3] object-cover rounded-lg hover:opacity-90 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Attendance + permission letter */}
          {(attendance.length > 0 || permissionLetter) && (
            <div className="report-section px-6 sm:px-10 py-7 flex flex-wrap gap-3 no-print" style={{ borderTop: '1px solid #ECECEC' }}>
              {attendance.map((u, i) => (
                <a key={i} href={u} target="_blank" rel="noopener"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-50"
                   style={{ borderColor: '#E4E4E7', color: '#52525B' }}>
                  <FileCheck2 size={12} style={{ color }} /> Attendance Sheet {attendance.length > 1 ? i + 1 : ''}
                </a>
              ))}
              {permissionLetter && (
                <a href={permissionLetter} target="_blank" rel="noopener"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-gray-50"
                   style={{ borderColor: '#E4E4E7', color: '#52525B' }}>
                  <FileCheck2 size={12} style={{ color }} /> Permission Letter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
