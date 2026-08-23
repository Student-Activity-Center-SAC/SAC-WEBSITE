import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { error: authError } = await requireAdmin();
  if (authError) return NextResponse.json({ error: authError }, { status: 401 });

  let { data, error } = await db
    .from('stories')
    .select('*')
    .order('sort_order', { ascending: true });

  let needsMigration = false;
  if (error) {
    needsMigration = true;
    const fallback = await db.from('stories').select('*');
    data = fallback.data;
  }

  return NextResponse.json({ success: true, data: data ?? [], needsMigration });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const body = await req.json();
  const { data, error: e } = await db.from('stories').insert(body).select().single();
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/stories');
  revalidatePath('/');
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { slug, ...rest } = await req.json();

  // Enforce uniqueness: if setting homepage_order to 1/2/3, clear it from any other story.
  if (rest.homepage_order && rest.homepage_order > 0) {
    await db.from('stories')
      .update({ homepage_order: 0 })
      .eq('homepage_order', rest.homepage_order)
      .neq('slug', slug);
  }

  // Enforce uniqueness: only one story can be the stories-page highlight.
  if (rest.featured === true) {
    await db.from('stories').update({ featured: false }).neq('slug', slug);
  }

  const { error: e } = await db.from('stories').update(rest).eq('slug', slug);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/stories');
  revalidatePath(`/stories/${slug}`);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

// Reorder: receives the full ordered list of slugs, assigns sort_order 0..n
export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { orderedSlugs } = await req.json() as { orderedSlugs: string[] };
  const updates = orderedSlugs.map((s, i) =>
    db.from('stories').update({ sort_order: i }).eq('slug', s)
  );
  const results = await Promise.all(updates);
  const failed = results.find(r => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message, needsMigration: true }, { status: 400 });

  revalidatePath('/stories');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return NextResponse.json({ error }, { status: 401 });

  const { slug } = await req.json();
  const { error: e } = await db.from('stories').delete().eq('slug', slug);
  if (e) return NextResponse.json({ error: e.message }, { status: 400 });
  revalidatePath('/stories');
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
