import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export const metadata = { title: 'Admin Login — KL SAC' };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect('/admin');
  return <LoginForm />;
}
