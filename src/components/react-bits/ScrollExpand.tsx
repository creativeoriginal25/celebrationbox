import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface ScrollExpandProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  children,
  className = '',
  minScale = 0.96,
  maxScale = 1.02,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: 'center center',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
