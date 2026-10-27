import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Sliders, CheckCircle2 } from 'lucide-react';
import { InteractiveSimulationConfig } from '../types';
import { CreativeBadge } from './CreativeBadge';

interface LessonSimulationProps {
  config: InteractiveSimulationConfig;
}

export const LessonSimulation: React.FC<LessonSimulationProps> = ({ config }) => {
  const [param1, setParam1] = useState<number>(config.param1Default);
  const [param2, setParam2] = useState<number>(config.param2Default ?? 50);
  const [toggleState, setToggleState] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync state if config defaults change
  useEffect(() => {
    setParam1(config.param1Default);
    if (config.param2Default !== undefined) {
      setParam2(config.param2Default);
    }
  }, [config]);

  // Render canvas based on simulation type
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (config.type === 'optics') {
      // Snell's Law optics simulation
      const boundaryY = height * 0.48;
      const originX = width * 0.5;
      const theta1Rad = (param1 * Math.PI) / 180;
      const n2 = param2 > 0 ? param2 / 30 : 1.5; // Scale to ~1.3 - 2.4
      const sinTheta2 = Math.sin(theta1Rad) / n2;
      const theta2Rad = Math.asin(Math.min(1, Math.max(-1, sinTheta2)));

      // Mediums background
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, boundaryY);
      ctx.fillStyle = '#EEF2F6';
      ctx.fillRect(0, boundaryY, width, height - boundaryY);

      // Boundary line & normal
      ctx.strokeStyle = '#D6A348';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, boundaryY);
      ctx.lineTo(width, boundaryY);
      ctx.stroke();

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#94A3B8';
      ctx.beginPath();
      ctx.moveTo(originX, 15);
      ctx.lineTo(originX, height - 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // Incident ray
      const len = 140;
      const incX = originX - len * Math.sin(theta1Rad);
      const incY = boundaryY - len * Math.cos(theta1Rad);
      ctx.strokeStyle = '#D67546';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(incX, incY);
      ctx.lineTo(originX, boundaryY);
      ctx.stroke();

      // Refracted rays
      if (toggleState) {
        // Dispersed
        const colors = ['#FF4D4D', '#D6A348', '#47C3D3', '#8B5CF6'];
        colors.forEach((col, idx) => {
          const delta = (idx - 1.5) * 0.03;
          const localSin = Math.sin(theta1Rad) / (n2 + delta);
          const rad = Math.asin(Math.min(1, Math.max(-1, localSin)));
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(originX, boundaryY);
          ctx.lineTo(originX + len * Math.sin(rad), boundaryY + len * Math.cos(rad));
          ctx.stroke();
        });
      } else {
        ctx.strokeStyle = '#47C3D3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(originX, boundaryY);
        ctx.lineTo(originX + len * Math.sin(theta2Rad), boundaryY + len * Math.cos(theta2Rad));
        ctx.stroke();
      }
    } else if (config.type === 'soil_agriculture') {
      // Soil pH and nutrient availability curve
      // param1 = pH (e.g. 4.0 to 9.0)
      ctx.fillStyle = '#FAF7F2';
      ctx.fillRect(0, 0, width, height);

      // Draw soil layers
      ctx.fillStyle = '#6E5D4F';
      ctx.fillRect(0, height - 40, width, 40);

      // Draw pH axis bar
      const barY = 50;
      const grad = ctx.createLinearGradient(30, 0, width - 30, 0);
      grad.addColorStop(0, '#E11D48'); // Acidic red
      grad.addColorStop(0.35, '#F59E0B'); // Mild acid
      grad.addColorStop(0.5, '#10B981'); // Neutral 6.5-7.0 optimum green
      grad.addColorStop(0.7, '#06B6D4'); // Mild alkaline
      grad.addColorStop(1, '#6366F1'); // Strong alkaline
      ctx.fillStyle = grad;
      ctx.roundRect(30, barY, width - 60, 24, 12);
      ctx.fill();

      // Marker for current pH
      const phMin = config.param1Min;
      const phMax = config.param1Max;
      const phPos = 30 + ((param1 - phMin) / (phMax - phMin)) * (width - 60);
      ctx.fillStyle = '#1F272A';
      ctx.beginPath();
      ctx.arc(phPos, barY + 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw nutrient availability bars
      const nutrients = [
        { name: 'Nitrogen (N)', optMin: 6.0, optMax: 7.5, color: '#10B981' },
        { name: 'Phosphorus (P)', optMin: 6.5, optMax: 7.2, color: '#D6A348' },
        { name: 'Potassium (K)', optMin: 6.0, optMax: 8.5, color: '#47C3D3' }
      ];

      nutrients.forEach((nut, i) => {
        const y = 110 + i * 40;
        ctx.fillStyle = '#485358';
        ctx.font = '12px sans-serif';
        ctx.fillText(nut.name, 35, y);

        // Calculate availability fraction
        const dist = Math.abs(param1 - (nut.optMin + nut.optMax) / 2);
        const avail = Math.max(0.15, Math.min(1, 1 - dist * 0.35));

        ctx.fillStyle = '#E2E8F0';
        ctx.roundRect(145, y - 12, width - 180, 14, 7);
        ctx.fill();

        ctx.fillStyle = nut.color;
        ctx.roundRect(145, y - 12, (width - 180) * avail, 14, 7);
        ctx.fill();
      });
    } else if (config.type === 'beam_engineering') {
      // Structural Beam deflection under load
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // Support points
      const leftSupportX = 50;
      const rightSupportX = width - 50;
      const beamY = 130;

      // Draw supports (triangles)
      ctx.fillStyle = '#485358';
      ctx.beginPath();
      ctx.moveTo(leftSupportX, beamY);
      ctx.lineTo(leftSupportX - 15, beamY + 25);
      ctx.lineTo(leftSupportX + 15, beamY + 25);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(rightSupportX, beamY);
      ctx.lineTo(rightSupportX - 15, beamY + 25);
      ctx.lineTo(rightSupportX + 15, beamY + 25);
      ctx.closePath();
      ctx.fill();

      // Calculate deflection (scaled)
      // param1: Load (kN), param2: Span (m)
      const maxDeflection = Math.min(75, (param1 * Math.pow(param2 / 5, 2)) * 0.35);

      // Deflected beam curve
      ctx.strokeStyle = '#D67546';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(leftSupportX, beamY);
      ctx.quadraticCurveTo(
        (leftSupportX + rightSupportX) / 2,
        beamY + maxDeflection * 1.8,
        rightSupportX,
        beamY
      );
      ctx.stroke();

      // Load arrow at center
      const midX = (leftSupportX + rightSupportX) / 2;
      const arrowTopY = 40;
      const arrowBottomY = beamY + maxDeflection * 0.8;

      ctx.strokeStyle = '#0891B2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(midX, arrowTopY);
      ctx.lineTo(midX, arrowBottomY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#0891B2';
      ctx.beginPath();
      ctx.moveTo(midX, arrowBottomY);
      ctx.lineTo(midX - 7, arrowBottomY - 12);
      ctx.lineTo(midX + 7, arrowBottomY - 12);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Load: ${param1} kN`, midX + 12, 60);
      ctx.fillText(`Max Deflection: ${(maxDeflection * 0.8).toFixed(1)} mm`, midX + 12, arrowBottomY + 20);
    } else if (config.type === 'photosynthesis') {
      // Photosynthetic saturation rate curve
      ctx.fillStyle = '#FAFDF8';
      ctx.fillRect(0, 0, width, height);

      // Axes
      const ox = 55;
      const oy = height - 40;
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, 20);
      ctx.lineTo(ox, oy);
      ctx.lineTo(width - 25, oy);
      ctx.stroke();

      // Curve
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let x = 0; x <= width - ox - 35; x += 5) {
        // Michaelis-Menten / saturation curve: V = (Vmax * x) / (Km + x)
        const intensity = (x / (width - ox - 35)) * config.param1Max;
        const rate = (100 * intensity) / (250 + intensity);
        const y = oy - (rate / 100) * (oy - 45);
        if (x === 0) ctx.moveTo(ox + x, y);
        else ctx.lineTo(ox + x, y);
      }
      ctx.stroke();

      // Current point on curve
      const currRate = (100 * param1) / (250 + param1);
      const px = ox + (param1 / config.param1Max) * (width - ox - 35);
      const py = oy - (currRate / 100) * (oy - 45);

      ctx.fillStyle = '#D67546';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#1F272A';
      ctx.fillText(`Rate: ${currRate.toFixed(1)}% of Vmax`, px - 35, py - 12);
    } else if (config.type === 'geometry') {
      // Spiral phyllotaxis / golden ratio geometry
      ctx.fillStyle = '#1F272A';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const count = Math.min(180, param2 || 120);
      const goldenAngle = (param1 * Math.PI) / 180; // Typically 137.5 deg

      for (let n = 0; n < count; n++) {
        const r = 6 * Math.sqrt(n);
        const theta = n * goldenAngle;
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);

        const colors = ['#47C3D3', '#D6A348', '#D67546'];
        ctx.fillStyle = colors[n % colors.length];
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (config.type === 'kinetics_chemistry') {
      // Chemical Kinetics: Maxwell-Boltzmann distribution and Activation Energy (Ea)
      // param1 = Temperature T (260 - 500 K)
      // param2 = Activation Energy Ea (20 - 80 kJ/mol)
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      const ox = 45;
      const oy = height - 40;
      const plotW = width - ox - 35;
      const plotH = oy - 45;

      // Coordinate axes
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, 25);
      ctx.lineTo(ox, oy);
      ctx.lineTo(width - 20, oy);
      ctx.stroke();

      // Axis labels
      ctx.font = '10px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Fraction of Collisions', ox - 5, 20);
      ctx.fillText('Molecular Kinetic Energy (E)', width - 170, oy + 25);

      // Temperature parameter normalization (T in K, typical ~300)
      const T = param1 || 310;
      const Ea = param2 || 45; // in kJ/mol, scale to plot width

      // Maxwell Boltzmann distribution: f(E) ~ sqrt(E) * exp(-E / (kT))
      const kT = (T / 300) * 22; // temperature scaling factor

      // Calculate curve points
      const points: { x: number; y: number; energy: number }[] = [];
      const maxEnergy = 100;
      for (let e = 0; e <= maxEnergy; e += 1) {
        const energyNorm = e;
        const prob = Math.sqrt(energyNorm) * Math.exp(-energyNorm / kT);
        const px = ox + (energyNorm / maxEnergy) * plotW;
        const py = oy - (prob / 2.8) * plotH;
        points.push({ x: px, y: Math.max(35, py), energy: energyNorm });
      }

      // Fill area under curve for E >= Ea (reactive molecules)
      const eaPx = ox + (Ea / maxEnergy) * plotW;
      ctx.fillStyle = 'rgba(214, 163, 72, 0.35)';
      ctx.beginPath();
      let started = false;
      for (const pt of points) {
        if (pt.x >= eaPx) {
          if (!started) {
            ctx.moveTo(pt.x, oy);
            ctx.lineTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      if (started) {
        ctx.lineTo(ox + plotW, oy);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Main Curve
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Draw Activation Energy Ea threshold line
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(eaPx, 35);
      ctx.lineTo(eaPx, oy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label Ea
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`Activation Barrier (Ea = ${Ea} kJ)`, eaPx - 30, 30);

      // Shaded area label
      const reactiveFraction = Math.max(0.1, Math.exp(-Ea / ((8.314 * T) / 1000) / 4) * 100);
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Reactive: ~${reactiveFraction.toFixed(1)}% (E ≥ Ea)`, eaPx + 8, oy - 20);

      // Temperature indicator
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Temp: ${T} K`, ox + 15, 50);
    } else if (config.type === 'calculus_math') {
      // Differential Calculus: Secant line converging to Tangent line as h -> 0
      // param1 = x coordinate (-2.5 to 2.5)
      // param2 = h step interval (0.05 to 3.0)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height - 55;
      const scaleX = 55;
      const scaleY = 32;

      // Coordinate grid
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let x = -4; x <= 4; x++) {
        const gx = cx + x * scaleX;
        ctx.beginPath();
        ctx.moveTo(gx, 20);
        ctx.lineTo(gx, height - 20);
        ctx.stroke();
      }
      for (let y = 0; y <= 6; y++) {
        const gy = cy - y * scaleY;
        ctx.beginPath();
        ctx.moveTo(25, gy);
        ctx.lineTo(width - 25, gy);
        ctx.stroke();
      }

      // X and Y axes
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(20, cy);
      ctx.lineTo(width - 20, cy);
      ctx.moveTo(cx, 15);
      ctx.lineTo(cx, height - 15);
      ctx.stroke();

      // Parabola function: f(x) = 0.45 * x^2
      const f = (xVal: number) => 0.45 * xVal * xVal;
      const df = (xVal: number) => 0.9 * xVal; // exact derivative

      ctx.strokeStyle = '#0891B2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = -3.5; px <= 3.5; px += 0.1) {
        const screenX = cx + px * scaleX;
        const screenY = cy - f(px) * scaleY;
        if (px === -3.5) ctx.moveTo(screenX, screenY);
        else ctx.lineTo(screenX, screenY);
      }
      ctx.stroke();

      // Base point P(x, f(x))
      const x0 = param1;
      const y0 = f(x0);
      const px0 = cx + x0 * scaleX;
      const py0 = cy - y0 * scaleY;

      // Sample point Q(x + h, f(x + h))
      const h = Math.max(0.05, param2);
      const x1 = x0 + h;
      const y1 = f(x1);
      const px1 = cx + x1 * scaleX;
      const py1 = cy - y1 * scaleY;

      // Draw True Tangent Line in Cyan/Orange
      const tangentSlope = df(x0);
      const tanLen = 3.0;
      ctx.strokeStyle = '#D67546';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + (x0 - tanLen) * scaleX, cy - (y0 - tangentSlope * tanLen) * scaleY);
      ctx.lineTo(cx + (x0 + tanLen) * scaleX, cy - (y0 + tangentSlope * tanLen) * scaleY);
      ctx.stroke();

      // Draw Secant Line through P and Q (dashed gold)
      const secantSlope = (y1 - y0) / h;
      const secLen = 3.2;
      ctx.strokeStyle = '#D6A348';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + (x0 - secLen * 0.8) * scaleX, cy - (y0 - secantSlope * secLen * 0.8) * scaleY);
      ctx.lineTo(cx + (x1 + secLen * 0.8) * scaleX, cy - (y1 + secantSlope * secLen * 0.8) * scaleY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point P
      ctx.fillStyle = '#0891B2';
      ctx.beginPath();
      ctx.arc(px0, py0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1F272A';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('P(x, f(x))', px0 - 15, py0 - 12);

      // Point Q
      ctx.fillStyle = '#D6A348';
      ctx.beginPath();
      ctx.arc(px1, py1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('Q(x+h, f(x+h))', px1 - 20, py1 - 12);

      // Numerical slope comparison banner
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(15, 15, 240, 48);
      ctx.strokeStyle = '#CBD5E1';
      ctx.strokeRect(15, 15, 240, 48);
      ctx.fillStyle = '#1F272A';
      ctx.font = '11px sans-serif';
      ctx.fillText(`Secant Slope: Δy/Δx = ${secantSlope.toFixed(3)}`, 22, 32);
      ctx.fillStyle = '#D67546';
      ctx.fillText(`Tangent Derivative f'(x) = ${tangentSlope.toFixed(3)}`, 22, 48);
      ctx.fillStyle = '#0891B2';
      ctx.fillText(`h = ${h.toFixed(2)}`, 200, 32);
    }
  }, [config, param1, param2, toggleState]);

  const handleReset = () => {
    setParam1(config.param1Default);
    if (config.param2Default !== undefined) setParam2(config.param2Default);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden p-6 md:p-8 my-8">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CreativeBadge label="EUSATIS AHA: UNDERSTANDING IN ACTION" theme="cyan" size="md" />
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D6A348]/20 text-[#B47818] font-mono">
              INTERACTIVE PHENOMENON
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
            {config.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-700 mt-1 max-w-xl font-normal">
            {config.description}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Two-Zone Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-6">
        {/* Visual Stage */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3 flex flex-col items-center">
          <div className="w-full max-w-[460px] aspect-[16/10] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={460}
              height={290}
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* Control Deck */}
        <div className="lg:col-span-5 space-y-4">
          {/* Slider 1 */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span>{config.param1Label}</span>
              <span className="font-mono tabular-nums text-xs font-bold text-[#0891B2] bg-[#47C3D3]/15 px-2 py-0.5 rounded">
                {param1} {config.param1Unit}
              </span>
            </div>
            <input
              type="range"
              min={config.param1Min}
              max={config.param1Max}
              step={(config.param1Max - config.param1Min) / 100}
              value={param1}
              onChange={(e) => setParam1(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0891B2]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>{config.param1Min} {config.param1Unit}</span>
              <span>{config.param1Max} {config.param1Unit}</span>
            </div>
          </div>

          {/* Slider 2 (if configured) */}
          {config.param2Label && config.param2Min !== undefined && config.param2Max !== undefined && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                <span>{config.param2Label}</span>
                <span className="font-mono tabular-nums text-xs font-bold text-[#D6A348] bg-[#D6A348]/15 px-2 py-0.5 rounded">
                  {param2} {config.param2Unit || ''}
                </span>
              </div>
              <input
                type="range"
                min={config.param2Min}
                max={config.param2Max}
                step={(config.param2Max - config.param2Min) / 100}
                value={param2}
                onChange={(e) => setParam2(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D6A348]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>{config.param2Min} {config.param2Unit || ''}</span>
                <span>{config.param2Max} {config.param2Unit || ''}</span>
              </div>
            </div>
          )}

          {/* Optional Mode Toggle */}
          {config.type === 'optics' && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="font-medium text-slate-700">Chromatic Dispersion</span>
              <button
                type="button"
                onClick={() => setToggleState(!toggleState)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  toggleState ? 'bg-[#47C3D3]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                    toggleState ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Pedagogical Principle Callout */}
          <div className="bg-[#FAF7F5] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-[#D67546] block mb-1">
              Core Insight:
            </span>
            {config.principleNote}
          </div>
        </div>
      </div>
    </div>
  );
};
