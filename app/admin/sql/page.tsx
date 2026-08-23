import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import SQLExecutorClient from './SQLExecutorClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'SQL Executor — KL SAC Dev' };

// Mirrors the gate in /api/admin/db-query — the console is off unless
// ADMIN_SQL_CONSOLE=true and the session matches ADMIN_SQL_USER.
export default async function SQLExecutorPage() {
  const enabled = process.env.ADMIN_SQL_CONSOLE === 'true';
  const sqlUser = process.env.ADMIN_SQL_USER ?? '';

  const session = await getAdminSession();
  if (!enabled || !sqlUser || !session || session.username !== sqlUser) redirect('/admin');

  return <SQLExecutorClient />;
}
