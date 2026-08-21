import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { DEMO_ACTIVITIES, DOMAIN_META } from '@/lib/demo-data';
import { FadeIn } from '../_components/FadeIn';

export const revalidate = 300;

export const metadata = {
  title: 'Activities',
  description: 'Upcoming and past activities and workshops organised by KL SAC clubs.',
};

async function getEvents() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const res  = await fetch(`${base}/api/public/activities`, { next: { revalidate: 300 } });
    const json = await res.json();
    return json.data?.length ? json.data : DEMO_ACTIVITIES;
  } catch {
    return DEMO_ACTIVITIES;
  }
}

export default async function EventsPage() {
  const events  = await getEvents();
  const today   = new Date().toISOString().split('T')[0];
  const upcoming = events
    .filter((e: any) => e.activity_date >= today)
    .sort((a: any, b: any) => a.activity_date.localeCompare(b.activity_date));
  const past = events
    .filter((e: any) => e.activity_date < today)
    .sort((a: any, b: any) => b.activity_date.localeCompare(a.activity_date));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', paddingTop: '92px', paddingBottom: '56px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pt-8">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: '#8B0000' }}>
            Calendar
          </p>
          <h1
            className="font-black leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            Activities
          </h1>
          <p className="text-lg" style={{ color: '#71717A', maxWidth: '52ch' }}>
            Competitions, workshops, performances, and outreach activities organised by KL SAC clubs across all five domains.
          </p>
        </div>
      </section>

      {/* ─── Upcoming Events ──────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 pb-20">
            <FadeIn>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#8B0000' }} />
                <h2 className="font-black text-xl" style={{ color: '#0D0D0D' }}>Upcoming Activities</h2>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(139,0,0,0.08)', color: '#8B0000' }}>
                  {upcoming.length}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E4E4E7' }}>
                {upcoming.map((ev: any) => (
                  <EventRow key={ev.code} ev={ev} dim={false} />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── Past Events ──────────────────────────────────────────────── */}
      {past.length > 0 && (
        <section style={{ background: '#F7F7F8' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#D1D5DB' }} />
                <h2 className="font-black text-xl" style={{ color: '#0D0D0D' }}>Past Activities</h2>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: '#F4F4F5', color: '#71717A' }}>
                  {past.length}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E4E4E7' }}>
                {past.map((ev: any) => (
                  <EventRow key={ev.code} ev={ev} dim={true} />
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-32 text-center">
            <CalendarDays size={48} className="mx-auto mb-5 opacity-20" style={{ color: '#71717A' }} />
            <p className="font-bold text-lg" style={{ color: '#71717A' }}>
              No activities to display at this time.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

function EventRow({ ev, dim }: { ev: any; dim: boolean }) {
  const dmeta  = DOMAIN_META[ev.domain];
  const color  = dmeta?.color ?? '#8B0000';
  const date   = new Date(ev.activity_date);

  return (
    <div
      className="group flex items-start gap-5 sm:gap-8 py-5"
      style={{ borderBottom: '1px solid #E4E4E7', opacity: dim ? 0.55 : 1 }}>
      {/* Date */}
      <div className="w-12 sm:w-14 shrink-0 text-center pt-0.5">
        <div className="font-black text-2xl leading-none" style={{ color: '#0D0D0D' }}>
          {date.getDate()}
        </div>
        <div className="text-[10px] font-bold uppercase mt-0.5" style={{ color: '#A1A1AA' }}>
          {date.toLocaleString('en-IN', { month: 'short' })}
          {' '}{date.getFullYear().toString().slice(2)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base sm:text-lg leading-snug mb-1.5" style={{ color: '#0D0D0D' }}>
          {ev.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: '#A1A1AA' }}>
          <span className="font-black uppercase text-[10px]" style={{ color }}>{ev.domain}</span>
          {ev.venue && <><span>·</span><span>{ev.venue}</span></>}
        </div>
        {ev.description && (
          <p className="text-sm mt-2 line-clamp-1" style={{ color: '#71717A' }}>
            {ev.description}
          </p>
        )}
      </div>

      {/* Register CTA (only upcoming) */}
      {!dim && (
        <Link
          href="https://sacactivities.kluniversity.in/auth/login"
          target="_blank"
          rel="noopener"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: '#8B0000' }}>
          Register
          <ArrowUpRight size={11} />
        </Link>
      )}
    </div>
  );
}

