import React from 'react';

interface MathTextProps {
  content: string;
  className?: string;
}

/**
 * Universal mathematical, scientific, and chemical text normalizer.
 * Cleans:
 *  - Accidental tab corruptions (\t or literal 0x09) stemming from unescaped \text
 *  - Mathematical notation (Snell's Law: 1.00 * sin(30°) = 1.52 * sin(θ2) => θ2 ≈ 19.2°)
 *  - Thermodynamic units (J/mol, 8.314 J/(mol·K), K, 10 K, Ea = 52.0 kJ/mol, 300 K (27°C) to 310 K (37°C))
 *  - Beam mechanics symbols (δ_max)
 *  - Chemical and photolysis equations (2H₂O ⟶ 4H⁺ + 4e⁻ + O₂↑)
 */
export function normalizeMathAndScientificContent(raw: string): string {
  if (!raw) return '';

  let s = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Treat literal backslash-t string "\\t" the same as tab character "\t"
    .replace(/\\t/g, '\t');

  // Strip accidental markdown heading markers if passed into inline text
  s = s.replace(/^[ \t]*#{1,4}[ \t]+/gm, '');

  // 1. Remove and repair corrupted tab escapes (\t) and \text wrappers
  s = s
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\t?ext\{([^}]+)\}/g, '$1')
    .replace(/\t+ext\{([^}]+)\}/g, '$1')
    .replace(/\bext\{([^}]+)\}/g, '$1')
    // Repair unit tabs: \tJ/mol, \tmol, \tK, \tC, \tkJ
    .replace(/\t+J\s*\/\s*mol/gi, ' J/mol')
    .replace(/\t+kJ\s*\/\s*mol/gi, ' kJ/mol')
    .replace(/\t+mol\b/gi, ' mol')
    .replace(/\t+K\b/g, ' K')
    .replace(/\t+C\b/g, ' C')
    .replace(/\t+max\b/g, '_max')
    .replace(/δ\s*\t*max\b/g, 'δ_max')
    .replace(/\bδmax\b/g, 'δ_max');

  // 2. Clean specific units, constants, and temperature ranges
  s = s
    .replace(/\(\s*\t*\s*J\s*\/\s*mol\s*\)/gi, '(J/mol)')
    .replace(/8\.314\s*\t*\s*J\s*\/\s*\(\s*\t*\s*mol\s*[·•\.]\s*\t*\s*K\s*\)/gi, '8.314 J/(mol·K)')
    .replace(/8\.314\s*J\s*\/\s*mol\s*[·•\.]\s*K/gi, '8.314 J/(mol·K)')
    .replace(/\(\s*\t*\s*K\s*\)/gi, '(K)')
    .replace(/\b10\s*\t*\s*K\b/g, '10 K')
    .replace(/\bEa\s*=\s*/g, 'E_a = ')
    .replace(/E_a\s*=\s*52\.0\s*\t*\s*kJ\s*\/\s*mol\)/gi, 'E_a = 52.0 kJ/mol)')
    .replace(/E_a\s*=\s*52\.0\s*\t*\s*kJ\s*\/\s*mol\b/gi, 'E_a = 52.0 kJ/mol')
    // 300 K (27°C) to 310 K (37°C)
    .replace(/300\s*\t*\s*K\s*\(\s*27°?\s*\t*\s*C\s*\)\s*to\s*310\s*\t*\s*K\s*\(\s*37°?\s*\t*\s*C\s*\)/gi, '300 K (27°C) to 310 K (37°C)')
    .replace(/([0-9]+)\s*\t*\s*K\s*\(\s*([0-9]+)°?\s*\t*\s*C\s*\)/gi, '$1 K ($2°C)')
    .replace(/([0-9]+)\s*\t+K\b/g, '$1 K')
    .replace(/([0-9]+)°\s*\t+C\b/g, '$1°C');

  // 3. Clean photolysis chemical equation and stoichiometry
  s = s
    .replace(/2\s*\t*\s*H2\s*\t*\s*O\s*⟶\s*4\s*\t*\s*H\+\s*\+\s*4e\-?\s*\+\s*\t*\s*O2\s*↑?/gi, '2H₂O ⟶ 4H⁺ + 4e⁻ + O₂↑')
    .replace(/2\s*\t*\s*H2\s*\t*\s*O\s*->\s*4\s*\t*\s*H\+\s*\+\s*4e\-?\s*\+\s*\t*\s*O2\s*↑?/gi, '2H₂O ⟶ 4H⁺ + 4e⁻ + O₂↑')
    .replace(/\b2\s*\t*\s*H2\s*\t*\s*O\b/g, '2H₂O')
    .replace(/\b\t*H2\s*\t*\s*O\b/g, 'H₂O')
    .replace(/\b\t*O2\s*↑/g, 'O₂↑')
    .replace(/\b\t*O2\b/g, 'O₂')
    .replace(/\b4\s*\t*H\+/g, '4H⁺')
    .replace(/\b4e\-/g, '4e⁻')
    .replace(/3\s*[×x*]\s*2\s*=\s*6/g, '3 × 2 = 6');

  // 4. Clean Snell's law equation statement: "1.00 * sin(30°) = 1.52 * sin(θ2) => θ2 ≈ 19.2°."
  s = s
    .replace(/1\.00\s*[*·×]\s*sin\(30°?\)\s*=\s*1\.52\s*[*·×]\s*sin\(θ2\)\s*(?:=>|⟹)\s*θ2\s*≈\s*19\.2°/gi, '1.00 · sin(30°) = 1.52 · sin(θ₂) ⟹ θ₂ ≈ 19.2°')
    .replace(/1\.00\s*\*\s*sin/g, '1.00 · sin')
    .replace(/1\.52\s*\*\s*sin/g, '1.52 · sin')
    .replace(/sin\(θ2\)/g, 'sin(θ₂)')
    .replace(/sin\(θ1\)/g, 'sin(θ₁)')
    .replace(/\bθ2\b/g, 'θ₂')
    .replace(/\bθ1\b/g, 'θ₁')
    .replace(/\bn1\b/g, 'n₁')
    .replace(/\bn2\b/g, 'n₂')
    .replace(/\s*=>\s*/g, ' ⟹ ');

  // 5. Replace any remaining literal tabs globally with a single space
  s = s.replace(/\t+/g, ' ');

  // 6. Clean excess whitespace while preserving newlines
  s = s.replace(/[ ]{2,}/g, ' ');

  return s;
}

