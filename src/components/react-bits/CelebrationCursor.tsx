import React, { useEffect, useRef } from 'react';

export interface CelebrationCursorProps {
  /** Custom confetti colors, defaults to Celebration Box vibrant palette */
  colors?: string[];
  /** Number of confetti pieces spawned per cursor move */
  particlesPerMove?: number;
  /** Number of confetti pieces in a click explosion */
  particlesPerBurst?: number;
  /** Custom canvas className */
  className?: string;
  /** Optional container element ref; if omitted, attaches to parent container */
  targetRef?: React.RefObject<HTMLElement | null>;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  opacity: number;
  decay: number;
  gravity: number;
  wobbleSpeed: number;
  wobbleAngle: number;
}

const DEFAULT_COLORS = [
  '#E91E63', // Rani Pink
  '#FFB400', // Marigold Yellow
  '#00A8A8', // Teal
  '#FFBE98', // Peach
  '#D8B4E2', // Lilac
  '#FF4081', // Vivid Rose
  '#38BDF8', // Sky Blue
  '#FFF8F0', // Warm Off-White
];

export const CelebrationCursor: React.FC<CelebrationCursorProps> = ({
  colors = DEFAULT_COLORS,
  particlesPerMove = 2,
  particlesPerBurst = 36,
  className = '',
  targetRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const internalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect user's reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Target element to track: provided targetRef or canvas's parent element
    const container = targetRef?.current || internalRef.current?.parentElement || canvas.parentElement;
    if (!container) return;

    let particles: ConfettiParticle[] = [];
    let animationFrameId: number;
    let isHovering = false;
    let lastX = 0;
    let lastY = 0;

    // Resize canvas to match container size
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    const createParticle = (
      x: number,
      y: number,
      isBurst = false,
      mouseVx = 0,
      mouseVy = 0
    ): ConfettiParticle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Confetti dimensions (paper ribbons / rectangles)
      const isRibbon = Math.random() > 0.6;
      const width = isRibbon ? Math.random() * 4 + 4 : Math.random() * 6 + 6;
      const height = isRibbon ? Math.random() * 12 + 8 : Math.random() * 8 + 6;

      let vx: number;
      let vy: number;

      if (isBurst) {
        // Radial 360 burst with high velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 2.5; // Upward bias
      } else {
        // Gentle spilling trail with cursor momentum
        vx = (Math.random() - 0.5) * 2.5 + mouseVx * 0.15;
        vy = Math.random() * 2 + 1 + mouseVy * 0.1;
      }

      return {
        x,
        y,
        vx,
        vy,
        width,
        height,
        color,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.2,
        vRotY: (Math.random() - 0.5) * 0.25,
        vRotZ: (Math.random() - 0.5) * 0.15,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.006,
        gravity: 0.12,
        wobbleSpeed: Math.random() * 0.08 + 0.04,
        wobbleAngle: Math.random() * Math.PI * 2,
      };
    };

    // Track mouse move on container
    const handleMouseMove = (e: MouseEvent) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mouseVx = x - lastX;
      const mouseVy = y - lastY;
      lastX = x;
      lastY = y;

      // Spawn tumbling paper confetti trail from cursor
      for (let i = 0; i < particlesPerMove; i++) {
        const jitterX = x + (Math.random() - 0.5) * 12;
        const jitterY = y + (Math.random() - 0.5) * 12;
        particles.push(createParticle(jitterX, jitterY, false, mouseVx, mouseVy));
      }

      // Cap maximum active particles for high FPS
      if (particles.length > 220) {
        particles.splice(0, particles.length - 220);
      }
    };

    // Burst on click
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < particlesPerBurst; i++) {
        particles.push(createParticle(x, y, true));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('click', handleClick, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Animation render loop
    const render = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Tumbling physics
        p.wobbleAngle += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobbleAngle) * 0.8;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985; // Air drag

        // 3D rotation angles
        p.rotationX += p.vRotX;
        p.rotationY += p.vRotY;
        p.rotationZ += p.vRotZ;

        // Fade out
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > rect.height + 40 || p.x < -40 || p.x > rect.width + 40) {
          particles.splice(i, 1);
          continue;
        }

        // Draw 3D tumbling paper confetti
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotationZ);

        // Perspective scaling from 3D tumbling
        const scaleX = Math.cos(p.rotationY);
        const scaleY = Math.cos(p.rotationX);

        ctx.scale(scaleX, scaleY);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        // Shadow / slight fold depth
        ctx.shadowColor = 'rgba(43, 43, 58, 0.12)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;

        // Draw paper rectangle
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [colors, particlesPerMove, particlesPerBurst, targetRef]);

  return (
    <div ref={internalRef} className="contents">
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-20 h-full w-full ${className}`}
        aria-hidden="true"
      />
    </div>
  );
};

export default CelebrationCursor;