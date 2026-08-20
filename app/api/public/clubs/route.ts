import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabase
    .from('clubs')
    .select('id, slug, name, domain_code, domain_slug, tagline, logo_url')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ success: false, data: [] }, { status: 500 });
  return NextResponse.json({ success: true, data: data ?? [] });
}
