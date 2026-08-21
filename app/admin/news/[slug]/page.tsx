import { supabase } from '@/lib/supabase-admin';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import NewsForm from '../_components/NewsForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'Edit Article — KL SAC Admin' };

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { slug } = await params;
  const { data } = await supabase.from('news_articles').select('*').eq('slug', slug).single();
  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/news"
            className="inline-flex items-center gap-1 text-sm mb-6 font-semibold"
            style={{ color: '#71717A' }}>
        <ChevronLeft size={14} /> Back to News
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Edit Article
      </h1>
      <NewsForm mode="edit" initial={data} />
    </div>
  );
}
