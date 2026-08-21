import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/query-builder';
import ClubForm from '../_components/ClubForm';

export const metadata = { title: 'Edit Club — KL SAC Admin' };

export default async function EditClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { data } = await db.from('clubs').select('*').eq('slug', slug).single();
  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/clubs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
        <ArrowLeft size={14} /> Back to Clubs
      </Link>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Edit Club
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>{data.name}</p>
      <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <ClubForm mode="edit" initial={data} />
      </div>
    </div>
  );
}
