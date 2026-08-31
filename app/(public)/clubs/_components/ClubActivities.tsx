"use client";

import { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { ActivityCard, Activity } from '../../_components/ActivityCard';
import { FadeIn } from '../../_components/FadeIn';

function toSlug(name: string) {
  return name?.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') ?? '';
}

interface Props {
  slug: string;
  clubName: string;
  domainColor: string;
  domainAccentBg: string;
  apiCategories: string[];
}

export default function ClubActivities({ slug, clubName, domainColor, domainAccentBg, apiCategories }: Props) {
  const [clubUpcoming, setUpcoming] = useState<Activity[]>([]);
  const [clubCompleted, setCompleted] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const [upRes, compRes] = await Promise.all([
          fetch('https://sacactivities.kluniversity.in/api/public/activities/upcoming').then(r => r.json()).catch(() => ({ activities: [] })),
          fetch('https://sacactivities.kluniversity.in/api/public/activities/completed').then(r => r.json()).catch(() => ({ activities: [] })),
        ]);

        const allUp = Array.isArray(upRes.activities) ? upRes.activities : [];
        const allComp = Array.isArray(compRes.activities) ? compRes.activities : [];

        const isClubActivity = (act: Activity) => {
          return toSlug(act.club_name || '') === slug || toSlug(act.category || '') === slug || apiCategories.includes(act.category);
        };

        setUpcoming(allUp.filter(isClubActivity));
        setCompleted(allComp.filter(isClubActivity));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [slug, apiCategories]);

  return (
    <>
      {/* ─── Upcoming Activities ─────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="kicker mb-3" style={{ color: domainColor }}>
                  Upcoming Activities
                </p>
                <h2
                  className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  2026-27 ACADEMIC YEAR
                </h2>
              </div>
              {clubUpcoming.length > 0 && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: domainAccentBg, color: domainColor }}>
                  {clubUpcoming.length} upcoming
                </span>
              )}
            </div>
          </FadeIn>

          {loading ? (
            <div className="rounded-2xl p-14 flex flex-col items-center justify-center text-center"
                 style={{ background: '#fff', border: '1.5px dashed #D1D1D6' }}>
              <Loader2 size={32} className="mx-auto mb-4 animate-spin" style={{ color: '#D1D1D6' }} />
              <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>
                Loading activities...
              </p>
            </div>
          ) : clubUpcoming.length > 0 ? (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clubUpcoming.map((act: any) => (
                  <ActivityCard key={act.code} act={act} completed={false} />
                ))}
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="rounded-2xl p-14 text-center"
                   style={{ background: '#fff', border: '1.5px dashed #D1D1D6' }}>
                <Calendar size={32} className="mx-auto mb-4" style={{ color: '#D1D1D6' }} />
                <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>
                  No upcoming activities.
                </p>
                <p className="text-xs" style={{ color: '#A1A1AA' }}>
                  Check back soon for new events from {clubName}.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── Completed Activities ────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="kicker mb-3" style={{ color: domainColor }}>
                  Past Events
                </p>
                <h2
                  className="font-display font-medium leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                  2026-27 ACADEMIC YEAR
                </h2>
              </div>
              {clubCompleted.length > 0 && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: domainAccentBg, color: domainColor }}>
                  {clubCompleted.length} completed
                </span>
              )}
            </div>
          </FadeIn>

          {loading ? (
            <div className="rounded-2xl p-14 flex flex-col items-center justify-center text-center"
                 style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
              <Loader2 size={32} className="mx-auto mb-4 animate-spin" style={{ color: '#D1D1D6' }} />
              <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>
                Loading past events...
              </p>
            </div>
          ) : clubCompleted.length > 0 ? (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clubCompleted.map((act: any) => (
                  <ActivityCard key={act.code} act={act} completed={true} />
                ))}
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="rounded-2xl p-14 text-center"
                   style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
                <CheckCircle2 size={32} className="mx-auto mb-4" style={{ color: '#D1D1D6' }} />
                <p className="font-bold text-sm mb-1" style={{ color: '#71717A' }}>
                  No completed activities yet.
                </p>
                <p className="text-xs" style={{ color: '#A1A1AA' }}>
                  Past events will appear here once they conclude.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
