import { db } from '@/lib/query-builder';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import ActivityForm from '../_components/ActivityForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'Edit Activity — KL SAC Admin' };

export default async function EditActivityPage({ params }: { params: Promise<{ code: string }> }) {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { code } = await params;
  const { data } = await db.from('activities').select('*').eq('code', decodeURIComponent(code)).single();
  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/activities" className="inline-flex items-center gap-1 text-sm mb-6 font-semibold" style={{ color: '#71717A' }}>
        <ChevronLeft size={14} /> Back to Activities
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Edit Activity</h1>
      <ActivityForm mode="edit" initial={data} />
    </div>
  );
}
