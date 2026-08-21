import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import SQLExecutorClient from './SQLExecutorClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'SQL Executor — KL SAC Dev' };

const DEV_USER = '2400030188';

export default async function SQLExecutorPage() {
  const session = await getAdminSession();
  if (!session || session.username !== DEV_USER) redirect('/admin');

  return <SQLExecutorClient />;
}
