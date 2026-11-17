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

  // Exact 8.5s cinematic timeline matching the video sequence
  const TOTAL_DURATION_MS = 8500;

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    if (onStartReveal) {
      onStartReveal();
    }
    setTimeout(() => {
      onComplete();
    }, 600); // 600ms graceful fadeout into the website
  }, [onStartReveal, onComplete]);

  // Handle timeline progress
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

  // Audio playback handler
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
          // Autoplay sound blocked by browser policy; keep muted until user tap
          setIsMuted(true);
        });
    }

    // Lock page scrolling during intro
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

  // Block keyboard shortcuts from skipping
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
      {/* Authentic soundtrack playback from original video */}
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

      {/* Warm celebratory ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 230, 180, 0.45) 0%, rgba(255, 255, 255, 0.95) 75%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle dotted celebration grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(#2B2B3A 0.8px, transparent 0.8px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      {/* =========================================================================
          STAGE 0: INITIAL EXPANDING GOLDEN SPARKLE STAR (0s - 1.2s)
         ========================================================================= */}
      <motion.div
        className="absolute z-10 pointer-events-none flex items-center justify-center"
        initial={{ scale: 0, opacity: 0, rotate: -45 }}
        animate={{
          scale: [0, 1.35, 1, 1.4, 0],
          opacity: [0, 1, 0.9, 1, 0],
          rotate: [-45, 0, 15, 30, 45],
        }}
        transition={{
          duration: 1.3,
          times: [0, 0.35, 0.6, 0.85, 1],
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-36 sm:h-36 drop-shadow-sm">
          <path
            d="M 50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z"
            fill="#FFB300"
          />
          <circle cx="28" cy="24" r="3" fill="#FFB300" opacity="0.8" />
          <circle cx="76" cy="28" r="2.5" fill="#FFB300" opacity="0.8" />
          <circle cx="22" cy="72" r="2" fill="#FFB300" opacity="0.8" />
          <circle cx="74" cy="76" r="3" fill="#FFB300" opacity="0.8" />
        </svg>
      </motion.div>

      {/* =========================================================================
          MAIN ANIMATED VECTOR STAGE: EXACT MATCH TO USER'S 3RD REFERENCE IMAGE
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-4xl px-4 sm:px-8 flex items-center justify-center">
        <svg
          viewBox="0 0 1100 370"
          className="w-full h-auto overflow-visible select-none filter drop-shadow-sm"
          role="img"
          aria-label="Celebration Box Intro Animation"
        >
          <defs>
            <linearGradient id="introBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F42B75" />
              <stop offset="100%" stopColor="#D81B60" />
            </linearGradient>
            <linearGradient id="introLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF337E" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>
            <linearGradient id="introRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="50%" stopColor="#FFC107" />
              <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
            <filter id="introBoxGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#E91E63" floodOpacity="0.28" />
            </filter>
            <filter id="introGroundShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>

          {/* Perspective Floor Shadow */}
          <motion.ellipse
            cx="140"
            cy="312"
            rx="78"
            ry="15"
            fill="#2B2B3A"
            opacity="0.16"
            filter="url(#introGroundShadow)"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{
              scale: [0.2, 1.15, 1, 1],
              opacity: [0, 0.25, 0.16, 0.16],
            }}
            transition={{
              delay: 0.8,
              duration: 0.9,
              times: [0, 0.6, 0.85, 1],
              ease: smoothEase,
            }}
          />

          {/* ========================================================
              CELEBRATION ERUPTION (Exact Match to Image 3)
             ======================================================== */}
          <motion.g
            id="intro-eruption"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 2.1,
              duration: 0.75,
              ease: smoothEase,
            }}
            style={{ transformOrigin: '140px 190px' }}
          >
            {/* Golden Fan Burst Rays */}
            <path d="M 205 160 L 265 95 L 252 88 Z" fill="#FFB300" />
            <path d="M 215 175 L 285 130 L 278 120 Z" fill="#FFB300" />
            <path d="M 218 190 L 280 170 L 278 160 Z" fill="#FFB300" />

            {/* 2 Yellow Splash Streaks */}
            <path
              d="M 125 155 Q 135 125 145 145 T 160 135"
              fill="none"
              stroke="#FFB300"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 95 160 Q 80 135 70 145"
              fill="none"
              stroke="#FFB300"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Teal Curly Loop-de-Loop Streamer */}
            <path
              d="M 165 175 C 175 125, 215 95, 230 115 C 242 132, 218 152, 205 138 C 190 120, 210 65, 245 50"
              fill="none"
              stroke="#00A8A8"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Teal Sinusoidal Zigzag Ribbon */}
            <path
              d="M 175 195 Q 190 180 205 195 T 235 185 T 255 195"
              fill="none"
              stroke="#00A8A8"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Big 4-Point Golden Star */}
            <path
              d="M 295 85 Q 295 106 316 106 Q 295 106 295 127 Q 295 106 274 106 Q 295 106 295 85 Z"
              fill="#FFB300"
            />

            {/* Purple Hollow Triangle */}
            <polygon
              points="242,165 258,188 226,188"
              fill="none"
              stroke="#7B1FA2"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Solid Teal Small Triangle */}
            <polygon
              points="155,105 167,122 143,122"
              fill="#00A8A8"
            />

            {/* Confetti Circles & Dots */}
            <circle cx="202" cy="188" r="9" fill="#E91E63" />
            <circle cx="168" cy="122" r="8" fill="#5E17EB" />
            <circle cx="272" cy="148" r="6.5" fill="#FFB300" />
            <circle cx="248" cy="72" r="6" fill="#00A8A8" />
            <circle cx="188" cy="68" r="8" fill="#FFB300" />
            <circle cx="282" cy="182" r="5" fill="#7B1FA2" />
            <circle cx="198" cy="98" r="4.5" fill="#00A8A8" />
          </motion.g>

          {/* ========================================================
              SCULPTED 3D ANGLED BOX BODY
             ======================================================== */}
          <motion.g
            id="intro-box-body"
            filter="url(#introBoxGlow)"
            initial={{ y: -120, scale: 0.5, opacity: 0 }}
            animate={{
              y: [-120, 8, 0, 0],
              scale: [0.5, 1.06, 1, 1],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              delay: 0.8,
              duration: 0.95,
              times: [0, 0.65, 0.85, 1],
              ease: smoothEase,
            }}
          >
            {/* Dark Interior Cavity */}
            <path
              d="M 58 190 Q 132 176 216 190 Q 132 208 58 190 Z"
              fill="#880E3D"
            />

            {/* Warm Inner Glow */}
            <ellipse cx="137" cy="192" rx="45" ry="7" fill="#FFB300" opacity="0.65" />

            {/* Main Sculpted Front Body */}
            <path
              d="M 58 190
                 C 56 220, 60 270, 65 288
                 C 70 300, 85 304, 137 304
                 C 189 304, 204 300, 209 288
                 C 214 270, 218 220, 216 190
                 Q 137 206 58 190 Z"
              fill="url(#introBoxGrad)"
            />

            {/* Left Sheen Line */}
            <path
              d="M 64 195 Q 67 250 72 285 Q 67 245 65 195 Z"
              fill="#FFFFFF"
              opacity="0.25"
            />

            {/* Vertical Center Ribbon */}
            <path
              d="M 122 203
                 Q 137 206 152 203
                 L 150 304
                 Q 137 305 124 304 Z"
              fill="url(#introRibbonGrad)"
            />

            {/* Ribbon Sheen */}
            <path
              d="M 129 204 L 129 304"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              opacity="0.38"
            />
          </motion.g>

          {/* ========================================================
              3D POPPED LID & PLUMP BOW
             ======================================================== */}
          <motion.g
            id="intro-popped-lid"
            initial={{ rotate: 0, x: 20, y: 10, opacity: 0 }}
            animate={{
              rotate: [0, -32, -28],
              x: [20, -5, 0],
              y: [10, -8, 0],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 1.85,
              duration: 0.8,
              times: [0, 0.65, 1],
              ease: smoothEase,
            }}
            style={{ transformOrigin: '58px 190px' }}
          >
            <g transform="translate(42, 222) rotate(-28)">
              {/* Lid Slab 3D Thickness Bottom Lip */}
              <rect
                x="0"
                y="0"
                width="170"
                height="38"
                rx="10"
                fill="#AD1457"
              />

              {/* Lid Slab Main Front Face */}
              <rect
                x="0"
                y="-8"
                width="170"
                height="38"
                rx="10"
                fill="url(#introLidGrad)"
              />

              {/* Lid Top Edge Highlight */}
              <rect
                x="6"
                y="-6"
                width="158"
                height="4"
                rx="2"
                fill="#FFFFFF"
                opacity="0.32"
              />

              {/* Yellow Ribbon Band across the Lid */}
              <rect
                x="70"
                y="-8"
                width="32"
                height="46"
                fill="url(#introRibbonGrad)"
              />

              {/* Plump Double-Loop Ribbon Bow on Top of Lid */}
              <g id="intro-plump-bow" transform="translate(86, -8)">
                <path
                  d="M 0 -4
                     C -25 -38, -65 -32, -58 -6
                     C -52 14, -22 10, 0 0 Z"
                  fill="url(#introRibbonGrad)"
                />
                <path
                  d="M -4 -8 C -22 -28, -50 -24, -44 -6 C -38 8, -16 6, -4 -8 Z"
                  fill="#FFFFFF"
                  opacity="0.28"
                />

                <path
                  d="M 0 -4
                     C 25 -38, 65 -32, 58 -6
                     C 52 14, 22 10, 0 0 Z"
                  fill="url(#introRibbonGrad)"
                />
                <path
                  d="M 4 -8 C 22 -28, 50 -24, 44 -6 C 38 8, 16 6, 4 -8 Z"
                  fill="#FFFFFF"
                  opacity="0.28"
                />

                <ellipse cx="0" cy="-2" rx="10" ry="8" fill="#FFA000" />
                <ellipse cx="-2" cy="-4" rx="5" ry="3" fill="#FFE082" opacity="0.5" />
              </g>
            </g>
          </motion.g>

          {/* ========================================================
              WORDMARK: "Celebration Box"
             ======================================================== */}
          <motion.g
            id="intro-brand-wordmark"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 3.2,
              duration: 0.85,
              ease: smoothEase,
            }}
          >
            <text
              x="330"
              y="255"
              fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontSize="132"
              fontWeight="800"
              letterSpacing="-1.8"
            >
              <tspan fill="#2B2B3A">Celebration </tspan>
              <tspan fill="#E91E63" fontWeight="900">
                Box
              </tspan>
            </text>
          </motion.g>

          {/* ========================================================
              GOLDEN SWOOSH UNDERLINE & SPARKLE
             ======================================================== */}
          <motion.path
            d="M 375 296 Q 595 258 795 276 Q 935 290 1020 276"
            fill="none"
            stroke="#FFB300"
            strokeWidth="11"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              delay: 4.5,
              duration: 1.0,
              ease: smoothEase,
            }}
          />

          <motion.path
            d="M 1042 254 Q 1042 274 1062 274 Q 1042 274 1042 294 Q 1042 274 1022 274 Q 1042 274 1042 254 Z"
            fill="#FFB300"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], rotate: [-45, 0, 10, 0], opacity: 1 }}
            transition={{
              delay: 5.3,
              duration: 0.65,
              type: 'spring',
              bounce: 0.45,
            }}
          />
        </svg>
      </div>

      {/* Thin brand gradient progress bar */}
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
