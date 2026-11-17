import React, { useId } from 'react';

export interface CelebrationBoxAnimatedHeaderLogoProps {
  /**
   * Height or size of the icon (number in px or CSS string e.g. '48px', '3rem').
   * Default: 48
   */
  size?: number | string;
  /**
   * Additional class name for the wrapper element.
   */
  className?: string;
  /**
   * Whether to display the text wordmark next to the icon.
   * Default: true
   */
  showWordmark?: boolean;
}

/**
 * CelebrationBoxAnimatedHeaderLogo
 * 
 * Reusable header component combining:
 * 1. Looping animated flat-vector gift box icon (3.2s pure CSS, zero libraries)
 * 2. Brand wordmark: "Celebration" (#2B2B3A) + "Box" (#E91E63) with marigold swoosh (#FFB400)
 * 
 * Rules Preserved:
 * - transform-box: view-box and transform-origin: 0px 0px
 * - translate(pivot) rotate() translate(-pivot)
 * - 3.2s timing loop with cubic-bezier(0.34, 1.56, 0.64, 1) overshoot
 * - prefers-reduced-motion static open frame
 * - Strictly flat vector (no gradients, shadows, or external animation libraries)
 */
export const CelebrationBoxAnimatedHeaderLogo: React.FC<CelebrationBoxAnimatedHeaderLogoProps> = ({
  size = 48,
  className = '',
  showWordmark = true,
}) => {
  const rawId = useId();
  // Safe CSS identifier without colons
  const uid = 'cb_' + rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  const iconDimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`celebration-box-brand-header inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}
      style={{ '--cb-icon-size': iconDimension } as React.CSSProperties}
    >
      <style>{`
        /* Scoped to this instance: ${uid} */
        .${uid}-svg {
          width: var(--cb-icon-size, 48px);
          height: var(--cb-icon-size, 48px);
          display: block;
          overflow: visible;
        }

        .${uid}-bob,
        .${uid}-squash,
        .${uid}-lid,
        .${uid}-confetti {
          transform-box: view-box;
          transform-origin: 0px 0px;
        }

        /* 1. Idle Bobbing (4px) */
        .${uid}-bob {
          animation: ${uid}-boxBob 3.2s ease-in-out infinite;
        }

        @keyframes ${uid}-boxBob {
          0%     { transform: translate(0px, 0px); }
          4.5%   { transform: translate(0px, 2px); }
          12.5%  { transform: translate(0px, -2px); }
          18%    { transform: translate(0px, 0px); }
          43.75% { transform: translate(0px, 0px); }
          54%    { transform: translate(0px, -4px); }
          65%    { transform: translate(0px, 0px); }
          76%    { transform: translate(0px, -4px); }
          87.5%  { transform: translate(0px, 0px); }
          100%   { transform: translate(0px, 0px); }
        }

        /* 2. Box Squash (pivot: 200, 328) */
        .${uid}-squash {
          animation: ${uid}-boxSquash 3.2s ease-in-out infinite;
        }

        @keyframes ${uid}-boxSquash {
          0%    { transform: translate(200px, 328px) scale(1, 1) translate(-200px, -328px); }
          4.5%  { transform: translate(200px, 328px) scale(1.04, 0.94) translate(-200px, -328px); }
          9%    { transform: translate(200px, 328px) scale(0.985, 1.02) translate(-200px, -328px); }
          12.5% { transform: translate(200px, 328px) scale(1, 1) translate(-200px, -328px); }
          100%  { transform: translate(200px, 328px) scale(1, 1) translate(-200px, -328px); }
        }

        /* 3. Lid Motion (hinge: 112, 220) */
        .${uid}-lid {
          animation: ${uid}-lidMotion 3.2s infinite;
        }

        @keyframes ${uid}-lidMotion {
          0% {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
            animation-timing-function: ease-in;
          }
          4.5% {
            transform: translate(0px, 2px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
            animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          12.5% {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px);
            animation-timing-function: ease-in-out;
          }
          43.75% {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px);
          }
          87.5% {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px);
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          98% {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
          }
          100% {
            transform: translate(0px, 0px) translate(112px, 220px) rotate(0deg) translate(-112px, -220px);
          }
        }

        /* 4. Confetti Burst */
        .${uid}-confetti {
          opacity: 0;
          transform: translate(210px, 214px) translate(0px, 0px) scale(0) rotate(0deg);
          animation: ${uid}-burst 3.2s cubic-bezier(0.15, 0.85, 0.35, 1) infinite;
          animation-delay: var(--delay, 0s);
        }

        @keyframes ${uid}-burst {
          0%, 9.4% {
            transform: translate(210px, 214px) translate(0px, 0px) scale(0) rotate(0deg);
            opacity: 0;
          }
          11% { opacity: 1; }
          25% {
            transform: translate(210px, 214px) translate(var(--x1), var(--y1)) scale(1.2) rotate(var(--r1));
            opacity: 1;
          }
          36% {
            transform: translate(210px, 214px) translate(var(--x2), var(--y2)) scale(1) rotate(var(--r2));
            opacity: 0.8;
          }
          43.75%, 100% {
            transform: translate(210px, 214px) translate(var(--x3), var(--y3)) scale(0.55) rotate(var(--r3));
            opacity: 0;
          }
        }

        /* 5. Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .${uid}-bob,
          .${uid}-squash,
          .${uid}-lid,
          .${uid}-confetti {
            animation: none !important;
          }
          .${uid}-lid {
            transform: translate(0px, -4px) translate(112px, 220px) rotate(-22deg) translate(-112px, -220px) !important;
          }
          .${uid}-confetti {
            opacity: 1 !important;
            transform: translate(210px, 214px) translate(var(--x1), var(--y1)) scale(1.15) rotate(var(--r1)) !important;
          }
        }
      `}</style>

      {/* ==============================================================
           ICON: SVG ANIMATED GIFT BOX
           ============================================================== */}
      <svg
        className={`${uid}-svg shrink-0`}
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        {/* Assembly (Bobs together) */}
        <g className={`${uid}-bob`}>
          {/* Inner Cavity */}
          <polygon points="120,218 136,204 264,204 280,218" fill="#7B2D8E" />

          {/* Squash Wrapper */}
          <g className={`${uid}-squash`}>
            {/* Box Body */}
            <path
              d="M 120 216 Q 200 220 280 216 L 272 316 Q 272 328 260 328 L 140 328 Q 128 328 128 316 Z"
              fill="#E91E63"
            />
            {/* Vertical Body Ribbon */}
            <path d="M 185 219 L 215 219 L 215 328 L 185 328 Z" fill="#FFB400" />
          </g>

          {/* Lid with Attached Bow */}
          <g className={`${uid}-lid`}>
            <rect x="112" y="196" width="176" height="24" rx="4" fill="#E91E63" />
            <rect x="185" y="196" width="30" height="24" fill="#FFB400" />

            <g transform="translate(200, 196) scale(1.45)">
              <path d="M 0 0 C -16 -24, -36 -18, -30 -2 C -25 9, -8 4, 0 0 Z" fill="#FFB400" />
              <path d="M 0 0 C 16 -24, 36 -18, 30 -2 C 25 9, 8 4, 0 0 Z" fill="#FFB400" />
              <path d="M -4 3 Q -14 12 -18 9" fill="none" stroke="#FFB400" strokeWidth="3" strokeLinecap="round" />
              <path d="M 4 3 Q 14 12 18 9" fill="none" stroke="#FFB400" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="7.5" ry="6.5" fill="#FFB400" />
            </g>
          </g>
        </g>

        {/* Confetti Elements */}
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
            fill="#FFB400"
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
            stroke="#00A8A8"
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
            stroke="#00A8A8"
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
            stroke="#7B2D8E"
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
            stroke="#FFB400"
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
            stroke="#FFB400"
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
            fill="#E91E63"
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
            fill="#00A8A8"
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
            fill="#FFB400"
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
            fill="#7B2D8E"
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
            stroke="#00A8A8"
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
            fill="#E91E63"
          />
        </g>
      </svg>

      {/* ==============================================================
           WORDMARK: "Celebration Box" with Marigold Swoosh
           ============================================================== */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline tracking-tight font-extrabold font-['Poppins',sans-serif] text-xl sm:text-2xl md:text-[26px]">
            <span className="text-[#2B2B3A]">Celebration</span>
            <span className="text-[#E91E63] ml-1.5 font-black">Box</span>
          </div>
          {/* Small Marigold underline swoosh beneath wordmark */}
          <svg
            className="w-full h-2 mt-0.5 overflow-visible"
            viewBox="0 0 160 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M 2 5 Q 50 11 100 8 Q 130 6 155 4"
              stroke="#FFB400"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Tiny sparkle dot at end of swoosh */}
            <circle cx="157" cy="4" r="1.8" fill="#FFB400" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CelebrationBoxAnimatedHeaderLogo;
