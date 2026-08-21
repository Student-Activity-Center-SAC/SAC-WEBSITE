import { db } from '@/lib/query-builder';
import ClubsPageClient from './_components/ClubsPageClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Clubs — KL SAC' };

export default async function ClubsPage() {
  const { data: clubs } = await db
    .from('clubs')
    .select('id, slug, name, domain_code, domain_slug, tagline, logo_url')
    .order('name', { ascending: true });

  return <ClubsPageClient clubs={clubs ?? []} />;
}
