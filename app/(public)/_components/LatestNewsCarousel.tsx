'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  photo_url: string | null;
  category: string;
}

export function LatestNewsCarousel({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = articles.length;

  function prev() { setActive(i => (i - 1 + count) % count); }
  function next() { setActive(i => (i + 1) % count); }

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setActive(i => (i + 1) % count), 3500);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) {
    return (
      <div className="rounded-2xl p-14 text-center" style={{ background: '#faf6f1', border: '1px solid var(--hairline)' }}>
        <p className="font-display font-medium text-xl mb-1" style={{ color: 'rgba(25,19,19,0.45)' }}>News coming soon</p>
        <p className="text-sm" style={{ color: 'rgba(25,19,19,0.35)' }}>Check back soon for updates from SAC.</p>
      </div>
    );
  }

  const article = articles[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <Link
        href={`/news/${article.slug}`}
        key={article.slug}
        className="group grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
        style={{ border: '1px solid var(--hairline)', background: '#faf6f1' }}>

        <div className="lg:col-span-2 h-56 lg:h-full overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #6a0002 0%, #970003 100%)' }}>
          {article.photo_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={article.photo_url} src={article.photo_url} alt={article.title}
              className="w-full h-full object-cover animate-fade-in" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-2xl font-medium opacity-20" style={{ color: '#fff' }}>KL SAC</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="kicker" style={{ color: '#970003' }}>{article.category}</span>
          </div>
          <h3
            className="font-display font-medium leading-tight mb-3"
            style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)', color: '#191313', letterSpacing: '-0.01em' }}>
            {article.title}
          </h3>
          <p className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all mt-4"
            style={{ color: '#970003' }}>
            Read more <ArrowRight size={13} />
          </p>
        </div>
      </Link>

      {/* Controls */}
      {count > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            aria-label="Previous article"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(25,19,19,0.06)', color: 'rgba(25,19,19,0.5)' }}>
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {articles.map((a, i) => (
              <button
                key={a.slug}
                onClick={() => setActive(i)}
                aria-label={`Show news ${i + 1}`}
                className="transition-all rounded-full"
                style={{
                  height: '6px',
                  width: i === active ? '22px' : '6px',
                  background: i === active ? '#970003' : 'rgba(25,19,19,0.15)',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next article"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(25,19,19,0.06)', color: 'rgba(25,19,19,0.5)' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
