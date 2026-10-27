import React, { useState } from 'react';
import { Copy, Check, Info, Sparkles } from 'lucide-react';
import { parseMathToReact } from './MathText';

interface EquationBlockProps {
  rawEquation: string;
  contextSubject?: string;
}

/**
 * Dedicated mathematical and scientific equation component.
 * Converts raw equation strings and LaTeX-style syntax into visually rich,
 * high-clarity mathematical display cards with styled fraction bars,
 * formatted subscripts/superscripts, and interactive variable glossaries.
 */
export const EquationBlock: React.FC<EquationBlockProps> = ({
  rawEquation,
  contextSubject = 'General'
}) => {
  const [copied, setCopied] = useState(false);
  const [showGlossary, setShowGlossary] = useState(true);

  // Normalize equation text
  const cleanEq = rawEquation.replace(/\$\$/g, '').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanEq);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Known equation presets for rich formatting & variable breakdowns
  const getEquationDetails = () => {
    if (cleanEq.includes('n_1') && cleanEq.includes('\\sin')) {
      return {
        title: "Snell's Law of Wave Refraction",
        renderedDisplay: (
          <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-[#1F272A] py-2">
            <span className="italic font-semibold">n</span>
            <sub className="text-sm font-sans font-bold -mt-1 text-[#0891B2]">1</sub>
            <span className="text-slate-400 font-sans">·</span>
            <span>sin(</span>
            <span className="italic text-[#0891B2]">θ</span>
            <sub className="text-sm font-sans font-bold -mt-1 text-[#0891B2]">1</sub>
            <span>)</span>
            <span className="text-[#D6A348] font-bold px-2">=</span>
            <span className="italic font-semibold">n</span>
            <sub className="text-sm font-sans font-bold -mt-1 text-[#D67546]">2</sub>
            <span className="text-slate-400 font-sans">·</span>
            <span>sin(</span>
            <span className="italic text-[#D67546]">θ</span>
            <sub className="text-sm font-sans font-bold -mt-1 text-[#D67546]">2</sub>
            <span>)</span>
          </div>
        ),
        variables: [
          { symbol: 'n₁', name: 'Refractive Index (Medium 1)', desc: 'Optical density ratio c/v of the incident material (e.g. Air = 1.0003)' },
          { symbol: 'θ₁', name: 'Incident Angle', desc: 'Angle between incident wavefront and the surface normal perpendicular (degrees)' },
          { symbol: 'n₂', name: 'Refractive Index (Medium 2)', desc: 'Optical density ratio of the refracting transmission medium (e.g. Crown Glass = 1.52)' },
          { symbol: 'θ₂', name: 'Refraction Angle', desc: 'Angle of the transmitted refracted wave relative to normal' }
        ],
        intuition: 'Conservation of wave phase speed across boundaries forces wave crests to pivot when changing velocity.'
      };
    }

    if (cleanEq.includes('\\delta') || cleanEq.includes('48 E I') || cleanEq.includes('F L^3') || cleanEq.includes('FL^3')) {
      return {
        title: 'Euler-Bernoulli Elastic Beam Deflection',
        renderedDisplay: (
          <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-[#1F272A] py-2">
            <div className="flex items-center">
              <span className="italic font-semibold text-[#D67546]">δ</span>
              <sub className="text-xs font-sans font-bold text-slate-500 ml-0.5">max</sub>
            </div>
            <span className="text-[#D6A348] font-bold px-1">=</span>
            <div className="inline-flex flex-col items-center">
              {/* Numerator */}
              <div className="px-3 pb-1 border-b-2 border-slate-800 font-serif flex items-center gap-1.5">
                <span className="italic font-semibold text-[#0891B2]">F</span>
                <span className="text-slate-400 font-sans">·</span>
                <span className="italic font-semibold">L</span>
                <sup className="text-sm font-sans font-bold text-[#D6A348] -mt-2">3</sup>
              </div>
              {/* Denominator */}
              <div className="px-3 pt-1 font-serif flex items-center gap-1.5">
                <span className="font-sans font-bold text-slate-700">48</span>
                <span className="text-slate-400 font-sans">·</span>
                <span className="italic font-semibold">E</span>
                <span className="text-slate-400 font-sans">·</span>
                <span className="italic font-semibold text-[#0891B2]">I</span>
              </div>
            </div>
          </div>
        ),
        variables: [
          { symbol: 'δ_max', name: 'Peak Mid-Span Deflection', desc: 'Vertical displacement distance (m or mm) under load' },
          { symbol: 'F', name: 'Point Force', desc: 'Applied concentrated load in Newtons (N)' },
          { symbol: 'L', name: 'Span Length', desc: 'Distance between horizontal beam supports (m) — cubically amplified' },
          { symbol: 'E', name: "Young's Modulus", desc: 'Elastic stiffness intrinsic to material (Pascals, e.g. Steel = 200 GPa)' },
          { symbol: 'I', name: 'Second Moment of Area', desc: 'Geometric cross-sectional resistance against bending (m⁴)' }
        ],
        intuition: 'Span length is cubed (L³): doubling span increases sagging deflection 8-fold (2³ = 8)!'
      };
    }

    if (cleanEq.includes('CO_2') || cleanEq.includes('C_6H_{12}O_6') || cleanEq.includes('photons')) {
      return {
        title: 'Photosynthetic Carbon Fixation Stoichiometry',
        renderedDisplay: (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl font-serif text-[#1F272A] py-2">
            <span className="font-bold text-slate-800">6</span>
            <span>CO</span><sub className="text-xs font-sans font-bold text-slate-500">2</sub>
            <span className="text-[#0891B2] font-bold">+</span>
            <span className="font-bold text-slate-800">6</span>
            <span>H</span><sub className="text-xs font-sans font-bold text-slate-500">2</sub><span>O</span>
            <span className="text-[#0891B2] font-bold">+</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-[#B47818] font-sans text-xs sm:text-sm font-bold">Light Photons</span>
            <div className="flex flex-col items-center px-2">
              <span className="text-[10px] font-sans font-bold text-emerald-600 tracking-wider">chlorophyll</span>
              <span className="text-[#D6A348] text-xl font-bold">⟶</span>
            </div>
            <span>C</span><sub className="text-xs font-sans font-bold text-slate-500">6</sub>
            <span>H</span><sub className="text-xs font-sans font-bold text-slate-500">12</sub>
            <span>O</span><sub className="text-xs font-sans font-bold text-slate-500">6</sub>
            <span className="text-[#0891B2] font-bold">+</span>
            <span className="font-bold text-slate-800">6</span>
            <span>O</span><sub className="text-xs font-sans font-bold text-slate-500">2</sub>
            <span className="text-emerald-600 font-sans text-sm font-bold">↑</span>
          </div>
        ),
        variables: [
          { symbol: 'CO₂', name: 'Carbon Dioxide', desc: 'Atmospheric gas captured via stomata in leaf mesophyll tissue' },
          { symbol: 'H₂O', name: 'Water', desc: 'Transported through root xylem; split in photosystem II to supply electrons' },
          { symbol: 'C₆H₁₂O₆', name: 'D-Glucose', desc: 'High-energy organic carbohydrate stored or converted into starch and cellulose' },
          { symbol: 'O₂', name: 'Molecular Oxygen', desc: 'Byproduct transpired into atmosphere, sustaining aerobic life on Earth' }
        ],
        intuition: 'Solar electromagnetic energy is converted into stable covalent chemical bonds within glucose molecules.'
      };
    }

    if (cleanEq.includes('CaCO_3') || cleanEq.includes('Ca^{2+}') || cleanEq.includes('CO_3')) {
      return {
        title: 'Agricultural Soil Neutralization Stoichiometry',
        renderedDisplay: (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-lg sm:text-2xl font-serif text-[#1F272A] py-2">
            <span>CaCO</span><sub className="text-xs font-sans font-bold text-slate-500">3</sub>
            <span className="text-[#0891B2] font-bold">+</span>
            <span className="font-bold text-slate-800">2</span>
            <span>H</span><sup className="text-xs font-sans font-bold text-[#D67546]">+</sup>
            <span className="text-[#D6A348] text-xl font-bold px-1">⟶</span>
            <span>Ca</span><sup className="text-xs font-sans font-bold text-[#0891B2]">2+</sup>
            <span className="text-[#0891B2] font-bold">+</span>
            <span>H</span><sub className="text-xs font-sans font-bold text-slate-500">2</sub><span>O</span>
            <span className="text-[#0891B2] font-bold">+</span>
            <span>CO</span><sub className="text-xs font-sans font-bold text-slate-500">2</sub>
            <span className="text-emerald-600 font-sans text-sm font-bold">↑</span>
          </div>
        ),
        variables: [
          { symbol: 'CaCO₃', name: 'Agricultural Limestone', desc: 'Calcium carbonate mineral applied to neutralize acidic soils' },
          { symbol: 'H⁺', name: 'Active Hydrogen Ions', desc: 'Acidic protons in soil solution lowering the pH' },
          { symbol: 'Ca²⁺', name: 'Bioavailable Calcium Cation', desc: 'Soluble plant nutrient readily absorbed through root membranes' },
          { symbol: 'CO₂ & H₂O', name: 'Innocuous Byproducts', desc: 'Water and carbon dioxide released during proton neutralization' }
        ],
        intuition: 'Liming directly consumes acidic protons, releasing essential calcium cations into the soil exchange complex.'
      };
    }

    if (cleanEq.includes('\\phi') || cleanEq.includes('\\Phi') || cleanEq.includes('1.618') || cleanEq.includes('137.5') || cleanEq.includes('a+b')) {
      return {
        title: 'Golden Ratio & Phyllotaxis Divergence Angle',
        renderedDisplay: (
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xl sm:text-2xl font-serif text-[#1F272A] py-2">
            <div className="flex items-center gap-2">
              <span className="italic font-semibold text-[#D6A348] text-3xl">Φ</span>
              <span className="text-[#D6A348] font-bold">=</span>
              <div className="inline-flex flex-col items-center">
                <span className="px-2 pb-0.5 border-b border-slate-700 font-serif">1 + √5</span>
                <span className="px-2 pt-0.5 font-sans font-bold">2</span>
              </div>
              <span className="text-slate-400 font-sans">≈</span>
              <span className="font-mono text-lg font-bold text-slate-800">1.6180339...</span>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="italic font-semibold text-[#0891B2] text-2xl">ψ</span>
              <span className="text-[#0891B2] font-bold">=</span>
              <span>360° · (1 - 1/Φ)</span>
              <span className="text-slate-400 font-sans">≈</span>
              <span className="font-mono text-lg font-bold text-[#D67546]">137.5077°</span>
            </div>
          </div>
        ),
        variables: [
          { symbol: 'Φ (Phi)', name: 'Golden Ratio Constant', desc: 'Irrational proportion (1 + √5)/2 governing self-similar logarithmic growth' },
          { symbol: 'ψ (Psi)', name: 'Golden Divergence Angle', desc: '137.5° offset per primordium, ensuring no overlapping leaves and optimal sunlight exposure' }
        ],
        intuition: 'Because Φ is the most irrational number, it prevents periodic alignment, ensuring maximal space packing efficiency.'
      };
    }

    if (cleanEq.includes('E_a') || cleanEq.includes('RT') || cleanEq.includes('Arrhenius') || (cleanEq.includes('k =') && cleanEq.includes('A'))) {
      return {
        title: 'The Arrhenius Law of Reaction Kinetics',
        renderedDisplay: (
          <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-[#1F272A] py-2">
            <span className="italic font-semibold text-[#0891B2]">k</span>
            <span className="text-[#D6A348] font-bold px-1">=</span>
            <span className="italic font-semibold text-slate-800">A</span>
            <span className="text-slate-400 font-sans">·</span>
            <span className="font-serif">e</span>
            <sup className="text-xs sm:text-sm font-sans font-bold -mt-3 text-slate-800">
              <span className="text-[#D67546]">-E</span><sub className="text-[10px] text-[#D67546]">a</sub>
              <span className="text-slate-400"> / </span>
              <span className="text-[#0891B2]">RT</span>
            </sup>
          </div>
        ),
        variables: [
          { symbol: 'k', name: 'Reaction Rate Constant', desc: 'Quantitative velocity coefficient of the elementary reaction' },
          { symbol: 'A', name: 'Pre-Exponential Frequency Factor', desc: 'Frequency of collisions with favorable steric molecular orientation (s⁻¹)' },
          { symbol: 'E_a', name: 'Activation Energy', desc: 'Minimum kinetic threshold required to reach the transition state barrier (J/mol)' },
          { symbol: 'R', name: 'Universal Gas Constant', desc: 'Ideal gas constant (8.314 J / mol · K)' },
          { symbol: 'T', name: 'Absolute Temperature', desc: 'Thermal kinetic energy measured in Kelvin (K)' }
        ],
        intuition: 'Temperature increases exponentially amplify the fraction of collisions with sufficient kinetic energy to overcome the activation barrier.'
      };
    }

    if (cleanEq.includes('lim') || cleanEq.includes("f'(x)") || (cleanEq.includes('f(x+h)') && cleanEq.includes('h'))) {
      return {
        title: 'The Formal Limit Definition of the Derivative',
        renderedDisplay: (
          <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-serif text-[#1F272A] py-2">
            <div className="flex items-center font-serif">
              <span className="italic font-semibold text-[#0891B2]">f</span>
              <span className="text-slate-800 font-sans font-bold">&prime;</span>
              <span>(</span><span className="italic">x</span><span>)</span>
            </div>
            <span className="text-[#D6A348] font-bold px-1">=</span>
            <div className="flex flex-col items-center mr-1">
              <span className="text-xs sm:text-sm font-sans font-bold text-slate-500">lim</span>
              <span className="text-[10px] font-sans font-bold text-[#D67546] -mt-0.5">h → 0</span>
            </div>
            <div className="inline-flex flex-col items-center">
              <div className="px-2 pb-1 border-b-2 border-slate-800 font-serif flex items-center gap-1">
                <span>f(x + h)</span>
                <span className="text-slate-400 font-sans">-</span>
                <span>f(x)</span>
              </div>
              <div className="px-2 pt-1 font-serif text-center">
                <span className="italic font-semibold text-[#0891B2]">h</span>
              </div>
            </div>
          </div>
        ),
        variables: [
          { symbol: "f'(x)", name: 'Instantaneous Derivative', desc: 'Slope of tangent line and true rate of change at point x' },
          { symbol: 'h', name: 'Secant Increment Interval', desc: 'Distance between sampling coordinates approaching the infinitesimal limit zero' },
          { symbol: 'f(x+h) - f(x)', name: 'Vertical Delta (Δy)', desc: 'Net function displacement over the horizontal span h' }
        ],
        intuition: 'As the sampling distance h collapses to zero, secant approximations converge into the instantaneous velocity and curvature.'
      };
    }

    // Universal high-fidelity math renderer fallback
    return {
      title: contextSubject ? `${contextSubject} Mathematical Formulation` : 'Mathematical Formulation',
      renderedDisplay: (
        <div className="flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-serif text-[#1F272A] py-2 text-center tracking-wide overflow-x-auto">
          {parseMathToReact(cleanEq)}
        </div>
      ),
      variables: [],
      intuition: null
    };
  };

  const details = getEquationDetails();

  return (
    <div className="my-8 rounded-3xl bg-linear-to-b from-white to-slate-50/80 border border-slate-200 shadow-sm overflow-hidden">
      {/* Equation Card Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-800 font-['Outfit'] block">
            {details.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {details.variables.length > 0 && (
            <button
              onClick={() => setShowGlossary(!showGlossary)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-[#0891B2]" />
              <span>{showGlossary ? 'Hide Guide' : 'Variable Guide'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Copy formula"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Equation Stage */}
      <div className="p-6 sm:p-8 flex items-center justify-center bg-white relative overflow-hidden">
        {/* Subtle decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#485358 0.75px, transparent 0.75px)',
            backgroundSize: '16px 16px'
          }}
        />

        <div className="relative z-10 w-full overflow-x-auto py-1">
          {details.renderedDisplay}
        </div>
      </div>

      {/* Variable Breakdown & Scientific Intuition */}
      {showGlossary && details.variables.length > 0 && (
        <div className="p-5 sm:p-6 bg-slate-50/80 border-t border-slate-100 space-y-4">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-slate-500 font-['Outfit']">
            Variable Breakdown & Physical Meanings
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {details.variables.map((v, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-serif font-bold text-sm bg-slate-100 text-slate-900 border border-slate-200">
                    {v.symbol}
                  </span>
                  <span className="font-bold text-slate-800 font-['Outfit'] text-sm">
                    {v.name}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pl-0.5">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {details.intuition && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
              <strong className="block text-slate-900 mb-0.5 font-black uppercase tracking-[0.2em] font-['Outfit'] text-xs">
                Core Scientific Insight:
              </strong>
              <span className="leading-relaxed">{details.intuition}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
