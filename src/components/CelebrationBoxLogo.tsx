import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CelebrationBoxLogoProps {
  className?: string;
  animated?: boolean;
  onAnimationComplete?: () => void;
  variant?: 'light' | 'dark';
  interactive?: boolean;
}

// Smooth luxurious cubic-bezier easing curve
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

  // Exact Brand Palette
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
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2B2B3A" floodOpacity="0.12" />
        </filter>
        {/* Luminous Glow for Sparkle Stars */}
        <filter id="logoStarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFB400" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ========================================================
          1. FESTIVE GIFT BOX WITH OPENING LID & BURST
         ======================================================== */}
      <g filter="url(#logoBoxShadow)">

        {/* --- Confetti, Streamers & Spray Bursting from inside Box --- */}
        <g id="celebration-burst">
          {/* Top-Right Golden Sparkle Star */}
          <motion.path
            d="M 246 40 Q 246 62 268 62 Q 246 62 246 84 Q 246 62 224 62 Q 246 62 246 40 Z"
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
            d="M 195 150 C 215 120 240 140 258 112 C 268 96 280 102 276 88"
            fill="none"
            stroke={tealColor}
            strokeWidth="8.5"
            strokeLinecap="round"
            initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.75, ease: smoothEase }}
          />

          {/* Pink Confetti Dot */}
          <motion.circle
            cx="242"
            cy="156"
            r="9.5"
            fill={boxColor}
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.44, duration: 0.5, ease: smoothEase }}
          />

          {/* Yellow Spray Droplets (Fountain Spray) */}
          <motion.path
            d="M 148 174 C 140 156 156 140 166 148 C 172 154 162 172 148 174 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.36, duration: 0.55, ease: smoothEase }}
          />
          <motion.path
            d="M 178 176 C 174 156 198 142 205 156 C 209 166 193 178 178 176 Z"
            fill={ribbonColor}
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.55, ease: smoothEase }}
          />

          {/* Pink Spray Droplet */}
          <motion.path
            d="M 194 180 C 200 166 222 158 228 170 C 230 176 212 184 194 180 Z"
            fill={boxColor}
            initial={isAnimated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.42, duration: 0.55, ease: smoothEase }}
          />
        </g>

        {/* --- Box Base with 3D Curved Top Rim --- */}
        <motion.g
          initial={isAnimated ? { scale: 0.9, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: smoothEase }}
        >
          {/* Main Box Body */}
          <path
            d="M 72 175 C 112 182 174 192 234 184 C 240 183 244 188 242 195 L 228 268 C 226 276 218 282 209 282 L 97 282 C 88 282 80 276 78 268 L 66 186 C 64 179 67 174 72 175 Z"
            fill={boxColor}
          />
          {/* Vertical Warm Yellow Ribbon */}
          <path
            d="M 138 187 C 150 189 162 189 170 187 L 168 282 L 140 282 Z"
            fill={ribbonColor}
          />
        </motion.g>

        {/* --- Gift Box Lid & Bow (Outer group anchors position, inner group rotates) --- */}
        <g transform="translate(68, 178)">
          <motion.g
            initial={isAnimated ? { rotate: 0 } : { rotate: -28 }}
            animate={{ rotate: -28 }}
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
                rotate: [-28, -34, -25, -28],
                transition: { duration: 0.6, ease: 'easeInOut' }
              }
            }}
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Yellow Ribbon Bow sitting on the TOP edge of the lid */}
            <g transform="translate(80, -34)">
              {/* Left Bow Loop */}
              <path
                d="M -6 0 C -26 -32 -52 -16 -34 4 C -22 10 -12 6 -6 0 Z"
                fill={ribbonColor}
              />
              {/* Right Bow Loop */}
              <path
                d="M 6 0 C 12 6 22 10 34 4 C 52 -16 26 -32 6 0 Z"
                fill={ribbonColor}
              />
              {/* Center Bow Knot */}
              <circle cx="0" cy="2" r="8" fill={ribbonAccent} />
            </g>

            {/* Lid Rectangle with soft rounded corners */}
            <rect
              x="0"
              y="-34"
              width="172"
              height="34"
              rx="11"
              fill={boxColor}
              stroke={lidStrokeColor}
              strokeWidth="1.5"
            />
          </motion.g>
        </g>

      </g>

      {/* ========================================================
          2. UNIFIED TYPOGRAPHY: "Celebration Box"
         ======================================================== */}
      <motion.text
        x="276"
        y="232"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="122"
        fontWeight="800"
        letterSpacing="-1.8"
        initial={isAnimated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
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
