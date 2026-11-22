import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Confetti, ConfettiRef } from './react-bits/Confetti';
import { HERO_CONFIG } from '../config/hero';
import { HeroProductVisual } from './hero/HeroProductVisual';
import { TrustChips } from './hero/TrustChips';
import { HeroActions } from './hero/HeroActions';
import { SocialProof } from './hero/SocialProof';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder?: (productId?: 'mini-celebration-box' | 'signature-celebration-box' | string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleVisualClick = () => {
    // Subtle festive burst on interacting with the product visual
    confettiRef.current?.burst();
    if (onExplore) {
      onExplore();
    }
  };

  const handleWhatsAppAction = () => {
    if (onOpenOrder) {
      onOpenOrder('signature-celebration-box');
    }
  };

  return (
    <section
      id="home"
      className="relative pt-2 pb-12 sm:pt-6 sm:pb-16 md:pt-10 md:pb-20 overflow-hidden scroll-mt-24 text-center md:text-left"
    >
      {/* Official Confetti Engine - Contained behind UI */}
      <Confetti
        ref={confettiRef}
        colors={['#E91E63', '#FFB400', '#00A8A8', '#D8B4E2', '#FFB6C1']}
        shapes={['rect', 'strip', 'circle']}
        size={12}
        burst={false}
        burstCount={75}
        autoplay={false}
        className="relative"
      >
        {/* Subtle decorative dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.20]"
          style={{
            backgroundImage: 'radial-gradient(#2B2B3A 0.75px, transparent 0.75px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Main Composition Container */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ============================================================== */}
          {/* MOBILE-FIRST HERO LAYOUT (Stacked on Mobile, 2-Col on Desktop) */}
          {/* ============================================================== */}
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 lg:gap-12 md:items-center">
            
            {/* ------------------------------------------------------------ */}
            {/* LEFT / UPPER COLUMN: Narrative, Headline & CTAs              */}
            {/* ------------------------------------------------------------ */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-span-7 lg:col-span-6 z-10">
              
              {/* 1. PREMIUM BADGE (Single sparkle, lightweight lavender/pink pill) */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50/90 border border-brand-pink/20 text-[11px] sm:text-xs font-bold text-brand-pink tracking-wider uppercase mb-2.5 sm:mb-3.5 shadow-xs select-none"
              >
                <span>{HERO_CONFIG.badge.icon}</span>
                <span>{HERO_CONFIG.badge.text}</span>
              </motion.div>

              {/* 2. MAIN HEADLINE (Two-line editorial typography clamp(30px, 8vw, 36px) on mobile) */}
              <motion.h1
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-extrabold text-[30px] leading-[1.12] xs:text-[32px] sm:text-5xl lg:text-6xl text-brand-ink tracking-tight mb-2 sm:mb-3 max-w-[340px] xs:max-w-[360px] sm:max-w-xl md:max-w-none"
              >
                <span className="block sm:inline">{HERO_CONFIG.headline.line1}</span>{' '}
                <span className="relative inline-block text-brand-pink">
                  {HERO_CONFIG.headline.highlight}
                  {/* Custom SVG Wavy Underline */}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-2.5 text-brand-marigold overflow-visible pointer-events-none"
                    viewBox="0 0 120 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M 2 7 Q 16 0 30 7 Q 44 14 58 7 Q 72 0 86 7 Q 100 14 118 7"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h1>

              {/* 3. SUPPORTING COPY (14-15px on mobile, concise 2 lines) */}
              <motion.p
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14px] leading-[1.45] sm:text-base text-brand-ink-light max-w-[320px] xs:max-w-[340px] sm:max-w-lg font-normal mb-3 sm:mb-5"
              >
                {HERO_CONFIG.subtitle}
              </motion.p>

              {/* DESKTOP ONLY: Actions on Left Column */}
              <div className="hidden md:flex flex-col items-start gap-3 w-full">
                <HeroActions
                  onExplore={onExplore}
                  onWhatsAppOrder={onOpenOrder ? handleWhatsAppAction : undefined}
                  className="mx-0"
                />
                <SocialProof className="pt-1" />
              </div>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT / MIDDLE COLUMN: Product Centerpiece Visual & Chips    */}
            {/* ------------------------------------------------------------ */}
            <div className="w-full flex flex-col items-center md:col-span-5 lg:col-span-6 mt-1 sm:mt-2 md:mt-0 mb-3 sm:mb-4 md:mb-0 z-10">
              {/* Product Visual Container (Centered, 22-24px rounded, glow) */}
              <HeroProductVisual onImageClick={handleVisualClick} />

              {/* Trust Chips Row (From ₹299 • Free Campus Pickup • DIY Setup) */}
              <TrustChips className="mt-2.5 sm:mt-3" />
            </div>

            {/* ------------------------------------------------------------ */}
            {/* MOBILE ONLY: Call to Actions & Social Proof                  */}
            {/* ------------------------------------------------------------ */}
            <div className="md:hidden w-full flex flex-col items-center mt-2.5 z-10">
              <HeroActions
                onExplore={onExplore}
                onWhatsAppOrder={onOpenOrder ? handleWhatsAppAction : undefined}
              />
              <SocialProof className="mt-2" />
            </div>

          </div>

        </div>
      </Confetti>
    </section>
  );
};
