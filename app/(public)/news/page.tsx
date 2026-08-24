import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/query-builder';
import { FadeIn } from '../_components/FadeIn';

export const revalidate = 0;

export const metadata = {
  title: 'News & Updates',
  description: 'Latest news, announcements, and updates from KL SAC.',
};

export default async function NewsPage() {
  const { data } = await db
    .from('news_articles')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('date', { ascending: false });

  const articles = data ?? [];
  // The starred article is the big highlight; fall back to first if none starred
  const featured = articles.find(a => a.featured) ?? articles[0];
  const rest = articles.filter(a => a.slug !== featured?.slug);

  return (
    <>
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-4" style={{ color: '#970003' }}>
            News & Updates
          </p>
          <h1
            className="font-display font-medium leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            What's Happening at SAC.
          </h1>
          <p className="text-lg" style={{ color: '#71717A', maxWidth: '54ch' }}>
            Announcements, activity wrap-ups, and institutional updates from KL SAC.
          </p>
        </div>
      </section>

      {featured && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 pb-16">
            <FadeIn>
              <Link
                href={`/news/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
                style={{ border: '1px solid #E4E4E7' }}>
                <div className="lg:col-span-2 lg:self-start aspect-square overflow-hidden rounded-2xl" style={{ background: 'rgba(139,0,0,0.05)' }}>
                  {featured.photo_url ? (
                    <img src={featured.photo_url} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-black text-4xl" style={{ color: '#E4E4E7' }}>KL</span>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
                  <span className="kicker mb-3" style={{ color: '#8B0000' }}>
                    {featured.category}
                  </span>
                  <h2
                    className="font-display font-medium leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.25rem, 2.4vw, 1.9rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                    {featured.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717A' }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#A1A1AA' }}>
                      {new Date(featured.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#8B0000' }}>
                      Read more <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div style={{ borderTop: '1px solid #E4E4E7' }}>
              {rest.map(article => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="group flex flex-col sm:flex-row gap-5 sm:gap-8 py-7 transition-colors hover:bg-white/50"
                  style={{ borderBottom: '1px solid #E4E4E7' }}>
                  <div className="sm:w-20 shrink-0">
                    <p className="font-black text-2xl leading-none" style={{ color: '#0D0D0D' }}>
                      {new Date(article.date).getDate()}
                    </p>
                    <p className="text-[10px] font-bold uppercase mt-0.5" style={{ color: '#A1A1AA' }}>
                      {new Date(article.date).toLocaleString('en-IN', { month: 'short' })}
                      {' '}{new Date(article.date).getFullYear().toString().slice(2)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="kicker mb-1" style={{ color: '#8B0000' }}>
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-base sm:text-lg leading-snug mb-2" style={{ color: '#0D0D0D' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm line-clamp-2" style={{ color: '#71717A' }}>
                      {article.excerpt}
                    </p>
                  </div>
                  {article.photo_url && (
                    <div className="hidden sm:block w-24 h-24 shrink-0 rounded-2xl overflow-hidden">
                      <img src={article.photo_url} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="hidden sm:flex items-center shrink-0">
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: '#D1D1D6' }} />
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

