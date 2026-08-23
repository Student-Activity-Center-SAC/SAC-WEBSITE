'use client';

import { useEffect } from 'react';

/**
 * Prevents iOS Safari rubber-band overscroll at the top of the page.
 * `overscroll-behavior: none` works on Android/Firefox but not iOS Safari;
 * on iOS the only reliable fix is suppressing touchmove via JS when the
 * page is already scrolled to the top and the user is pulling downward.
 */
export default function NoOverscroll() {
  useEffect(() => {
    let startY = 0;

    const onStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onMove = (e: TouchEvent) => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const pullingDown = e.touches[0].clientY > startY;
      if (scrollTop <= 0 && pullingDown && e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
    };
  }, []);

  return null;
}
