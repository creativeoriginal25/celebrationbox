import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          {/* Main 4-point golden star */}
          <path
            d="M 50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z"
            fill="#FFB400"
          />
          {/* Mini accent sparkles */}
          <circle cx="28" cy="24" r="3" fill="#FFB400" opacity="0.8" />
          <circle cx="76" cy="28" r="2.5" fill="#FFB400" opacity="0.8" />
          <circle cx="22" cy="72" r="2" fill="#FFB400" opacity="0.8" />
          <circle cx="74" cy="76" r="3" fill="#FFB400" opacity="0.8" />
        </svg>
      </motion.div>

      {/* =========================================================================
          MAIN ANIMATED VECTOR STAGE: GIFT BOX + CONFETTI + CELEBRATION BOX LOGO
         ========================================================================= */}
      <div className="relative z-20 w-full max-w-4xl px-4 sm:px-8 flex items-center justify-center">
        <svg
          viewBox="0 0 1100 360"
          className="w-full h-auto overflow-visible select-none filter drop-shadow-sm"
          role="img"
          aria-label="Celebration Box Intro Animation"
        >
          <defs>
            {/* Box highlight glow */}
            <filter id="intro-box-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#E91E63" floodOpacity="0.28" />
            </filter>
            {/* Soft ground shadow blur */}
            <filter id="ground-shadow-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* -------------------------------------------------------------------
              1. GIFT BOX GROUP (Lands, opens lid, bursts confetti)
             ------------------------------------------------------------------- */}
          <g id="animated-gift-box-group">
            {/* Ground shadow beneath the box (expands as box lands) */}
            <motion.ellipse
              cx="131"
              cy="312"
              rx="72"
              ry="16"
              fill="#2B2B3A"
              filter="url(#ground-shadow-blur)"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.15, 1, 1],
                opacity: [0, 0.25, 0.18, 0.18],
              }}
              transition={{
                delay: 0.8,
                duration: 0.9,
                times: [0, 0.6, 0.85, 1],
                ease: smoothEase,
              }}
            />

            {/* Complete Gift Box Structure */}
            <motion.g
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
              filter="url(#intro-box-glow)"
            >
              {/* Confetti & Streamer Eruption from inside the box */}
              <motion.g
                id="confetti-eruption"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.25, 1],
                  opacity: [0, 1, 1],
                }}
                transition={{
                  delay: 2.1,
                  duration: 0.8,
                  ease: smoothEase,
                }}
                style={{ transformOrigin: '131px 180px' }}
              >
                {/* Golden burst explosion rays radiating behind */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.85] }}
                  transition={{ delay: 2.15, duration: 0.6 }}
                >
                  <path d="M 130 110 L 126 80 L 134 80 Z" fill="#FFB400" />
                  <path d="M 160 120 L 185 95 L 180 90 Z" fill="#FFB400" />
                  <path d="M 100 120 L 75 95 L 80 90 Z" fill="#FFB400" />
                  <path d="M 175 145 L 205 140 L 205 148 Z" fill="#FFB400" />
                  <path d="M 85 145 L 55 140 L 55 148 Z" fill="#FFB400" />
                </motion.g>

                {/* Big Golden Sparkling 4-point Star shooting up */}
                <motion.path
                  d="M 188 48 Q 188 66 206 66 Q 188 66 188 84 Q 188 66 170 66 Q 188 66 188 48 Z"
                  fill="#FFB400"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: [0, 1.3, 1], rotate: [-45, 0] }}
                  transition={{ delay: 2.2, duration: 0.7, type: 'spring' }}
                />

                {/* Teal Spiraling Ribbon Streamer */}
                <motion.path
                  d="M 140 170 Q 165 125 190 140 T 225 105 T 215 70"
                  fill="none"
                  stroke="#00A8A8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 2.15, duration: 0.75, ease: smoothEase }}
                />

                {/* Secondary Playful Gold Ribbon */}
                <motion.path
                  d="M 120 170 Q 95 130 80 145 T 60 115"
                  fill="none"
                  stroke="#FFB400"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.7, ease: smoothEase }}
                />

                {/* Festive Colorful Confetti Pieces */}
                {/* Rani Pink rect */}
                <motion.rect
                  x="176"
                  y="112"
                  width="12"
                  height="7"
                  rx="2"
                  fill="#E91E63"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 35 }}
                  transition={{ delay: 2.22, duration: 0.4 }}
                />
                {/* Teal triangle */}
                <motion.polygon
                  points="148,82 158,100 138,100"
                  fill="#00A8A8"
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: -20 }}
                  transition={{ delay: 2.25, duration: 0.4 }}
                />
                {/* Marigold dot */}
                <circle cx="165" cy="138" r="6" fill="#FFB400" />
                {/* Purple dot */}
                <circle cx="105" cy="118" r="5.5" fill="#8E24AA" />
                {/* Teal small dot */}
                <circle cx="125" cy="95" r="4.5" fill="#00A8A8" />
                {/* Pink small dot */}
                <circle cx="210" cy="125" r="5" fill="#E91E63" />
                {/* Gold diamond */}
                <motion.rect
                  x="78"
                  y="92"
                  width="9"
                  height="9"
                  fill="#FFB400"
                  initial={{ scale: 0, rotate: 45 }}
                  animate={{ scale: 1, rotate: 45 }}
                  transition={{ delay: 2.28, duration: 0.4 }}
                />
              </motion.g>

              {/* Main Gift Box Body */}
              <g id="box-body">
                <rect
                  x="64"
                  y="170"
                  width="134"
                  height="105"
                  rx="12"
                  fill="#E91E63"
                />
                {/* Top highlight gloss */}
                <path
                  d="M 68 172 Q 66 172 66 176 L 66 210 Q 72 174 105 172 Z"
                  fill="#FFFFFF"
                  opacity="0.24"
                />
                {/* Interior Dark Lip (visible when lid pops open) */}
                <rect
                  x="64"
                  y="170"
                  width="134"
                  height="16"
                  rx="4"
                  fill="#C2185B"
                />
                {/* Warm golden light beam coming from inside */}
                <motion.polygon
                  points="68,172 194,172 230,120 40,120"
                  fill="url(#inner-box-light)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.45, 0.25] }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                />
                {/* Vertical Center Ribbon */}
                <rect
                  x="116"
                  y="170"
                  width="30"
                  height="105"
                  fill="#FFB400"
                />
                {/* Ribbon sheen line */}
                <line
                  x1="122"
                  y1="170"
                  x2="122"
                  y2="275"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  opacity="0.38"
                />
              </g>

              {/* Box Lid & Bow: Opens at 1.9s with spring rotation */}
              <g transform="translate(56, 172)">
                <motion.g
                  initial={{ rotate: 0 }}
                  animate={{
                    rotate: [0, -32, -26],
                    y: [0, -6, -4],
                  }}
                  transition={{
                    delay: 1.9,
                    duration: 0.7,
                    times: [0, 0.65, 1],
                    ease: smoothEase,
                  }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Two-Loop Bow on Top of Lid */}
                  <g transform="translate(75, -28)">
                    {/* Left Bow Loop */}
                    <path
                      d="M 0 0 C -24 -30 -52 -16 -32 4 C -20 11 -9 4 0 0 Z"
                      fill="#FFB400"
                    />
                    <path
                      d="M -4 -4 C -20 -24 -40 -14 -24 2 Z"
                      fill="#FFFFFF"
                      opacity="0.32"
                    />
                    {/* Right Bow Loop */}
                    <path
                      d="M 0 0 C 9 4 20 11 32 4 C 52 -16 24 -30 0 0 Z"
                      fill="#FFB400"
                    />
                    <path
                      d="M 4 -4 C 20 -24 40 -14 24 2 Z"
                      fill="#FFFFFF"
                      opacity="0.32"
                    />
                    {/* Center Bow Knot */}
                    <circle cx="0" cy="2" r="7.5" fill="#FFA000" />
                  </g>

                  {/* Rectangular Lid Bar */}
                  <rect
                    x="0"
                    y="-28"
                    width="150"
                    height="30"
                    rx="8"
                    fill="#E91E63"
                  />
                  {/* Top lid highlight line */}
                  <rect
                    x="6"
                    y="-26"
                    width="138"
                    height="3.5"
                    rx="1.5"
                    fill="#FFFFFF"
                    opacity="0.3"
                  />
                  {/* Ribbon band on lid */}
                  <rect
                    x="60"
                    y="-28"
                    width="30"
                    height="30"
                    fill="#FFB400"
                  />
                </motion.g>
              </g>
            </motion.g>
          </g>

          {/* -------------------------------------------------------------------
              2. WORDMARK: "Celebration Box" (Reveals from 3.2s to 4.8s)
             ------------------------------------------------------------------- */}
          <motion.g
            id="brand-wordmark"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 3.2,
              duration: 0.85,
              ease: smoothEase,
            }}
          >
            <text
              x="254"
              y="234"
              fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
              fontSize="130"
              fontWeight="800"
              letterSpacing="-1.8"
            >
              <tspan fill="#2B2B3A">Celebration </tspan>
              <tspan fill="#E91E63" fontWeight="900">
                Box
              </tspan>
            </text>
          </motion.g>

          {/* -------------------------------------------------------------------
              3. GOLDEN SWOOSH UNDERLINE + SPARKLE (Draws at 4.5s)
             ------------------------------------------------------------------- */}
          {/* Animated Curved Underline Swoosh */}
          <motion.path
            d="M 315 272 Q 535 234 735 252 Q 875 266 980 252"
            fill="none"
            stroke="#FFB400"
            strokeWidth="10.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              delay: 4.5,
              duration: 1.0,
              ease: smoothEase,
            }}
          />

          {/* 4-Pointed Sparkle Star at the End of Swoosh */}
          <motion.path
            d="M 1002 232 Q 1002 252 1022 252 Q 1002 252 1002 272 Q 1002 252 982 252 Q 1002 252 1002 232 Z"
            fill="#FFB400"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], rotate: [-45, 0, 10, 0], opacity: 1 }}
            transition={{
              delay: 5.3,
              duration: 0.65,
              type: 'spring',
              bounce: 0.45,
            }}
          />

          {/* Gentle Floating Sparkles around the finished mark (6.0s+) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1] }}
            transition={{ delay: 5.8, duration: 2.0 }}
          >
            <circle cx="280" cy="140" r="2.5" fill="#FFB400" />
            <circle cx="890" cy="160" r="3" fill="#E91E63" />
            <circle cx="950" cy="190" r="2" fill="#00A8A8" />
            <circle cx="620" cy="130" r="2.5" fill="#FFB400" />
          </motion.g>
        </svg>
      </div>

      {/* =========================================================================
          BOTTOM CELEBRATION PROGRESS BAR (Thin, elegant brand gradient)
         ========================================================================= */}
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
