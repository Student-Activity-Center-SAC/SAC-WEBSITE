'use client';
import { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, Layers } from 'lucide-react';

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (target === 0) return;
    const steps = 40;
    const step = Math.ceil(target / steps);
    let current = 0;
    ref.current = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target && ref.current) clearInterval(ref.current);
    }, duration / steps);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [target, duration]);
  return count;
}

interface Stats { clubs: number; students: number; activities: number; }

export default function StatsBar() {
  const [stats, setStats] = useState<Stats>({ clubs: 0, students: 0, activities: 0 });

  useEffect(() => {
    fetch('/api/public/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const clubs      = useCountUp(stats.clubs);
  const students   = useCountUp(stats.students);
  const activities = useCountUp(stats.activities);

  const items = [
    { icon: Layers, label: 'Active Clubs',      value: clubs },
    { icon: Users,  label: 'Registered Students', value: students },
    { icon: BookOpen, label: 'Activities Hosted', value: activities },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {items.map(({ icon: Icon, label, value }) => (
        <div key={label} className="text-center p-6 rounded-2xl border"
             style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <Icon size={28} className="mx-auto mb-2" style={{ color: 'var(--primary)' }} />
          <div className="text-4xl font-extrabold" style={{ color: 'var(--foreground)' }}>
            {value.toLocaleString()}+
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

