import React, { useState, useRef, useEffect, useCallback } from 'react';

interface EusatisLogoProps {
  variant?: 'full' | 'main' | 'monogram' | 'icon';
  colorMode?: 'original' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
}

// Spark configuration for the AHA effect
interface SparkDef {
  id: number;
  xPercent: number; // Anchor on oval perimeter (0-100)
  yPercent: number; // Anchor on oval perimeter (0-100)
  dx: number; // Horizontal drift (px)
  dy: number; // Vertical drift (px)
  type: 'star' | 'dot' | 'trail';
  color: string;
  delayMs: number;
  durationMs: number;
  size?: number;
  angle?: number;
}

// 8 precisely calibrated sparks around the Eusatis oval
const AHA_SPARKS: SparkDef[] = [
  // 1. Upper right shoulder (Gold four-point star)
  {
    id: 1,
    xPercent: 82,
    yPercent: 16,
    dx: 18,
    dy: -14,
    type: 'star',
    color: '#D6A348',
    delayMs: 280,
    durationMs: 850,
    size: 13
  },
  // 2. Upper left shoulder (Cyan glowing dot)
  {
    id: 2,
    xPercent: 18,
    yPercent: 18,
    dx: -16,
    dy: -12,
    type: 'dot',
    color: '#47C3D3',
    delayMs: 460,
    durationMs: 750,
    size: 5
  },
  // 3. Right outer edge (Terracotta light trail)
  {
    id: 3,
    xPercent: 96,
    yPercent: 50,
    dx: 22,
    dy: 2,
    type: 'trail',
    color: '#D67546',
    delayMs: 650,
    durationMs: 800,
    angle: 85
  },
  // 4. Lower right curve (Cyan four-point star)
  {
    id: 4,
    xPercent: 82,
    yPercent: 82,
    dx: 18,
    dy: 16,
    type: 'star',
    color: '#47C3D3',
    delayMs: 850,
    durationMs: 850,
    size: 12
  },
  // 5. Lower left curve (Gold glowing dot)
  {
    id: 5,
    xPercent: 18,
    yPercent: 82,
    dx: -18,
    dy: 16,
    type: 'dot',
    color: '#D6A348',
    delayMs: 1050,
    durationMs: 800,
    size: 5
  },
  // 6. Left outer edge (Cyan light trail)
  {
    id: 6,
    xPercent: 4,
    yPercent: 48,
    dx: -22,
    dy: 0,
    type: 'trail',
    color: '#47C3D3',
    delayMs: 1250,
    durationMs: 800,
    angle: -90
  },
  // 7. Top apex (Cyan four-point star - Moment of Discovery)
  {
    id: 7,
    xPercent: 50,
    yPercent: 4,
    dx: 0,
    dy: -20,
    type: 'star',
    color: '#47C3D3',
    delayMs: 1450,
    durationMs: 850,
    size: 14
  },
  // 8. Mid-right accent (Terracotta delicate dot)
  {
    id: 8,
    xPercent: 88,
    yPercent: 68,
    dx: 16,
    dy: 10,
    type: 'dot',
    color: '#D67546',
    delayMs: 1650,
    durationMs: 700,
    size: 4
  }
];

