import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';
import AdvisoryBoardClient from './_components/AdvisoryBoardClient';

export const dynamic = 'force-dynamic';

export default async function AdvisoryBoardPage() {
  const { session, error } = await requireAdmin();
  if (error || !session) redirect('/admin/login');

  const { data: members, error: dbError } = await db
    .from('advisory_board')
    .select('*')
    .order('sort_order', { ascending: true });

  if (dbError) {
    console.error('Error fetching advisory board:', dbError);
  }

  return <AdvisoryBoardClient initialMembers={members ?? []} />;
}
