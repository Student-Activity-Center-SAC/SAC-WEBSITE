'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CRIMSON = '#8B0000';
const DARK    = '#09090B';
const DISPLAY = "'Arial Black','Helvetica Neue',Arial,sans-serif";
const SANS    = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const DRAW    = [0.76, 0, 0.24, 1] as [number, number, number, number];

/* â”€â”€ Word reel â€” alternates white / crimson â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   "LIVE" is last and gets its own held scene with branding  */
const WORDS = [
  { text: 'DREAM',    red: false }, // aspiration
  { text: 'CODE',     red: true  }, // TEC
  { text: 'LEAD',     red: false }, // leadership
  { text: 'DANCE',    red: true  }, // LCH
  { text: 'BUILD',    red: false }, // creation
  { text: 'SERVE',    red: true  }, // ESO
  { text: 'RISE',     red: false }, // growth
  { text: 'INNOVATE', red: true  }, // IIE
  { text: 'PERFORM',  red: false }, // LCH
  { text: 'THRIVE',   red: true  }, // HWB
  { text: 'CREATE',   red: false }, // arts & craft
  { text: 'ACHIEVE',  red: true  }, // accomplishment
  { text: 'INSPIRE',  red: false }, // impact
  { text: 'LIVE',     red: true  }, // ← held with KL SAC branding
];

const WORD_MS  = 150;
const LAST_IDX = WORDS.length - 1;

type Phase = 'reel' | 'live-scene' | 'kl-sac' | 'tagline';

// Survives client-side navigation (SPA) but resets on full page reload
let _introShown = false;

export function IntroAnimation() {
  const [idx,     setIdx]     = useState(0);
  const [phase,   setPhase]   = useState<Phase>('reel');
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  const dismiss = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setVisible(false);
  }, []);

  useEffect(() => {
    if (_introShown) return;

    // Skip on F5 refresh or browser back/forward
    const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type;
    if (navType === 'reload' || navType === 'back_forward') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    _introShown = true;
    setVisible(true);

    const ts: ReturnType<typeof setTimeout>[] = [];

    /* Schedule every word in the reel */
    WORDS.forEach((_, i) => ts.push(setTimeout(() => setIdx(i), i * WORD_MS)));

    const reelEnd = WORDS.length * WORD_MS; // after LIVE's own flash

    /* After LIVE flashes, hold it with branding */
    ts.push(setTimeout(() => setPhase('live-scene'), reelEnd));

    /* KL SAC beat */
    ts.push(setTimeout(() => setPhase('kl-sac'),  reelEnd + 700));

    /* Transition to tagline */
    ts.push(setTimeout(() => setPhase('tagline'), reelEnd + 700 + 520));

    /* Auto-dismiss after tagline is felt */
    ts.push(setTimeout(dismiss, reelEnd + 700 + 520 + 520));

    return () => ts.forEach(clearTimeout);
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, transition: { duration: 0.65, ease: 'easeIn' } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer select-none"
          style={{ background: DARK }}
          onClick={dismiss}
          aria-hidden="true"
        >

          {/* â•â• Word reel + LIVE scene â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {(phase === 'reel' || phase === 'live-scene') && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* The current word.
                  LIVE uses a stable key so it doesn't re-punch when the
                  phase switches from reel â†’ live-scene.                   */}
              <motion.p
                key={idx === LAST_IDX ? 'live-word' : `w${idx}`}
                initial={{ scale: 1.1, opacity: 1 }}
                animate={{ scale: 1,   opacity: 1 }}
                transition={{ duration: 0.09, ease: 'easeOut' }}
                style={{
                  margin: 0,
                  fontFamily: DISPLAY, fontWeight: 900,
                  fontSize: 'clamp(52px, 13vw, 128px)',
                  letterSpacing: '0.05em',
                  color: WORDS[idx].red ? CRIMSON : '#FFFFFF',
                  userSelect: 'none',
                }}
              >
                {WORDS[idx].text}
              </motion.p>

            </div>
          )}

          {/* â•â• KL SAC â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {phase === 'kl-sac' && (
            <motion.div
              key="kl-sac"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              style={{ lineHeight: 1, whiteSpace: 'nowrap' }}
            >
              <span style={{
                fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(52px, 13vw, 128px)',
                letterSpacing: '0.05em', color: '#FFFFFF',
              }}>
                KL{' '}
              </span>
              <span style={{
                fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(52px, 13vw, 128px)',
                letterSpacing: '0.05em', color: CRIMSON,
              }}>
                SAC
              </span>
            </motion.div>
          )}

          {/* â•â• YOUR TIME. tagline â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {phase === 'tagline' && (
            <motion.div
              key="tagline"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.26, ease: 'easeOut' }}
              style={{ textAlign: 'center', lineHeight: 1 }}
            >
              <p style={{
                margin: 0, fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(40px, 8vw, 88px)',
                letterSpacing: '0.06em', color: '#FFFFFF',
              }}>
                YOUR
              </p>
              <p style={{
                margin: 0, fontFamily: DISPLAY, fontWeight: 900,
                fontSize: 'clamp(40px, 8vw, 88px)',
                letterSpacing: '0.06em', color: CRIMSON,
              }}>
                TIME.
              </p>
            </motion.div>
          )}

          {/* Tap to skip â€” barely visible */}
          <p style={{
            position: 'absolute', bottom: 22, margin: 0,
            fontFamily: SANS, fontSize: 8,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.16)',
          }}>
            Tap to skip
          </p>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

