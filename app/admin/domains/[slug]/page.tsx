import { requireAdmin } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/query-builder';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DomainForm from '../_components/DomainForm';

export const dynamic = 'force-dynamic';

export default async function AdminDomainEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { error } = await requireAdmin();
  if (error) redirect('/admin/login');

  const { slug } = await params;
  const { data: domain } = await db.from('domains').select('*').eq('slug', slug).single();
  if (!domain) notFound();

  return (
    <div>
      <Link href="/admin/domains"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#71717A' }}>
        <ArrowLeft size={14} /> All Domains
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
             style={{ background: `${domain.color}12`, color: domain.color }}>
          {domain.code}
        </div>
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#0D0D0D', letterSpacing: '-0.02em' }}>
            {domain.name}
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Edit domain content, photos, and competencies</p>
        </div>
      </div>

      <DomainForm domain={domain} />
    </div>
  );
}
