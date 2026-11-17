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
      gravity = 1,
      wind = 0,
      life = 5,
      burst: enableBurst = true,
      burstCount = 120,
      burstPower = 1,
      burstSpread = 70,
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null);
    const hasFiredIntroRef = useRef(false);

    // Initialize scoped canvas confetti instance so particles stay strictly behind interactive elements
    useEffect(() => {
      if (canvasRef.current) {
        confettiInstanceRef.current = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true,
        });
      }
      return () => {
        try {
          confettiInstanceRef.current?.reset();
        } catch {
          // ignore
        }
      };
    }, []);

    // Map React Bits shapes to confetti shapes
    const mappedShapes: ('square' | 'circle')[] = shapes.some((s) => s === 'circle')
      ? ['square', 'circle']
      : ['square'];

    // Public API: Fire a burst from a specific coordinate
    const fireBurst = (clientX?: number, clientY?: number, angleDeg: number = 90) => {
      if (disabled) return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const fire = confettiInstanceRef.current || confetti;

      // Position burst around the upper hero logo / center
      const rect = containerRef.current?.getBoundingClientRect();
      let originX = 0.5;
      let originY = 0.32; // upper area of hero

      if (clientX !== undefined && rect && rect.width > 0) {
        originX = Math.max(0.1, Math.min(0.9, (clientX - rect.left) / rect.width));
      }
      if (clientY !== undefined && rect && rect.height > 0) {
        originY = Math.max(0.1, Math.min(0.5, (clientY - rect.top) / rect.height));
      }

      fire({
        particleCount: burstCount,
        angle: angleDeg,
        spread: burstSpread,
        startVelocity: 34 * burstPower,
        origin: { x: originX, y: originY },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.15,
        gravity: gravity * 1.15,
        ticks: Math.floor(life * 30), // Dissipates cleanly before reaching lower button zone
        drift: wind * 0.5,
        disableForReducedMotion: true,
      });
    };

    // Public API: Fire two celebratory cannons restricted to the upper hero/logo area
    const fireCannons = () => {
      if (disabled) return;
      if (typeof window === 'undefined') return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const fire = confettiInstanceRef.current || confetti;

      // Left cannon aimed inward & upward in the upper hero area
      fire({
        particleCount: Math.floor(burstCount * 0.7),
        angle: 60,
        spread: burstSpread,
        startVelocity: 36 * burstPower,
        origin: { x: 0.15, y: 0.36 },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.15,
        gravity: gravity * 1.1,
        ticks: Math.floor(life * 32),
        disableForReducedMotion: true,
      });

      // Right cannon aimed inward & upward in the upper hero area
      fire({
        particleCount: Math.floor(burstCount * 0.7),
        angle: 120,
        spread: burstSpread,
        startVelocity: 36 * burstPower,
        origin: { x: 0.85, y: 0.36 },
        colors,
        shapes: mappedShapes,
        scalar: (size / 14) * 1.15,
        gravity: gravity * 1.1,
        ticks: Math.floor(life * 32),
        disableForReducedMotion: true,
      });
    };

    const clearAll = () => {
      try {
        if (confettiInstanceRef.current) {
          confettiInstanceRef.current.reset();
        } else {
          confetti.reset();
        }
      } catch {
        // ignore
      }
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
        className={`relative w-full h-full min-h-[240px] overflow-hidden ${className}`}
        style={style}
      >
        {/* Dedicated background canvas: strictly pointer-events: none and z-0 behind interactive elements */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ pointerEvents: 'none' }}
        />
        <div className="relative z-10 w-full h-full pointer-events-auto">{children}</div>
      </div>
    );
  }
);

Confetti.displayName = 'Confetti';
