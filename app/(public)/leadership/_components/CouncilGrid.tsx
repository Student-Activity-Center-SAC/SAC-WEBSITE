'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  X, Linkedin, Award, Users, Camera, ChevronRight,
} from 'lucide-react';

const CRIMSON = '#8B0000';

// DB row types
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
  size = 'md',
  onClick,
}: {
  member?: Member;
  roleFallback?: string;
  nameFallback?: string;
  size?: 'lg' | 'md' | 'sm';
  onClick?: (m: Member) => void;
}) {
  const isPlaceholder = !member;
  const photoH = size === 'lg' ? 'h-56' : size === 'md' ? 'h-44' : 'h-32';
  const canClick = !!member && !!onClick;

  const initials = member?.name
    ? member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      role={canClick ? 'button' : undefined}
      tabIndex={canClick ? 0 : undefined}
      onKeyDown={canClick ? e => e.key === 'Enter' && onClick!(member!) : undefined}
      onClick={canClick ? () => onClick!(member!) : undefined}
      className={`group rounded-2xl overflow-hidden flex flex-col transition-all duration-200
        ${canClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl' : 'opacity-60'}`}
      style={{ border: '1px solid #E4E4E7', background: '#fff' }}>

      {/* Photo area */}
      <div
        className={`${photoH} relative overflow-hidden flex items-center justify-center flex-col gap-2`}
        style={{
          background: isPlaceholder
            ? '#F4F4F5'
            : member?.photo
              ? undefined
              : `linear-gradient(135deg, ${CRIMSON}14 0%, ${CRIMSON}06 100%)`,
        }}>

        {member?.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <>
            {isPlaceholder ? (
              <>
                <Camera size={size === 'sm' ? 18 : 24} style={{ color: '#D1D1D6' }} />
                <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#D1D1D6' }}>
                  Photo
                </span>
              </>
            ) : (
              <div
                className={`rounded-full flex items-center justify-center font-black
                  ${size === 'lg' ? 'w-20 h-20 text-3xl' : size === 'md' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg'}`}
                style={{ background: `${CRIMSON}14`, color: CRIMSON }}>
                {initials}
              </div>
            )}
          </>
        )}

        {/* Hover overlay */}
        {canClick && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: `${CRIMSON}DD` }}>
            <ChevronRight size={20} className="text-white" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">View Profile</span>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="px-4 py-3 flex-1">
        <p
          className={`font-black leading-snug truncate ${size === 'lg' ? 'text-base' : 'text-sm'}`}
          style={{ color: isPlaceholder ? '#A1A1AA' : '#0D0D0D' }}>
          {member?.name ?? nameFallback ?? 'Name TBA'}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: isPlaceholder ? '#D1D1D6' : CRIMSON }}>
          {member?.role ?? roleFallback ?? '–'}
        </p>
        {member?.subtitle && (
          <p className="text-[10px] mt-0.5 leading-snug" style={{ color: '#71717A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {member.subtitle}
          </p>
        )}
        {member?.year_of_study && (
          <p className="text-[10px] mt-0.5 truncate" style={{ color: '#A1A1AA' }}>
            {member.year_of_study}{member.branch ? ` · ${member.branch.split(' ')[0]}` : ''}
          </p>
        )}
        {member?.designation && (
          <p className="text-[10px] mt-0.5 truncate" style={{ color: '#A1A1AA' }}>
            {member.designation}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ member, onClose }: { member: Member; onClose: () => void }) {
  const initials = member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-3 sm:p-8"
      style={{ background: 'rgba(9,9,11,0.78)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>

      <div
        className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="h-1.5 shrink-0" style={{ background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON}70)` }} />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* Profile header */}
          <div
            className="px-6 sm:px-8 pt-7 pb-6"
            style={{ background: `linear-gradient(160deg, ${CRIMSON}10 0%, ${CRIMSON}04 100%)` }}>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/8 z-10"
              aria-label="Close profile">
              <X size={15} style={{ color: '#71717A' }} />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-start">

              {/* Photo */}
              <div
                className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center font-black text-2xl"
                style={{ background: `${CRIMSON}14`, color: CRIMSON }}>
                {member.photo
                  ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
                  : initials}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full inline-block mb-2"
                  style={{ background: `${CRIMSON}12`, color: CRIMSON }}>
                  {member.role}
                </span>
                <h2
                  className="font-black text-2xl sm:text-3xl leading-tight mb-1"
                  style={{ color: '#0D0D0D', letterSpacing: '-0.025em' }}>
                  {member.name}
                </h2>
                {member.subtitle && (
                  <p className="text-sm mb-2" style={{ color: '#71717A' }}>{member.subtitle}</p>
                )}

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mb-4">
                  {member.year_of_study && (
                    <span style={{ color: '#3F3F46' }}>{member.year_of_study}</span>
                  )}
                  {member.branch && (
                    <span style={{ color: '#71717A' }}>· {member.branch}</span>
                  )}
                  {member.designation && (
                    <span style={{ color: '#71717A' }}>{member.designation}</span>
                  )}
                  {member.club_lead && (
                    <span style={{ color: CRIMSON }}>· Leads {member.club_lead}</span>
                  )}
                </div>

                {member.linkedin && (
                  <Link
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-85"
                    style={{ background: '#0A66C2', color: '#fff' }}>
                    <Linkedin size={12} />
                    LinkedIn Profile
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E4E4E7' }} />

          {/* Content */}
          <div className="px-6 sm:px-8 py-7 flex flex-col gap-8">

            {/* SAC Journey */}
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase mb-4" style={{ color: CRIMSON }}>
                SAC Journey
              </p>
              {member.journey ? (
                <p className="text-base leading-relaxed" style={{ color: '#3F3F46' }}>
                  {member.journey}
                </p>
              ) : (
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
                  <p className="text-sm" style={{ color: '#A1A1AA' }}>Journey story coming soon.</p>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div>
              <p
                className="text-[10px] font-black tracking-[0.22em] uppercase mb-4 flex items-center gap-2"
                style={{ color: '#A1A1AA' }}>
                <Award size={10} />
                Achievements
              </p>
              {member.achievements && member.achievements.length > 0 ? (
                <ul className="flex flex-col gap-2.5">
                  {member.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                        style={{ background: CRIMSON }} />
                      <span className="text-sm leading-relaxed" style={{ color: '#3F3F46' }}>{ach}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: '#F7F7F8', border: '1.5px dashed #D1D1D6' }}>
                  <p className="text-sm" style={{ color: '#A1A1AA' }}>Achievements will appear here.</p>
                </div>
              )}
            </div>

            {/* Club involvement */}
            {member.clubs_list && member.clubs_list.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-black tracking-[0.22em] uppercase mb-4 flex items-center gap-2"
                  style={{ color: '#A1A1AA' }}>
                  <Users size={10} />
                  Club Involvement
                </p>
                <div className="flex flex-wrap gap-2">
                  {member.clubs_list.map((c, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: `${CRIMSON}10`, color: CRIMSON }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
  const [selected, setSelected] = useState<Member | null>(null);
  const open = useCallback((m: Member) => setSelected(m), []);
  const close = useCallback(() => setSelected(null), []);

  const byRole = (role: string) => members.filter(m => m.role === role);

  const presidents    = byRole('President');
  const vps           = byRole('Vice President');
  const secs          = byRole('Secretary');
  const jsecs         = byRole('Joint Secretary');
  const mentors       = byRole('Faculty Mentor');
  const incharges     = byRole('Faculty In-Charge');
  const deputyDirs    = byRole('Deputy Director');

  return (
    <>
      {/* ── Deputy Directors of SAC ──────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Deputy Directors" sub="Deputy Directors of SAC." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {deputyDirs.length > 0
              ? deputyDirs.map(m => <MemberCard key={m.id} member={m} size="md" onClick={open} />)
              : Array.from({ length: 2 }).map((_, i) => <MemberCard key={i} roleFallback="Deputy Director" size="md" />)}
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
                  ? mentors.map(m => <MemberCard key={m.id} member={m} size="sm" onClick={open} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty Mentor" size="sm" />)}
              </div>
            </div>

            <div>
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: '#A1A1AA' }}>
                Faculty In-Charges
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {incharges.length > 0
                  ? incharges.map(m => <MemberCard key={m.id} member={m} size="sm" onClick={open} />)
                  : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="Faculty In-Charge" size="sm" />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Presidents ──────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Student Council Leadership" sub="Presidents of KL SAC." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {presidents.length > 0
              ? presidents.map(m => <MemberCard key={m.id} member={m} size="lg" onClick={open} />)
              : Array.from({ length: 3 }).map((_, i) => <MemberCard key={i} roleFallback="President" size="lg" />)}
          </div>
        </div>
      </section>

      {/* ── Vice Presidents ─────────────────────────────────────────── */}
      <section style={{ background: '#F7F7F8' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 py-20">
          <SectionLabel label="Vice Presidents" sub="Domain & division leadership." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {vps.length > 0
              ? vps.map(m => <MemberCard key={m.id} member={m} size="md" onClick={open} />)
              : Array.from({ length: 7 }).map((_, i) => <MemberCard key={i} roleFallback="Vice President" size="md" />)}
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
                <MemberCard key={m.id} member={m} size="sm" onClick={open} />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                    size="sm"
                    onClick={lead ? open : undefined}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Profile Modal ────────────────────────────────────────────── */}
      {selected && <ProfileModal member={selected} onClose={close} />}
    </>
  );
}
