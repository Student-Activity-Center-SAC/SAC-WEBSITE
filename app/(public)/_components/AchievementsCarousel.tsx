'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  International: { bg: 'rgba(151,0,3,0.1)', color: '#970003' },
  National:      { bg: 'rgba(151,0,3,0.1)', color: '#970003' },
  State:         { bg: 'rgba(151,0,3,0.06)', color: '#b30004' },
  University:    { bg: '#F4F4F5',            color: '#52525B' },
};

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#3B82F6', LCH: '#8B5CF6', HWB: '#10B981', ESO: '#F59E0B', IIE: '#EF4444',
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  level: string;
  domain_code: string;
  club_name: string;
  year: string | number;
  photo?: string | null;
  organization?: string | null;
}

export function AchievementsCarousel({ achievements }: { achievements: Achievement[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = achievements.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setActive(i => (i + 1) % count), 3000);
    return () => clearInterval(t);
  }, [count, paused]);

  function prev() { setActive(i => (i - 1 + count) % count); }
  function next() { setActive(i => (i + 1) % count); }

  if (count === 0) {
    return (
      <div className="rounded-2xl p-14 text-center" style={{ background: '#faf6f1', border: '1px solid var(--hairline)' }}>
        <Trophy size={32} className="mx-auto mb-4" style={{ color: 'rgba(25,19,19,0.2)' }} />
        <p className="font-display font-medium text-xl mb-1" style={{ color: 'rgba(25,19,19,0.45)' }}>Achievements coming soon</p>
        <p className="text-sm" style={{ color: 'rgba(25,19,19,0.35)' }}>Check back soon for student milestones.</p>
      </div>
    );
  }

  const ach = achievements[active];
  const levelStyle  = LEVEL_COLORS[ach.level]        ?? LEVEL_COLORS.University;
  const domainColor = DOMAIN_COLORS[ach.domain_code] ?? '#970003';

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Card */}
      <div
        key={ach.id}
        className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--hairline)', background: '#faf6f1' }}>

        {/* Photo / placeholder */}
        <div className="lg:col-span-2 h-56 lg:h-full overflow-hidden relative"
             style={{ background: 'linear-gradient(135deg, #6a0002 0%, #970003 100%)' }}>
          {ach.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={ach.photo} src={ach.photo} alt={ach.title}
                 className="w-full h-full object-cover animate-fade-in" loading="lazy" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-8">
              <Trophy size={40} style={{ color: 'rgba(255,255,255,0.35)' }} />
              <span
                className="font-display font-medium text-5xl tabular-nums leading-none"
                style={{ color: 'rgba(255,255,255,0.2)' }}>
                {ach.year}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: levelStyle.bg, color: levelStyle.color }}>
              {ach.level}
            </span>
            {ach.domain_code && (
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: domainColor }}>
                {ach.domain_code}
                {ach.club_name ? ` · ${ach.club_name}` : ''}
              </span>
            )}
            {ach.year && !ach.photo && (
              <span className="text-xs ml-auto" style={{ color: 'rgba(25,19,19,0.3)' }}>{ach.year}</span>
            )}
          </div>

          <h3
            className="font-display font-medium leading-tight mb-3"
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)', color: '#191313', letterSpacing: '-0.01em' }}>
            {ach.title}
          </h3>

          {ach.description && (
            <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: 'rgba(25,19,19,0.5)' }}>
              {ach.description}
            </p>
          )}

          {ach.organization && (
            <p className="text-xs font-semibold" style={{ color: 'rgba(25,19,19,0.35)' }}>
              {ach.organization}
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      {count > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Left arrow */}
          <button
            onClick={prev}
            aria-label="Previous achievement"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(25,19,19,0.06)', color: 'rgba(25,19,19,0.5)' }}>
            <ChevronLeft size={18} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {achievements.map((a, i) => (
              <button
                key={a.id}
                onClick={() => setActive(i)}
                aria-label={`Achievement ${i + 1}`}
                className="transition-all rounded-full"
                style={{
                  height: '6px',
                  width: i === active ? '22px' : '6px',
                  background: i === active ? '#970003' : 'rgba(25,19,19,0.15)',
                }}
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            aria-label="Next achievement"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(25,19,19,0.06)', color: 'rgba(25,19,19,0.5)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
