import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
  ReactNode,
} from 'react';
import confetti from 'canvas-confetti';

export type ConfettiShape = 'rect' | 'square' | 'strip' | 'circle' | 'triangle';

export interface ConfettiRef {
  burst: (x?: number, y?: number, angle?: number) => void;
  cannons: () => void;
  clear: () => void;
}

export interface ConfettiProps {
  colors?: string[];
  shapes?: ConfettiShape[];
  size?: number;
  sizeVariance?: number;
  aspect?: number;
  density?: number;
  spread?: number;
  inherit?: number;
  gravity?: number;
  drag?: number;
  flutter?: number;
  spin?: number;
  wind?: number;
  turbulence?: number;
  life?: number;
  fade?: number;
  shading?: number;
  sheen?: number;
  opacity?: number;
  settle?: boolean;
  burst?: boolean;
  burstCount?: number;
  burstPower?: number;
  burstSpread?: number;
  maxPieces?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  idleDelay?: number;
  intro?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  (
    {
      colors = ['#5227FF', '#FF9FFC', '#B19EEF', '#E91E63', '#FFB400', '#00A8A8'],
      shapes = ['rect', 'strip', 'circle'],
      size = 14,
      sizeVariance = 0.4,
      aspect = 0.55,
      density = 0, // 0 turns off pointer trail waterfall!
      spread = 1,
      inherit = 0.25,
      gravity = 1,
      drag = 1,
      flutter = 1,
      spin = 1,
      wind = 0,
      turbulence = 0.5,
      life = 6,
      fade = 0.25,
      shading = 0.5,
      sheen = 0.35,
      opacity = 1,
      settle = false,
      burst: enableBurst = true,
      burstCount = 120,
      burstPower = 1,
      burstSpread = 70,
      maxPieces = 1800,
      autoplay = false,
      autoplaySpeed = 1,
      idleDelay = 1.5,
      intro = true,
      interactive = true,
      disabled = false,
      children,
      className = '',
      style,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasFiredIntroRef = useRef(false);

    // Map React Bits shapes to confetti shapes
    const mappedShapes: ('square' | 'circle')[] = shapes.some((s) => s === 'circle')
      ? ['square', 'circle']
      : ['square'];

    // Public API: Fire a burst from a specific coordinate
    const fireBurst = (clientX?: number, clientY?: number, angleDeg: number = 90) => {
      if (disabled) return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const originX = clientX !== undefined ? clientX / window.innerWidth : 0.5;
      const originY = clientY !== undefined ? clientY / window.innerHeight : 0.35;

      confetti({
        particleCount: burstCount,
        angle: angleDeg,
        spread: burstSpread,
        startVelocity: 38 * burstPower,
        origin: { x: originX, y: originY },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.2,
        gravity: gravity * 0.85,
        ticks: Math.floor(life * 50),
        drift: wind * 0.5,
        disableForReducedMotion: true,
      });
    };

    // Public API: Fire two celebratory corner cannons
    const fireCannons = () => {
      if (disabled) return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Left bottom cannon aimed inward & upward (60 degrees)
      confetti({
        particleCount: Math.floor(burstCount * 0.75),
        angle: 60,
        spread: burstSpread,
        startVelocity: 45 * burstPower,
        origin: { x: 0.1, y: 0.85 },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.25,
        gravity: gravity * 0.85,
        ticks: Math.floor(life * 55),
        disableForReducedMotion: true,
      });

      // Right bottom cannon aimed inward & upward (120 degrees)
      confetti({
        particleCount: Math.floor(burstCount * 0.75),
        angle: 120,
        spread: burstSpread,
        startVelocity: 45 * burstPower,
        origin: { x: 0.9, y: 0.85 },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.25,
        gravity: gravity * 0.85,
        ticks: Math.floor(life * 55),
        disableForReducedMotion: true,
      });
    };

    const clearAll = () => {
      confetti.reset();
    };

    useImperativeHandle(ref, () => ({
      burst: fireBurst,
      cannons: fireCannons,
      clear: clearAll,
    }));

    // Trigger intro cannons once on view
    useEffect(() => {
      if (!intro || disabled || hasFiredIntroRef.current) return;
      const container = containerRef.current;
      if (!container) return;

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasFiredIntroRef.current) {
            hasFiredIntroRef.current = true;
            setTimeout(() => {
              fireCannons();
            }, 380);
          }
        },
        { threshold: 0.15 }
      );

      io.observe(container);
      return () => io.disconnect();
    }, [intro, disabled]);

    // Handle user click to fire interactive burst
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !enableBurst || disabled) return;
      // Do not trigger if user clicked on an interactive button or link
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) return;

      fireBurst(e.clientX, e.clientY, 90);
    };

    return (
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`relative w-full h-full min-h-[240px] ${className}`}
        style={style}
      >
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }
);

Confetti.displayName = 'Confetti';
