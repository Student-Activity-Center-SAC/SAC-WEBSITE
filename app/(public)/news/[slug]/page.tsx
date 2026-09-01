import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { db } from '@/lib/query-builder';
import { FadeIn } from '../../_components/FadeIn';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await db.from('news_articles').select('title,excerpt').eq('slug', slug).single();
  if (!data) return {};
  return { title: `${data.title} — KL SAC News`, description: data.excerpt };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: article } = await db
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) notFound();

  const { data: allArticles } = await db
    .from('news_articles')
    .select('slug,title,category')
    .order('date', { ascending: false });

  const articles = allArticles ?? [];
  const idx = articles.findIndex(a => a.slug === slug);
  const next = articles[(idx + 1) % articles.length];

  return (
    <>
      <section style={{ background: '#fff', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-10">
          <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold mb-8 transition-opacity hover:opacity-70" style={{ color: '#A1A1AA' }}>
            <ArrowLeft size={12} /> All News
          </Link>

          {article.photo_url && (
            <div className="w-full rounded-2xl overflow-hidden mb-8 bg-gray-100 flex items-center justify-center">
              <img src={article.photo_url} alt={article.title} className="w-full h-auto" />
            </div>
          )}

          <span className="kicker mb-4" style={{ color: '#8B0000' }}>
            {article.category}
          </span>
          <h1
            className="font-display font-medium leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            {article.title}
          </h1>
        </div>
      </section>

      <section style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-10 py-16">
          <FadeIn>
            <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: '#3F3F46' }}>
              {article.excerpt}
            </p>
            <div className="flex flex-col gap-5">
              {(article.body ?? '').split('\n\n').map((para: string, i: number) => (
                <p key={i} className="text-base sm:text-lg leading-relaxed" style={{ color: '#3F3F46' }}>
                  {para}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {next && next.slug !== slug && (
        <section style={{ background: '#fff' }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-10 py-16">
            <FadeIn>
              <p className="kicker mb-5" style={{ color: '#A1A1AA' }}>
                Continue Reading
              </p>
              <Link
                href={`/news/${next.slug}`}
                className="group flex items-center gap-5 py-6 transition-colors"
                style={{ borderTop: '1px solid #E4E4E7', borderBottom: '1px solid #E4E4E7' }}>
                <div className="flex-1">
                  <span className="kicker mb-1" style={{ color: '#8B0000' }}>
                    {next.category}
                  </span>
                  <h3 className="font-semibold text-base sm:text-lg leading-tight" style={{ color: '#0D0D0D' }}>
                    {next.title}
                  </h3>
                </div>
                <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" style={{ color: '#D1D1D6' }} />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
