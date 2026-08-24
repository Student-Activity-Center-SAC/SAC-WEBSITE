'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { DOMAINS } from '@/lib/content/domains';

type Filter = 'all' | 'TEC' | 'LCH' | 'HWB' | 'ESO' | 'IIE';

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Clubs' },
  { value: 'TEC', label: 'Technology' },
  { value: 'LCH', label: 'Liberal Arts' },
  { value: 'ESO', label: 'Social Outreach' },
  { value: 'HWB', label: 'Health & Wellbeing' },
  { value: 'IIE', label: 'Innovation' },
];

interface Club {
  id: string;
  slug: string;
  name: string;
  domain_code: string;
  domain_slug: string;
  tagline: string;
  logo_url?: string;
}

interface Props { clubs: Club[]; }

export default function ClubsPageClient({ clubs }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const filteredClubs = q
    ? clubs.filter(c => c.name.toLowerCase().includes(q) || c.tagline?.toLowerCase().includes(q))
    : clubs;

  const visibleDomains = DOMAINS.filter(d => filter === 'all' || d.code === filter);
  const totalClubs = clubs.length;
  const totalDomains = [...new Set(clubs.map(c => c.domain_code))].length;

  return (
    <>
      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section style={{ background: '#fff', paddingTop: '92px', paddingBottom: '0' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pt-10 pb-0">
          <p className="kicker mb-4" style={{ color: '#970003' }}>
            20+ Clubs · {totalDomains} Domains
          </p>
          <h1
            className="font-display font-medium leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0D0D0D', letterSpacing: '-0.025em' }}>
            Find Your Community.
          </h1>
          <p className="text-lg mb-10" style={{ color: '#71717A', maxWidth: '56ch' }}>
            20+ clubs across {totalDomains} domains. Every passion, every ambition — there's a club for you at KL SAC.
          </p>

          {/* Search */}
          <div className="relative mb-5 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A1A1AA' }} />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clubs…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full text-sm outline-none transition-shadow"
              style={{
                background: '#F7F7F8',
                border: '1px solid #E4E4E7',
                color: '#191313',
              }}
              onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px #97000330'; }}
              onBlur={e => { e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 pb-0">
            {FILTER_OPTIONS.map(opt => {
              const domain = DOMAINS.find(d => d.code === opt.value);
              const isActive = filter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className="px-4 py-2 rounded-full text-sm font-bold transition-all"
                  style={{
                    background: isActive ? (domain?.color ?? '#8B0000') : '#F7F7F8',
                    color:      isActive ? '#fff' : '#3F3F46',
                    border:     isActive ? 'none' : '1px solid #E4E4E7',
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Club List ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff' }}>
        <div className="w-full px-6 sm:px-12 xl:px-20 pt-10 pb-24">
          {visibleDomains.map(domain => {
            const domainClubs = filteredClubs.filter(c => c.domain_code === domain.code);
            if (!domainClubs.length) return null;
            return (
              <div key={domain.code} id={domain.code} className="mb-16">
                {/* Domain header */}
                <div
                  className="flex items-center gap-4 py-5 mb-2"
                  style={{ borderBottom: `2px solid ${domain.color}25` }}>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                    style={{ background: domain.accentBg, color: domain.color }}>
                    {domain.code}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base sm:text-lg leading-tight" style={{ color: '#0D0D0D' }}>
                      {domain.name}
                    </p>
                    <p className="text-xs mt-0.5 italic" style={{ color: domain.color }}>
                      {domain.tagline}
                    </p>
                  </div>
                </div>

                {/* Club rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0" style={{ borderTop: '1px solid #F0F0F0' }}>
                  {domainClubs.map(club => (
                    <Link
                      key={club.slug}
                      href={`/clubs/${club.slug}`}
                      className="group flex items-center gap-4 py-4 px-2 transition-colors hover:bg-gray-50 rounded-lg"
                      style={{ borderBottom: '1px solid #F4F4F5' }}>
                      {club.logo_url && (
                        <img
                          src={club.logo_url}
                          alt={club.name}
                          className="w-9 h-9 rounded-lg object-contain shrink-0"
                          style={{ background: domain.accentBg, padding: '4px' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-base leading-tight text-gray-900 group-hover:text-gray-600 transition-colors">
                          {club.name}
                        </p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#A1A1AA' }}>
                          {club.tagline}
                        </p>
                      </div>
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1 shrink-0"
                        style={{ color: '#D1D1D6' }} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredClubs.length === 0 && (
            <div className="py-24 text-center" style={{ color: '#A1A1AA' }}>
              <p className="font-bold text-lg mb-2">{q ? `No clubs matching "${search}"` : 'No clubs found.'}</p>
              {q && <p className="text-sm">Try a different search term.</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
