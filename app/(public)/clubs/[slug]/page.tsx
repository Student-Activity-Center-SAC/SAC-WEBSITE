import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ClubActivities from '../_components/ClubActivities';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2,
  Camera, Calendar, MapPin, Trophy, Users,
} from 'lucide-react';
import { db } from '@/lib/query-builder';
import { getDomainByCode } from '@/lib/content/domains';
import { FadeIn } from '../../_components/FadeIn';
import { ActivityCard, Activity } from '../../_components/ActivityCard';

export const revalidate = 60;

function toSlug(name: string) {
  return name?.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') ?? '';
}

/** Safely parse a JSON column (string | array | null) → string[] */
function parseJsonCol(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

function safeUrl(url: any): string | null {
  if (typeof url !== 'string' || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/')) return trimmed;
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return null;
  }
}

async function getClubBySlug(slug: string) {
  const { data: all } = await db.from('clubs').select('*').order('id', { ascending: true });
  const raw = (all ?? []).find((c: any) => toSlug(c.club_name) === slug);
  if (!raw) return null;
  return {
    id:             raw.id,
    slug,
    name:           raw.club_name ?? '',
    domain_code:    raw.club_domain ?? '',
    tagline:        raw.club_description ?? '',
    logo_url:       safeUrl(raw.club_logo),
    about:          raw.club_about ? raw.club_about.split('\n').filter(Boolean) : [],
    gallery:        parseJsonCol(raw.gallery).map(safeUrl).filter(Boolean) as string[],
    competencies:   parseJsonCol(raw.competencies),
    activities_list:parseJsonCol(raw.activities_list),
    api_categories: parseJsonCol(raw.api_categories),
    purpose:        (raw.purpose ?? null) as string | null,
    cover_url:      safeUrl(raw.cover_url),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) return {};
  return { title: club.name, description: club.tagline };
}

const OFFICE_ROLES = [
  { role: 'Club Coordinator', abbr: 'CC'  },
  { role: 'Vice-Coordinator', abbr: 'VC'  },
  { role: 'Secretary',        abbr: 'SEC' },
  { role: 'Treasurer',        abbr: 'TR'  },
];

export default async function ClubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const domain = getDomainByCode(club.domain_code);
  if (!domain) notFound();

  const [achievementsRes, membersRes] = await Promise.all([
    db.from('achievements').select('*').eq('club_name', club.name).order('year', { ascending: false }),
    db.from('council_members').select('*').order('sort_order', { ascending: true }),
  ]);

  const achievements = (achievementsRes.data ?? []).map((ach: any) => ({
    ...ach,
    photo: safeUrl(ach.photo)
  }));

  const galleryPhotos: string[] = Array.isArray(club.gallery) ? club.gallery : [];
  const about: string[]         = Array.isArray(club.about)   ? club.about   : [];
  const competencies: string[]  = Array.isArray(club.competencies) ? club.competencies : [];
  const activitiesList: string[]= Array.isArray(club.activities_list) ? club.activities_list : [];
  const apiCategories: string[] = Array.isArray(club.api_categories) ? club.api_categories : [];

  const officeBearers = (membersRes.data ?? []).filter((m: any) => 
    m.club_lead === club.name || parseJsonCol(m.clubs_list).includes(club.name)
  );

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '92px',
          paddingBottom: '72px',
          background: club.cover_url
            ? undefined
            : `linear-gradient(135deg, ${domain.color}18 0%, ${domain.color}06 100%)`,
          borderBottom: `1px solid ${domain.color}18`,
          position: 'relative',
          overflow: 'hidden',
        }}>
        {club.cover_url && (
          <>
            <Image
              src={club.cover_url}
              alt={club.name}
              fill
              priority
              style={{
                objectFit: 'cover', objectPosition: 'center',
              }}
            />
            <div
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${domain.color}cc 0%, rgba(0,0,0,0.65) 100%)`,
              }}
            />
          </>
        )}

        <div className="w-full px-6 sm:px-12 xl:px-20" style={{ position: 'relative' }}>
          <Link
            href="/clubs"
            className="inline-flex items-center gap-2 text-xs font-bold mb-8 transition-opacity hover:opacity-70"
            style={{ color: club.cover_url ? '#fff' : domain.color }}>
            <ArrowLeft size={12} />
            {domain.shortName}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            {club.logo_url && (
              <Image
                src={club.logo_url}
                alt={club.name}
                width={48}
                height={48}
                className="rounded-xl object-contain"
                style={{
                  background: club.cover_url ? 'rgba(255,255,255,0.15)' : domain.accentBg,
                  padding: '6px',
                }}
              />
            )}
            <span
              className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{
                background: club.cover_url ? 'rgba(255,255,255,0.2)' : domain.accentBg,
                color:      club.cover_url ? '#fff' : domain.color,
              }}>
              {domain.code}
            </span>
          </div>

          <h1
            className="font-display font-medium leading-tight mb-3"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              color: club.cover_url ? '#fff' : '#0D0D0D',
              letterSpacing: '-0.025em',
            }}>
            {club.name}
          </h1>

          <p className="text-lg sm:text-xl font-medium mb-6 italic"
             style={{ color: club.cover_url ? 'rgba(255,255,255,0.85)' : domain.color }}>
            "{club.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="https://sacactivities.kluniversity.in/auth/login"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
              style={{ background: domain.color, color: '#fff' }}>
              Register on Student Dashboard
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About ────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <FadeIn>
                <p className="kicker mb-6" style={{ color: domain.color }}>
                  About the Club
                </p>
                <div className="flex flex-col gap-5">
                  {about.map((para, i) => (
                    <p key={i} className="text-base sm:text-lg leading-relaxed" style={{ color: '#3F3F46' }}>
                      {para}
                    </p>
                  ))}
                  {about.length === 0 && (
                    <p className="text-base leading-relaxed" style={{ color: '#A1A1AA' }}>
                      Information about this club will be added soon.
                    </p>
                  )}
                </div>
              </FadeIn>
            </div>

            <div>
              <FadeIn delay={0.1}>
                {club.purpose && (
                  <div className="rounded-2xl p-6 mb-6" style={{ background: '#F7F7F8', border: '1px solid #E4E4E7' }}>
                    <p className="kicker mb-3" style={{ color: '#A1A1AA' }}>
                      Our Purpose
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#3F3F46' }}>
                      {club.purpose}
                    </p>
                  </div>
                )}

                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ border: '1px solid #E4E4E7' }}>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                    style={{ background: domain.accentBg, color: domain.color }}>
                    {domain.code}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-wider" style={{ color: domain.color }}>
                      {domain.shortName} Domain
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>
                      {domain.tagline}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Activity Gallery ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="kicker mb-3" style={{ color: domain.color }}>
                  Club Gallery
                </p>
                <h2
                  className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  Behind the scenes.
                </h2>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            {galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {galleryPhotos.map((src, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden group"
                    style={{ aspectRatio: '3/2' }}>
                    <Image
                      src={src}
                      alt={`${club.name} activity photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2"
                      style={{
                        aspectRatio: '3/2',
                        background: i % 2 === 0 ? `${domain.color}10` : `${domain.color}07`,
                        border: `1.5px dashed ${domain.color}22`,
                      }}>
                      <Camera size={24} style={{ color: `${domain.color}38` }} />
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

      {/* ─── Competencies ─────────────────────────────────────────────── */}
      {competencies.length > 0 && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <p className="kicker mb-8" style={{ color: domain.color }}>
                Competencies You'll Develop
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {competencies.map(c => (
                  <div key={c} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: domain.color }} />
                    <span className="text-sm font-semibold" style={{ color: '#3F3F46' }}>{c}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <Suspense fallback={
        <section style={{ background: '#F7F7F8' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20 text-center">
            <p className="text-sm font-semibold" style={{ color: '#A1A1AA' }}>Loading activities...</p>
          </div>
        </section>
      }>
        <ClubActivities slug={slug} clubName={club.name} domainColor={domain.color} domainAccentBg={domain.accentBg} apiCategories={apiCategories} />
      </Suspense>

      {/* ─── Achievements ─────────────────────────────────────────────── */}
      {achievements.length > 0 && (
        <section style={{ background: '#F7F7F8' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <p className="kicker mb-3" style={{ color: domain.color }}>
                    Club Achievements
                  </p>
                  <h2
                    className="font-display font-medium leading-tight"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                    Honours & recognition.
                  </h2>
                </div>
                <Link
                  href="/achievements"
                  className="text-xs font-bold hover:opacity-70 transition-opacity"
                  style={{ color: domain.color }}>
                  All achievements →
                </Link>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach: any) => (
                  <div key={ach.id} className="rounded-2xl p-6 flex flex-col" style={{ background: '#fff', border: '1px solid #E4E4E7' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full" style={{ background: domain.accentBg, color: domain.color }}>
                        {ach.level}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: '#A1A1AA' }}>{ach.year}</span>
                    </div>
                    {ach.photo && (
                      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden">
                        <Image src={ach.photo} alt={ach.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                    )}
                    <h3 className="font-bold text-base mb-2" style={{ color: '#0D0D0D' }}>{ach.title}</h3>
                    {ach.organization && (
                      <p className="text-xs font-semibold mb-2" style={{ color: domain.color }}>{ach.organization}</p>
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>{ach.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── Office Bearers ───────────────────────────────────────────── */}
      {officeBearers.length > 0 && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <p className="kicker mb-3" style={{ color: domain.color }}>
                    Office Bearers
                  </p>
                  <h2
                    className="font-display font-medium leading-tight"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                    The team behind the club.
                  </h2>
                </div>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {officeBearers.map((member: any) => {
                  const roleAbbr = OFFICE_ROLES.find(r => member.role?.includes(r.role))?.abbr || member.role?.substring(0, 2).toUpperCase() || 'LDR';
                  return (
                    <div
                      key={member.id}
                      className="rounded-2xl p-6 flex flex-col items-center text-center gap-4"
                      style={{ background: '#F7F7F8', border: '1px solid #E4E4E7' }}>
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center font-black text-sm relative overflow-hidden"
                        style={{ background: domain.accentBg, color: domain.color }}>
                        {member.photo ? (
                          <Image src={safeUrl(member.photo) || ''} alt={member.name} fill className="object-cover" />
                        ) : (
                          roleAbbr
                        )}
                      </div>
                      <div>
                        <p className="font-black text-sm mb-0.5" style={{ color: '#0D0D0D' }}>{member.name}</p>
                        <p className="text-xs font-semibold" style={{ color: '#A1A1AA' }}>{member.role || 'Club Leader'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── Join CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Users size={16} style={{ color: domain.color }} />
                </div>
                <h2
                  className="font-display font-medium mb-2 leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em' }}>
                  Ready to join {club.name}?
                </h2>
                <p style={{ color: 'rgba(25,19,19,0.55)' }}>
                  Register on the Student Dashboard to join this club and be part of the community.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 shrink-0">
                <Link
                  href="https://sacactivities.kluniversity.in/auth/login"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-[1.03]"
                  style={{ background: '#970003', color: '#fff' }}>
                  Join on Dashboard
                  <ArrowUpRight size={14} />
                </Link>
                <Link
                  href="/clubs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all hover:opacity-80"
                  style={{ background: '#fff', color: '#191313', border: '1px solid var(--hairline)' }}>
                  Browse all clubs
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
