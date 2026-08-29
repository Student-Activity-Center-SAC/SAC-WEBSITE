'use client';

import { useEffect, useRef } from 'react';

export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
      aria-hidden="true"
    />
  );
}
