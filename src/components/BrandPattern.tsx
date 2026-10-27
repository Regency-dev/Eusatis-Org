import React from 'react';

interface BrandPatternProps {
  className?: string;
  opacity?: number;
  variant?: 'grid' | 'strip' | 'banner';
}

export const BrandPattern: React.FC<BrandPatternProps> = ({
  className = '',
  opacity = 0.15,
  variant = 'grid'
}) => {
  if (variant === 'strip') {
    return (
      <div
        className={`flex items-center gap-2.5 overflow-hidden pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        {[...Array(14)].map((_, i) => {
          const colors = ['#47c3d3', '#d6a348', '#d67546', '#485358'];
          const color = colors[i % colors.length];
          const isArch = i % 2 === 0;
          return isArch ? (
            <div
              key={i}
              className="w-7 h-9 shrink-0 rounded-t-full"
              style={{ backgroundColor: color }}
            />
          ) : (
            <div
              key={i}
              className="w-7 h-9 shrink-0 rounded-[14px] border-2"
              style={{ borderColor: color }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="eusatis-geometric-pattern"
            width="60"
            height="70"
            patternUnits="userSpaceOnUse"
          >
            {/* Arch element with curved top */}
            <path
              d="M 10,28 C 10,14 22,14 22,28 Z"
              fill="#47c3d3"
              opacity="0.8"
            />
            {/* Oval ring with curved corners */}
            <rect
              x="38"
              y="8"
              width="14"
              height="18"
              rx="7"
              ry="9"
              fill="none"
              stroke="#d6a348"
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Solid vertical oval */}
            <rect
              x="10"
              y="44"
              width="13"
              height="18"
              rx="6.5"
              ry="9"
              fill="#d67546"
              opacity="0.7"
            />
            {/* Curved lower arch / 'e' shape motif */}
            <path
              d="M 36,54 C 36,44 54,44 54,54 Z"
              fill="#485358"
              opacity="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eusatis-geometric-pattern)" />
      </svg>
    </div>
  );
};
