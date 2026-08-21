import { NextResponse } from 'next/server';
import { db } from '@/lib/query-builder';

export async function GET() {
  const { data, error } = await db
    .from('clubs')
    .select('id, slug, name, domain_code, domain_slug, tagline, logo_url')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ success: false, data: [] }, { status: 500 });
  return NextResponse.json({ success: true, data: data ?? [] });
}
