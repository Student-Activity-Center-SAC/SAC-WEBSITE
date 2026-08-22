import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/query-builder';
import MemberForm from '../_components/MemberForm';

export const metadata = { title: 'Edit Member — KL SAC Admin' };

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const [{ data }, { data: clubRows }] = await Promise.all([
    db.from('council_members').select('*').eq('id', id).single(),
    db.from('clubs').select('*').order('club_name', { ascending: true }),
  ]);
  if (!data) notFound();

  const clubs = (clubRows ?? []).map((c: any) => ({ id: c.id, name: c.club_name }));

  return (
    <div>
      <Link href="/admin/leadership"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
        <ArrowLeft size={14} /> Back to Leadership
      </Link>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Edit Member</h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>{data.name}</p>
      <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <MemberForm mode="edit" initial={data} clubs={clubs} />
      </div>
    </div>
  );
}
