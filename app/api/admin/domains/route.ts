import { NextResponse, NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error: dbError } = await db
    .from('domains')
    .select('*')
    .order('sort_order', { ascending: true });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { slug, ...fields } = body;
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const { error: dbError } = await db
    .from('domains')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('slug', slug);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidatePath('/domains');
  revalidatePath(`/domains/${slug}`);
  revalidatePath('/');

  return NextResponse.json({ success: true });
}
