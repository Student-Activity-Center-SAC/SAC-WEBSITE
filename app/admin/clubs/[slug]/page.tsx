import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/query-builder';
import ClubForm from '../_components/ClubForm';

/** Safely parse a JSON column (string | array | null) → string[] */
function parseJsonCol(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
}

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit Club — KL SAC Admin' };

function toSlug(name: string) {
  return name?.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') ?? '';
}

export default async function EditClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { data: allClubs } = await db.from('clubs').select('*').order('id', { ascending: true });
  const raw = (allClubs ?? []).find((c: any) => toSlug(c.club_name) === slug);

  if (!raw) notFound();

  const data = {
    id:             raw.id,
    slug,
    name:           raw.club_name ?? '',
    domain_code:    raw.club_domain ?? 'TEC',
    domain_slug:    raw.club_domain?.toLowerCase() ?? 'technology',
    tagline:        raw.club_description ?? '',
    logo_url:       raw.club_logo ?? '',
    about:          raw.club_about ? raw.club_about.split('\n').filter(Boolean) : [],
    purpose:        raw.purpose ?? '',
    competencies:   parseJsonCol(raw.competencies),
    activities_list:parseJsonCol(raw.activities_list),
    cover_url:      raw.cover_url ?? '',
    gallery:        parseJsonCol(raw.gallery),
    sort_order:     0,
  };

  return (
    <div>
      <Link href="/admin/clubs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
        <ArrowLeft size={14} /> Back to Clubs
      </Link>
      <h1 className="text-2xl font-black mb-1" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
        Edit Club
      </h1>
      <p className="text-sm mb-8" style={{ color: '#71717A' }}>{data.name}</p>
      <div className="rounded-2xl border p-6" style={{ background: '#fff', borderColor: '#E4E4E7' }}>
        <ClubForm mode="edit" initial={data} />
      </div>
    </div>
  );
}
