import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CelebrationBoxLogoProps {
  className?: string;
  animated?: boolean;
  onAnimationComplete?: () => void;
  variant?: 'light' | 'dark'; // 'light' (default) for cream/white surfaces; 'dark' for dark surfaces
  interactive?: boolean; // Hover micro-interactions
}

// Smooth luxurious cubic-bezier easing curve for silky fluid animations
const smoothEase = [0.16, 1, 0.3, 1] as const;

export const CelebrationBoxLogo: React.FC<CelebrationBoxLogoProps> = ({
  className = 'h-24 w-auto',
  animated = false,
  onAnimationComplete,
  variant = 'light',
  interactive = true,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Exact Brand Colors
  const celebrationTextColor = variant === 'dark' ? '#FFFFFF' : '#2B2B3A';
  const boxTextColor = '#E91E63'; // Rani pink
  const ribbonColor = '#FFB400'; // Marigold yellow
  const ribbonAccent = '#FFA000';
  const boxColor = '#E91E63'; // Rani pink
  const lidStrokeColor = '#D81B60';
  const tealColor = '#00A8A8'; // Teal

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 340"
      className={`${className} select-none overflow-visible`}
      role="img"
      aria-label="Celebration Box Logo"
      whileHover={interactive && !isAnimated ? 'hover' : undefined}
    >
      <defs>
        {/* Soft Drop Shadow for Box and Bow */}
        <filter id="logoBoxShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2B2B3A" floodOpacity="0.14" />
        </filter>
        {/* Luminous Glow for Sparkle Stars */}
        <filter id="logoStarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFB400" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ========================================================
          1. FESTIVE GIFT BOX ICON (LEFT SIDE)
         ======================================================== */}
      <g filter="url(#logoBoxShadow)">

        {/* --- Confetti & Streamers Erupting from the Open Box --- */}
        <g id="celebration-burst">
          {/* Top-Right Golden Sparkle Star */}
          <motion.path
            d="M 260 28 Q 260 50 282 50 Q 260 50 260 72 Q 260 50 238 50 Q 260 50 260 28 Z"
            fill={ribbonColor}
            filter="url(#logoStarGlow)"
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: [0, 1.25, 1], opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.6, ease: smoothEase }}
            variants={{
              hover: { scale: [1, 1.35, 1], rotate: [0, 15, -15, 0], transition: { duration: 0.6 } }
            }}
          />

          {/* Teal Serpentine Streamer */}
          <motion.path
            d="M 160 145 C 185 105 215 130 240 95 C 255 75 275 88 270 70"
            fill="none"
            stroke={tealColor}
            strokeWidth="8"
            strokeLinecap="round"
            initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.75, ease: smoothEase }}
          />

          {/* Pink Confetti Dot */}
          <motion.circle
            cx="255"
            cy="125"
            r="9.5"
            fill={boxColor}
            initial={isAnimated ? { scale: 0, y: 25, opacity: 0 } : false}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.44, duration: 0.5, ease: smoothEase }}
          />

          {/* Yellow Confetti / Firework Droplets */}
          <motion.path
            d="M 115 135 C 105 118 125 102 136 118 C 142 128 130 140 115 135 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, y: 20, opacity: 0 } : false}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.36, duration: 0.55, ease: smoothEase }}
          />
          <motion.path
            d="M 152 110 C 146 92 168 80 174 100 C 178 112 162 122 152 110 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, y: 22, opacity: 0 } : false}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.55, ease: smoothEase }}
          />
        </g>

        {/* --- Gift Box Base --- */}
        <motion.g
          initial={isAnimated ? { scale: 0.85, opacity: 0, y: 15 } : false}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }}
        >
          {/* Main Box Body (Tapered with rounded corners) */}
          <path
            d="M 72 175 L 208 175 C 216 175 221 180 219 188 L 204 266 C 201 274 193 280 184 280 L 96 280 C 87 280 79 274 76 266 L 61 188 C 59 180 64 175 72 175 Z"
            fill={boxColor}
          />
          {/* Vertical Warm Yellow Ribbon */}
          <path
            d="M 124 175 L 156 175 L 151 280 L 129 280 Z"
            fill={ribbonColor}
          />
        </motion.g>

        {/* --- Gift Box Lid & Bow (Animated Elastic Pop) --- */}
        <motion.g
          initial={isAnimated ? { rotate: 0, y: 28, x: 10 } : { rotate: -22, y: -10, x: -14 }}
          animate={{ rotate: -22, y: -10, x: -14 }}
          transition={
            isAnimated
              ? {
                  delay: 0.22,
                  duration: 0.75,
                  ease: smoothEase,
                }
              : undefined
          }
          variants={{
            hover: {
              rotate: [-22, -28, -19, -22],
              y: [-10, -18, -8, -10],
              transition: { duration: 0.6, ease: 'easeInOut' }
            }
          }}
          style={{ transformOrigin: '68px 165px' }}
        >
          {/* Yellow Ribbon Bow on Lid */}
          <g transform="translate(140, 130)">
            {/* Left Bow Loop */}
            <path
              d="M -8 -2 C -28 -35 -50 -20 -32 -2 C -20 6 -12 2 -8 2 Z"
              fill={ribbonColor}
            />
            {/* Right Bow Loop */}
            <path
              d="M 8 2 C 12 2 20 6 32 -2 C 50 -20 28 -35 8 -2 Z"
              fill={ribbonColor}
            />
            {/* Center Bow Knot */}
            <circle cx="0" cy="0" r="8" fill={ribbonAccent} />
          </g>

          {/* Lid Rectangle with soft rounded corners */}
          <rect
            x="52"
            y="130"
            width="176"
            height="36"
            rx="11"
            fill={boxColor}
            stroke={lidStrokeColor}
            strokeWidth="1.5"
          />
        </motion.g>

      </g>

      {/* ========================================================
          2. UNIFIED TYPOGRAPHY: "Celebration Box"
          Using a single <text> with <tspan> so text NEVER overlaps!
         ======================================================== */}
      <motion.text
        x="276"
        y="232"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="122"
        fontWeight="800"
        letterSpacing="-1.8"
        initial={isAnimated ? { opacity: 0, y: 245 } : false}
        animate={{ opacity: 1, y: 232 }}
        transition={{ delay: 0.25, duration: 0.65, ease: smoothEase }}
      >
        <tspan fill={celebrationTextColor}>Celebration </tspan>
        <tspan fill={boxTextColor} fontWeight="900">Box</tspan>
      </motion.text>

      {/* ========================================================
          3. DYNAMIC GOLDEN SWOOSH UNDERLINE & SPARKLE
         ======================================================== */}
      {/* Curved Swoosh starting under "Celebration" and flowing under "Box" */}
      <motion.path
        d="M 340 268 Q 545 230 735 248 Q 870 262 970 248"
        fill="none"
        stroke={ribbonColor}
        strokeWidth="9"
        strokeLinecap="round"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.8, ease: smoothEase }}
      />

      {/* 4-pointed Sparkle Star at End of Swoosh */}
      <motion.path
        d="M 992 230 Q 992 248 1010 248 Q 992 248 992 266 Q 992 248 974 248 Q 992 248 992 230 Z"
        fill={ribbonColor}
        filter="url(#logoStarGlow)"
        initial={isAnimated ? { scale: 0, rotate: -45, opacity: 0 } : false}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.95, duration: 0.5, type: 'spring', bounce: 0.55 }}
        variants={{
          hover: { scale: [1, 1.4, 1], rotate: [0, 90, 0], transition: { duration: 0.55 } }
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
