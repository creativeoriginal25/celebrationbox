import React from 'react';

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
 * Official brand logo for Celebration Box:
 * Features open pink gift box with festive confetti,
 * bold "Celebration Box" typography, and golden swoosh underline with sparkle.
 */
export const CelebrationBoxLogo: React.FC<CelebrationBoxLogoProps> = ({
  className = 'h-10 w-auto',
  animated = false,
  variant = 'light',
}) => {
  const isDark = variant === 'dark';
  const logoSrc = isDark
    ? '/brand/celebration-box-logo-white.png'
    : '/brand/celebration-box-logo.png';

  return (
    <img
      src={logoSrc}
      alt="Celebration Box"
      className={`${className} object-contain select-none transition-transform duration-200 ${
        animated ? 'hover:scale-105 active:scale-95' : ''
      }`}
      loading="eager"
      onError={(e) => {
        // Fallback to jpg if png fails
        (e.target as HTMLImageElement).src = '/brand/celebration-box-logo.jpg';
      }}
    />
  );
};

export default CelebrationBoxLogo;
