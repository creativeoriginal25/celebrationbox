import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';
import { Confetti, ConfettiRef } from './react-bits/Confetti';
import GradientText from './react-bits/GradientText';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const [logoKey, setLogoKey] = useState<number>(0);

  useEffect(() => {
    // Fire festive celebration cannons when the gift box lid pops open
    const timer = setTimeout(() => {
      confettiRef.current?.cannons();
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  const handleBoxClick = () => {
    // Click on the gift box fires an upward celebration burst and replays the celebratory pop
    setLogoKey((prev) => prev + 1);
    confettiRef.current?.burst();
  };

  return (
    <section
      id="home"
      className="relative pt-8 pb-16 sm:pt-12 md:pt-20 md:pb-28 overflow-hidden scroll-mt-28 text-center"
    >
      {/* Official Celebration Confetti Engine - Confined to upper hero, strictly behind UI elements */}
      <Confetti
        ref={confettiRef}
        colors={['#5227FF', '#FF9FFC', '#B19EEF', '#E91E63', '#FFB400', '#00A8A8']}
        shapes={['rect', 'strip', 'circle']}
        size={14}
        burst={true}
        burstCount={110}
        burstPower={1}
        burstSpread={70}
        autoplay={false}
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

        {/* Main Centered Composition Container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* ELEMENT 1: TOP BRAND BADGE (With ~32-36px spacing to the main logo) */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-pink-50 border border-brand-pink-200/80 text-xs font-bold tracking-wider uppercase mb-8 sm:mb-9 shadow-xs select-none">
            <Sparkles className="w-3.5 h-3.5 text-brand-pink fill-brand-pink/20" />
            <GradientText
              colors={['#E91E63', '#FF4081', '#FFB400', '#00A8A8']}
              animationSpeed={6}
              variant="flow"
              className="font-bold tracking-wider"
            >
              ✦ CURATED DIY CELEBRATION KITS
            </GradientText>
          </div>

          {/* ELEMENT 2: CELEBRATION BOX MAIN HERO LOGO (Responsive: ~300-310px on 360px viewport, perfectly centered) */}
          <div
            onClick={handleBoxClick}
            title="Click to celebrate!"
            className="w-full flex items-center justify-center mb-5 sm:mb-7 select-none cursor-pointer px-2"
          >
            <div className="relative flex items-center justify-center w-full">
              {/* Soft celebratory ambient highlight glow behind the logo */}
              <div
                className="absolute w-72 sm:w-96 md:w-[32rem] h-20 sm:h-32 bg-gradient-to-r from-brand-pink/15 via-brand-marigold/15 to-brand-teal/15 rounded-full blur-2xl opacity-60 pointer-events-none"
                aria-hidden="true"
              />
              <CelebrationBoxLogo
                key={logoKey}
                className="w-[min(90vw,310px)] h-auto sm:w-auto sm:h-32 md:h-40 lg:h-48 max-w-full mx-auto relative z-10 filter drop-shadow-xs transition-transform"
                animated={true}
              />
            </div>
          </div>

          {/* ELEMENT 3: MAIN HEADLINE (Mobile: 28px, 800 weight, 1.12 line height, wraps into 2 balanced lines) */}
          <h1 className="font-display font-extrabold text-[28px] leading-[1.12] sm:text-5xl lg:text-6xl text-brand-ink tracking-tight mb-3 sm:mb-4 max-w-3xl mx-auto px-3 text-center">
            <span className="block sm:inline">Make Every Celebration</span>{' '}
            <span className="relative inline-block text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-3 underline-offset-8">
              Special.
            </span>
          </h1>

          {/* ELEMENT 4: SUPPORTING DESCRIPTION (Mobile: 14.5px, 1.5 line height, comfortable padding) */}
          <p className="text-[14.5px] leading-[1.5] sm:text-base md:text-lg text-brand-ink-light max-w-[340px] sm:max-w-xl md:max-w-2xl mx-auto font-normal mb-2.5 px-4 text-center">
            Beautiful DIY birthday decorations, thoughtfully curated and packed into one celebration box.
          </p>

          {/* ELEMENT 5: BRAND SUPPORTING LINE (Mobile: 12.5px, balanced line wrap) */}
          <p className="text-[12.5px] leading-snug sm:text-xs md:text-sm font-medium text-brand-ink-muted mb-6 sm:mb-8 px-4 max-w-sm sm:max-w-none mx-auto text-center">
            DIY Celebration Kits • Easy to Set Up • Made for Your Moments
          </p>

          {/* ELEMENT 6: ACTION BUTTONS (48px height, isolated above confetti, full-width responsive within screen margins) */}
          <div className="relative z-20 isolate flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[340px] sm:max-w-none mx-auto px-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 h-[48px] rounded-xl text-[15px] font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer pointer-events-auto"
            >
              <span>Explore Celebration Boxes</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => onOpenOrder('signature-celebration-box')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 h-[48px] rounded-xl text-[15px] font-semibold text-brand-ink bg-white hover:bg-brand-cream-100 border border-brand-ink/15 shadow-sm active:scale-98 transition-all cursor-pointer pointer-events-auto"
            >
              <MessageCircle className="w-4 h-4 text-brand-teal shrink-0" />
              <span>Order on WhatsApp</span>
            </button>
          </div>

        </div>
      </Confetti>
    </section>
  );
};
