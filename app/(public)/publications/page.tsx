import { db } from '@/lib/query-builder';
import { FadeIn } from '../_components/FadeIn';
import { Download, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export const metadata = {
  title: 'Publications',
  description: 'Annual reports, magazines, and research publications from KL SAC.',
};

const TYPE_COLORS: Record<string, string> = {
  'Annual Report': '#8B0000',
  'Magazine':      '#B91C1C',
  'Research':      '#7C0000',
  'Newsletter':    '#991B1B',
};

export default async function PublicationsPage() {
  const { data } = await db
    .from('publications')
    .select('*')
    .order('sort_order', { ascending: true });

  const publications = data ?? [];

  return (
    <>
      <section style={{ background: '#fff', paddingTop: '92px', paddingBottom: '48px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pt-8">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: '#8B0000' }}>
            Publications
          </p>
          <h1
            className="font-black leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            Reports & Publications
          </h1>
        </div>
      </section>

      <section style={{ background: '#F7F7F8' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-16 flex flex-col gap-16">
          {publications.length === 0 && (
            <p className="text-sm text-center py-16" style={{ color: '#A1A1AA' }}>
              No publications yet. Check back soon.
            </p>
          )}

          {publications.map(pub => {
            const typeColor = TYPE_COLORS[pub.type] ?? '#8B0000';
            return (
              <FadeIn key={pub.id}>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#fff', border: '1px solid #E4E4E7', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div className="px-6 sm:px-8 py-6 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: typeColor }}>
                          {pub.type}
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: '#C7C7CC' }}>{pub.year}</span>
                      </div>
                      <h2
                        className="font-black text-xl sm:text-2xl leading-tight mb-2"
                        style={{ color: '#0D0D0D', letterSpacing: '-0.01em' }}>
                        {pub.title}
                      </h2>
                      <p className="text-sm leading-relaxed" style={{ color: '#71717A', maxWidth: '64ch' }}>
                        {pub.description}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${typeColor}15` }}>
                      <BookOpen size={22} style={{ color: typeColor }} />
                    </div>
                  </div>

                  {pub.pdf_url && (
                    <div className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4 flex-wrap" style={{ borderTop: '1px solid #F0F0F0' }}>
                      <p className="text-xs" style={{ color: '#A1A1AA' }}>Interactive ebook · Flip pages to read</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link
                          href={`/ebook/${pub.id}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-80"
                          style={{ background: '#8B0000', color: '#fff' }}>
                          <BookOpen size={13} />
                          Read as Ebook
                        </Link>
                        <a
                          href={pub.pdf_url}
                          download
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:opacity-80"
                          style={{ border: '1.5px solid #8B0000', color: '#8B0000' }}>
                          <Download size={13} />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </>
  );
}
