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
    <div className={`group rounded-lg overflow-hidden border hairline bg-paper flex flex-col ${isPlaceholder ? 'opacity-40' : ''}`}>

      {/* Portrait photo — aspect-[4/5] */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5' }}>
        {member?.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-top transition-[filter] duration-500 sm:grayscale sm:group-hover:grayscale-0"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center font-black text-2xl"
            style={{
              background: isPlaceholder
                ? 'var(--surface)'
                : 'linear-gradient(135deg,#8B000012 0%,#8B000005 100%)',
              color: '#8B0000',
            }}>
            {isPlaceholder ? '' : initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-4 flex flex-col items-center text-center gap-0.5">
        <p className="font-semibold text-sm leading-snug text-foreground">
          {member?.name ?? nameFallback ?? 'Name TBA'}
        </p>
        <p className="kicker text-red-700" style={{ fontSize: '9px' }}>
          {member?.role ?? roleFallback ?? '—'}
        </p>
        {member?.subtitle && (
          <p className="text-[10px] mt-0.5 leading-snug text-foreground/50">
            {member.subtitle}
          </p>
        )}
        {member?.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: '#0A66C2', color: '#fff' }}
            aria-label="LinkedIn">
            <Linkedin size={11} />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-10">
      <p className="kicker mb-3" style={{ color: '#970003' }}>{label}</p>
      {sub && (
        <h2 className="font-display font-medium leading-tight text-foreground"
            style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', letterSpacing: '-0.02em' }}>
          {sub}
        </h2>
      )}
    </div>
  );
}

// ─── Shared grid wrapper ──────────────────────────────────────────────────────
const GRID = 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10';

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CouncilGrid({ members, clubs }: { members: Member[]; clubs: ClubRow[] }) {
  const byRole = (role: string) => members.filter(m => m.role === role);

  const presidents = byRole('President');
  const vps        = byRole('Vice President');
  const secs       = byRole('Secretary');
  const jsecs      = byRole('Joint Secretary');
  const mentors    = byRole('Faculty Mentor');
  const incharges  = byRole('Faculty In-Charge');
  const deputyDirs = byRole('Deputy Director');

  return (
    <>
      {/* ── Deputy Directors ─────────────────────────────────────────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Deputy Directors" sub="Deputy Directors of SAC." />
          <div className={GRID}>
            {deputyDirs.length > 0
              ? deputyDirs.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 2 }).map((_, i) => <MemberCard key={i} roleFallback="Deputy Director" />)}
          </div>
        </div>
      </section>

      {/* ── Faculty Mentors & In-Charges ─────────────────────────────── */}
      <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Faculty" sub="Mentors & In-Charges." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="kicker mb-6" style={{ color: '#A1A1AA' }}>Faculty Mentors</p>
              <div className={GRID}>
                {mentors.length > 0
                  ? mentors.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty Mentor" />)}
              </div>
            </div>
            <div>
              <p className="kicker mb-6" style={{ color: '#A1A1AA' }}>Faculty In-Charges</p>
              <div className={GRID}>
                {incharges.length > 0
                  ? incharges.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty In-Charge" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Presidents ──────────────────────────────────────────────── */}
      <section className="bg-paper border-b hairline">
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Student Council Leadership" sub="Presidents of KL SAC." />
          <div className={GRID}>
            {presidents.length > 0
              ? presidents.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="President" />)}
          </div>
        </div>
      </section>

      {/* ── Vice Presidents ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Vice Presidents" sub="Domain & division leadership." />
          <div className={GRID}>
            {vps.length > 0
              ? vps.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 7 }).map((_, i) => <MemberCard key={i} roleFallback="Vice President" />)}
          </div>
        </div>
      </section>

      {/* ── Secretaries ─────────────────────────────────────────────── */}
      {(secs.length > 0 || jsecs.length > 0) && (
        <section className="bg-paper border-b hairline">
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <SectionLabel label="Secretaries" sub="Division heads & coordinators." />
            <div className={GRID}>
              {[...secs, ...jsecs].map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Club Leads ──────────────────────────────────────────────── */}
      {clubs.length > 0 && (
        <section style={{ background: '#F7F7F8', borderBottom: '1px solid #E4E4E7' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <SectionLabel label="Club Leads" sub={`Coordinators of all ${clubs.length} clubs.`} />
            <div className={GRID}>
              {clubs.map(club => {
                const lead = members.find(m => m.role === 'Club Lead' && m.club_lead === club.name);
                return (
                  <MemberCard
                    key={club.slug}
                    member={lead}
                    roleFallback="Club Lead"
                    nameFallback={`${club.name} Lead`}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
