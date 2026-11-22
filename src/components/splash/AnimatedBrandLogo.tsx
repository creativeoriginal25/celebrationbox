import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBrandLogoProps {
  stage: 1 | 2 | 3 | 4;
}

export const AnimatedBrandLogo: React.FC<AnimatedBrandLogoProps> = ({ stage }) => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none max-w-sm sm:max-w-md w-full px-4">
      {/* ============================================================== */}
      {/* STAGE 1: Minimal Gift-Box Icon with Subtle Pink Glow Aura      */}
      {/* ============================================================== */}
      <div className="relative flex items-center justify-center mb-4 sm:mb-5">
        {/* Soft pink ambient glow aura behind gift box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: stage >= 1 ? [0.25, 0.45, 0.35] : 0,
            scale: stage >= 1 ? [0.9, 1.1, 1] : 0.8,
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#E91E63]/20 blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Vector Gift Box Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-sm"
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
            role="img"
            aria-label="Celebration Box Icon"
          >
            {/* Box Body with Rounded Bottom Corners */}
            <path
              d="M 40 76 Q 100 80 160 76 L 154 156 Q 154 168 142 168 L 58 168 Q 46 168 46 156 Z"
              fill="#E91E63"
            />

            {/* Vertical Body Ribbon */}
            <path d="M 88 78 L 112 78 L 112 168 L 88 168 Z" fill="#FFB400" />

            {/* Lid */}
            <rect x="34" y="58" width="132" height="20" rx="4" fill="#E91E63" />
            <rect x="88" y="58" width="24" height="20" fill="#FFB400" />

            {/* Lid Bow */}
            <g transform="translate(100, 58) scale(1.15)">
              <path
                d="M 0 0 C -14 -20, -30 -16, -25 -2 C -21 7, -6 3, 0 0 Z"
                fill="#FFB400"
              />
              <path
                d="M 0 0 C 14 -20, 30 -16, 25 -2 C 21 7, 6 3, 0 0 Z"
                fill="#FFB400"
              />
              <ellipse cx="0" cy="0" rx="6" ry="5.5" fill="#FFB400" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* STAGE 2: Wordmark "Celebration Box" Reveal                     */}
      {/* ============================================================== */}
      <div className="relative overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: stage >= 2 ? 1 : 0,
            y: stage >= 2 ? 0 : 12,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex items-center justify-center font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-none"
        >
          <span className="text-[#2B2B3A] mr-2">Celebration</span>
          <span className="text-[#E91E63] font-black">Box</span>
        </motion.div>

        {/* ============================================================== */}
        {/* STAGE 3: Signature Golden Swoosh & Sparkle                     */}
        {/* ============================================================== */}
        <div className="relative w-full h-4 mt-1.5 flex items-center justify-center">
          <svg
            viewBox="0 0 260 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-48 sm:w-56 h-auto overflow-visible"
            aria-hidden="true"
          >
            {/* Animated Golden Underline Swoosh */}
            <motion.path
              d="M 10 16 Q 80 4 150 10 Q 200 14 240 8"
              stroke="#FFB400"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: stage >= 3 ? 1 : 0,
                opacity: stage >= 3 ? 1 : 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
            />

            {/* Signature Sparkle Star at the Tip */}
            <motion.path
              d="M 245 4 Q 245 8 249 8 Q 245 8 245 12 Q 245 8 241 8 Q 245 8 245 4 Z"
              fill="#FFB400"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: stage >= 3 ? 1.25 : 0,
                opacity: stage >= 3 ? 1 : 0,
              }}
              transition={{
                delay: 0.25,
                duration: 0.3,
                ease: 'easeOut',
              }}
            />
          </svg>
        </div>
      </div>

      {/* ============================================================== */}
      {/* STAGE 3 DETAIL: Tagline Reveal                                 */}
      {/* ============================================================== */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: stage >= 3 ? 1 : 0,
          y: stage >= 3 ? 0 : 8,
        }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="mt-3 text-xs sm:text-sm font-semibold text-[#2B2B3A]/75 tracking-wider uppercase font-sans"
      >
        Big Moments. One Little Box.
      </motion.p>
    </div>
  );
};