/**
 * Universal mathematical and scientific expression renderer.
 * Formats mathematical variables (L, E, I, F, a, b, etc.) in authentic italic mathematical typography,
 * properly displays Greek letters (Φ, θ, δ, ψ), formats powers (L³, 2³ = 8, 10⁸),
 * chemical ions (Ca²⁺, Mg²⁺, K⁺, NH₄⁺, CO₃²⁻), fractions, and equation statements.
 */
export const MathText: React.FC<MathTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Pre-normalize all mathematical, scientific, and formatting corruptions
  const normalized = normalizeMathAndScientificContent(content);

  // Split on inline math delimiter $...$ or block $$...$$
  const parts = normalized.split(/(\$\$?[^$]+\$\$?)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isBlock = part.startsWith('$$') && part.endsWith('$$');
        const isInline = !isBlock && part.startsWith('$') && part.endsWith('$');

        if (isBlock || isInline) {
          const rawInner = isBlock ? part.slice(2, -2).trim() : part.slice(1, -1).trim();
          return (
            <MathSegment
              key={index}
              mathString={rawInner}
              isBlock={isBlock}
            />
          );
        }

        // Plain text: parse any inline bold text or raw mathematical notation in prose
        return <React.Fragment key={index}>{renderProseWithSymbols(part)}</React.Fragment>;
      })}
    </span>
  );
};

/**
 * Render symbols and notations that might appear outside $...$ in regular prose,
 * and support markdown bold **...** and formatted sub/superscripts.
 */
