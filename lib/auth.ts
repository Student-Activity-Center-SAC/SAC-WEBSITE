import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export interface AdminSession {
  username: string;
  name?: string;
  role: string;
  club_name?: string | null;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sac_admin')?.value;
  if (!token) return null;
  const payload = await verifyToken(token) as any;
  if (!payload || (payload.role !== 'sac_admin' && payload.role !== 'admin' && payload.role !== 'club_lead')) return null;
  return {
    ...payload,
    role: payload.role === 'sac_admin' ? 'admin' : payload.role,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return { session: null, error: 'Unauthorized' };
  }
  return { session, error: null };
}
