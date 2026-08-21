import { db } from '@/lib/query-builder';
import { FadeIn } from '../_components/FadeIn';
import { Trophy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Achievements',
  description: 'Recognition, milestones, and achievements from KL SAC clubs and students.',
};

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#8B0000', LCH: '#B91C1C', HWB: '#7C0000', ESO: '#991B1B', IIE: '#C53030',
};

const LEVEL_STYLES: Record<string, { bg: string; color: string }> = {
  International: { bg: 'rgba(139,0,0,0.08)', color: '#8B0000' },
  National:      { bg: 'rgba(139,0,0,0.08)', color: '#8B0000' },
  State:         { bg: 'rgba(124,0,0,0.08)', color: '#7C0000' },
  University:    { bg: '#F4F4F5',            color: '#52525B' },
};

export default async function AchievementsPage() {
  const { data } = await db
    .from('achievements')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false });

  const achievements = data ?? [];

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Achievements</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '18ch' }}>
            What Our Students Have Built.
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '56ch' }}>
            Competitions won, recognitions earned, and milestones crossed — by KL SAC students.
          </p>
        </div>
      </section>

      {/* ─── Achievements list ────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            {achievements.length === 0 ? (
              <div className="rounded-2xl border p-20 text-center" style={{ borderColor: '#E4E4E7' }}>
                <Trophy size={36} className="mx-auto mb-4" style={{ color: '#D1D1D6' }} />
                <p className="font-bold text-lg mb-1" style={{ color: '#0D0D0D' }}>No achievements published yet.</p>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  Check back soon — our students are always earning new milestones.
                </p>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid #E4E4E7' }}>
                {achievements.map((ach: any) => {
                  const domainColor = DOMAIN_COLORS[ach.domain_code] ?? '#8B0000';
                  const levelStyle  = LEVEL_STYLES[ach.level]        ?? LEVEL_STYLES.University;
                  return (
                    <div
                      key={ach.id}
                      className="flex flex-col sm:flex-row gap-6 sm:gap-8 py-8"
                      style={{ borderBottom: '1px solid #E4E4E7' }}>

                      {ach.photo ? (
                        <div className="sm:w-48 shrink-0">
                          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                            <img src={ach.photo} alt={ach.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </div>
                      ) : (
                        <div className="sm:w-16 shrink-0">
                          <span className="font-black text-base" style={{ color: '#0D0D0D' }}>{ach.year}</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {ach.photo && (
                          <p className="font-black text-xs mb-2" style={{ color: '#A1A1AA' }}>{ach.year}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                            style={{ background: levelStyle.bg, color: levelStyle.color }}>
                            {ach.level}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: domainColor }}>
                            {ach.domain_code} · {ach.club_name}
                          </span>
                        </div>
                        <h3 className="font-bold text-base sm:text-lg leading-snug mb-2" style={{ color: '#0D0D0D' }}>
                          {ach.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#71717A' }}>
                          {ach.description}
                        </p>
                        {ach.organization && (
                          <p className="text-xs mt-2 font-semibold" style={{ color: '#A1A1AA' }}>
                            {ach.organization}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </FadeIn>
        </div>
      </section>
    </>
  );
}
