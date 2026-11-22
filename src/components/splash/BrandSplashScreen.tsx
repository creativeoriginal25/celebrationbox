import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBrandLogo } from './AnimatedBrandLogo';

export const SPLASH_STORAGE_KEY = 'celebration_box_splash_seen';

interface BrandSplashScreenProps {
  onComplete: () => void;
}

export const BrandSplashScreen: React.FC<BrandSplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const [isVisible, setIsVisible] = useState(true);
  const isCompletedRef = useRef(false);

  // Complete and cleanly dismiss the splash overlay
  const handleFinish = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
    } catch {
      // ignore storage quota/sandbox limits
    }

    setIsVisible(false);

    // Give 350ms for the exit lift/fade transition before unmounting
    setTimeout(() => {
      onComplete();
    }, 350);
  }, [onComplete]);

  // Reduced motion and keyboard skip listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      handleFinish();
      return;
    }

    // 2. Lock body scroll while splash is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 3. Allow immediate skip via any key
    const handleKeyDown = () => {
      handleFinish();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleFinish]);

  // Orchestrate the 4 animation stages (Total ~1.65 seconds)
  useEffect(() => {
    // Stage 1 (0–300 ms): Logo entrance
    // Stage 2 (300–800 ms): Brand Reveal
    const timerStage2 = setTimeout(() => {
      setStage(2);
    }, 320);

    // Stage 3 (800–1300 ms): Signature detail & tagline
    const timerStage3 = setTimeout(() => {
      setStage(3);
    }, 800);

    // Stage 4 (1300–1650 ms): Homepage transition
    const timerStage4 = setTimeout(() => {
      setStage(4);
      handleFinish();
    }, 1350);

    // Hard fallback failsafe: never trap the user
    const fallbackFailsafe = setTimeout(() => {
      handleFinish();
    }, 2200);

    return () => {
      clearTimeout(timerStage2);
      clearTimeout(timerStage3);
      clearTimeout(timerStage4);
      clearTimeout(fallbackFailsafe);
    };
  }, [handleFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="brand-splash-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          onClick={handleFinish}
          role="presentation"
          aria-label="Celebration Box Welcome Screen - Tap to skip"
          className="fixed inset-0 z-[999999] bg-[#FFF8F0] flex flex-col items-center justify-center p-4 select-none cursor-pointer overflow-hidden pointer-events-auto"
          style={{
            paddingTop: 'env(safe-area-inset-top, 16px)',
            paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          }}
        >
          {/* Subtle warm ambient background glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(#E91E63 0.65px, transparent 0.65px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />

          {/* Centered Brand Animation Sequence */}
          <AnimatedBrandLogo stage={stage} />

          {/* Discreet tap-to-skip hint for mobile shoppers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 0.4 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 sm:bottom-8 text-[11px] font-semibold text-[#2B2B3A]/50 tracking-wider uppercase"
          >
            Tap anywhere to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
