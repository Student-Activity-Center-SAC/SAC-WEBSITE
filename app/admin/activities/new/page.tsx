import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ActivityForm from '../_components/ActivityForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = { title: 'New Activity — KL SAC Admin' };

export default async function NewActivityPage() {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  return (
    <div>
      <Link href="/admin/activities" className="inline-flex items-center gap-1 text-sm mb-6 font-semibold" style={{ color: '#71717A' }}>
        <ChevronLeft size={14} /> Back to Activities
      </Link>
      <h1 className="text-2xl font-black mb-8" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>New Activity</h1>
      <ActivityForm mode="create" />
    </div>
  );
}
