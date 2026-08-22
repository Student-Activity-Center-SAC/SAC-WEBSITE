import { db } from '@/lib/query-builder';
import ClubsPageClient from './_components/ClubsPageClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Clubs — KL SAC' };

export default async function ClubsPage() {
  const { data: dbClubs } = await db
    .from('clubs')
    .select('*')
    .order('club_name', { ascending: true });

  const clubs = (dbClubs ?? []).map((c: any) => ({
    id: c.id,
    slug: c.club_name ? c.club_name.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') : '',
    name: c.club_name,
    domain_code: c.club_domain,
    domain_slug: c.club_domain ? c.club_domain.toLowerCase() : '',
    tagline: c.club_description,
    logo_url: c.club_logo,
  }));

  return <ClubsPageClient clubs={clubs} />;
}
