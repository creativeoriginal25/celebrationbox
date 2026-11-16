import React, { useRef, useEffect } from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';
import { Confetti, ConfettiRef } from './react-bits/Confetti';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // Fire festive celebration cannons when the gift box lid pops open
    const timer = setTimeout(() => {
      confettiRef.current?.cannons();
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  const handleBoxClick = () => {
    // Click on the gift box fires an upward celebration burst
    confettiRef.current?.burst();
  };

  return (
    <section
      id="home"
      className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden scroll-mt-28 text-center"
    >
      {/* Official React Bits Confetti Engine - Configured with user's exact preset */}
      <Confetti
        ref={confettiRef}
        colors={['#5227FF', '#FF9FFC', '#B19EEF', '#E91E63', '#FFB400', '#00A8A8']}
        shapes={['rect', 'strip', 'circle']}
        size={14}
        sizeVariance={0.4}
        aspect={0.55}
        density={0} // Prevents cursor waterfall completely!
        spread={1}
        inherit={0.25}
        gravity={1}
        drag={1}
        flutter={1}
        spin={1}
        wind={0}
        turbulence={0.5}
        life={6}
        fade={0.25}
        shading={0.5}
        sheen={0.35}
        opacity={1}
        settle={false}
        burst={true}
        burstCount={120}
        burstPower={1}
        burstSpread={70}
        maxPieces={1800}
        autoplay={false}
        autoplaySpeed={1}
        idleDelay={1.5}
        intro={true}
        interactive={true}
        disabled={false}
        className="relative"
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

          {/* ELEMENT 2: CELEBRATION BOX CODE-GENERATED ANIMATED LOGO (ENLARGED & HIGHLIGHTED) */}
          <div
            onClick={handleBoxClick}
            title="Click to celebrate!"
            className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto flex items-center justify-center mb-6 sm:mb-9 select-none cursor-pointer px-2"
          >
            {/* Mobile-only optical center offset (-34px on mobile to perfectly equalize margins, reset to 0 on sm+ desktop) */}
            <div className="relative -translate-x-[34px] sm:translate-x-0 flex items-center justify-center w-full transition-transform">
              {/* Soft celebratory ambient highlight glow behind the logo */}
              <div
                className="absolute w-72 sm:w-96 md:w-[32rem] h-20 sm:h-32 bg-gradient-to-r from-brand-pink/15 via-brand-marigold/15 to-brand-teal/15 rounded-full blur-2xl opacity-60 pointer-events-none"
                aria-hidden="true"
              />
              <CelebrationBoxLogo
                className="h-20 xs:h-24 sm:h-34 md:h-44 lg:h-52 w-auto max-w-full mx-auto relative z-10 filter drop-shadow-xs"
                animated={true}
              />
            </div>
          </div>

          {/* ELEMENT 3: MAIN HEADLINE */}
          <h1 className="font-display font-extrabold text-2xl xs:text-3xl sm:text-5xl lg:text-6xl text-brand-ink tracking-tight leading-[1.16] mb-3 sm:mb-5 max-w-3xl mx-auto px-2">
            Make Every Celebration{' '}
            <span className="text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-3 underline-offset-8">
              Special.
            </span>
          </h1>

          {/* ELEMENT 4: SUPPORTING DESCRIPTION */}
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-brand-ink-light max-w-2xl mx-auto font-normal leading-relaxed mb-3 px-2">
            Beautiful DIY birthday decorations, thoughtfully curated and packed into one celebration box.
          </p>

          {/* ELEMENT 5: BRAND SUPPORTING LINE */}
          <p className="text-[11px] xs:text-xs sm:text-sm font-medium text-brand-ink-muted mb-6 sm:mb-10 px-2">
            DIY Celebration Kits • Easy to Set Up • Made for Your Moments
          </p>

          {/* ELEMENT 6: ACTION BUTTONS (Touch-friendly 48px min height on mobile) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto px-2">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[48px] rounded-xl text-sm sm:text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span>Explore Celebration Boxes</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenOrder('signature-celebration-box')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] rounded-xl text-sm sm:text-base font-semibold text-brand-ink bg-white hover:bg-brand-cream-100 border border-brand-ink/15 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-brand-teal" />
              <span>Order on WhatsApp</span>
            </button>
          </div>

        </div>
      </Confetti>
    </section>
  );
};
