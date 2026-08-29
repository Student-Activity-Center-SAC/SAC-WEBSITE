'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideo = () => {
      if (videoRef.current) {
        videoRef.current.src = src;
        videoRef.current.play().catch(() => {});
      }
    };

    if (document.readyState === 'complete') {
      loadVideo();
    } else {
      window.addEventListener('load', loadVideo);
      return () => window.removeEventListener('load', loadVideo);
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      aria-hidden="true"
    />
  );
}