function renderProseWithSymbols(text: string): React.ReactNode {
  // If the text contains bold markers **text**
  if (text.includes('**')) {
    const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
    return (
      <>
        {boldParts.map((bp, i) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            const inner = bp.slice(2, -2);
            return (
              <strong key={i} className="font-bold text-slate-900 font-['Outfit']">
                {renderProseWithSymbols(inner)}
              </strong>
            );
          }
          return <React.Fragment key={i}>{cleanProseSymbols(bp)}</React.Fragment>;
        })}
      </>
    );
  }

  return cleanProseSymbols(text);
}

function cleanProseSymbols(text: string): React.ReactNode {
  let s = normalizeMathAndScientificContent(text)
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/3\s*x\s*10\^8/gi, '3 × 10⁸')
    .replace(/10\^8/g, '10⁸')
    .replace(/\\circ/g, '°');

  // If text contains $...$ or LaTeX tokens, pass to parseMathToReact
  if (s.includes('$') || /(\\[a-zA-Z]+|\^\{?[0-9a-zA-Z°+\-]+\}?|_\{?[0-9a-zA-Z°+\-]+\}?|√\{|\\frac)/.test(s)) {
    return <>{parseMathToReact(s)}</>;
  }

  // Check for common variable and equation occurrences in prose so they match the formula typography
  // e.g. length L, modulus of elasticity E, second moment of area I, point load F, L³, 2³ = 8, Ca²⁺, Mg²⁺, K⁺, NH₄⁺
  const proseTokens = s.split(/(\b(?:L\^3|2\^3\s*=\s*8|Ca\^\{?2\+?\}?|Mg\^\{?2\+?\}?|K\^\{?\+?\}?|NH_4\^\{?\+?\}?|CO_3\^\{?2\-?\}?|δ_max|E_a|θ₂|θ₁|n₁|n₂|H₂O|O₂↑|O₂|4H⁺|4e⁻)\b|(?<=\blength\s+)L\b|(?<=\bmodulus of elasticity\s+)E\b|(?<=\bsecond moment of area\s+)I\b|(?<=\bpoint load\s+)F\b|(?<=\bspan length\s+)L\b|(?<=\bincreases\s+)I\b|(?<=\bquantities\s+)a\b|(?<=\band\s+)b\b|(?<=\bwith\s+)a\s*>\s*b\b)/g);

  if (proseTokens.length > 1) {
    return (
      <>
        {proseTokens.map((tok, ti) => {
          if (!tok) return null;
          if (tok === 'L') {
            return <span key={ti} className="italic font-serif font-bold text-slate-900 mx-0.5">L</span>;
          }
          if (tok === 'E') {
            return <span key={ti} className="italic font-serif font-bold text-slate-900 mx-0.5">E</span>;
          }
          if (tok === 'I') {
            return <span key={ti} className="italic font-serif font-bold text-[#0891B2] mx-0.5">I</span>;
          }
          if (tok === 'F') {
            return <span key={ti} className="italic font-serif font-bold text-[#0891B2] mx-0.5">F</span>;
          }
          if (tok === 'a') {
            return <span key={ti} className="italic font-serif font-bold text-slate-900 mx-0.5">a</span>;
          }
          if (tok === 'b') {
            return <span key={ti} className="italic font-serif font-bold text-slate-900 mx-0.5">b</span>;
          }
          if (tok === 'δ_max') {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-[#D67546]">δ</span>
                <sub className="font-sans text-[11px] font-bold text-[#D67546] ml-0.5">max</sub>
              </span>
            );
          }
          if (tok === 'E_a') {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-slate-900">E</span>
                <sub className="font-sans text-[11px] font-bold text-slate-700 ml-0.5">a</sub>
              </span>
            );
          }
          if (tok === 'θ₂') {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-[#D67546]">θ</span>
                <sub className="font-sans text-[11px] font-bold text-[#D67546] ml-0.5">2</sub>
              </span>
            );
          }
          if (tok === 'θ₁') {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-[#0891B2]">θ</span>
                <sub className="font-sans text-[11px] font-bold text-[#0891B2] ml-0.5">1</sub>
              </span>
            );
          }
          if (tok.includes('>')) {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-slate-900">a</span>
                <span className="font-sans font-bold text-slate-700 mx-1">&gt;</span>
                <span className="italic font-serif font-bold text-slate-900">b</span>
              </span>
            );
          }
          if (tok.includes('L^3') || tok === 'L³') {
            return (
              <span key={ti} className="inline-flex items-baseline mx-0.5">
                <span className="italic font-serif font-bold text-slate-900">L</span>
                <sup className="font-sans text-xs font-bold text-[#D6A348] -top-1">3</sup>
              </span>
            );
          }
          if (tok.includes('2^3') || tok.includes('2³')) {
            return (
              <span key={ti} className="font-sans font-bold text-slate-900 mx-0.5">
                2<sup>3</sup> = 8
              </span>
            );
          }
          return <React.Fragment key={ti}>{tok}</React.Fragment>;
        })}
      </>
    );
  }

  return s;
}

