'use client';

import Link from 'next/link';
import { Linkedin } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  role: string;
  subtitle?: string;
  photo?: string;
  linkedin?: string;
  club_lead?: string;
  is_faculty?: boolean;
  designation?: string;
  sort_order?: number;
}

interface ClubRow {
  id: string;
  slug: string;
  name: string;
  domain_code: string;
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({
  member,
  roleFallback,
  nameFallback,
}: {
  member?: Member;
  roleFallback?: string;
  nameFallback?: string;
}) {
  const isPlaceholder = !member;
  const initials = member?.name
    ? member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className={`group relative rounded-2xl overflow-hidden border hairline bg-white flex flex-col shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isPlaceholder ? 'opacity-50 grayscale' : ''}`}>
      {/* Portrait photo — aspect-[4/5] */}
      <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: '4/5' }}>
        {member?.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center font-black text-3xl"
            style={{
              background: isPlaceholder
                ? '#F4F4F5'
                : 'linear-gradient(135deg,#8B000010 0%,#8B000002 100%)',
              color: isPlaceholder ? '#D4D4D8' : '#8B0000',
            }}>
            {isPlaceholder ? '' : initials}
          </div>
        )}
        {/* Subtle gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="px-5 py-5 flex flex-col gap-1 flex-1 relative bg-white">
        <p className="font-display font-semibold text-base sm:text-lg leading-tight text-foreground">
          {member?.name ?? nameFallback ?? 'Name TBA'}
        </p>
        <p className="text-xs sm:text-sm font-semibold tracking-wide" style={{ color: '#970003' }}>
          {member?.role ?? roleFallback ?? '—'}
        </p>
        {(member?.subtitle || member?.club_lead || member?.designation) && (
          <p className="text-xs mt-1 leading-relaxed text-foreground/60 line-clamp-2">
            {member.subtitle || member.club_lead || member.designation}
          </p>
        )}
        
        {/* Spacer to push LinkedIn button to bottom if needed */}
        <div className="flex-1" />

        {member?.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:opacity-80"
            style={{ background: '#0A66C215', color: '#0A66C2' }}
            aria-label={`LinkedIn profile for ${member.name}`}>
            <Linkedin size={12} fill="currentColor" /> LinkedIn
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-12">
      <p className="kicker mb-3" style={{ color: '#970003' }}>{label}</p>
      {sub && (
        <h2 className="font-display font-medium leading-tight text-foreground max-w-2xl"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}>
          {sub}
        </h2>
      )}
    </div>
  );
}

// ─── Shared grid wrapper ──────────────────────────────────────────────────────
const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8';

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CouncilGrid({ members, clubs }: { members: Member[]; clubs: ClubRow[] }) {
  const byRole = (role: string) => members.filter(m => m.role === role);
  
  // Custom grouping for Domains/Divisions/Clubs
  const domainLeaders = members.filter(m => m.role === 'Domain Secretary' || m.role === 'Domain Joint Secretary');
  const divisionLeaders = members.filter(m => m.role === 'Division Secretary' || m.role === 'Division Joint Secretary');
  const clubLeads = members.filter(m => m.role === 'Club Lead' || m.role === 'Club Co-Lead');

  const presidents = byRole('President');
  const vps        = byRole('Vice President');
  const mentors    = byRole('Faculty Mentor');
  const incharges  = byRole('Faculty In-Charge');

  return (
    <>
      {/* ── Executive Leadership: Presidents + Vice Presidents ─────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">

          {/* Presidents — with the red kicker */}
          <SectionLabel label="Executive Leadership" sub="Presidents of KL SAC." />
          <div className={GRID + ' mb-20'}>
            {presidents.length > 0
              ? presidents.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 4 }).map((_, i) => <MemberCard key={i} roleFallback="President" />)}
          </div>

          {/* Vice Presidents — plain sub-heading, no red kicker */}
          <h2
            className="font-display font-medium leading-tight mb-12"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#191313', letterSpacing: '-0.02em' }}>
            Vice Presidents of KL SAC.
          </h2>
          <div className={GRID}>
            {vps.length > 0
              ? vps.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 12 }).map((_, i) => <MemberCard key={i} roleFallback="Vice President" />)}
          </div>

        </div>
      </section>

      {/* ── Domain Wise Leadership ──────────────────────────────────── */}
      {(domainLeaders.length > 0) && (
        <section className="bg-paper border-b hairline">
          <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
            <SectionLabel label="Domain Leadership" sub="Secretaries and Joint Secretaries across 5 domains." />
            <div className={GRID}>
              {domainLeaders.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Division Wise Leadership ────────────────────────────────── */}
      {(divisionLeaders.length > 0) && (
        <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
            <SectionLabel label="Division Leadership" sub="Operations, management, and technical divisions." />
            <div className={GRID}>
              {divisionLeaders.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Faculty Mentors & In-Charges ─────────────────────────────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
          <SectionLabel label="Club Mentors & In-Charges" sub="Faculty guiding our student clubs." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="kicker mb-8" style={{ color: '#A1A1AA' }}>Faculty Mentors</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {mentors.length > 0
                  ? mentors.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 2 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty Mentor" />)}
              </div>
            </div>
            <div>
              <p className="kicker mb-8" style={{ color: '#A1A1AA' }}>Faculty In-Charges</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {incharges.length > 0
                  ? incharges.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 2 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty In-Charge" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Club Leadership ─────────────────────────────────────────── */}
      {clubs.length > 0 && (
        <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-24">
            <SectionLabel label="Club Leadership" sub={`Leads and Co-Leads of all ${clubs.length} clubs.`} />
            <div className={GRID}>
              {clubs.map(club => {
                // Find all leaders for this club
                const leaders = clubLeads.filter(m => m.club_lead === club.name);
                
                if (leaders.length === 0) {
                  return (
                    <MemberCard
                      key={`${club.slug}-empty`}
                      roleFallback="Club Lead"
                      nameFallback={`${club.name} Lead`}
                    />
                  );
                }
                
                return leaders.map(lead => (
                  <MemberCard
                    key={lead.id}
                    member={lead}
                    roleFallback={lead.role}
                  />
                ));
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
