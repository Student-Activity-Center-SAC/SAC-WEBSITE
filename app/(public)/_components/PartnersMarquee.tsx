'use client';

import { useRef, useEffect } from 'react';

export function PartnersMarquee({ partners }: { partners: any[] }) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);
  const drag      = useRef({ active: false, startX: 0, startPos: 0 });
  const rafRef    = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const dur = Math.max(partners.length * 1.6, 8) * 60; // frames per loop

    const tick = () => {
      if (!pausedRef.current && !drag.current.active) {
        const half = track.scrollWidth / 2;
        if (half > 0) {
          posRef.current -= half / dur;
          if (posRef.current <= -half) posRef.current += half;
          track.style.transform = `translateX(${posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [partners.length]);

  const cursor = (c: string) => {
    if (wrapRef.current) wrapRef.current.style.cursor = c;
  };

  const wrap = (pos: number, half: number) => {
    while (pos > 0)     pos -= half;
    while (pos < -half) pos += half;
    return pos;
  };

  // Logos that need white-edge removal + larger size
  const LARGE = ['akshaya patra', 'aster ramesh', 'avanflix', 'green pencil'];
  const isLarge = (name: string) => LARGE.some(k => name.toLowerCase().includes(k));

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden select-none"
      style={{ borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', cursor: 'grab' }}
      onMouseEnter={() => { pausedRef.current = true; cursor('grab'); }}
      onMouseLeave={() => { pausedRef.current = false; drag.current.active = false; cursor('grab'); }}
      onMouseDown={e => {
        drag.current = { active: true, startX: e.clientX, startPos: posRef.current };
        cursor('grabbing');
        e.preventDefault();
      }}
      onMouseMove={e => {
        if (!drag.current.active || !trackRef.current) return;
        const half   = trackRef.current.scrollWidth / 2;
        const newPos = wrap(drag.current.startPos + (e.clientX - drag.current.startX), half);
        posRef.current = newPos;
        trackRef.current.style.transform = `translateX(${newPos}px)`;
      }}
      onMouseUp={() => { drag.current.active = false; cursor('grab'); }}
    >
      <div ref={trackRef} className="flex" style={{ width: 'max-content' }}>
        {[...partners, ...partners].map((p: any, i: number) => {
          const large = isLarge(p.partner_name ?? '');
          return (
            <div
              key={`${p.id}-${i}`}
              className="flex items-center justify-center shrink-0 px-10 py-7"
              style={{ borderRight: '1px solid var(--hairline)' }}
            >
              <img loading="lazy"
                src={p.partner_image}
                alt={p.partner_name}
                className="object-contain"
                style={{
                  height:       large ? '150px' : '72px',
                  maxWidth:     large ? '380px' : '220px',
                  mixBlendMode: large ? 'multiply' : 'normal',
                }}
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
