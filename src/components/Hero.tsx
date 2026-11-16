import React, { useState } from 'react';
import { ArrowRight, MessageCircle, Sparkles, RotateCcw } from 'lucide-react';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const [animKey, setAnimKey] = useState<number>(0);
  const [, setIsAnimationFinished] = useState<boolean>(false);

  const handleReplay = () => {
    setIsAnimationFinished(false);
    setAnimKey((prev) => prev + 1);
  };

  return (
    <section
      id="home"
      className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden scroll-mt-28 text-center"
    >
      {/* Subtle decorative dot pattern background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(#2B2B3A 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Main Centered Composition Container (~1100px max-width) */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* ELEMENT 1: TOP BRAND BADGE */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-pink-50 border border-brand-pink-200/80 text-brand-pink-700 text-xs font-bold tracking-wider uppercase mb-6 sm:mb-8 shadow-xs select-none">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink fill-brand-pink/20" />
          <span>✦ CURATED DIY CELEBRATION KITS</span>
        </div>

        {/* ELEMENT 2: CELEBRATION BOX CODE-GENERATED ANIMATED LOGO */}
        <div className="relative group w-full max-w-md sm:max-w-xl mx-auto flex flex-col items-center justify-center mb-6 sm:mb-8 select-none">
          <CelebrationBoxLogo
            key={animKey}
            className="h-20 sm:h-24 md:h-28 w-auto max-w-full mx-auto"
            animated={true}
            onAnimationComplete={() => setIsAnimationFinished(true)}
            interactive={true}
          />
          {/* Subtle replay button that appears smoothly on hover */}
          <button
            onClick={handleReplay}
            title="Replay intro animation"
            aria-label="Replay intro animation"
            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-brand-ink-muted hover:text-brand-pink bg-white/70 hover:bg-white rounded-full border border-brand-ink/10 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-brand-marigold" />
            <span>Replay</span>
          </button>
        </div>

        {/* ELEMENT 3: MAIN HEADLINE */}
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-brand-ink tracking-tight leading-[1.14] mb-4 sm:mb-5 max-w-3xl mx-auto">
          Make Every Celebration{' '}
          <span className="text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-3 underline-offset-8">
            Special.
          </span>
        </h1>

        {/* ELEMENT 4: SUPPORTING DESCRIPTION */}
        <p className="text-sm sm:text-base md:text-lg text-brand-ink-light max-w-2xl mx-auto font-normal leading-relaxed mb-3">
          Beautiful DIY birthday decorations, thoughtfully curated and packed into one celebration box.
        </p>

        {/* ELEMENT 5: BRAND SUPPORTING LINE */}
        <p className="text-xs sm:text-sm font-medium text-brand-ink-muted mb-8 sm:mb-10">
          DIY Celebration Kits • Easy to Set Up • Made for Your Moments
        </p>

        {/* ELEMENT 6: ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span>Explore Celebration Boxes</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenOrder('signature-celebration-box')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-brand-ink bg-white hover:bg-brand-cream-100 border border-brand-ink/15 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-brand-teal" />
            <span>Order on WhatsApp</span>
          </button>
        </div>

      </div>
    </section>
  );
};
