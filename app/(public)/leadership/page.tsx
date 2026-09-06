import { Camera } from 'lucide-react';
import { db } from '@/lib/query-builder';
import CouncilGrid from './_components/CouncilGrid';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Official Council — KL SAC',
  description:
    'The Official Council of KL SAC — a structured body of faculty leadership, executive officers, domain leads, club mentors, and student club leaders working together across 25+ clubs and 5 domains to enrich campus life.',
};

export default async function LeadershipPage() {
  const [{ data: members }, { data: dbClubs }, { data: advisoryBoard }] = await Promise.all([
    db.from('council_members').select('*').order('sort_order', { ascending: true }),
    db.from('clubs').select('*').order('sort_order', { ascending: true }),
    db.from('advisory_board').select('*').order('sort_order', { ascending: true }),
  ]);

  const clubs = (dbClubs ?? []).map((c: any) => ({
    id: c.id,
    slug: c.club_name ? c.club_name.toLowerCase().replace(/[\s/&]+/g, '-').replace(/-+/g, '-') : '',
    name: c.club_name,
    domain_code: c.club_domain,
  }));

  const deputyDirectors = (members ?? []).filter((m: any) => m.role === 'Deputy Director' || m.category === 'Deputy Director');
  const deputy1 = deputyDirectors[0] || null;
  const deputy2 = deputyDirectors[1] || null;

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#faf6f1', paddingTop: '92px', paddingBottom: '72px' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20">
          <p className="kicker mb-5" style={{ color: '#970003' }}>Official Council</p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#191313', letterSpacing: '-0.025em', maxWidth: '22ch' }}>
            Official Council of KL SAC
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(25,19,19,0.55)', maxWidth: '60ch' }}>
            A structured body of distinguished faculty advisors, executive leadership, domain and division heads,
            club mentors, and student club leads — collectively shaping the vision, governance, and vibrant campus
            experience of KL University across the University Advisory Board, Director &amp; Deputy Directors SAC,
            Executive Leadership, Domain &amp; Division Leadership, Club Mentors &amp; In-Charges, and Clubs Leadership.
          </p>
        </div>
      </section>


      {/* ─── University Advisory Board ────────────────────────────────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
          <p className="kicker mb-8" style={{ color: '#970003' }}>University Advisory Board</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {(advisoryBoard ?? []).map((m: any) => (
              <div key={m.id} className="group flex flex-col items-center">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-3 border hairline relative">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-bold text-center text-sm sm:text-base text-foreground leading-tight mb-1">{m.name}</h3>
                <p className="text-xs sm:text-sm text-center text-red-700 font-semibold">{m.role}</p>
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 10 - (advisoryBoard ?? []).length) }).map((_, i) => (
              <div key={`placeholder-${i}`} className="flex flex-col items-center opacity-50">
                <div className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center mb-3">
                  <span className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">Placeholder</span>
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1.5" />
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Director SAC ─────────────────────────────────────────────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
          <p className="kicker mb-8" style={{ color: '#970003' }}>Director, Student Activity Centre</p>

          <div className="group grid overflow-hidden rounded-2xl border hairline bg-paper sm:grid-cols-[300px_1fr]">

            {/* Photo — 4:3 on mobile, full height on desktop */}
            <div className="aspect-[4/3] overflow-hidden sm:aspect-auto">
              <img
                loading="lazy"
                decoding="async"
                src="/sai vijay sir.png"
                alt="Er. P Sai Vijay"
                className="h-full w-full object-cover object-top transition-[filter] duration-700 sm:grayscale sm:group-hover:grayscale-0"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
              <p className="kicker text-red-700">Director</p>
              <h3 className="font-display mt-3 text-3xl font-medium text-foreground sm:text-4xl">
                Er. P Sai Vijay
              </h3>
              <p className="mt-2 text-base font-semibold text-red-700">
                Director, Student Activity Centre
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-foreground/55">
                The Director of the Student Activity Centre oversees all student clubs, domains, events, and
                extracurricular programmes at KL University — guiding both the faculty leadership and student
                council in fostering a vibrant campus community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Deputy Directors SAC ─────────────────────────────────────── */}
      <section className="bg-white border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-16">
          <p className="kicker mb-8" style={{ color: '#970003' }}>Deputy Directors, SAC</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Deputy 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-56 md:w-64 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-5 border hairline relative shadow-sm">
                {!deputy1?.photo ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold uppercase tracking-widest text-xs">
                    Deputy Director 1
                  </div>
                ) : (
                  <img src={deputy1.photo} alt={deputy1.name} className="w-full h-full object-cover transition-[filter] duration-700 sm:grayscale sm:group-hover:grayscale-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-display text-xl font-medium text-foreground text-center">{deputy1?.name || 'Deputy Director Name'}</h3>
              <p className="text-red-700 font-semibold text-sm text-center">Deputy Director, SAC</p>
            </div>

            {/* Message */}
            <div className="text-center px-2 py-8 md:py-0">
              <p className="text-lg leading-relaxed text-foreground/70 italic font-display" style={{ letterSpacing: '-0.01em' }}>
                "Our Deputy Directors play a pivotal role in bridging the gap between student aspirations and institutional resources. They are the driving force behind our vibrant campus life, ensuring that every club, domain, and student initiative receives the guidance and support needed to thrive and create lasting impact."
              </p>
            </div>

            {/* Deputy 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-56 md:w-64 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-5 border hairline relative shadow-sm">
                {!deputy2?.photo ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold uppercase tracking-widest text-xs">
                    Deputy Director 2
                  </div>
                ) : (
                  <img src={deputy2.photo} alt={deputy2.name} className="w-full h-full object-cover transition-[filter] duration-700 sm:grayscale sm:group-hover:grayscale-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="font-display text-xl font-medium text-foreground text-center">{deputy2?.name || 'Deputy Director Name'}</h3>
              <p className="text-red-700 font-semibold text-sm text-center">Deputy Director, SAC</p>
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
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#191313', letterSpacing: '-0.02em' }}>
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
                <h3 className="font-semibold text-base sm:text-lg mb-2" style={{ color: '#191313' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(25,19,19,0.5)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

