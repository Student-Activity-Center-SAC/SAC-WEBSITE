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
      {/* ── Hero Image (full-width, top) ── */}
      {article.photo_url && (
        <div className="w-full" style={{ paddingTop: '72px', background: '#f5f0eb' }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-10 pt-8 pb-0">
            <div className="w-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(25,19,19,0.08)' }}>
              <img
                src={article.photo_url}
                alt={article.title}
                className="w-full object-cover"
                style={{ maxHeight: '400px', objectPosition: 'center' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <section style={{ background: article.photo_url ? '#f5f0eb' : '#f5f0eb', paddingTop: article.photo_url ? '24px' : '100px', paddingBottom: '28px' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-10">

          {!article.photo_url && (
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 mb-8 font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#970003', fontSize: '0.75rem' }}>
              <ArrowLeft size={12} /> All News
            </Link>
          )}

          {article.photo_url && (
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 mb-5 font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#970003', fontSize: '0.75rem' }}>
              <ArrowLeft size={12} /> All News
            </Link>
          )}

          {/* Category */}
          {article.category && article.category.toLowerCase() !== 'general' && (
            <span
              className="inline-block px-2.5 py-0.5 mb-3 rounded-full font-bold tracking-[0.12em] uppercase"
              style={{ background: '#97000312', color: '#970003', fontSize: '0.65rem' }}>
              {article.category}
            </span>
          )}

          {/* Title — much smaller */}
          <h1
            className="font-display font-medium leading-snug mb-2"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.65rem)', color: '#191313', letterSpacing: '-0.018em' }}>
            {article.title}
          </h1>

          {/* Date */}
          {article.date && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(25,19,19,0.38)', fontWeight: 500 }}>
              {new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>
      </section>

      {/* ── Body ── */}
      <section className="bg-white">
        <div className="max-w-2xl mx-auto px-5 sm:px-10 py-8">
          <FadeIn>
            {/* Excerpt / lead */}
            {article.excerpt && (
              <p
                className="leading-relaxed mb-5 font-medium"
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(25,19,19,0.7)',
                  borderLeft: '3px solid #97000340',
                  paddingLeft: '12px',
                }}>
                {article.excerpt}
              </p>
            )}

            {/* Body paragraphs */}
            <div
              className="flex flex-col gap-4"
              style={{ color: 'rgba(25,19,19,0.6)', fontSize: '0.8rem', lineHeight: '1.8' }}>
              {(article.body ?? '').split('\n\n').filter(Boolean).map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Next Article ── */}
      {next && next.slug !== slug && (
        <section style={{ background: '#f5f0eb', borderTop: '1px solid rgba(25,19,19,0.08)' }}>
          <div className="max-w-2xl mx-auto px-5 sm:px-10 py-8">
            <FadeIn>
              <p
                className="font-bold tracking-[0.16em] uppercase mb-3"
                style={{ fontSize: '0.65rem', color: 'rgba(25,19,19,0.3)' }}>
                Continue Reading
              </p>
              <Link
                href={`/news/${next.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md"
                style={{ background: '#fff', border: '1px solid rgba(25,19,19,0.08)' }}>
                <div className="flex-1 min-w-0">
                  {next.category && next.category.toLowerCase() !== 'general' && (
                    <span
                      className="font-bold uppercase tracking-widest mb-1 block"
                      style={{ fontSize: '0.6rem', color: '#970003' }}>
                      {next.category}
                    </span>
                  )}
                  <h3
                    className="font-medium leading-snug"
                    style={{ fontSize: '0.85rem', color: '#191313' }}>
                    {next.title}
                  </h3>
                </div>
                <ArrowRight
                  size={15}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                  style={{ color: '#97000350' }}
                />
              </Link>
            </FadeIn>
          </div>
        </section>
      )}
    </>
  );
}
