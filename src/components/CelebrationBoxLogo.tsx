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
  const celebrationTextColor = isMono ? '#2B2B3A' : variant === 'dark' ? '#FFFFFF' : '#2B2B3A';
  const boxColor = isMono ? '#2B2B3A' : '#E91E63'; // Rani pink
  const boxInterior = isMono ? '#1A1A24' : '#C2185B'; // Deep pink box opening
  const ribbonColor = isMono ? '#FFFFFF' : '#FFB400'; // Marigold yellow
  const ribbonKnotColor = isMono ? '#E0E0E0' : '#FFA000';
  const tealColor = isMono ? '#2B2B3A' : '#00A8A8'; // Teal

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 340"
      className={`${className} select-none overflow-visible`}
      role="img"
      aria-label="Celebration Box Logo"
    >
      {/* ========================================================
          1. REFINED FLAT-VECTOR GIFT BOX ICON
         ======================================================== */}
      <g id="gift-box-icon">

        {/* --- Confetti & Streamer Burst: Erupts on intro, then tucks inside permanently --- */}
        <motion.g
          id="celebration-burst"
          initial={isAnimated ? { scale: 0, opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={
            isAnimated
              ? {
                  scale: [0, 1.15, 1, 1, 0],
                  opacity: [0, 1, 1, 1, 0],
                }
              : { scale: 0, opacity: 0 }
          }
          transition={
            isAnimated
              ? {
                  duration: 2.8,
                  times: [0, 0.22, 0.35, 0.68, 0.95],
                  ease: smoothEase,
                }
              : undefined
          }
          style={{ transformOrigin: '140px 170px' }}
        >
          {/* Golden Sparkle Star */}
          <path
            d="M 195 62 Q 195 78 211 78 Q 195 78 195 94 Q 195 78 179 78 Q 195 78 195 62 Z"
            fill={ribbonColor}
          />

          {/* Teal Playful Streamer */}
          <path
            d="M 155 152 Q 175 125 195 135 T 225 108"
            fill="none"
            stroke={tealColor}
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Confetti Particles */}
          <circle cx="182" cy="122" r="6" fill={boxColor} />
          <circle cx="142" cy="138" r="5" fill={ribbonColor} />
          <circle cx="162" cy="116" r="4.5" fill={tealColor} />
        </motion.g>

        {/* --- Symmetrical, Balanced Rectangular Box Body --- */}
        <motion.g
          initial={isAnimated ? { scale: 0.92, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: smoothEase }}
        >
          {/* Main Box Body with flat straight bottom & slightly rounded corners */}
          <rect
            x="64"
            y="170"
            width="132"
            height="105"
            rx="10"
            fill={boxColor}
          />

          {/* Box Interior Shadow Lip (revealed momentarily when lid pops) */}
          <rect
            x="64"
            y="170"
            width="132"
            height="12"
            rx="4"
            fill={boxInterior}
          />

          {/* Clean Vertical Center Ribbon */}
          <rect
            x="116"
            y="170"
            width="28"
            height="105"
            fill={ribbonColor}
          />
        </motion.g>

        {/* --- Lid & Bow: Opens during intro celebration, then closes and stays continuously closed --- */}
        <g transform="translate(58, 172)">
          <motion.g
            initial={isAnimated ? { rotate: 0 } : { rotate: 0 }}
            animate={
              isAnimated
                ? {
                    rotate: [0, -26, -24, -24, 0],
                  }
                : { rotate: 0 }
            }
            transition={
              isAnimated
                ? {
                    duration: 2.8,
                    times: [0, 0.2, 0.3, 0.68, 1],
                    ease: smoothEase,
                  }
                : undefined
            }
            style={{ transformOrigin: '0px 0px' }}
          >
            {/* Elegant Two-Loop Gift Ribbon Bow on Top Edge of Lid */}
            <g transform="translate(72, -28)">
              {/* Left Bow Loop */}
              <path
                d="M 0 0 C -22 -28 -48 -14 -30 4 C -18 10 -8 4 0 0 Z"
                fill={ribbonColor}
              />
              {/* Right Bow Loop */}
              <path
                d="M 0 0 C 8 4 18 10 30 4 C 48 -14 22 -28 0 0 Z"
                fill={ribbonColor}
              />
              {/* Center Bow Knot */}
              <circle cx="0" cy="2" r="6.5" fill={ribbonKnotColor} />
            </g>

            {/* Clearly Defined Rectangular Lid Bar with rounded corners */}
            <rect
              x="0"
              y="-28"
              width="144"
              height="30"
              rx="8"
              fill={boxColor}
            />

            {/* Matching Vertical Ribbon Band on Lid (aligns continuously with box ribbon when closed) */}
            <rect
              x="58"
              y="-28"
              width="28"
              height="30"
              fill={ribbonColor}
            />
          </motion.g>
        </g>

      </g>

      {/* ========================================================
          2. PRESERVED WORDMARK: "Celebration Box"
         ======================================================== */}
      <motion.text
        x="268"
        y="232"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="122"
        fontWeight="800"
        letterSpacing="-1.8"
        initial={isAnimated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22, duration: 0.6, ease: smoothEase }}
      >
        <tspan fill={celebrationTextColor}>Celebration </tspan>
        <tspan fill={boxColor} fontWeight="900">Box</tspan>
      </motion.text>

      {/* ========================================================
          3. DYNAMIC GOLDEN SWOOSH UNDERLINE & SPARKLE
         ======================================================== */}
      {/* Curved Swoosh starting under "Celebration" and flowing under "Box" */}
      <motion.path
        d="M 330 268 Q 540 232 730 250 Q 865 264 965 250"
        fill="none"
        stroke={ribbonColor}
        strokeWidth="9"
        strokeLinecap="round"
        initial={isAnimated ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.75, ease: smoothEase }}
      />

      {/* 4-pointed Sparkle Star at End of Swoosh */}
      <motion.path
        d="M 988 232 Q 988 250 1006 250 Q 988 250 988 268 Q 988 250 970 250 Q 988 250 988 232 Z"
        fill={ribbonColor}
        initial={isAnimated ? { scale: 0, rotate: -45, opacity: 0 } : false}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.45, type: 'spring', bounce: 0.5 }}
        onAnimationComplete={() => {
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }}
      />
    </motion.svg>
  );
};
