'use client';

import Link from 'next/link';
import { Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export interface Member {
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

export function MemberCard({
  member,
  roleFallback,
  nameFallback,
  compact = false,
  colorized = false,
}: {
  member?: Member;
  roleFallback?: string;
  nameFallback?: string;
  compact?: boolean;
  colorized?: boolean;
}) {
  const isPlaceholder = !member;
  const initials = member?.name
    ? member.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const [isScanning, setIsScanning] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!member?.linkedin) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    
    // Start scanning effect immediately
    setIsScanning(true);

    // Open profile after 3 seconds of continuous hover
    hoverTimer.current = setTimeout(() => {
      setIsScanning(false);
      window.open(member.linkedin, '_blank');
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsScanning(false);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`group relative rounded-3xl overflow-hidden flex flex-col transition-[filter] duration-700 
        ${!colorized ? 'sm:grayscale' : 'sm:grayscale-0'} 
        ${isPlaceholder ? 'opacity-50' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.6)'
      }}
    >
      {/* Laser Scanner Overlay */}
      <AnimatePresence>
        {isScanning && (
          <>
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: ['-10%', '100%', '-10%', '100%', '-10%', '100%'] }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute left-0 right-0 h-16 z-50 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(151,0,3,0.3) 90%, rgba(216,0,6,0.8) 100%)',
                borderBottom: '2px solid rgba(255, 50, 50, 0.9)',
                boxShadow: '0 4px 15px rgba(216, 0, 6, 0.5)'
              }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(2px)' }}
            >
              <div className="bg-white/95 px-4 py-2.5 rounded-full shadow-lg border border-red-100 flex items-center gap-2 transform transition-transform scale-110">
                <Linkedin size={14} className="text-[#0A66C2]" />
                <span className="text-[10px] font-black text-[#970003] uppercase tracking-widest mt-px">Opening Profile...</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Hover Glow Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" 
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(151,0,3,0.06), transparent 70%)' }} />

      {/* Portrait photo — aspect-[4/5] */}
      <div className="relative w-full bg-transparent overflow-hidden z-0" style={{ aspectRatio: '4/5' }}>
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
              background: isPlaceholder ? 'rgba(0,0,0,0.02)' : 'linear-gradient(135deg,#8B000010 0%,#8B000002 100%)',
              color: isPlaceholder ? '#D4D4D8' : '#8B0000',
            }}>
            {isPlaceholder ? '' : initials}
          </div>
        )}
      </div>

      {/* Info Content - Glassy */}
      <div className={`${compact ? 'px-4 pb-5 pt-3' : 'px-5 pb-6 pt-4'} flex flex-col gap-1 flex-1 relative z-10`}
           style={{ borderTop: '1px solid rgba(255, 255, 255, 0.5)' }}>
        <h3 className={`font-display font-semibold leading-tight text-foreground tracking-tight drop-shadow-sm ${compact ? 'text-[15px] sm:text-[17px]' : 'text-[17px] sm:text-[19px]'}`}>
          {member?.name ?? nameFallback ?? 'Name TBA'}
        </h3>
        
        <p className={`font-semibold tracking-wide ${compact ? 'text-[10px] sm:text-xs' : 'text-[11px] sm:text-[13px]'}`} 
           style={{ 
             background: 'linear-gradient(135deg, #970003 0%, #d80006 100%)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text'
           }}>
          {member?.role ?? roleFallback ?? '—'}
        </p>

        {(member?.subtitle || member?.club_lead || member?.designation) && (
          <p className="text-xs mt-1.5 leading-relaxed text-foreground/70 line-clamp-2 mix-blend-multiply">
            {member.subtitle || member.club_lead || member.designation}
          </p>
        )}

        <div className="flex-1" />

        {member?.linkedin && (
          <Link
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
            style={{ 
              background: 'rgba(10, 102, 194, 0.06)', 
              color: '#0A66C2',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(10, 102, 194, 0.2)'
            }}
            aria-label={`LinkedIn profile for ${member.name}`}>
            <Linkedin size={12} fill="currentColor" /> LinkedIn
          </Link>
        )}
      </div>
    </motion.div>
  );
}
