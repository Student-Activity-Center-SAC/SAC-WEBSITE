'use client';

import { useEffect, useRef, useState } from 'react';

function parseValue(raw: string): { target: number; suffix: string } {
  const match = raw.match(/^(\d+)(\D*)$/);
  if (!match) return { target: 0, suffix: raw };
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

interface StatCounterProps {
  value: string;
  label: string;
  /** ms, default 1600 */
  duration?: number;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
  className?: string;
}

export default function StatCounter({
  value,
  label,
  duration = 1600,
  style,
  labelStyle,
  valueStyle,
  className,
}: StatCounterProps) {
  const { target, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration]);

  return (
    <div ref={ref} style={style} className={className}>
      <div
        className="font-display font-medium leading-none mb-2 tabular-nums"
        style={{
          fontSize: 'clamp(2.2rem, 4.5vw, 3.25rem)',
          color: '#970003',
          letterSpacing: '-0.03em',
          ...valueStyle,
        }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[13px] font-medium" style={{ color: 'rgba(25,19,19,0.45)', ...labelStyle }}>
        {label}
      </div>
    </div>
  );
}
