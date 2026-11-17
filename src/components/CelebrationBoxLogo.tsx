import React, { useId } from 'react';

export interface CelebrationBoxLogoProps {
  className?: string;
  animated?: boolean;
  onAnimationComplete?: () => void;
  variant?: 'light' | 'dark' | 'monochrome';
  interactive?: boolean;
  loop?: boolean;
}

/**
 * CelebrationBoxLogo
 * 
 * Official brand identity logo for Celebration Box:
 * - Flat vector gift box icon on the left
 * - "Celebration Box" wordmark on the right (Poppins font)
 * - Golden marigold underline swoosh with celebration sparkle
 * 
 * Animation Behavior:
 * - When animated: Opens once, bursts confetti, closes smoothly, and STAYS CLOSED (fill-mode: forwards).
 * - When static (animated=false): Renders pristine in its closed state.
 * - Lid pivot locked at (112, 220) via translate(112, 220) rotate(...) translate(-112, -220).
 */
export const CelebrationBoxLogo: React.FC<CelebrationBoxLogoProps> = ({
  className = 'h-24 w-auto',
  animated = false,
  onAnimationComplete,
  variant = 'light',
  loop = false,
}) => {
  const rawId = useId();
  const uid = 'cbl_' + rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Strict Brand Color Palette
  const isMono = variant === 'monochrome';
  const textColor = isMono ? '#2B2B3A' : variant === 'dark' ? '#FFFFFF' : '#2B2B3A';
  const boxPink = isMono ? '#2B2B3A' : '#E91E63';
  const cavityPurple = isMono ? '#1A1A24' : '#7B2D8E';
  const ribbonYellow = isMono ? '#FFFFFF' : '#FFB400';
  const tealColor = isMono ? '#2B2B3A' : '#00A8A8';

  const iterationCount = loop ? 'infinite' : '1';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1140 340"
      className={`${className} select-none overflow-visible`}
      role="img"
      aria-label="Celebration Box Logo"
    >
      <style>{`
        .${uid}-bob,
        .${uid}-squash,
        .${uid}-lid,
        .${uid}-confetti {
          transform-box: view-box;
          transform-origin: 0px 0px;
        }

        ${
          animated
            ? `
        /* 1. Master Bob: Subtle elevation, then returns and rests */
        .${uid}-bob {
          animation: ${uid}-boxBob 3.2s ease-in-out ${iterationCount} forwards;
        }
        @keyframes ${uid}-boxBob {
          0% { transform: translate(0px, 0px); }
          5% { transform: translate(0px, 2px); }
          15% { transform: translate(0px, -2px); }
          22% { transform: translate(0px, 0px); }
          40% { transform: translate(0px, -4px); }
          55% { transform: translate(0px, 0px); }
          70% { transform: translate(0px, -3px); }
          88%, 100% { transform: translate(0px, 0px); }
        }

        /* 2. Box Squash: Anticipation before pop */
        .${uid}-squash {
          animation: ${uid}-boxSquash 3.2s ease-in-out ${iterationCount} forwards;
        }
        @keyframes ${uid}-boxSquash {
          0% { transform: translate(200px, 328px) scale(1, 1) translate(-200px, -328px); }
          5% { transform: translate(200px, 328px) scale(1.04, 0.94) translate(-200px, -328px); }
          10% { transform: translate(200px, 328px) scale(0.985, 1.02) translate(-200px, -328px); }
          16%, 100% { transform: translate(200px, 328px) scale(1, 1) translate(-200px, -328px); }
        }

        /* 3. Lid Motion: Opens to -22deg with overshoot, holds for confetti, then closes and STAYS CLOSED */
        .${uid}-lid {
          animation: ${uid}-lidMotion 3.2s ${iterationCount} forwards;
        }
        @keyframes ${uid}-lidMotion {
          0% {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
            animation-timing-function: ease-in;
          }
          5% {
            transform: translate(0px, 2px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
            animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          15% {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px);
            animation-timing-function: ease-in-out;
          }
          /* Holds open while celebratory confetti bursts */
          68% {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          /* Closes smoothly and rests completely sealed */
          90%, 100% {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
          }
        }

        /* 4. Confetti Burst: Shoots up on open, drifts, fades out */
        .${uid}-confetti {
          opacity: 0;
          transform: translate(210px, 214px) scale(0);
          animation: ${uid}-burst 3.2s cubic-bezier(0.15, 0.85, 0.35, 1) ${iterationCount} forwards;
          animation-delay: var(--delay, 0s);
        }
        @keyframes ${uid}-burst {
          0%, 9.4% {
            transform: translate(210px, 214px) scale(0) rotate(0deg);
            opacity: 0;
          }
          13% { opacity: 1; }
          28% {
            transform: translate(210px, 214px) translate(var(--x1), var(--y1)) scale(1.2) rotate(var(--r1));
            opacity: 1;
          }
          42% {
            transform: translate(210px, 214px) translate(var(--x2), var(--y2)) scale(1) rotate(var(--r2));
            opacity: 0.8;
          }
          55%, 100% {
            transform: translate(210px, 214px) translate(var(--x3), var(--y3)) scale(0.55) rotate(var(--r3));
            opacity: 0;
          }
        }
        `
            : `
        /* Static Closed Box Frame */
        .${uid}-lid {
          transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
        }
        .${uid}-confetti {
          opacity: 0;
          transform: translate(210px, 214px) scale(0);
        }
        `
        }

        /* Reduced Motion Fallback */
        @media (prefers-reduced-motion: reduce) {
          .${uid}-bob,
          .${uid}-squash,
          .${uid}-lid,
          .${uid}-confetti {
            animation: none !important;
          }
          .${uid}-lid {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px) !important;
          }
          .${uid}-confetti {
            opacity: 0 !important;
          }
        }
      `}</style>

      {/* ========================================================
          1. GIFT BOX ICON (Nested SVG with its own 400x400 coordinate space)
         ======================================================== */}
      <svg
        x="-30"
        y="10"
        width="320"
        height="320"
        viewBox="0 0 400 400"
        className="overflow-visible"
        aria-hidden="true"
      >
        {/* Assembly (Bobs together) */}
        <g className={`${uid}-bob`}>
          {/* Inner Cavity */}
          <polygon points="120,218 136,204 264,204 280,218" fill={cavityPurple} />

          {/* Squash Wrapper */}
          <g className={`${uid}-squash`}>
            {/* Box Body */}
            <path
              d="M 120 216 Q 200 220 280 216 L 272 316 Q 272 328 260 328 L 140 328 Q 128 328 128 316 Z"
              fill={boxPink}
            />
            {/* Vertical Body Ribbon */}
            <path d="M 185 219 L 215 219 L 215 328 L 185 328 Z" fill={ribbonYellow} />
          </g>

          {/* Lid with Attached Bow (Hinged firmly at 112, 220) */}
          <g className={`${uid}-lid`}>
            <rect x="112" y="196" width="176" height="24" rx="4" fill={boxPink} />
            <rect x="185" y="196" width="30" height="24" fill={ribbonYellow} />

            <g transform="translate(200, 196) scale(1.45)">
              <path d="M 0 0 C -16 -24, -36 -18, -30 -2 C -25 9, -8 4, 0 0 Z" fill={ribbonYellow} />
              <path d="M 0 0 C 16 -24, 36 -18, 30 -2 C 25 9, 8 4, 0 0 Z" fill={ribbonYellow} />
              <path d="M -4 3 Q -14 12 -18 9" fill="none" stroke={ribbonYellow} strokeWidth="3" strokeLinecap="round" />
              <path d="M 4 3 Q 14 12 18 9" fill="none" stroke={ribbonYellow} strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="7.5" ry="6.5" fill={ribbonYellow} />
            </g>
          </g>
        </g>

        {/* Confetti Burst */}
        <g>
          {/* 1. Star */}
          <path
            className={`${uid}-confetti`}
            style={{
              '--x1': '95px', '--y1': '-150px', '--r1': '160deg',
              '--x2': '106px', '--y2': '-132px', '--r2': '220deg',
              '--x3': '112px', '--y3': '-104px', '--r3': '260deg',
            } as React.CSSProperties}
            d="M 0 -14 Q 0 0 14 0 Q 0 0 0 14 Q 0 0 -14 0 Q 0 0 0 -14 Z"
            fill={ribbonYellow}
          />
          {/* 2. Squiggle */}
          <path
            className={`${uid}-confetti`}
            style={{
              '--x1': '45px', '--y1': '-152px', '--r1': '35deg',
              '--x2': '50px', '--y2': '-132px', '--r2': '50deg',
              '--x3': '54px', '--y3': '-104px', '--r3': '60deg',
              '--delay': '0.04s',
            } as React.CSSProperties}
            d="M -13 0 Q -6 -14 0 0 T 14 0"
            fill="none"
            stroke={tealColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* 3. Loop */}
          <path
            className={`${uid}-confetti`}
            style={{
              '--x1': '80px', '--y1': '-168px', '--r1': '65deg',
              '--x2': '86px', '--y2': '-142px', '--r2': '85deg',
              '--x3': '90px', '--y3': '-112px', '--r3': '95deg',
              '--delay': '0.06s',
            } as React.CSSProperties}
            d="M -10 6 C -17 -15 4 -22 9 -9 C 12 1 -2 10 11 16"
            fill="none"
            stroke={tealColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* 4. Purple Triangle */}
          <polygon
            className={`${uid}-confetti`}
            style={{
              '--x1': '90px', '--y1': '-92px', '--r1': '190deg',
              '--x2': '98px', '--y2': '-70px', '--r2': '240deg',
              '--x3': '104px', '--y3': '-46px', '--r3': '270deg',
              '--delay': '0.08s',
            } as React.CSSProperties}
            points="0,-10 10,7 -10,7"
            fill="none"
            stroke={cavityPurple}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* 5. Spark 1 */}
          <line
            className={`${uid}-confetti`}
            style={{
              '--x1': '105px', '--y1': '-135px', '--r1': '0deg',
              '--x2': '116px', '--y2': '-122px', '--r2': '0deg',
              '--x3': '122px', '--y3': '-108px', '--r3': '0deg',
            } as React.CSSProperties}
            x1="-8" y1="5" x2="8" y2="-5"
            stroke={ribbonYellow}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* 6. Spark 2 */}
          <line
            className={`${uid}-confetti`}
            style={{
              '--x1': '120px', '--y1': '-86px', '--r1': '0deg',
              '--x2': '132px', '--y2': '-75px', '--r2': '0deg',
              '--x3': '138px', '--y3': '-66px', '--r3': '0deg',
              '--delay': '0.02s',
            } as React.CSSProperties}
            x1="-9" y1="2" x2="9" y2="-2"
            stroke={ribbonYellow}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* 7. Pink Dot 1 */}
          <circle
            className={`${uid}-confetti`}
            style={{
              '--x1': '8px', '--y1': '-170px', '--r1': '0deg',
              '--x2': '6px', '--y2': '-146px', '--r2': '0deg',
              '--x3': '4px', '--y3': '-118px', '--r3': '0deg',
            } as React.CSSProperties}
            cx="0" cy="0" r="5.5"
            fill={boxPink}
          />
          {/* 8. Teal Dot */}
          <circle
            className={`${uid}-confetti`}
            style={{
              '--x1': '-2px', '--y1': '-122px', '--r1': '0deg',
              '--x2': '-4px', '--y2': '-100px', '--r2': '0deg',
              '--x3': '-6px', '--y3': '-76px', '--r3': '0deg',
              '--delay': '0.1s',
            } as React.CSSProperties}
            cx="0" cy="0" r="6"
            fill={tealColor}
          />
          {/* 9. Gold Dot */}
          <circle
            className={`${uid}-confetti`}
            style={{
              '--x1': '32px', '--y1': '-160px', '--r1': '0deg',
              '--x2': '34px', '--y2': '-136px', '--r2': '0deg',
              '--x3': '36px', '--y3': '-108px', '--r3': '0deg',
              '--delay': '0.03s',
            } as React.CSSProperties}
            cx="0" cy="0" r="5"
            fill={ribbonYellow}
          />
          {/* 10. Purple Dot */}
          <circle
            className={`${uid}-confetti`}
            style={{
              '--x1': '110px', '--y1': '-130px', '--r1': '0deg',
              '--x2': '118px', '--y2': '-108px', '--r2': '0deg',
              '--x3': '124px', '--y3': '-84px', '--r3': '0deg',
              '--delay': '0.08s',
            } as React.CSSProperties}
            cx="0" cy="0" r="4.5"
            fill={cavityPurple}
          />
          {/* 11. Teal Triangle */}
          <polygon
            className={`${uid}-confetti`}
            style={{
              '--x1': '18px', '--y1': '-140px', '--r1': '-140deg',
              '--x2': '20px', '--y2': '-120px', '--r2': '-180deg',
              '--x3': '22px', '--y3': '-96px', '--r3': '-210deg',
              '--delay': '0.06s',
            } as React.CSSProperties}
            points="0,-9 9,6 -9,6"
            fill="none"
            stroke={tealColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 12. Pink Dot 2 */}
          <circle
            className={`${uid}-confetti`}
            style={{
              '--x1': '70px', '--y1': '-75px', '--r1': '0deg',
              '--x2': '76px', '--y2': '-56px', '--r2': '0deg',
              '--x3': '80px', '--y3': '-38px', '--r3': '0deg',
              '--delay': '0.12s',
            } as React.CSSProperties}
            cx="0" cy="0" r="4"
            fill={boxPink}
          />
        </g>
      </svg>

      {/* ========================================================
          2. WORDMARK: "Celebration Box"
         ======================================================== */}
      <text
        x="270"
        y="234"
        fontFamily="'Poppins', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        fontSize="110"
        fontWeight="800"
        letterSpacing="-1.8"
      >
        <tspan fill={textColor}>Celebration </tspan>
        <tspan fill={boxPink} fontWeight="900">
          Box
        </tspan>
      </text>

      {/* ========================================================
          3. DYNAMIC GOLDEN SWOOSH UNDERLINE & SPARKLE
         ======================================================== */}
      <path
        d="M 310 272 Q 550 236 760 252 Q 910 264 1005 252"
        fill="none"
        stroke={ribbonYellow}
        strokeWidth="10"
        strokeLinecap="round"
      />

      <path
        d="M 1025 232 Q 1025 252 1045 252 Q 1025 252 1025 272 Q 1025 252 1005 252 Q 1025 252 1025 232 Z"
        fill={ribbonYellow}
      />
    </svg>
  );
};

export default CelebrationBoxLogo;
