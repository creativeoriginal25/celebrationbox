import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface IntroCodedAnimationProps {
  onStartReveal?: () => void;
  onComplete: () => void;
}

const smoothEase = [0.16, 1, 0.3, 1] as const;

export const IntroCodedAnimation: React.FC<IntroCodedAnimationProps> = ({
  onStartReveal,
  onComplete,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const TOTAL_DURATION_MS = 8000;

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    if (onStartReveal) {
      onStartReveal();
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onStartReveal, onComplete]);

  useEffect(() => {
    const startTime = performance.now();
    let animId: number;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= TOTAL_DURATION_MS) {
        handleFinish();
      } else {
        animId = requestAnimationFrame(update);
      }
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [handleFinish]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlayingSound(true);
          setIsMuted(false);
        })
        .catch(() => {
          setIsMuted(true);
        });
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.muted || isMuted) {
      audio.muted = false;
      audio.play().then(() => {
        setIsMuted(false);
        setIsPlayingSound(true);
      }).catch(() => {});
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleScreenClick = () => {
    const audio = audioRef.current;
    if (audio && (audio.paused || isMuted)) {
      audio.muted = false;
      audio.play().then(() => {
        setIsMuted(false);
        setIsPlayingSound(true);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'Escape', 'ArrowRight', 'ArrowLeft'].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleScreenClick}
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[999999] bg-[#FFFDF9] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ touchAction: 'none' }}
    >
      <audio
        ref={audioRef}
        src="/intro-video.mp4"
        preload="auto"
        playsInline
      />

      {/* Floating Sound Toggle Button */}
      <button
        onClick={toggleSound}
        type="button"
        aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-brand-ink text-xs font-semibold border border-brand-ink/10 shadow-md cursor-pointer transition-all active:scale-95"
      >
        {isMuted ? (
          <>
            <VolumeX className="w-4 h-4 text-brand-pink" />
            <span className="hidden xs:inline">Tap for Sound</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-emerald-500" />
            <span className="hidden xs:inline">Sound On</span>
          </>
        )}
      </button>

      {/* Subtle dotted celebration grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(#2B2B3A 0.8px, transparent 0.8px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* Main Animated Vector Logo */}
      <div className="relative z-20 w-full max-w-4xl px-4 sm:px-8 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1140 340"
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Celebration Box Intro Animation"
        >
          {/* Rebuilt Clean Gift Box Symbol */}
          <g id="intro-celebration-box-icon" transform="translate(-40, 20) scale(0.8)">
            
            {/* Confetti Background Accents */}
            <motion.g
              id="intro-confetti"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 2.1,
                duration: 0.65,
                type: 'spring',
                bounce: 0.4,
              }}
              style={{ transformOrigin: '180px 160px' }}
            >
              <path d="M 252 64 Q 252 76 264 76 Q 252 76 252 88 Q 252 76 240 76 Q 252 76 252 64 Z" fill="#FFB400" />
              <line x1="222" y1="102" x2="236" y2="88" stroke="#FFB400" strokeWidth="3" strokeLinecap="round" />
              <line x1="236" y1="116" x2="252" y2="110" stroke="#FFB400" strokeWidth="3" strokeLinecap="round" />
              <path d="M 224 130 Q 236 114 248 130 T 272 118" fill="none" stroke="#00A8A8" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="118,92 130,105 108,105" fill="#00A8A8" />
              <circle cx="266" cy="142" r="4.5" fill="#00A8A8" />
              <circle cx="106" cy="72" r="4" fill="#E91E63" />
            </motion.g>

            {/* Box Opening: Rear Rim & Inner Cavity */}
            <g id="intro-box-opening">
              <polygon
                points="105,172 122,148 238,148 255,172"
                fill="#C2185B"
              />
              <line
                x1="122"
                y1="148"
                x2="238"
                y2="148"
                stroke="#AD1457"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Main Gift-Box Body */}
            <motion.g
              id="intro-box-body"
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.8,
                duration: 0.75,
                ease: smoothEase,
              }}
            >
              <path
                d="M 105 172
                   L 255 172
                   L 255 264
                   Q 255 275 244 275
                   L 116 275
                   Q 105 275 105 264
                   Z"
                fill="#E91E63"
              />
            </motion.g>

            {/* Vertical Body Ribbon */}
            <motion.rect
              id="intro-body-ribbon"
              x="165"
              y="172"
              width="30"
              height="103"
              fill="#FFB400"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.85, duration: 0.6, ease: smoothEase }}
              style={{ transformOrigin: '180px 172px' }}
            />

            {/* Floating Tilted Lid */}
            <g transform="translate(155, 106)">
              <motion.g
                id="intro-floating-lid"
                initial={{ rotate: 0, y: 15, opacity: 0 }}
                animate={{ rotate: -18, y: 0, opacity: 1 }}
                transition={{
                  delay: 1.8,
                  duration: 0.7,
                  type: 'spring',
                  bounce: 0.35,
                }}
                style={{ transformOrigin: '0px 0px' }}
              >
                <rect x="-81" y="6" width="162" height="14" rx="4" fill="#C2185B" />
                <rect x="-81" y="-8" width="162" height="14" rx="4" fill="#E91E63" />
                <rect x="-15" y="-8" width="30" height="28" fill="#FFB400" />

                {/* Gift Bow */}
                <g id="intro-gift-bow" transform="translate(0, -8)">
                  <path
                    d="M 0 -2
                       C -12 -20, -28 -16, -23 -2
                       C -19 8, -6 4, 0 -2 Z"
                    fill="#FFB400"
                  />
                  <path
                    d="M 0 -2
                       C 12 -20, 28 -16, 23 -2
                       C 19 8, 6 4, 0 -2 Z"
                    fill="#FFB400"
                  />
                  <path d="M -4 2 Q -10 9 -14 6" fill="none" stroke="#FFB400" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 4 2 Q 10 9 14 6" fill="none" stroke="#FFB400" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="0" cy="-2" rx="6" ry="5" fill="#FFA000" />
                </g>
              </motion.g>
            </g>
          </g>

          {/* Wordmark: "Celebration Box" */}
          <motion.text
            x="245"
            y="234"
            fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="110"
            fontWeight="800"
            letterSpacing="-1.8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.0, duration: 0.8, ease: smoothEase }}
          >
            <tspan fill="#2B2B3A">Celebration </tspan>
            <tspan fill="#E91E63" fontWeight="900">
              Box
            </tspan>
          </motion.text>

          {/* Dynamic Golden Swoosh Underline */}
          <motion.path
            d="M 295 272 Q 535 236 745 252 Q 895 264 990 252"
            fill="none"
            stroke="#FFB400"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 4.2, duration: 0.9, ease: smoothEase }}
          />

          {/* 4-point Sparkle Star */}
          <motion.path
            d="M 1012 232 Q 1012 252 1032 252 Q 1012 252 1012 272 Q 1012 252 992 252 Q 1012 252 1012 232 Z"
            fill="#FFB400"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], rotate: [-45, 0], opacity: 1 }}
            transition={{ delay: 5.0, duration: 0.6, type: 'spring', bounce: 0.45 }}
          />
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-ink/5 z-20">
        <div
          className="h-full bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default IntroCodedAnimation;
