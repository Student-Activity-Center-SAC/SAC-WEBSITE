'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.src = src;
        videoRef.current.play().catch(() => {});
      }
    }, 100);
    return () => clearTimeout(timer);
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