interface MathSegmentProps {
  mathString: string;
  isBlock?: boolean;
}

export const MathSegment: React.FC<MathSegmentProps> = ({ mathString, isBlock = false }) => {
  const renderedNodes = parseMathToReact(mathString);

  if (isBlock) {
    return (
      <span className="block my-4 text-center overflow-x-auto py-2">
        <span className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 font-serif text-lg sm:text-xl md:text-2xl text-[#1F272A] shadow-xs">
          {renderedNodes}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-baseline font-serif text-slate-900 mx-0.5">
      {renderedNodes}
    </span>
  );
};

/**
 * Parses LaTeX-style string into React elements (fractions, powers, indices, Greek letters, variables)
 */
export function parseMathToReact(input: string): React.ReactNode[] {
  let s = normalizeMathAndScientificContent(input);

  // 1. Clean \mathrm{...} and delimiters
  s = s.replace(/\\mathrm\{([^}]+)\}/g, '$1');

  // 2. Normalize arrows, dots, and LaTeX grouping brackets
  s = s
    .replace(/\\uparrow/g, '↑')
    .replace(/\\downarrow/g, '↓')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\\{/g, '{')
    .replace(/\\right\\}/g, '}')
    .replace(/\\cdot/g, ' · ')
    .replace(/\bcdot\b/g, ' · ');

  // 3. Normalize common Greek letters & operators
  const replacements: [RegExp, string][] = [
    [/\\Phi/g, 'Φ'],
    [/\\phi/g, 'ϕ'],
    [/\\Psi/g, 'Ψ'],
    [/\\psi/g, 'ψ'],
    [/\\theta/g, 'θ'],
    [/\\Theta/g, 'Θ'],
    [/\\delta/g, 'δ'],
    [/\\Delta/g, 'Δ'],
    [/\\lambda/g, 'λ'],
    [/\\Lambda/g, 'Λ'],
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\Gamma/g, 'Γ'],
    [/\\pi/g, 'π'],
    [/\\Pi/g, 'Π'],
    [/\\mu/g, 'µ'],
    [/\\sigma/g, 'σ'],
    [/\\Sigma/g, 'Σ'],
    [/\\omega/g, 'ω'],
    [/\\Omega/g, 'Ω'],
    [/\\propto/g, ' ∝ '],
    [/\\to/g, ' ⟶ '],
    [/\\longrightarrow/g, ' ⟶ '],
    [/\\leftarrow/g, ' ⟵ '],
    [/\\longleftarrow/g, ' ⟵ '],
    [/\\implies/g, ' ⟹ '],
    [/\\approx/g, ' ≈ '],
    [/\\times/g, ' × '],
    [/\\circ/g, '°'],
    [/\\le(q)?/g, ' ≤ '],
    [/\\ge(q)?/g, ' ≥ '],
    [/\\neq/g, ' ≠ '],
    [/\\pm/g, ' ± '],
    [/\\infty/g, '∞'],
    [/\\sin/g, 'sin'],
    [/\\cos/g, 'cos'],
    [/\\tan/g, 'tan'],
    [/\\arcsin/g, 'arcsin'],
    [/\\arccos/g, 'arccos'],
    [/\\arctan/g, 'arctan'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln']
  ];

  // Clean degree powers first before other replacements
  s = s
    .replace(/\^\{\\circ\}/g, '°')
    .replace(/\^\\circ/g, '°')
    .replace(/\^°/g, '°');

  for (const [pattern, rep] of replacements) {
    s = s.replace(pattern, rep);
  }

  // Normalize square roots: convert \sqrt{...} to √{...}
  s = s
    .replace(/\\sqrt\{([^}]+)\}/g, '√{$1}')
    .replace(/\\sqrt\s*([0-9a-zA-Z]+)/g, '√{$1}');

  return parseAdvancedTokens(s);
}

