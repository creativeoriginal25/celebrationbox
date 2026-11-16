import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayed, setHasPlayed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('celebration_box_intro_played') === 'true';
    } catch {
      return false;
    }
  });

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // If user has prefers-reduced-motion, skip video immediately to static logo
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHasPlayed(true);
      return;
    }

    if (!hasPlayed && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted without user interaction; fallback gracefully
      });
    }
  }, [hasPlayed]);

  const handleVideoEnded = () => {
    setHasPlayed(true);
    try {
      localStorage.setItem('celebration_box_intro_played', 'true');
    } catch {
      // ignore
    }
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

        {/* ELEMENT 2: CELEBRATION BOX ANIMATED LOGO / STATIC LOGO */}
        <div className="h-20 sm:h-24 md:h-28 w-full max-w-md sm:max-w-xl mx-auto flex items-center justify-center mb-6 sm:mb-8 select-none">
          {!hasPlayed ? (
            <video
              ref={videoRef}
              src="/videos/celebration-box-intro.mp4"
              poster="/brand/logo.webp"
              autoPlay
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
              onEnded={handleVideoEnded}
              className={`h-full w-auto max-w-full object-contain mix-blend-multiply transition-opacity duration-700 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label="Celebration Box Animated Logo"
            />
          ) : (
            <img
              src="/brand/logo.webp"
              alt="Celebration Box Logo"
              className="h-full w-auto max-w-full object-contain mx-auto animate-fadeIn"
            />
          )}
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
