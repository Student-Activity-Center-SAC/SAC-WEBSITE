import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { data } = await db.from('sac_stats').select('*').order('key');
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const LABELS: Record<string, { label: string; suffix: string }> = {
    students:            { label: 'Students Annually',               suffix: '+' },
    activities:          { label: 'Annual Activities',             suffix: '+' },
    clubs:               { label: 'Active Clubs',                  suffix: ''  },
    achievements:        { label: 'Achievements',                  suffix: '+' },
    ach_national:        { label: 'National Achievements',         suffix: '+' },
    ach_state:           { label: 'State Achievements',            suffix: '+' },
    ach_university:      { label: 'University Achievements',       suffix: '+' },
  };
  const updates: { key: string; value: number }[] = await req.json();
  for (const u of updates) {
    const meta = LABELS[u.key] ?? { label: u.key, suffix: '' };
    await db.from('sac_stats')
      .upsert({ key: u.key, value: u.value, label: meta.label, suffix: meta.suffix, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }
  revalidatePath('/');
  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}
