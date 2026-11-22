import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye } from 'lucide-react';
import { HERO_CONFIG } from '../../config/hero';

interface HeroProductVisualProps {
  onImageClick?: () => void;
  className?: string;
}

export const HeroProductVisual: React.FC<HeroProductVisualProps> = ({
  onImageClick,
  className = '',
}) => {
  return (
    <div className={`relative w-full max-w-[340px] xs:max-w-[360px] sm:max-w-md md:max-w-lg mx-auto ${className}`}>
      {/* 1. Subtle Pink / Lavender Ambient Glow Aura */}
      <div
        className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-brand-pink/20 via-[#D8B4E2]/25 to-brand-marigold/15 rounded-[32px] blur-xl opacity-70 pointer-events-none transform -rotate-1"
        aria-hidden="true"
      />

      {/* 2. Main Product Container with 22-24px rounded corners & subtle 1-1.5deg tilt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={onImageClick}
        className="group relative rounded-[22px] sm:rounded-[24px] bg-white p-2 sm:p-2.5 shadow-[0_12px_36px_-6px_rgba(43,43,58,0.12),0_4px_16px_rgba(233,30,99,0.06)] border border-white/80 overflow-hidden transform rotate-[1deg] hover:rotate-0 transition-transform duration-300 cursor-pointer"
        role="figure"
        aria-label="Pastel Rose Celebration Box Decoration Kit Setup"
      >
        {/* Visual Media Frame with Aspect Ratio */}
        <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full rounded-[16px] sm:rounded-[18px] overflow-hidden bg-brand-cream-100/60">
          <img
            src={HERO_CONFIG.productVisual.image}
            alt={HERO_CONFIG.productVisual.alt}
            width={600}
            height={400}
            fetchPriority="high"
            className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />

          {/* Top Left Floating Micro-Badge */}
          <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-white/70 text-[10px] sm:text-[11px] font-extrabold text-brand-pink tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span>{HERO_CONFIG.productVisual.badge}</span>
          </div>

          {/* Top Right Rose-Gold Sparkle Accent */}
          <div
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#B76E79] shadow-xs"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#B76E79]/20" />
          </div>

          {/* Bottom Caption Pill */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-brand-ink/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="truncate">{HERO_CONFIG.productVisual.caption}</span>
            <span className="inline-flex items-center gap-0.5 text-brand-pink font-bold shrink-0 ml-1">
              <Eye className="w-3 h-3" />
              <span>Tap to view</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
