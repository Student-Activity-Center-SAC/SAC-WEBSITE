'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode, CSSProperties } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'none';
  distance?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  style,
  delay = 0,
  duration = 0.65,
  direction = 'up',
  distance = 24,
  once = true,
}: FadeInProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : (direction === 'up' ? distance : 0) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay }}>
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  once?: boolean;
}

export function Stagger({ children, className, style, stagger = 0.08, once = true }: StaggerProps) {
  const shouldReduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : stagger } },
  };

  const item = {
    hidden:  { opacity: shouldReduce ? 1 : 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}

