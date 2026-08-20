import { supabase } from '@/lib/supabase-admin';
import ClubsPageClient from './_components/ClubsPageClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Clubs — KL SAC' };

export default async function ClubsPage() {
  const { data: clubs } = await supabase
    .from('clubs')
    .select('id, slug, name, domain_code, domain_slug, tagline, logo_url')
    .order('sort_order', { ascending: true });

  return <ClubsPageClient clubs={clubs ?? []} />;
}
