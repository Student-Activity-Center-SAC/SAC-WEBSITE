import { supabase } from '@/lib/supabase-admin';
import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import AchievementForm from '../_components/AchievementForm';

export const dynamic = 'force-dynamic';

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { data } = await supabase.from('achievements').select('*').eq('id', id).single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Edit Achievement
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>
        {data.title}
      </p>
      <AchievementForm achievement={data} />
    </div>
  );
}
