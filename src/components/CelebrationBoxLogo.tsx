import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface CelebrationBoxLogoProps {
  className?: string;
  animated?: boolean;
  onAnimationComplete?: () => void;
  variant?: 'light' | 'dark' | 'monochrome';
  interactive?: boolean;
}

// Silky cubic-bezier easing curve for fluid, professional animations
const smoothEase = [0.16, 1, 0.3, 1] as const;

export const CelebrationBoxLogo: React.FC<CelebrationBoxLogoProps> = ({
  className = 'h-24 w-auto',
  animated = false,
  onAnimationComplete,
  variant = 'light',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimated = animated && !shouldReduceMotion;

  // Strict Brand Color Palette
  const isMono = variant === 'monochrome';
  const textColor = isMono ? '#2B2B3A' : variant === 'dark' ? '#FFFFFF' : '#2B2B3A';
  const boxPink = isMono ? '#2B2B3A' : '#E91E63';
  const boxDarkPink = isMono ? '#1A1A24' : '#AD1457';
  const boxInterior = isMono ? '#15151F' : '#880E3D';
  const ribbonYellow = isMono ? '#FFFFFF' : '#FFB300';
  const ribbonKnotYellow = isMono ? '#E0E0E0' : '#FFA000';
  const tealColor = isMono ? '#2B2B3A' : '#00A8A8';
  const purpleColor = isMono ? '#2B2B3A' : '#7B1FA2';

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1100 370"
      className={`${className} select-none overflow-visible`}
      role="img"
      aria-label="Celebration Box Logo"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="logoBoxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F42B75" />
          <stop offset="100%" stopColor="#D81B60" />
        </linearGradient>
        <linearGradient id="logoLidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF337E" />
          <stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
        <linearGradient id="logoRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB300" />
          <stop offset="50%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>

        {/* Soft shadow blur filter */}
        <filter id="logoGroundShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" />
        </filter>

        {/* Celebratory ambient glow for the gift box */}
        <filter id="logoBoxGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor={boxPink} floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ========================================================
          1. PERSPECTIVE FLOOR SHADOW (Accurate 3D drop shadow)
         ======================================================== */}
      <motion.ellipse
        cx="140"
        cy="312"
        rx="78"
        ry="15"
        fill="#2B2B3A"
        opacity={isMono ? 0 : 0.16}
        filter="url(#logoGroundShadow)"
        initial={isAnimated ? { scale: 0.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: isMono ? 0 : 0.16 }}
        transition={{ duration: 0.6, ease: smoothEase }}
      />

      {/* ========================================================
          2. CELEBRATION ERUPTION (Exact Match to Image 3)
         ======================================================== */}
      <motion.g
        id="celebration-burst"
        initial={isAnimated ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          isAnimated
            ? {
                delay: 0.25,
                duration: 0.7,
                type: 'spring',
                bounce: 0.35,
              }
            : undefined
        }
        style={{ transformOrigin: '140px 190px' }}
      >
        {/* Golden Fan Burst Rays (3 distinct wedge rays radiating right) */}
        <path d="M 205 160 L 265 95 L 252 88 Z" fill={ribbonYellow} />
        <path d="M 215 175 L 285 130 L 278 120 Z" fill={ribbonYellow} />
        <path d="M 218 190 L 280 170 L 278 160 Z" fill={ribbonYellow} />

        {/* 2 Yellow Splash Streaks erupting from box rim */}
        <path
          d="M 125 155 Q 135 125 145 145 T 160 135"
          fill="none"
          stroke={ribbonYellow}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 95 160 Q 80 135 70 145"
          fill="none"
          stroke={ribbonYellow}
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Teal Curly Loop-de-Loop Streamer */}
        <path
          d="M 165 175 C 175 125, 215 95, 230 115 C 242 132, 218 152, 205 138 C 190 120, 210 65, 245 50"
          fill="none"
          stroke={tealColor}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Teal Sinusoidal Zigzag Ribbon below loop */}
        <path
          d="M 175 195 Q 190 180 205 195 T 235 185 T 255 195"
          fill="none"
          stroke={tealColor}
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Big Sparkling 4-Point Golden Star on Top Right */}
        <path
          d="M 295 85 Q 295 106 316 106 Q 295 106 295 127 Q 295 106 274 106 Q 295 106 295 85 Z"
          fill={ribbonYellow}
        />

        {/* Purple Hollow Triangle */}
        <polygon
          points="242,165 258,188 226,188"
          fill="none"
          stroke={purpleColor}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Solid Teal Small Triangle */}
        <polygon
          points="155,105 167,122 143,122"
          fill={tealColor}
        />

        {/* Confetti Circles & Dots */}
        <circle cx="202" cy="188" r="9" fill={boxPink} />
        <circle cx="168" cy="122" r="8" fill="#5E17EB" />
        <circle cx="272" cy="148" r="6.5" fill={ribbonYellow} />
        <circle cx="248" cy="72" r="6" fill={tealColor} />
        <circle cx="188" cy="68" r="8" fill={ribbonYellow} />
        <circle cx="282" cy="182" r="5" fill={purpleColor} />
        <circle cx="198" cy="98" r="4.5" fill={tealColor} />
      </motion.g>

      {/* ========================================================
          3. SCULPTED 3D ANGLED BOX BODY (Exact Match to Image 3)
         ======================================================== */}
      <motion.g
        id="box-body"
        filter={isMono ? undefined : 'url(#logoBoxGlow)'}
        initial={isAnimated ? { y: 20, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: smoothEase }}
      >
        {/* Dark Interior Cavity (Visible through the open dipping rim) */}
        <path
          d="M 58 190 Q 132 176 216 190 Q 132 208 58 190 Z"
          fill={boxInterior}
        />

        {/* Warm Golden Glow inside Box */}
        <ellipse cx="137" cy="192" rx="45" ry="7" fill={ribbonYellow} opacity="0.65" />

        {/* Main Sculpted Front Body (Curved dipping top, tapered sides, curved base) */}
        <path
          d="M 58 190
             C 56 220, 60 270, 65 288
             C 70 300, 85 304, 137 304
             C 189 304, 204 300, 209 288
             C 214 270, 218 220, 216 190
             Q 137 206 58 190 Z"
          fill={isMono ? boxPink : 'url(#logoBoxGrad)'}
        />

        {/* Elegant Front Left Contour Highlight Sheen */}
        <path
          d="M 64 195 Q 67 250 72 285 Q 67 245 65 195 Z"
          fill="#FFFFFF"
          opacity={isMono ? '0' : '0.25'}
        />

        {/* Vertical Center Golden Ribbon (Curving with the box contour) */}
        <path
          d="M 122 203
             Q 137 206 152 203
             L 150 304
             Q 137 305 124 304 Z"
          fill={isMono ? ribbonYellow : 'url(#logoRibbonGrad)'}
        />

        {/* Ribbon Sheen Line */}
        <path
          d="M 129 204 L 129 304"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          opacity={isMono ? '0' : '0.38'}
        />
      </motion.g>

      {/* ========================================================
          4. 3D POPPED LID & PLUMP BOW (Tilted ~28° to the right)
         ======================================================== */}
      <motion.g
        id="popped-lid-with-bow"
        initial={
          isAnimated
            ? { rotate: 0, x: 20, y: 10 }
            : { rotate: -28, x: 0, y: 0 }
        }
        animate={{ rotate: -28, x: 0, y: 0 }}
        transition={
          isAnimated
            ? {
                delay: 0.15,
                duration: 0.65,
                type: 'spring',
                bounce: 0.35,
              }
            : undefined
        }
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
            fill={boxDarkPink}
          />

          {/* Lid Slab Main Front Face */}
          <rect
            x="0"
            y="-8"
            width="170"
            height="38"
            rx="10"
            fill={isMono ? boxPink : 'url(#logoLidGrad)'}
          />

          {/* Lid Top Edge Highlight */}
          <rect
            x="6"
            y="-6"
            width="158"
            height="4"
            rx="2"
            fill="#FFFFFF"
            opacity={isMono ? '0' : '0.32'}
          />

          {/* Yellow Ribbon Band across the Lid */}
          <rect
            x="70"
            y="-8"
            width="32"
            height="46"
            fill={isMono ? ribbonYellow : 'url(#logoRibbonGrad)'}
          />

          {/* Plump Double-Loop Ribbon Bow on Top of Lid */}
          <g id="plump-bow" transform="translate(86, -8)">
            {/* Left Big Curved Bow Loop */}
            <path
              d="M 0 -4
                 C -25 -38, -65 -32, -58 -6
                 C -52 14, -22 10, 0 0 Z"
              fill={isMono ? ribbonYellow : 'url(#logoRibbonGrad)'}
            />
            <path
              d="M -4 -8 C -22 -28, -50 -24, -44 -6 C -38 8, -16 6, -4 -8 Z"
              fill="#FFFFFF"
              opacity={isMono ? '0' : '0.28'}
            />

            {/* Right Plump Bow Loop */}
            <path
              d="M 0 -4
                 C 25 -38, 65 -32, 58 -6
                 C 52 14, 22 10, 0 0 Z"
              fill={isMono ? ribbonYellow : 'url(#logoRibbonGrad)'}
            />
            <path
              d="M 4 -8 C 22 -28, 50 -24, 44 -6 C 38 8, 16 6, 4 -8 Z"
              fill="#FFFFFF"
              opacity={isMono ? '0' : '0.28'}
            />

            {/* Center Plump Bow Knot */}
            <ellipse cx="0" cy="-2" rx="10" ry="8" fill={ribbonKnotYellow} />
            <ellipse cx="-2" cy="-4" rx="5" ry="3" fill="#FFE082" opacity={isMono ? '0' : '0.5'} />
          </g>
        </g>
      </motion.g>

      {/* ========================================================
          5. BOLD TYPOGRAPHY: "Celebration Box"
         ======================================================== */}
      <motion.text
        x="330"
        y="255"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="132"
        fontWeight="800"
        letterSpacing="-1.8"
        initial={isAnimated ? { opacity: 0, x: 20 } : false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
      >
        <tspan fill={textColor}>Celebration </tspan>
        <tspan fill={boxPink} fontWeight="900">
          Box
        </tspan>
      </motion.text>

      {/* ========================================================
          6. DYNAMIC GOLDEN SWOOSH UNDERLINE & SPARKLE
         ======================================================== */}
      {/* Curved Underline Swoosh */}
      <motion.path
        d="M 375 296 Q 595 258 795 276 Q 935 290 1020 276"
        fill="none"
        stroke={ribbonYellow}
        strokeWidth="11"
        strokeLinecap="round"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.7, ease: smoothEase }}
      />

      {/* 4-Pointed Sparkle Star at End of Swoosh */}
      <motion.path
        d="M 1042 254 Q 1042 274 1062 274 Q 1042 274 1042 294 Q 1042 274 1022 274 Q 1042 274 1042 254 Z"
        fill={ribbonYellow}
        initial={isAnimated ? { scale: 0, rotate: -45, opacity: 0 } : false}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.45, type: 'spring', bounce: 0.45 }}
        onAnimationComplete={() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }}
      />
    </motion.svg>
  );
};

export default CelebrationBoxLogo;
