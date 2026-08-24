import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, ArrowLeft,
  Camera, Calendar, MapPin, Trophy,
} from 'lucide-react';
import { db } from '@/lib/query-builder';
import { FadeIn } from '../../_components/FadeIn';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await db.from('domains').select('name, description').eq('slug', slug).single();
  if (!data) return {};
  return { title: data.name, description: data.description };
}

export default async function DomainDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: domain } = await db.from('domains').select('*').eq('slug', slug).single();
  if (!domain) notFound();

  const today = new Date().toISOString().split('T')[0];
  const [{ data: clubsData }, { data: upcomingActivitiesData }] = await Promise.all([
    db
      .from('clubs')
      .select('id, slug, name, tagline, logo_url')
      .eq('domain_slug', slug)
      .order('name', { ascending: true }),
    db
      .from('activities')
      .select('*')
      .eq('domain', domain.code)
      .gte('activity_date', today)
      .order('activity_date', { ascending: true })
      .limit(6),
  ]);

  const clubs             = clubsData ?? [];
  const upcomingActivities = upcomingActivitiesData ?? [];
  const galleryPhotos     = (domain.gallery as string[]) ?? [];
  const competencies      = (domain.competencies as string[]) ?? [];
  const clubNameMap       = Object.fromEntries(clubs.map((c: any) => [c.slug, c.name]));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '92px',
          paddingBottom: '72px',
          background: domain.cover_url
            ? `linear-gradient(135deg, ${domain.color}cc 0%, ${domain.color}88 100%)`
            : `linear-gradient(135deg, ${domain.color}22 0%, ${domain.color}08 100%)`,
          borderBottom: `2px solid ${domain.color}20`,
          position: 'relative',
          overflow: 'hidden',
        }}>
        {domain.cover_url && (
          <img src={domain.cover_url} alt={domain.name}
               className="absolute inset-0 w-full h-full object-cover"
               style={{ zIndex: 0, opacity: 0.18 }} />
        )}
        <div className="relative z-10 w-full px-6 sm:px-12 xl:px-20">
          <Link
            href="/domains"
            className="inline-flex items-center gap-2 text-xs font-bold mb-8 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
            <ArrowLeft size={12} />
            All Domains
          </Link>

          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-lg shrink-0"
              style={{ background: domain.accent_bg, color: domain.color }}>
              {domain.code}
            </div>
            <div>
              <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: domain.color }}>
                Domain
              </p>
              <h1
                className="font-display font-medium leading-tight"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
                {domain.name}
              </h1>
            </div>
          </div>

          <p className="font-bold text-xl sm:text-2xl mb-6" style={{ color: domain.color, letterSpacing: '-0.01em' }}>
            {domain.tagline}
          </p>

          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <span className="font-black text-2xl" style={{ color: domain.color }}>{clubs.length}</span>
              <span className="ml-2" style={{ color: '#71717A' }}>Clubs</span>
            </div>
            <div>
              <span className="font-black text-2xl" style={{ color: domain.color }}>{competencies.length}</span>
              <span className="ml-2" style={{ color: '#71717A' }}>Competencies developed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <FadeIn className="lg:col-span-2">
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: domain.color }}>
                About This Domain
              </p>
              <h2
                className="font-display font-medium leading-tight mb-8"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                {domain.headline}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: '#71717A', maxWidth: '68ch' }}>
                {domain.philosophy}
              </p>
            </FadeIn>

            {competencies.length > 0 && (
              <FadeIn delay={0.1}>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: '#A1A1AA' }}>
                  Competencies Developed
                </p>
                <ul className="flex flex-col gap-3">
                  {competencies.map((c: string) => (
                    <li key={c} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: domain.color }} />
                      <span className="text-sm leading-relaxed" style={{ color: '#3F3F46' }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* ─── Activity Gallery ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-3" style={{ color: domain.color }}>
                  Activity Gallery
                </p>
                <h2
                  className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  Moments from our activities.
                </h2>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: domain.accent_bg, color: domain.color }}>
                Updated regularly
              </span>
            </div>
          </FadeIn>

          <FadeIn>
            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryPhotos.map((src: string, i: number) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={src} alt={`${domain.name} activity photo ${i + 1}`}
                         className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2"
                      style={{
                        aspectRatio: '4/3',
                        background: i % 3 === 0 ? `${domain.color}10` : i % 3 === 1 ? `${domain.color}07` : '#ECECEC',
                        border: `1.5px dashed ${domain.color}22`,
                      }}>
                      <Camera size={22} style={{ color: `${domain.color}38` }} />
                      <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: `${domain.color}38` }}>
                        Photo
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-center" style={{ color: '#A1A1AA' }}>
                  Photos coming soon.
                </p>
              </>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── Upcoming Activities ──────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-3" style={{ color: domain.color }}>
                  Upcoming Activities
                </p>
                <h2
                  className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  What's coming up.
                </h2>
              </div>
              <Link href="/activities" className="text-xs font-bold hover:opacity-70 transition-opacity"
                    style={{ color: domain.color }}>
                All activities →
              </Link>
            </div>
          </FadeIn>

          {upcomingActivities.length > 0 ? (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingActivities.slice(0, 3).map((activity: any) => {
                  const date  = new Date(activity.activity_date);
                  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  const day   = date.getDate();
                  return (
                    <div key={activity.code} className="rounded-2xl overflow-hidden flex flex-col"
                         style={{ border: '1px solid #E4E4E7' }}>
                      <div className="px-6 pt-6 pb-5 flex-1 flex flex-col"
                           style={{ background: `linear-gradient(160deg, ${domain.color}12 0%, ${domain.color}04 100%)` }}>
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div className="rounded-xl px-3 py-2 text-center min-w-[3.5rem]"
                               style={{ background: domain.color }}>
                            <p className="text-[9px] font-black tracking-widest text-white" style={{ opacity: 0.75 }}>{month}</p>
                            <p className="text-2xl font-black leading-none text-white">{day}</p>
                          </div>
                          <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mt-1"
                                style={{ background: domain.accent_bg, color: domain.color }}>
                            {activity.difficulty}
                          </span>
                        </div>
                        <h3 className="font-black text-base leading-snug mb-1" style={{ color: '#0D0D0D' }}>
                          {activity.title}
                        </h3>
                        {clubNameMap[activity.club_slug] && (
                          <p className="text-xs font-semibold mb-2" style={{ color: domain.color }}>
                            {clubNameMap[activity.club_slug]}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: '#71717A' }}>
                          {activity.description.length > 110
                            ? activity.description.slice(0, 110) + '…'
                            : activity.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#A1A1AA' }}>
                          <MapPin size={11} />
                          <span className="truncate">{activity.venue}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end px-6 py-3"
                           style={{ borderTop: '1px solid #E4E4E7', background: '#FAFAFA' }}>
                        <Link href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                              className="text-[11px] font-bold px-3.5 py-1.5 rounded-full transition-all hover:opacity-80"
                              style={{ background: domain.color, color: '#fff' }}>
                          Register →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="rounded-2xl p-14 text-center" style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
                <Calendar size={32} className="mx-auto mb-4" style={{ color: '#D1D1D6' }} />
                <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>No upcoming activities yet.</p>
                <p className="text-xs" style={{ color: '#A1A1AA' }}>Check back soon for new activities.</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── Clubs in this domain ─────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <FadeIn className="mb-12">
            <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: domain.color }}>
              {clubs.length} Clubs in {domain.short_name}
            </p>
            <h2 className="font-display font-medium leading-tight"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
              Find your community.
            </h2>
          </FadeIn>

          <FadeIn>
            {clubs.length === 0 ? (
              <div className="rounded-2xl border p-12 text-center" style={{ borderColor: '#E4E4E7', background: '#fff' }}>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  No clubs added to this domain yet.
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #E4E4E7' }}>
                {clubs.map((club: any) => (
                  <Link key={club.slug} href={`/clubs/${club.slug}`}
                        className="group flex items-center gap-6 py-5 transition-colors hover:bg-white/50"
                        style={{ borderBottom: '1px solid #E4E4E7' }}>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base sm:text-lg leading-tight text-gray-900 group-hover:text-gray-600 transition-colors mb-1">
                        {club.name}
                      </p>
                      <p className="text-sm" style={{ color: '#A1A1AA' }}>{club.tagline}</p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1"
                                style={{ color: '#D1D1D6' }} />
                  </Link>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── Achievements ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-3" style={{ color: domain.color }}>
                  Achievements
                </p>
                <h2 className="font-display font-medium leading-tight"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  What our clubs have won.
                </h2>
              </div>
              <Link href="/achievements" className="text-xs font-bold hover:opacity-70 transition-opacity"
                    style={{ color: domain.color }}>
                All achievements →
              </Link>
            </div>
          </FadeIn>
          <FadeIn>
            <div className="rounded-2xl p-14 text-center" style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
              <Trophy size={32} className="mx-auto mb-4" style={{ color: '#D1D1D6' }} />
              <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>Achievement records will be showcased here.</p>
              <p className="text-xs mb-6" style={{ color: '#A1A1AA' }}>National, state and inter-university wins.</p>
              <Link href="/achievements"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-[1.02]"
                    style={{ background: domain.color, color: '#fff' }}>
                View Achievement Board <ArrowRight size={13} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: domain.color }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl mb-2 leading-tight"
                style={{ color: '#fff', letterSpacing: '-0.02em' }}>
              Explore {domain.short_name} clubs.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)' }}>
              Register for a club and start building your development record.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href={`/clubs#${domain.code}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
                  style={{ background: '#fff', color: domain.color }}>
              See All Clubs <ArrowRight size={14} />
            </Link>
            <Link href="https://sacactivities.kluniversity.in/auth/login" target="_blank" rel="noopener"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:bg-white/15"
                  style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff' }}>
              Student Dashboard <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