export const EusatisLogo: React.FC<EusatisLogoProps> = ({
  variant = 'main',
  colorMode = 'original',
  size = 'md',
  className = '',
  interactive = true
}) => {
  // Dimensions exactly matching Brand Manual specifications
  const markDimensions = {
    sm: { w: 26, h: 32 },
    md: { w: 34, h: 42 },
    lg: { w: 48, h: 58 },
    xl: { w: 68, h: 82 }
  }[size];

  // Official color tokens from Brand Manual
  const outerRingColor =
    colorMode === 'white'
      ? '#FFFFFF'
      : colorMode === 'dark'
      ? '#2B3438'
      : '#D6A348'; // Gold oval ring

  const innerMarkColor =
    colorMode === 'white'
      ? '#FFFFFF'
      : colorMode === 'dark'
      ? '#2B3438'
      : '#47C3D3'; // Cyan E-mark

  const textColor =
    colorMode === 'white'
      ? 'text-white'
      : colorMode === 'dark'
      ? 'text-[#2B3438]'
      : 'text-[#2B3438]';

  const taglineColor =
    colorMode === 'white'
      ? 'text-white/80'
      : colorMode === 'dark'
      ? 'text-[#485358]'
      : 'text-[#485358]';

  // State management for interactive animation sequence
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSparks, setActiveSparks] = useState<SparkDef[]>([]);
  const [isIdleGlow, setIsIdleGlow] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sparkTimersRef = useRef<NodeJS.Timeout[]>([]);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Restrained Idle Effect: subtle shimmer after 20s of complete inactivity
  const scheduleIdleEffect = useCallback(() => {
    if (!interactive || reducedMotion) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      setIsIdleGlow(true);
      setTimeout(() => {
        setIsIdleGlow(false);
        scheduleIdleEffect();
      }, 1600);
    }, 20000);
  }, [interactive, reducedMotion]);

  useEffect(() => {
    scheduleIdleEffect();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [scheduleIdleEffect]);

  // Clean up any pending animation timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      sparkTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Trigger the 360-degree rotation and AHA spark sequence
  const triggerAnimation = useCallback(() => {
    if (!interactive || isAnimating) return; // Prevent overlapping animations

    // Reset idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIsIdleGlow(false);

    if (reducedMotion) {
      // Respect reduced-motion: gentle static highlight pulse without spinning or particles
      setIsIdleGlow(true);
      setTimeout(() => setIsIdleGlow(false), 900);
      return;
    }

    setIsAnimating(true);
    setActiveSparks([]);
    sparkTimersRef.current.forEach(clearTimeout);
    sparkTimersRef.current = [];

    // Schedule sparks with subtle staggered timing
    AHA_SPARKS.forEach((spark) => {
      const timer = setTimeout(() => {
        setActiveSparks((prev) => [...prev, spark]);
      }, spark.delayMs);
      sparkTimersRef.current.push(timer);
    });

    // Complete rotation cycle and reset cleanly back to resting orientation
    const totalDuration = 2350; // 2.2s rotation + spark fade-out
    animationTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
      setActiveSparks([]);
      scheduleIdleEffect();
    }, totalDuration);
  }, [interactive, isAnimating, reducedMotion, scheduleIdleEffect]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerAnimation();
    }
  };

  // The official approved EUSATIS SVG Logomark
  const MarkSvg = (
    <div
      className="relative shrink-0 flex items-center justify-center select-none"
      style={{
        width: markDimensions.w,
        height: markDimensions.h
      }}
    >
      {/* Restrained idle glow indicator */}
      {isIdleGlow && !isAnimating && (
        <span
          className="absolute inset-0 rounded-full bg-[#47C3D3]/20 blur-xs animate-pulse pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* SVG Oval Emblem */}
      <svg
        width={markDimensions.w}
        height={markDimensions.h}
        viewBox="0 0 88 106"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform origin-center will-change-transform"
        style={
          isAnimating
            ? {
                animation: 'eusatis-spin-smooth 2.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
              }
            : undefined
        }
        aria-label="Eusatis Oval Emblem"
      >
        {/* Outer warm oval frame with smooth curved corners */}
        {variant !== 'icon' && (
          <rect
            x="5.5"
            y="5.5"
            width="77"
            height="95"
            rx="38.5"
            ry="44"
            stroke={outerRingColor}
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors"
          />
        )}

        {/* Upper solid filled section (Initial confusion transforming into clarity) */}
        <path
          d="M 44,26 
             C 57.5,26 66,35 66,48 
             C 66,49.8 65,51 63.5,51 
             L 24.5,51 
             C 23,51 22,49.8 22,48 
             C 22,35 30.5,26 44,26 Z"
          fill={innerMarkColor}
        />

        {/* Lower open section (The moment clarity breaks through) */}
        <path
          d="M 22,54 
             C 22,52.8 22.8,52 24,52 
             L 32,52 
             C 33.2,52 34,52.8 34.2,54 
             C 34.8,61 38.8,67 44,67 
             C 49.2,67 53.2,62 54,56.5 
             C 54.2,55.2 55.2,54.5 56.5,54.5 
             L 64.5,54.5 
             C 65.8,54.5 66.5,55.5 66.2,57 
             C 64.2,69 55,78 44,78 
             C 31.5,78 22,68 22,54 Z"
          fill={innerMarkColor}
        />
      </svg>

      {/* AHA Spark Effect Layer */}
      {isAnimating && (
        <div
          className="absolute inset-0 pointer-events-none overflow-visible z-20"
          aria-hidden="true"
        >
          {activeSparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute pointer-events-none"
              style={
                {
                  left: `${spark.xPercent}%`,
                  top: `${spark.yPercent}%`,
                  '--dx': `${spark.dx}px`,
                  '--dy': `${spark.dy}px`
                } as React.CSSProperties
              }
            >
              {spark.type === 'star' && (
                <svg
                  width={spark.size || 12}
                  height={spark.size || 12}
                  viewBox="-6 -6 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible will-change-transform"
                  style={{
                    animation: `eusatis-spark-star-bloom ${spark.durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
                  }}
                >
                  <path
                    d="M 0,-6 Q 0,0 6,0 Q 0,0 0,6 Q 0,0 -6,0 Q 0,0 0,-6 Z"
                    fill={spark.color}
                  />
                </svg>
              )}

              {spark.type === 'dot' && (
                <div
                  className="rounded-full will-change-transform"
                  style={{
                    width: `${spark.size || 4}px`,
                    height: `${spark.size || 4}px`,
                    backgroundColor: spark.color,
                    boxShadow: `0 0 6px ${spark.color}`,
                    animation: `eusatis-spark-bloom ${spark.durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
                  }}
                />
              )}

              {spark.type === 'trail' && (
                <svg
                  width="6"
                  height="14"
                  viewBox="-3 -7 6 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible will-change-transform"
                  style={{
                    transform: `rotate(${spark.angle || 0}deg)`,
                    animation: `eusatis-spark-trail-bloom ${spark.durationMs}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`
                  }}
                >
                  <rect
                    x="-1"
                    y="-6"
                    width="2"
                    height="12"
                    rx="1"
                    fill={spark.color}
                    opacity="0.95"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (variant === 'icon' || variant === 'monogram') {
    return (
      <div
        className={`inline-flex items-center justify-center ${interactive ? 'cursor-pointer focus:outline-hidden' : ''} ${className}`}
        onMouseEnter={triggerAnimation}
        onFocus={triggerAnimation}
        onTouchStart={triggerAnimation}
        onKeyDown={interactive ? handleKeyDown : undefined}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'img' : undefined}
        aria-label="Eusatis logo mark with interactive AHA animation"
      >
        {MarkSvg}
      </div>
    );
  }

  const textSizeClass = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-3.5 select-none ${interactive ? 'cursor-pointer focus:outline-hidden group' : ''} ${className}`}
      onMouseEnter={triggerAnimation}
      onFocus={triggerAnimation}
      onTouchStart={triggerAnimation}
      onKeyDown={interactive ? handleKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'img' : undefined}
      aria-label="Eusatis brand logo with interactive AHA animation"
    >
      {MarkSvg}

      <div className="flex flex-col justify-center">
        <span
          className={`font-bold font-['Outfit'] tracking-tight leading-none transition-colors duration-200 ${textSizeClass} ${textColor} ${
            interactive ? 'group-hover:text-[#1F272A]' : ''
          }`}
        >
          Eusatis
        </span>
        {variant === 'full' && (
          <span
            className={`text-[11px] font-medium tracking-normal mt-1 ${taglineColor}`}
          >
            The joy of understanding more
          </span>
        )}
      </div>
    </div>
  );
};
