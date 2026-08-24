import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { db } from '@/lib/query-builder';
import { FadeIn, Stagger } from '../_components/FadeIn';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Stories',
  description: 'Real stories from KL SAC students — the experiences, growth, and impact that shaped their university years.',
};

const DOMAIN_COLORS: Record<string, string> = {
  TEC: '#8B0000', LCH: '#B91C1C', HWB: '#7C0000', ESO: '#991B1B', IIE: '#C53030',
};

export default async function StoriesPage() {
  const { data: stories } = await db
    .from('stories')
    .select('*')
    .order('sort_order', { ascending: true });

  const all = stories ?? [];
  const featured = all.find(s => s.featured) ?? all[0] ?? null;
  const rest = all.filter(s => s.slug !== featured?.slug);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Student Stories</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '24ch' }}>
            The Experiences That Shape Careers.
          </h1>
          <p className="text-lg leading-relaxed mb-5" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '56ch' }}>
            Behind every achievement is a student who chose to engage. These are their stories.
          </p>
        </div>
      </section>

      {/* ─── Featured Story ───────────────────────────────────────────── */}
      {featured && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-6" style={{ color: '#8B0000' }}>
                Featured Story
              </p>
              <Link
                href={`/stories/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden transition-shadow hover:shadow-xl"
                style={{ border: '1px solid #E4E4E7' }}>

                <div
                  className="lg:col-span-2 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${DOMAIN_COLORS[featured.domain_code] ?? '#8B0000'}18, ${DOMAIN_COLORS[featured.domain_code] ?? '#8B0000'}08)`, aspectRatio: '1/1' }}>
                  {featured.photo ? (
                    <img src={featured.photo} alt={featured.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-black" style={{ color: `${DOMAIN_COLORS[featured.domain_code] ?? '#D1D1D6'}30` }}>
                        {featured.domain_code}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest mb-4 inline-block"
                    style={{ color: DOMAIN_COLORS[featured.domain_code] ?? '#8B0000' }}>
                    {featured.domain_code} · {featured.club_name}
                  </span>
                  <h2
                    className="font-display font-medium leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                    {featured.title}
                  </h2>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: '#71717A' }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#0D0D0D' }}>{featured.student_name}</p>
                      <p className="text-xs" style={{ color: '#A1A1AA' }}>{featured.student_year}</p>
                    </div>
                    <div className="ml-auto">
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" style={{ color: '#D1D1D6' }} />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ─── Story Grid ───────────────────────────────────────────────── */}
      {rest.length > 0 && (
        <section style={{ background: '#F7F7F8' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <FadeIn>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-10" style={{ color: '#A1A1AA' }}>
                More Stories
              </p>
            </FadeIn>

            <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map(story => (
                <Link
                  key={story.slug}
                  href={`/stories/${story.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden transition-all hover:shadow-md"
                  style={{ background: '#fff', border: '1px solid #E4E4E7' }}>

                  <div
                    className="overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${DOMAIN_COLORS[story.domain_code] ?? '#E4E4E7'}18, ${DOMAIN_COLORS[story.domain_code] ?? '#E4E4E7'}08)`, aspectRatio: '1/1' }}>
                    {story.photo ? (
                      <img src={story.photo} alt={story.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-black" style={{ color: '#E4E4E7' }}>{story.domain_code}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[9px] font-black tracking-widest uppercase mb-2"
                          style={{ color: DOMAIN_COLORS[story.domain_code] ?? '#8B0000' }}>
                      {story.domain_code} · {story.club_name}
                    </span>
                    <h3 className="font-bold text-base leading-snug mb-2 flex-1" style={{ color: '#0D0D0D' }}>
                      {story.title}
                    </h3>
                    <p className="text-xs mb-4 line-clamp-2" style={{ color: '#71717A' }}>
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold" style={{ color: '#3F3F46' }}>{story.student_name}</p>
                        <p className="text-[10px]" style={{ color: '#A1A1AA' }}>{story.student_year}</p>
                      </div>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" style={{ color: '#D1D1D6' }} />
                    </div>
                  </div>
                </Link>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {all.length === 0 && (
        <section style={{ background: '#F7F7F8' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-24 text-center">
            <p className="font-bold text-lg mb-2" style={{ color: '#71717A' }}>No stories yet.</p>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>Check back soon for student stories.</p>
          </div>
        </section>
      )}
    </>
  );
}
