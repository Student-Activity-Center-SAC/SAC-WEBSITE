import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MemberForm from '../_components/MemberForm';

export const metadata = { title: 'Add Member — KL SAC Admin' };

export default async function NewMemberPage() {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  return (
    <div>
      <Link href="/admin/leadership"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
        <ArrowLeft size={14} /> Back to Leadership
      </Link>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>Add Council Member</h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>Add a new member to the Student Council.</p>
      <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <MemberForm mode="create" />
      </div>
    </div>
  );
}
