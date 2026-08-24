'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  photo_url: string | null;
  category: string;
  date: string;
}

export function LatestNewsCarousel({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = articles.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setActive(i => (i + 1) % count), 3000);
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
            <span className="text-xs" style={{ color: 'rgba(25,19,19,0.3)' }}>
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h3
            className="font-display font-medium leading-tight mb-3"
            style={{ fontSize: 'clamp(1.15rem, 2vw, 1.6rem)', color: '#191313', letterSpacing: '-0.01em' }}>
            {article.title}
          </h3>
          <p className="text-sm leading-relaxed mb-6 line-clamp-2" style={{ color: 'rgba(25,19,19,0.5)' }}>
            {article.excerpt}
          </p>
          <p className="text-xs font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
            style={{ color: '#970003' }}>
            Read more <ArrowRight size={11} />
          </p>
        </div>
      </Link>

      {/* Indicators */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
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
      )}
    </div>
  );
}
