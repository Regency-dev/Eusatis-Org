import React from 'react';

interface BrandPatternArrayProps {
  className?: string;
  rows?: number;
}

/**
 * Rectangular array of Eusatis brand motifs oriented from start to end (left to right)
 * based strictly on the Brand Manual's geometric shapes and color palette:
 * - Oval rings with curved corners (#D6A348 Gold)
 * - Upper curved clarity arches (#47C3D3 Cyan)
 * - Kinetic vertical terracotta capsules (#D67546)
 * - Structured slate geometric blocks (#485358)
 */
export const BrandPatternArray: React.FC<BrandPatternArrayProps> = ({
  className = '',
  rows = 2
}) => {
  return (
    <div
      className={`w-full overflow-hidden select-none border-y border-slate-800/80 bg-slate-950/60 py-3 ${className}`}
      aria-hidden="true"
    >
      <div className="w-full flex flex-col gap-2.5">
        {[...Array(rows)].map((_, rowIndex) => {
          // Stagger alternating rows slightly for dynamic geometric flow
          const offset = rowIndex % 2 === 1;
          return (
            <div
              key={rowIndex}
              className={`flex items-center gap-3 w-full justify-between overflow-hidden opacity-85 transition-opacity hover:opacity-100 ${
                offset ? '-translate-x-4' : 'translate-x-0'
              }`}
            >
              {[...Array(24)].map((_, colIndex) => {
                const cellType = (colIndex + rowIndex * 3) % 6;
                return (
                  <div
                    key={colIndex}
                    className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800/90 shadow-2xs transition-transform duration-300 hover:scale-110"
                  >
                    {cellType === 0 && (
                      /* Gold curved oval ring */
                      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                        <rect
                          x="2"
                          y="2"
                          width="18"
                          height="24"
                          rx="9"
                          ry="11"
                          stroke="#D6A348"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="11" cy="14" r="2.5" fill="#47C3D3" />
                      </svg>
                    )}

                    {cellType === 1 && (
                      /* Cyan upper clarity arch */
                      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                        <path
                          d="M 4,20 C 4,10 20,10 20,20 Z"
                          fill="#47C3D3"
                        />
                        <rect
                          x="7"
                          y="22"
                          width="10"
                          height="3"
                          rx="1.5"
                          fill="#D6A348"
                        />
                      </svg>
                    )}

                    {cellType === 2 && (
                      /* Terracotta vertical capsule with negative aperture */
                      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                        <rect
                          x="3"
                          y="3"
                          width="16"
                          height="22"
                          rx="8"
                          ry="10"
                          fill="#D67546"
                        />
                        <circle cx="11" cy="14" r="3.5" fill="#1F272A" />
                      </svg>
                    )}

                    {cellType === 3 && (
                      /* Interlocking dual-tone clarity emblem */
                      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="24"
                          rx="10"
                          ry="12"
                          stroke="#485358"
                          strokeWidth="2"
                        />
                        <path
                          d="M 7,12 C 7,8 17,8 17,12 Z"
                          fill="#47C3D3"
                        />
                        <circle cx="12" cy="18" r="2" fill="#D6A348" />
                      </svg>
                    )}

                    {cellType === 4 && (
                      /* Minimalist gold curvature segment */
                      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                        <path
                          d="M 4,7 C 4,17 18,17 18,23"
                          stroke="#D6A348"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="18" cy="7" r="2.5" fill="#D67546" />
                      </svg>
                    )}

                    {cellType === 5 && (
                      /* Dual arc with glowing focus center */
                      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
                        <path
                          d="M 3,14 C 3,7 19,7 19,14"
                          stroke="#47C3D3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 3,14 C 3,21 19,21 19,14"
                          stroke="#D67546"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="11" cy="14" r="2" fill="#FFFFFF" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
