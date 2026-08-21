import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { db } from '@/lib/query-builder';
import { FadeIn } from '../../_components/FadeIn';

export const dynamic = 'force-dynamic';

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#8B0000', LCH: '#B91C1C', HWB: '#7C0000', ESO: '#991B1B', IIE: '#C53030',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await db.from('stories').select('title, excerpt').eq('slug', slug).single();
  if (!data) return {};
  return { title: `${data.title} — KL SAC Stories`, description: data.excerpt };
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [{ data: story }, { data: allStories }] = await Promise.all([
    db.from('stories').select('*').eq('slug', slug).single(),
    db.from('stories').select('slug, title, student_name, sort_order').order('sort_order', { ascending: true }),
  ]);

  if (!story) notFound();

  const stories = allStories ?? [];
  const idx = stories.findIndex(s => s.slug === slug);
  const next = stories[(idx + 1) % stories.length] ?? null;
  const domainColor = DOMAIN_COLORS[story.domain_code] ?? '#8B0000';

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-10">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(25,19,19,0.4)' }}>
            <ArrowLeft size={12} />
            All Stories
          </Link>

          <span className="text-[10px] font-black uppercase tracking-widest mb-5 block" style={{ color: domainColor }}>
            {story.domain_code} · {story.club_name}
          </span>

          <h1
            className="font-display font-medium leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#191313', letterSpacing: '-0.025em' }}>
            {story.title}
          </h1>

          <div className="flex items-center gap-4">
            <div>
              {story.photo ? (
                <img src={story.photo} alt={story.student_name}
                     className="w-12 h-12 rounded-full object-cover object-top"
                     style={{ border: '2px solid rgba(25,19,19,0.15)' }} />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                     style={{ background: `${domainColor}22`, color: domainColor, border: '2px solid rgba(255,255,255,0.1)' }}>
                  {story.student_name?.charAt(0) ?? '?'}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#fff' }}>{story.student_name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.42)' }}>{story.student_year}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Story photo banner ───────────────────────────────────────── */}
      {story.photo && (
        <div className="w-full" style={{ maxHeight: '420px', overflow: 'hidden' }}>
          <img src={story.photo} alt={story.title}
               className="w-full object-cover object-center"
               style={{ maxHeight: '420px' }} />
        </div>
      )}

      {/* ─── Body ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-10 py-20">
          <FadeIn>
            <p className="text-xl sm:text-2xl font-bold leading-relaxed mb-12 italic" style={{ color: '#3F3F46' }}>
              "{story.excerpt}"
            </p>
            <div className="flex flex-col gap-6">
              {(story.body ?? '').split('\n\n').filter(Boolean).map((para: string, i: number) => (
                <p key={i} className="text-base sm:text-lg leading-relaxed" style={{ color: '#3F3F46' }}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </FadeIn>

          {story.tags && story.tags.length > 0 && (
            <FadeIn>
              <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: '1px solid #E4E4E7' }}>
                {story.tags.map((tag: string) => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: `${domainColor}10`, color: domainColor }}>
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── Next story ───────────────────────────────────────────────── */}
      {next && next.slug !== slug && (
        <section style={{ background: '#F7F7F8' }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-10 py-16">
            <FadeIn>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: '#A1A1AA' }}>
                Next Story
              </p>
              <Link
                href={`/stories/${next.slug}`}
                className="group flex items-center justify-between gap-6 p-6 rounded-2xl transition-shadow hover:shadow-md"
                style={{ background: '#fff', border: '1px solid #E4E4E7' }}>
                <div>
                  <p className="font-black text-lg leading-snug mb-1" style={{ color: '#0D0D0D' }}>{next.title}</p>
                  <p className="text-sm" style={{ color: '#A1A1AA' }}>{next.student_name}</p>
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
