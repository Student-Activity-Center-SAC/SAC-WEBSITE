'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useAnimationFrame, wrap } from 'framer-motion';

export default function ClubGalleryMarquee({ photos, clubName }: { photos: string[]; clubName: string }) {
  const [itemWidth, setItemWidth] = useState(400);
  const gap = 20; // 20px gap
  
  useEffect(() => {
    const updateSize = () => {
      // Adjust width based on screen size so 3 images fit nicely on desktop
      setItemWidth(window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 340 : 420);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const baseItems = photos.length > 0 ? photos : [];
  // Ensure we have enough items to fill the screen at least twice for seamless looping
  const repeatCount = Math.max(4, Math.ceil(12 / Math.max(1, baseItems.length)));
  const items = Array.from({ length: repeatCount }).flatMap(() => baseItems);

  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const speed = 1.2; // pixels per frame

  useAnimationFrame(() => {
    if (baseItems.length === 0) return;
    
    let currentX = x.get();
    
    if (!isHovered && !isDragging) {
      currentX -= speed;
    }
    
    const singleSetWidth = baseItems.length * (itemWidth + gap);
    
    if (singleSetWidth > 0) {
      const newX = wrap(-singleSetWidth, 0, currentX);
      x.set(newX);
    }
  });

  if (baseItems.length === 0) return null;

  return (
    <div 
      className="overflow-hidden w-full py-8 cursor-grab active:cursor-grabbing -mx-6 px-6 sm:-mx-12 sm:px-12 xl:-mx-20 xl:px-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDragging(false); }}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => { setIsHovered(false); setIsDragging(false); }}
    >
      <motion.div 
        className="flex"
        style={{ x, gap: `${gap}px` }}
        drag="x"
        dragConstraints={{ left: -100000, right: 100000 }} // large constraints, handled by wrap
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {items.map((src, i) => (
          <div 
            key={i} 
            className="relative shrink-0 rounded-2xl overflow-hidden pointer-events-none" 
            style={{ 
              width: itemWidth, 
              height: itemWidth * (2.5/3), 
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' 
            }}
          >
            <Image
              src={src}
              alt={`${clubName} gallery photo ${i}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes={`${itemWidth}px`}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
