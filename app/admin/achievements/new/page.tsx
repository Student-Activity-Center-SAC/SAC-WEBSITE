import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AchievementForm from '../_components/AchievementForm';

export default async function NewAchievementPage() {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  return (
    <div>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Add Achievement
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>
        Record a new award, qualification, or milestone.
      </p>
      <AchievementForm />
    </div>
  );
}