/**
 * Robust parser for mathematical expressions with nested balanced braces
 * (supporting \frac{num}{den}, √{inner}, ^{sup}, _{sub})
 */
function parseAdvancedTokens(str: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let keyIndex = 0;

  while (i < str.length) {
    // Check for \frac{...}{...}
    if (str.startsWith('\\frac', i)) {
      const firstOpen = str.indexOf('{', i + 5);
      if (firstOpen !== -1) {
        const numContent = extractBalancedBraces(str, firstOpen);
        if (numContent) {
          const secondOpen = str.indexOf('{', numContent.endIndex);
          if (secondOpen !== -1 && secondOpen === numContent.endIndex) {
            const denContent = extractBalancedBraces(str, secondOpen);
            if (denContent) {
              nodes.push(
                <span
                  key={`frac-${keyIndex++}`}
                  className="inline-flex flex-col items-center mx-1 align-middle text-[0.88em] leading-tight font-serif"
                >
                  <span className="px-1 border-b border-slate-700 pb-0.5 text-center font-medium">
                    {parseAdvancedTokens(numContent.inner)}
                  </span>
                  <span className="px-1 pt-0.5 text-center font-medium">
                    {parseAdvancedTokens(denContent.inner)}
                  </span>
                </span>
              );
              i = denContent.endIndex;
              continue;
            }
          }
        }
      }
    }

    // Check for √{...}
    if (str.startsWith('√{', i)) {
      const sqrtContent = extractBalancedBraces(str, i + 1);
      if (sqrtContent) {
        nodes.push(
          <span key={`sqrt-${keyIndex++}`} className="inline-flex items-center mx-0.5 font-serif">
            <span className="text-[1.15em] font-serif leading-none mr-0.5">√</span>
            <span className="border-t border-slate-800 px-0.5 text-[0.92em]">
              {parseAdvancedTokens(sqrtContent.inner)}
            </span>
          </span>
        );
        i = sqrtContent.endIndex;
        continue;
      }
    }

    // Check for ^{...} or ^x
    if (str[i] === '^') {
      if (str[i + 1] === '{') {
        const supContent = extractBalancedBraces(str, i + 1);
        if (supContent) {
          nodes.push(
            <sup key={`sup-${keyIndex++}`} className="text-[0.72em] font-bold font-sans ml-0.5 -top-1 text-slate-800">
              {parseAdvancedTokens(supContent.inner)}
            </sup>
          );
          i = supContent.endIndex;
          continue;
        }
      } else {
        const supMatch = str.slice(i + 1).match(/^([0-9a-zA-Z°+\-]+)/);
        if (supMatch) {
          nodes.push(
            <sup key={`sup-${keyIndex++}`} className="text-[0.72em] font-bold font-sans ml-0.5 -top-1 text-slate-800">
              {supMatch[1]}
            </sup>
          );
          i += 1 + supMatch[1].length;
          continue;
        }
      }
    }

    // Check for _{...} or _x
    if (str[i] === '_') {
      if (str[i + 1] === '{') {
        const subContent = extractBalancedBraces(str, i + 1);
        if (subContent) {
          nodes.push(
            <sub key={`sub-${keyIndex++}`} className="text-[0.72em] font-bold font-sans ml-0.5 bottom-0 text-slate-700">
              {parseAdvancedTokens(subContent.inner)}
            </sub>
          );
          i = subContent.endIndex;
          continue;
        }
      } else {
        const subMatch = str.slice(i + 1).match(/^([0-9a-zA-Z+]+)/);
        if (subMatch) {
          nodes.push(
            <sub key={`sub-${keyIndex++}`} className="text-[0.72em] font-bold font-sans ml-0.5 bottom-0 text-slate-700">
              {subMatch[1]}
            </sub>
          );
          i += 1 + subMatch[1].length;
          continue;
        }
      }
    }

    // Plain text segment until the next special token
    const nextSpecialIndex = findNextSpecialChar(str, i);
    const plainChunk = str.slice(i, nextSpecialIndex);
    if (plainChunk) {
      nodes.push(renderFormattedMathChunk(plainChunk, keyIndex++));
    }
    i = nextSpecialIndex;
  }

  return nodes;
}

