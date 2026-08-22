import { notFound } from 'next/navigation';
import { db } from '@/lib/query-builder';
import { EbookReader } from '../../EbookReader';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await db.from('publications').select('title').eq('id', id).single();
  return { title: data?.title ? `${data.title} — Read` : 'Ebook Reader' };
}

export default async function EbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: pub } = await db.from('publications').select('*').eq('id', id).single();
  if (!pub || !pub.pdf_url) notFound();

  return (
    <EbookReader
      pdfUrl={pub.pdf_url}
      title={pub.title}
      year={String(pub.year)}
      type={pub.type}
    />
  );
}
