import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CelebrationBoxLogoProps {
  className?: string;
  animated?: boolean;
  onAnimationComplete?: () => void;
  variant?: 'light' | 'dark'; // 'light' is default (for light backgrounds), 'dark' for dark backgrounds
  interactive?: boolean; // Hover bounce on lid
}

export const CelebrationBoxLogo: React.FC<CelebrationBoxLogoProps> = ({
  className = 'h-16 w-auto',
  animated = false,
  onAnimationComplete,
  variant = 'light',
  interactive = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Text color based on background variant
  const celebrationTextColor = variant === 'dark' ? '#FFFFFF' : '#2B2B3A';
  const boxTextColor = '#E91E63'; // Rani pink
  const ribbonColor = '#FFB400'; // Marigold yellow
  const ribbonAccent = '#FFA000';
  const boxColor = '#E91E63'; // Rani pink
  const tealColor = '#00A8A8'; // Teal

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 490 145"
      className={`${className} select-none overflow-visible`}
      role="img"
      aria-label="Celebration Box Logo"
      whileHover={interactive && !isAnimated ? 'hover' : undefined}
    >
      <defs>
        {/* Soft Drop Shadow for Box elements */}
        <filter id="boxGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#2B2B3A" floodOpacity="0.12" />
        </filter>
        <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FFB400" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* ========================================================
          1. GIFT BOX GRAPHIC (LEFT SIDE)
         ======================================================== */}
      <g filter="url(#boxGlow)">
        
        {/* Confetti & Streamers Bursting Out */}
        <g id="confetti-burst">
          {/* Yellow Sparkle Star Top-Right of Box */}
          <motion.path
            d="M 112 24 Q 112 32 120 32 Q 112 32 112 40 Q 112 32 104 32 Q 112 32 112 24 Z"
            fill={ribbonColor}
            filter="url(#starGlow)"
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.25, 1], opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
            variants={{
              hover: { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0], transition: { duration: 0.6 } }
            }}
          />

          {/* Teal Serpentine Streamer */}
          <motion.path
            d="M 76 54 Q 90 38 102 46 T 118 36"
            fill="none"
            stroke={tealColor}
            strokeWidth="5"
            strokeLinecap="round"
            initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.55, ease: 'easeOut' }}
          />

          {/* Pink Confetti Dot */}
          <motion.circle
            cx="110"
            cy="56"
            r="4.5"
            fill={boxColor}
            initial={isAnimated ? { scale: 0, y: 16 } : false}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4, type: 'spring', bounce: 0.5 }}
          />

          {/* Yellow Confetti Drops / Firework Sprays */}
          <motion.path
            d="M 54 50 C 50 44 58 38 62 46 C 64 50 58 54 54 50 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, y: 12, opacity: 0 } : false}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.4, type: 'spring', bounce: 0.4 }}
          />
          <motion.path
            d="M 70 38 C 68 30 76 26 78 34 C 79 38 74 42 70 38 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, y: 14, opacity: 0 } : false}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.36, duration: 0.4, type: 'spring', bounce: 0.4 }}
          />
        </g>

        {/* Gift Box Base */}
        <motion.g
          initial={isAnimated ? { scale: 0.75, opacity: 0, y: 10 } : false}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.45, type: 'spring', damping: 15 }}
        >
          {/* Main Box Body (Tapered with rounded corners) */}
          <path
            d="M 33 68 L 95 68 C 99 68 102 71 101 75 L 95 113 C 94 119 89 123 83 123 L 43 123 C 37 123 33 119 32 113 L 28 75 C 27 71 30 68 33 68 Z"
            fill={boxColor}
          />
          {/* Warm Yellow Vertical Ribbon */}
          <path
            d="M 58 68 L 70 68 L 68 123 L 60 123 Z"
            fill={ribbonColor}
          />
        </motion.g>

        {/* Gift Box Lid & Bow (Animated Elastic Pop) */}
        <motion.g
          initial={isAnimated ? { rotate: 0, y: 14, x: 0 } : { rotate: -20, y: -6, x: -8 }}
          animate={{ rotate: -20, y: -6, x: -8 }}
          transition={
            isAnimated
              ? {
                  delay: 0.22,
                  duration: 0.65,
                  type: 'spring',
                  stiffness: 280,
                  damping: 14,
                }
              : undefined
          }
          variants={{
            hover: {
              rotate: [-20, -26, -18, -20],
              y: [-6, -10, -5, -6],
              transition: { duration: 0.5, ease: 'easeInOut' }
            }
          }}
          style={{ transformOrigin: '30px 66px' }}
        >
          {/* Yellow Ribbon Bow on Lid */}
          <g transform="translate(48, 14)">
            {/* Left Bow Loop */}
            <path
              d="M 12 28 C 4 11 -5 19 3 28 C 9 32 12 30 14 30 Z"
              fill={ribbonColor}
            />
            {/* Right Bow Loop */}
            <path
              d="M 16 30 C 18 30 21 32 27 28 C 35 19 26 11 18 28 Z"
              fill={ribbonColor}
            />
            {/* Bow Knot */}
            <circle cx="15" cy="29" r="3.8" fill={ribbonAccent} />
          </g>

          {/* Lid Rectangle with soft corners */}
          <rect
            x="22"
            y="43"
            width="80"
            height="17"
            rx="5.5"
            fill={boxColor}
            stroke="#D81B60"
            strokeWidth="0.8"
          />
        </motion.g>

      </g>

      {/* ========================================================
          2. TYPOGRAPHY: "Celebration Box"
         ======================================================== */}
      {/* "Celebration" in Dark Ink / White */}
      <motion.text
        x="122"
        y="96"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="52"
        fontWeight="800"
        fill={celebrationTextColor}
        letterSpacing="-0.6"
        initial={isAnimated ? { opacity: 0, x: 105 } : false}
        animate={{ opacity: 1, x: 122 }}
        transition={{ delay: 0.26, duration: 0.45, ease: 'easeOut' }}
      >
        Celebration
      </motion.text>

      {/* "Box" in Rani Pink */}
      <motion.text
        x="386"
        y="96"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="52"
        fontWeight="900"
        fill={boxTextColor}
        letterSpacing="-0.6"
        initial={isAnimated ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, duration: 0.4, type: 'spring', bounce: 0.45 }}
      >
        Box
      </motion.text>

      {/* ========================================================
          3. DYNAMIC YELLOW SWOOSH UNDERLINE & SPARKLE
         ======================================================== */}
      {/* Curved Swoosh starting under "Celebration" and flowing under "Box" */}
      <motion.path
        d="M 152 114 Q 236 97 315 106 Q 380 114 438 108"
        fill="none"
        stroke={ribbonColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.52, duration: 0.65, ease: 'easeInOut' }}
      />

      {/* 4-pointed Sparkle Star at End of Swoosh */}
      <motion.path
        d="M 450 102 Q 450 109 457 109 Q 450 109 450 116 Q 450 109 443 109 Q 450 109 450 102 Z"
        fill={ribbonColor}
        filter="url(#starGlow)"
        initial={isAnimated ? { scale: 0, rotate: -45, opacity: 0 } : false}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.45, type: 'spring', bounce: 0.65 }}
        variants={{
          hover: { scale: [1, 1.4, 1], rotate: [0, 90, 0], transition: { duration: 0.5 } }
        }}
        onAnimationComplete={() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }}
      />
    </motion.svg>
  );
};