function findNextSpecialChar(str: string, fromIndex: number): number {
  const specials = ['\\frac', '√{', '^', '_'];
  let minIndex = str.length;

  for (const s of specials) {
    const idx = str.indexOf(s, fromIndex);
    if (idx !== -1 && idx < minIndex) {
      minIndex = idx;
    }
  }

  return minIndex;
}

function extractBalancedBraces(str: string, openIndex: number): { inner: string; endIndex: number } | null {
  if (str[openIndex] !== '{') return null;
  let depth = 0;
  for (let i = openIndex; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) {
        return {
          inner: str.slice(openIndex + 1, i),
          endIndex: i + 1
        };
      }
    }
  }
  return null;
}

/**
 * Format math chunks:
 * Identifies mathematical variables (L, E, I, F, a, b, etc.) and formats them
 * in italic serif typography to match the exact mathematical representation in formula cards.
 */
function renderFormattedMathChunk(chunk: string, keyPrefix: number): React.ReactNode {
  // Split chunk into tokens using non-capturing groups for decimals to avoid duplicating decimal parts
  const tokenRegex = /([A-Za-z]+|[0-9]+(?:\.[0-9]+)?|[=+\-×·≈∝→⟶⟵⟹<>≤≥°()\/,]|[^A-Za-z0-9\s=+\-×·≈∝→⟶⟵⟹<>≤≥°()\/,]+)/g;
  const tokens = chunk.split(tokenRegex).filter(Boolean);

  if (tokens.length === 1 && tokens[0] === chunk) {
    // Single item check
    if (/^[L]$/.test(chunk)) {
      return <span key={keyPrefix} className="italic font-serif font-bold text-slate-900 mx-0.5">L</span>;
    }
    if (/^[F]$/.test(chunk)) {
      return <span key={keyPrefix} className="italic font-serif font-bold text-[#0891B2] mx-0.5">F</span>;
    }
    if (/^[I]$/.test(chunk)) {
      return <span key={keyPrefix} className="italic font-serif font-bold text-[#0891B2] mx-0.5">I</span>;
    }
    if (/^[E]$/.test(chunk)) {
      return <span key={keyPrefix} className="italic font-serif font-bold text-slate-900 mx-0.5">E</span>;
    }
    if (/^[a-zA-Z]$/.test(chunk)) {
      return <span key={keyPrefix} className="italic font-serif font-semibold text-slate-900 mx-0.5">{chunk}</span>;
    }
  }

  return (
    <span key={keyPrefix} className="inline-flex items-baseline">
      {tokens.map((token, i) => {
        // Specific mathematical variables matching formula color and font
        if (token === 'F') {
          return <span key={i} className="italic font-serif font-bold text-[#0891B2] mx-0.5">F</span>;
        }
        if (token === 'I') {
          return <span key={i} className="italic font-serif font-bold text-[#0891B2] mx-0.5">I</span>;
        }
        if (token === 'L') {
          return <span key={i} className="italic font-serif font-bold text-slate-900 mx-0.5">L</span>;
        }
        if (token === 'E') {
          return <span key={i} className="italic font-serif font-bold text-slate-900 mx-0.5">E</span>;
        }
        // Known chemical ion tokens
        if (token === 'Ca') {
          return <span key={i} className="font-sans font-bold text-[#0891B2]">Ca</span>;
        }
        if (token === 'Mg') {
          return <span key={i} className="font-sans font-bold text-[#D6A348]">Mg</span>;
        }
        if (token === 'NH') {
          return <span key={i} className="font-sans font-bold text-slate-800">NH</span>;
        }
        if (token === 'CO') {
          return <span key={i} className="font-sans font-bold text-slate-800">CO</span>;
        }
        if (token === 'CaCO') {
          return <span key={i} className="font-sans font-bold text-slate-800">CaCO</span>;
        }
        if (token === 'H₂O' || token === 'H2O') {
          return (
            <span key={i} className="font-sans font-bold text-slate-900">
              H<sub className="font-sans text-[11px] font-bold">2</sub>O
            </span>
          );
        }
        if (token === 'O₂' || token === 'O2') {
          return (
            <span key={i} className="font-sans font-bold text-slate-900">
              O<sub className="font-sans text-[11px] font-bold">2</sub>
            </span>
          );
        }
        if (token === 'Φ' || token === 'ϕ') {
          return <span key={i} className="italic font-serif font-bold text-[#D6A348] mx-0.5">{token}</span>;
        }
        if (token === 'θ' || token === 'Θ') {
          return <span key={i} className="italic font-serif font-bold text-[#0891B2] mx-0.5">{token}</span>;
        }
        if (token === 'θ₂') {
          return (
            <span key={i} className="inline-flex items-baseline mx-0.5">
              <span className="italic font-serif font-bold text-[#D67546]">θ</span>
              <sub className="font-sans text-[10px] font-bold text-[#D67546] ml-0.5">2</sub>
            </span>
          );
        }
        if (token === 'θ₁') {
          return (
            <span key={i} className="inline-flex items-baseline mx-0.5">
              <span className="italic font-serif font-bold text-[#0891B2]">θ</span>
              <sub className="font-sans text-[10px] font-bold text-[#0891B2] ml-0.5">1</sub>
            </span>
          );
        }
        if (token === 'n₁') {
          return (
            <span key={i} className="inline-flex items-baseline mx-0.5">
              <span className="italic font-serif font-bold text-[#0891B2]">n</span>
              <sub className="font-sans text-[10px] font-bold text-[#0891B2] ml-0.5">1</sub>
            </span>
          );
        }
        if (token === 'n₂') {
          return (
            <span key={i} className="inline-flex items-baseline mx-0.5">
              <span className="italic font-serif font-bold text-[#D67546]">n</span>
              <sub className="font-sans text-[10px] font-bold text-[#D67546] ml-0.5">2</sub>
            </span>
          );
        }
        if (token === 'δ' || token === 'Δ') {
          return <span key={i} className="italic font-serif font-bold text-[#D67546] mx-0.5">{token}</span>;
        }
        if (token === 'ψ' || token === 'Ψ') {
          return <span key={i} className="italic font-serif font-bold text-[#D6A348] mx-0.5">{token}</span>;
        }
        // Single letter variables (a, b, x, y, n, v, c, etc.)
        if (/^[a-zA-Z]$/.test(token)) {
          return <span key={i} className="italic font-serif font-semibold text-slate-900 mx-0.5">{token}</span>;
        }
        // Math functions (sin, cos, tan, log, arcsin)
        if (/^(sin|cos|tan|arcsin|arccos|arctan|log|ln)$/.test(token)) {
          return <span key={i} className="font-sans font-medium text-slate-800 mr-0.5">{token}</span>;
        }
        // Operators with clean spacing
        if (/^[=+\-×·≈∝⟶→>≤≥<]$/.test(token)) {
          return <span key={i} className="font-sans font-semibold text-slate-700 mx-1">{token}</span>;
        }
        if (token === '⟹') {
          return <span key={i} className="font-sans font-bold text-[#D6A348] mx-2">⟹</span>;
        }
        // Digits
        if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
          return <span key={i} className="font-sans font-medium text-slate-900">{token}</span>;
        }
        // Default text/punctuation
        return <span key={i}>{token}</span>;
      })}
    </span>
  );
}
