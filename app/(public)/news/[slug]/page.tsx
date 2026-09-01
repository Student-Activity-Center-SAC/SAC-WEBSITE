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
      <section className="bg-white pt-24 pb-8">
        <div className="max-w-3xl mx-auto px-5 sm:px-10">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium mb-10 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={16} /> All News
          </Link>

          <div className="mb-8">
            {article.category && article.category.toLowerCase() !== 'general' && (
              <span className="inline-block px-3 py-1 mb-5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold tracking-wider uppercase">
                {article.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 leading-snug tracking-tight">
              {article.title}
            </h1>
          </div>

          {article.photo_url && (
            <div className="w-full rounded-2xl overflow-hidden mb-8 bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
              <img src={article.photo_url} alt={article.title} className="w-full max-h-[500px] object-cover" />
            </div>
          )}
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-10 pb-16">
          <FadeIn>
            {article.excerpt && (
              <p className="text-lg md:text-xl font-normal leading-relaxed mb-8 text-gray-600 border-l-4 border-gray-200 pl-4">
                {article.excerpt}
              </p>
            )}
            <div className="flex flex-col gap-6 text-gray-700 text-base md:text-lg leading-relaxed">
              {(article.body ?? '').split('\n\n').map((para: string, i: number) => (
                <p key={i}>
                  {para}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {next && next.slug !== slug && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-5 sm:px-10 py-16">
            <FadeIn>
              <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-5">
                Continue Reading
              </p>
              <Link
                href={`/news/${next.slug}`}
                className="group flex items-center gap-5 py-6 transition-colors border-y border-gray-100 hover:bg-gray-50 -mx-5 px-5 sm:mx-0 sm:px-5 rounded-xl">
                <div className="flex-1">
                  {next.category && next.category.toLowerCase() !== 'general' && (
                    <span className="inline-block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {next.category}
                    </span>
                  )}
                  <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-tight">
                    {next.title}
                  </h3>
                </div>
                <ArrowRight size={20} className="shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-gray-500" />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
