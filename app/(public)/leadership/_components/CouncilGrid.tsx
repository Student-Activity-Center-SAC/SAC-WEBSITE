'use client';

import Link from 'next/link';
import { Linkedin, Camera } from 'lucide-react';

const CRIMSON = '#8B0000';

interface Member {
  id: string;
  name: string;
  role: string;
  subtitle?: string;
  photo?: string;
  year_of_study?: string;
  branch?: string;
  linkedin?: string;
  journey?: string;
  achievements?: string[];
  clubs_list?: string[];
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

  const displayRole = member?.role ?? roleFallback ?? '–';
  const displayName = member?.name ?? nameFallback ?? 'Name TBA';

  return (
    <div
      className={`rounded-2xl overflow-hidden flex flex-col shadow-sm transition-shadow hover:shadow-md ${isPlaceholder ? 'opacity-50' : ''}`}
      style={{ border: '1px solid #E4E4E7', background: '#fff' }}>

      {/* Portrait photo */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {member?.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : isPlaceholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ background: '#F4F4F5' }}>
            <Camera size={28} style={{ color: '#D1D1D6' }} />
            <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#D1D1D6' }}>Photo</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${CRIMSON}14 0%, ${CRIMSON}06 100%)` }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl"
              style={{ background: `${CRIMSON}18`, color: CRIMSON }}>
              {initials}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-4 flex flex-col items-center text-center gap-1">
        <p
          className="font-black text-sm leading-snug"
          style={{ color: isPlaceholder ? '#A1A1AA' : '#0D0D0D', letterSpacing: '-0.01em' }}>
          {displayName}
        </p>
        <p className="text-[11px] font-semibold" style={{ color: CRIMSON }}>
          {displayRole}
        </p>
        {member?.subtitle && (
          <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#71717A' }}>
            {member.subtitle}
          </p>
        )}
        {member?.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: '#0A66C2', color: '#fff' }}
            aria-label="LinkedIn">
            <Linkedin size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-2" style={{ color: CRIMSON }}>
        {label}
      </p>
      {sub && (
        <h2
          className="font-black leading-tight"
          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#0D0D0D', letterSpacing: '-0.02em' }}>
          {sub}
        </h2>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CouncilGrid({
  members,
  clubs,
}: {
  members: Member[];
  clubs: ClubRow[];
}) {
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
      {/* ── Deputy Directors of SAC ──────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Deputy Directors" sub="Deputy Directors of SAC." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {deputyDirs.length > 0
              ? deputyDirs.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 2 }).map((_, i) => <MemberCard key={i} roleFallback="Deputy Director" />)}
          </div>
        </div>
      </section>

      {/* ── Faculty Mentors & In-Charges ─────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Faculty" sub="Mentors & In-Charges." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            <div>
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: '#A1A1AA' }}>
                Faculty Mentors
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mentors.length > 0
                  ? mentors.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty Mentor" />)}
              </div>
            </div>

            <div>
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: '#A1A1AA' }}>
                Faculty In-Charges
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {incharges.length > 0
                  ? incharges.map(m => <MemberCard key={m.id} member={m} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty In-Charge" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Presidents ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Student Council Leadership" sub="Presidents of KL SAC." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {presidents.length > 0
              ? presidents.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="President" />)}
          </div>
        </div>
      </section>

      {/* ── Vice Presidents ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Vice Presidents" sub="Domain & division leadership." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
            {vps.length > 0
              ? vps.map(m => <MemberCard key={m.id} member={m} />)
              : Array.from({ length: 7 }).map((_, i) => <MemberCard key={i} roleFallback="Vice President" />)}
          </div>
        </div>
      </section>

      {/* ── Secretaries ─────────────────────────────────────────────── */}
      {(secs.length > 0 || jsecs.length > 0) && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <SectionLabel label="Secretaries" sub="Division heads & coordinators." />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...secs, ...jsecs].map(m => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Club Leads ──────────────────────────────────────────────── */}
      {clubs.length > 0 && (
        <section style={{ background: '#fff' }}>
          <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
            <SectionLabel label="Club Leads" sub={`Coordinators of all ${clubs.length} clubs.`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {clubs.map(club => {
                const lead = members.find(
                  m => m.role === 'Club Lead' && m.club_lead === club.name,
                );
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
