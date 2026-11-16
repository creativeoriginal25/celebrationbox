import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
  ReactNode,
} from 'react';

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

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  shape: ConfettiShape;
  color: string;
  size: number;
  aspect: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  wobble: number;
  wobbleSpeed: number;
  age: number;
  maxLife: number;
  settled: boolean;
}

export const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  (
    {
      colors = ['#5227FF', '#FF9FFC', '#B19EEF', '#E91E63', '#FFB400', '#00A8A8'],
      shapes = ['rect', 'strip', 'circle'],
      size = 14,
      sizeVariance = 0.4,
      aspect = 0.55,
      density = 0, // Set to 0 to prevent cursor waterfall; bursts & cannons take spotlight!
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const piecesRef = useRef<Piece[]>([]);
    const lastPosRef = useRef<{ x: number; y: number; time: number; vx: number; vy: number } | null>(null);
    const hasFiredIntroRef = useRef(false);
    const lastPointerTimeRef = useRef(Date.now());
    const autoplayAngleRef = useRef(0);

    // Helpers
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    const createPiece = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      targetShape?: ConfettiShape
    ): Piece => {
      const sVar = 1 + (Math.random() * 2 - 1) * sizeVariance;
      const pieceSize = Math.max(4, size * sVar);
      const chosenShape = targetShape || pick(shapes);

      let pieceAspect = aspect;
      if (chosenShape === 'square' || chosenShape === 'circle') pieceAspect = 1;
      if (chosenShape === 'strip') pieceAspect = 0.25;

      return {
        x,
        y,
        vx,
        vy,
        shape: chosenShape,
        color: pick(colors),
        size: pieceSize,
        aspect: pieceAspect,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 8 * spin,
        vRotY: (Math.random() - 0.5) * 8 * spin,
        vRotZ: (Math.random() - 0.5) * 4 * spin,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: rand(3, 7) * flutter,
        age: 0,
        maxLife: life * rand(0.8, 1.2),
        settled: false,
      };
    };

    // Public API for ref
    const fireBurst = (x?: number, y?: number, angleDeg: number = -90) => {
      if (disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const originX = x !== undefined ? x : rect.width / 2;
      const originY = y !== undefined ? y : rect.height / 2;

      const count = Math.min(burstCount, maxPieces - piecesRef.current.length);
      const angleRad = (angleDeg * Math.PI) / 180;
      const halfSpreadRad = ((burstSpread / 2) * Math.PI) / 180;

      for (let i = 0; i < count; i++) {
        const spreadOffset = (Math.random() - 0.5) * 2 * halfSpreadRad;
        const speed = rand(14, 28) * burstPower;
        const pAngle = angleRad + spreadOffset;

        const vx = Math.cos(pAngle) * speed + rand(-2, 2);
        const vy = Math.sin(pAngle) * speed + rand(-2, 2);

        piecesRef.current.push(createPiece(originX, originY, vx, vy));
      }
    };

    const fireCannons = () => {
      if (disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      // Left bottom cannon aimed inward & upward
      fireBurst(rect.width * 0.1, rect.height * 0.9, -55);
      // Right bottom cannon aimed inward & upward
      fireBurst(rect.width * 0.9, rect.height * 0.9, -125);
    };

    const clearAll = () => {
      piecesRef.current = [];
    };

    useImperativeHandle(ref, () => ({
      burst: fireBurst,
      cannons: fireCannons,
      clear: clearAll,
    }));

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const shouldReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (shouldReduce) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animId: number;
      let lastFrameTime = performance.now();

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      // Intersection Observer for intro cannons
      if (intro && !hasFiredIntroRef.current) {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && !hasFiredIntroRef.current) {
              hasFiredIntroRef.current = true;
              setTimeout(() => {
                fireCannons();
              }, 400);
            }
          },
          { threshold: 0.15 }
        );
        io.observe(container);
      }

      // Pointer event listeners
      const handlePointerMove = (e: PointerEvent) => {
        if (!interactive || disabled) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const now = Date.now();
        lastPointerTimeRef.current = now;

        if (lastPosRef.current) {
          const dt = Math.max(1, (now - lastPosRef.current.time) / 1000);
          const dx = x - lastPosRef.current.x;
          const dy = y - lastPosRef.current.y;
          const dist = Math.hypot(dx, dy);

          const vx = (dx / dt) * inherit;
          const vy = (dy / dt) * inherit;

          // Only spill confetti if density > 0 (prevents waterfall drip when set to 0)
          if (density > 0 && dist > 15) {
            const count = Math.min(6, Math.floor(dist * 0.05 * density));
            for (let i = 0; i < count; i++) {
              if (piecesRef.current.length < maxPieces) {
                const spreadX = (Math.random() - 0.5) * 12 * spread;
                const spreadY = (Math.random() - 0.5) * 12 * spread;
                piecesRef.current.push(createPiece(x, y, vx + spreadX, vy + spreadY));
              }
            }
          }

          lastPosRef.current = { x, y, time: now, vx, vy };
        } else {
          lastPosRef.current = { x, y, time: now, vx: 0, vy: 0 };
        }
      };

      const handlePointerDown = (e: MouseEvent) => {
        if (!interactive || !enableBurst || disabled) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        fireBurst(x, y, -90);
      };

      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('click', handlePointerDown);

      // Main Physics & Render Loop
      const loop = (currentTime: number) => {
        animId = requestAnimationFrame(loop);
        const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
        lastFrameTime = currentTime;

        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        // Autoplay logic if pointer is idle
        const timeSincePointer = (Date.now() - lastPointerTimeRef.current) / 1000;
        if (autoplay && !disabled && timeSincePointer > idleDelay) {
          autoplayAngleRef.current += dt * 1.5 * autoplaySpeed;
          const autoX = width / 2 + Math.sin(autoplayAngleRef.current) * (width * 0.35);
          const autoY = height * 0.25 + Math.cos(autoplayAngleRef.current * 0.8) * (height * 0.15);

          if (Math.random() < 0.25 * autoplaySpeed && piecesRef.current.length < maxPieces) {
            piecesRef.current.push(
              createPiece(autoX, autoY, Math.sin(autoplayAngleRef.current) * 4, rand(-2, 2))
            );
          }
        }

        const currentPieces = piecesRef.current;
        const gravityAcc = gravity * 380;
        const windSpeed = wind * 60;

        for (let i = currentPieces.length - 1; i >= 0; i--) {
          const p = currentPieces[i];
          p.age += dt;

          if (p.age >= p.maxLife || p.y > height + 80) {
            currentPieces.splice(i, 1);
            continue;
          }

          if (!p.settled) {
            // Apply air drag
            const dragFactor = Math.max(0, 1 - drag * 1.2 * dt);
            p.vx *= dragFactor;
            p.vy *= dragFactor;

            // Apply gravity
            p.vy += gravityAcc * dt;

            // Apply flutter & turbulence
            p.wobble += p.wobbleSpeed * dt;
            const flutterForce = Math.sin(p.wobble) * 45 * flutter;
            const turbulenceOffset = (Math.random() - 0.5) * 30 * turbulence;

            p.vx += (windSpeed + flutterForce + turbulenceOffset) * dt;

            // Update position
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Update 3D tumbling rotation
            p.rotX += p.vRotX * dt;
            p.rotY += p.vRotY * dt;
            p.rotZ += p.vRotZ * dt;

            // Settle on bottom floor if enabled
            if (settle && p.y >= height - p.size / 2) {
              p.y = height - p.size / 2;
              p.vy = 0;
              p.vx = 0;
              p.settled = true;
            }
          }

          // Calculate visual projection
          const cosX = Math.cos(p.rotX);
          const cosY = Math.cos(p.rotY);

          // Alpha fade out
          const lifeProgress = p.age / p.maxLife;
          const fadeStart = 1 - fade;
          let alpha = opacity;
          if (lifeProgress > fadeStart) {
            alpha = opacity * (1 - (lifeProgress - fadeStart) / fade);
          }
          if (alpha <= 0) continue;

          // Shading & Sheen
          let lightFactor = 1;
          if (shading > 0) {
            lightFactor = 1 - Math.abs(cosX * cosY) * 0.4 * shading;
          }
          if (sheen > 0 && Math.abs(cosY) < 0.2) {
            lightFactor += sheen * 0.4;
          }

          // Render Particle
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotZ);
          ctx.scale(cosY, cosX);

          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.fillStyle = p.color;

          const w = p.size;
          const h = p.size * p.aspect;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -h / 2);
            ctx.lineTo(w / 2, h / 2);
            ctx.lineTo(-w / 2, h / 2);
            ctx.closePath();
            ctx.fill();
          } else {
            // 'rect', 'square', 'strip'
            ctx.fillRect(-w / 2, -h / 2, w, h);
          }

          ctx.restore();
        }
      };

      animId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(animId);
        ro.disconnect();
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('click', handlePointerDown);
      };
    }, [
      colors,
      shapes,
      size,
      sizeVariance,
      aspect,
      density,
      spread,
      inherit,
      gravity,
      drag,
      flutter,
      spin,
      wind,
      turbulence,
      life,
      fade,
      shading,
      sheen,
      opacity,
      settle,
      enableBurst,
      burstCount,
      burstPower,
      burstSpread,
      maxPieces,
      autoplay,
      autoplaySpeed,
      idleDelay,
      intro,
      interactive,
      disabled,
    ]);

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full min-h-[240px] overflow-hidden ${className}`}
        style={style}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10"
        />
        <div className="relative z-20 w-full h-full">{children}</div>
      </div>
    );
  }
);

Confetti.displayName = 'Confetti';
