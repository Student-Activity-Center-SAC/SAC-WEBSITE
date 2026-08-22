import { Camera } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/query-builder';
import CouncilGrid from './_components/CouncilGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Student Council — KL SAC',
  description:
    'The Student Council of KL University — presidents, vice presidents, secretaries, council members, club leads, and faculty leadership.',
};

export default async function LeadershipPage() {
  const [{ data: members }, { data: dbClubs }] = await Promise.all([
    db.from('council_members').select('*').order('sort_order', { ascending: true }),
    db.from('clubs').select('*').order('club_name', { ascending: true }),
  ]);

  const clubs = (dbClubs ?? []).map((c: any) => ({
    id: c.id,
    slug: c.club_name ? c.club_name.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') : '',
    name: c.club_name,
    domain_code: c.club_domain,
  }));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Governance</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
            Student Council of KL University
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '54ch' }}>
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
                  href="https://sacactivities.kluniversity.in/auth/login"
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

      {/* ─── Director SAC ─────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E4E4E7' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
          <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-8" style={{ color: '#8B0000' }}>
            Director, Student Activity Centre
          </p>

          <div
            className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12 p-8 sm:p-10 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #8B000008 0%, #8B000003 100%)', border: '1.5px solid #8B000018' }}>

            {/* Photo */}
            <div
              className="w-36 h-44 sm:w-44 sm:h-56 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-black text-3xl"
              style={{ background: '#8B000014', color: '#8B0000' }}>
              <img
                src="/sai vijay sir.png"
                alt="Er. P Sai Vijay"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div
                className="inline-block text-[10px] font-black tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
                style={{ background: '#8B000014', color: '#8B0000' }}>
                Director SAC
              </div>

              <h2
                className="font-black leading-tight mb-2"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
                Er. P Sai Vijay
              </h2>
              <p className="text-sm font-semibold mb-5" style={{ color: '#71717A' }}>
                Student Activity Centre · KL University
              </p>

              <p className="text-sm leading-relaxed" style={{ color: '#3F3F46', maxWidth: '52ch' }}>
                The Director of the Student Activity Centre oversees all student clubs, domains, events, and extracurricular
                programmes at KL University — guiding both the faculty leadership and student council in fostering a vibrant
                campus community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Council Grid ─────────────────────────────────── */}
      <CouncilGrid members={members ?? []} clubs={clubs ?? []} />

      {/* ─── Governance Framework ─────────────────────────────────────── */}
      <section style={{ background: '#faf6f1' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Governance Framework</p>
          <h2
            className="font-display font-medium leading-tight mb-10"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em' }}>
            How SAC is organised.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Faculty Oversight',              desc: 'SAC operates under direct university faculty supervision, ensuring alignment with academic and institutional values.' },
              { title: 'Student Leadership',             desc: 'Elected and appointed student officers manage day-to-day operations of each domain and its clubs.' },
              { title: 'Five Domain Structure',          desc: 'All clubs are organised into five domains — each with a dedicated coordinator and advisory faculty.' },
              { title: 'Student Development Commission', desc: 'An SDC framework awards credits for participation, enabling holistic development tracking across all activities.' },
              { title: 'Annual Review',                  desc: 'All clubs and domains undergo an annual performance review with student and faculty participation.' },
              { title: 'Open Membership',                desc: 'Any enrolled KL University student may join clubs and participate in activities regardless of branch or year.' },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid var(--hairline)' }}>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#191313' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
