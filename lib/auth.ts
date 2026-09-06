import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sac_admin')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
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
