import Navbar from './_components/Navbar';
import Footer from './_components/Footer';
import { IntroAnimation } from './_components/IntroAnimation';
import { supabase } from '@/lib/supabase-admin';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [{ data: domainsData }, { count: clubCount }] = await Promise.all([
    supabase.from('domains').select('slug, code, short_name, tagline, color, accent_bg').order('sort_order', { ascending: true }),
    supabase.from('clubs').select('*', { count: 'exact', head: true }),
  ]);

  const domains = domainsData ?? [];
  const totalClubs = clubCount ?? 0;

  return (
    <>
      <IntroAnimation />
      <Navbar domains={domains} totalClubs={totalClubs} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
