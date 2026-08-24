import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/query-builder';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export const metadata = { title: 'Domains — KL SAC Admin' };

export default async function AdminDomainsPage() {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { data: domains } = await db
    .from('domains')
    .select('slug, code, name, short_name, color, tagline, competencies, gallery')
    .order('sort_order', { ascending: true });

  const { data: clubs } = await db
    .from('clubs')
    .select('domain_code');

  const clubCounts: Record<string, number> = {};
  (clubs ?? []).forEach((c: any) => {
    clubCounts[c.domain_code] = (clubCounts[c.domain_code] ?? 0) + 1;
  });

  const isSeeded = (domains ?? []).length > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
            Domains
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>
            Edit domain names, taglines, philosophy, competencies, and photo gallery.
          </p>
        </div>
        {!isSeeded && (
          <div className="text-right">
            <p className="text-xs mb-2" style={{ color: '#A1A1AA' }}>No domains seeded yet.</p>
            <p className="text-xs font-mono bg-gray-100 px-3 py-2 rounded-lg" style={{ color: '#71717A' }}>
              Run the SQL + seed command below
            </p>
          </div>
        )}
      </div>

      {!isSeeded ? (
        <div className="rounded-2xl border p-12 text-center" style={{ borderColor: '#E4E4E7', background: '#fff' }}>
          <Globe size={40} className="mx-auto mb-4" style={{ color: '#E4E4E7' }} />
          <p className="font-bold text-base mb-2" style={{ color: '#71717A' }}>Domains not seeded yet.</p>
          <p className="text-sm mb-6" style={{ color: '#A1A1AA' }}>
            Run the SQL in MySQL, then run the seed command in your browser console:
          </p>
          <code className="block text-xs rounded-xl p-4 text-left" style={{ background: '#F7F7F8', color: '#3F3F46' }}>
            {`fetch('/api/admin/seed/domains', { method: 'POST', headers: { 'x-setup-key': process.env.ADMIN_SETUP_KEY } }).then(r => r.json()).then(console.log)`}
          </code>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(domains ?? []).map((d: any) => (
            <Link
              key={d.slug}
              href={`/admin/domains/${d.slug}`}
              className="group flex items-center gap-5 rounded-2xl border p-5 transition-all hover:shadow-md"
              style={{ background: '#fff', borderColor: '#E4E4E7' }}>

              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                   style={{ background: `${d.color}12`, color: d.color }}>
                {d.code}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-base leading-tight" style={{ color: '#0D0D0D' }}>
                  {d.name}
                </p>
                <p className="text-sm mt-0.5 italic" style={{ color: '#A1A1AA' }}>{d.tagline}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-semibold" style={{ color: d.color }}>
                    {clubCounts[d.code] ?? 0} clubs
                  </span>
                  <span className="text-xs" style={{ color: '#A1A1AA' }}>
                    {(d.competencies ?? []).length} competencies
                  </span>
                  <span className="text-xs" style={{ color: '#A1A1AA' }}>
                    {(d.gallery ?? []).length} gallery photos
                  </span>
                </div>
              </div>

              <ArrowRight size={16} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: '#8B0000' }} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
