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

      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map(article => (
                <Link
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  className="group rounded-2xl overflow-hidden flex flex-col bg-white transition-shadow hover:shadow-lg"
                  style={{ border: '1px solid #E4E4E7' }}>
                  
                  <div className="h-48 relative overflow-hidden" style={{ background: 'rgba(139,0,0,0.05)' }}>
                    {article.photo_url ? (
                      <img src={article.photo_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-black text-4xl" style={{ color: '#E4E4E7' }}>KL</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 w-fit" style={{ background: '#FFF0F0', color: '#8B0000' }}>
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-lg leading-snug mb-4" style={{ color: '#0D0D0D' }}>
                      {article.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-bold" style={{ color: '#8B0000' }}>Read full story</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: '#8B0000' }} />
                    </div>
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

