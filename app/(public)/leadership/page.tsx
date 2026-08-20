import { Camera } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-admin';
import CouncilGrid from './_components/CouncilGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Council — KL SAC',
  description:
    'The Student Council of KL University — presidents, vice presidents, secretaries, council members, club leads, and faculty leadership.',
};

export default async function LeadershipPage() {
  const [{ data: members }, { data: clubs }] = await Promise.all([
    supabase.from('council_members').select('*').order('sort_order', { ascending: true }),
    supabase.from('clubs').select('id, slug, name, domain_code').order('sort_order', { ascending: true }),
  ]);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#0A0A0F', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-5" style={{ color: '#8B0000' }}>
            Governance
          </p>
          <h1
            className="font-black leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#FFFFFF', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
            Student Council of KL University
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)', maxWidth: '54ch' }}>
            The elected and appointed student leaders who run KL SAC — {clubs?.length ?? 0} clubs, 5 domains, and the full breadth of campus life.
          </p>
        </div>
      </section>

      {/* ─── Group Photo ──────────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-10">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: '#8B0000' }}>
            Student Council Group Photo
          </p>

          <div
            className="w-full rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4"
            style={{
              aspectRatio: '16/6',
              background: 'linear-gradient(135deg, #8B000010 0%, #8B000005 100%)',
              border: '2px dashed #8B000025',
            }}>
            <Camera size={40} style={{ color: '#8B000035' }} />
            <div className="text-center">
              <p className="font-black text-sm tracking-wider uppercase" style={{ color: '#8B000040' }}>
                Complete Student Council — Group Photo
              </p>
              <p className="text-xs mt-1" style={{ color: '#A1A1AA' }}>
                Upload via{' '}
                <Link
                  href="https://sacactivities.kluniversity.in"
                  target="_blank"
                  rel="noopener"
                  className="font-bold hover:underline"
                  style={{ color: '#8B0000' }}>
                  Student Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Council Grid ─────────────────────────────────── */}
      <CouncilGrid members={members ?? []} clubs={clubs ?? []} />

      {/* ─── Governance Framework ─────────────────────────────────────── */}
      <section style={{ background: '#0A0A0F' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-5" style={{ color: '#8B0000' }}>
            Governance Framework
          </p>
          <h2
            className="font-black leading-tight mb-10"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', letterSpacing: '-0.02em' }}>
            How SAC is organised.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[
              { title: 'Faculty Oversight',              desc: 'SAC operates under direct university faculty supervision, ensuring alignment with academic and institutional values.' },
              { title: 'Student Leadership',             desc: 'Elected and appointed student officers manage day-to-day operations of each domain and its clubs.' },
              { title: 'Five Domain Structure',          desc: 'All clubs are organised into five domains — each with a dedicated coordinator and advisory faculty.' },
              { title: 'Student Development Commission', desc: 'An SDC framework awards credits for participation, enabling holistic development tracking across all activities.' },
              { title: 'Annual Review',                  desc: 'All clubs and domains undergo an annual performance review with student and faculty participation.' },
              { title: 'Open Membership',                desc: 'Any enrolled KL University student may join clubs and participate in activities regardless of branch or year.' },
            ].map(item => (
              <div key={item.title} className="p-7" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <h3 className="font-bold text-base mb-2" style={{ color: '#fff' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
