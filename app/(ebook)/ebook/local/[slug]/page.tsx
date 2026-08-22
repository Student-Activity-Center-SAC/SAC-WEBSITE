import { notFound } from 'next/navigation';
import { LOCAL_PUBLICATIONS } from '@/lib/local-publications';
import { EbookReader } from '../../../EbookReader';

export function generateStaticParams() {
  return LOCAL_PUBLICATIONS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pub = LOCAL_PUBLICATIONS.find(p => p.slug === slug);
  return { title: pub ? `${pub.title} — Read` : 'Ebook Reader' };
}

export default async function LocalEbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pub = LOCAL_PUBLICATIONS.find(p => p.slug === slug);
  if (!pub) notFound();

  return (
    <EbookReader
      pdfUrl={pub.pdfPath}
      title={pub.title}
      year={pub.year}
      type={pub.type}
    />
  );
}
