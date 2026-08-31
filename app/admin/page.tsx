import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/query-builder';
import Link from 'next/link';
import { BarChart2, Newspaper, Zap, BookOpen, ArrowRight, Building2, Users, BookMarked, Settings, Globe, Handshake } from 'lucide-react';

export const metadata = { title: 'Dashboard — KL SAC Admin' };

async function getStats() {
  const [{ data: stats }, { count: news }, { count: activities }, { count: pubs }, { count: clubs }, { count: council }, { count: stories }, { count: partnersCount }] =
    await Promise.all([
      db.from('sac_stats').select('*'),
      db.from('news_articles').select('*', { count: 'exact', head: true }),
      db.from('activities').select('*', { count: 'exact', head: true }),
      db.from('publications').select('*', { count: 'exact', head: true }),
      db.from('clubs').select('*', { count: 'exact', head: true }),
      db.from('council_members').select('*', { count: 'exact', head: true }),
      db.from('stories').select('*', { count: 'exact', head: true }),
      db.from('partners').select('*', { count: 'exact', head: true }),
    ]);
  const statMap: Record<string, number> = {};
  (stats ?? []).forEach((s: any) => { statMap[s.key] = s.value; });
  return { statMap, news: news ?? 0, activities: activities ?? 0, pubs: pubs ?? 0, clubs: clubs ?? 0, council: council ?? 0, stories: stories ?? 0, partners: partnersCount ?? 0 };
}

export default async function AdminDashboard() {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { statMap, news, activities, pubs, clubs, council, stories, partners } = await getStats();

  const sections = [
    { href: '/admin/news',         label: 'News Articles',   icon: Newspaper,   value: `${news} articles`,         desc: 'Add, edit, or remove news and updates' },
    { href: '/admin/stories',      label: 'Stories',         icon: BookMarked,  value: stories ? `${stories} stories` : 'Not seeded yet', desc: 'Manage student success stories' },
    { href: '/admin/clubs',        label: 'Clubs',           icon: Building2,   value: clubs ? `${clubs} clubs` : 'Not seeded yet', desc: 'Edit club names, descriptions, and competencies' },
    { href: '/admin/leadership',   label: 'Leadership',      icon: Users,       value: council ? `${council} members` : 'Not seeded yet', desc: 'Manage Student Council members and roles' },
    { href: '/admin/publications', label: 'Publications',    icon: BookOpen,    value: `${pubs} publications`,      desc: 'Upload magazines, reports, and PDFs' },
    { href: '/admin/partners',      label: 'Partners',        icon: Handshake,   value: partners > 0 ? `${partners} partners` : 'None added yet', desc: 'Manage partner logos shown in the homepage marquee' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Dashboard
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>
        Manage everything that appears on the public KL SAC website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ href, label, icon: Icon, value, desc }) => (
          <Link key={href} href={href}
                className="group rounded-2xl border p-6 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: '#fff', borderColor: '#E4E4E7' }}>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{ background: '#fff0f0' }}>
                <Icon size={18} style={{ color: '#8B0000' }} />
              </div>
              <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#8B0000' }} />
            </div>
            <div>
              <h2 className="font-black text-base mb-0.5" style={{ color: '#0D0D0D' }}>{label}</h2>
              <p className="text-xs font-semibold mb-1" style={{ color: '#8B0000' }}>{value}</p>
              <p className="text-xs" style={{ color: '#71717A' }}>{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <h2 className="font-black text-base mb-3" style={{ color: '#0D0D0D' }}>Quick guide</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm" style={{ color: '#71717A' }}>
          <li>Use <strong>News</strong> to publish articles with photos — they appear on the public news page instantly.</li>
          <li>Use <strong>Stories</strong> to manage student success stories featured on the website.</li>
          <li>Use <strong>Clubs</strong> to edit club names, descriptions, and listed competencies.</li>
          <li>Use <strong>Leadership</strong> to manage Student Council members, photos, and roles.</li>
          <li>Use <strong>Publications</strong> to upload and manage PDFs (magazines, annual reports).</li>
        </ol>
      </div>
    </div>
  );
}
