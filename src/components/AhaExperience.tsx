import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { CreativeBadge } from './CreativeBadge';
import { LessonSimulation } from './LessonSimulation';
import { InteractiveSimulationConfig, LearningResource } from '../types';
import { useSiteImage } from '../lib/imageManager';

interface AhaExperienceProps {
  onNavigate?: (page: string, slug?: string) => void;
  resources?: LearningResource[];
}

interface SimulationSlide {
  id: string;
  subject: string;
  theme: 'gold' | 'cyan' | 'terracotta';
  title: string;
  lessonTitle: string;
  lessonSlug: string;
  principle: string;
  accentColor: string;
  badgeLabel: string;
  simulationConfig?: InteractiveSimulationConfig;
  isSnellSpecial?: boolean;
}

export const AhaExperience: React.FC<AhaExperienceProps> = ({ onNavigate }) => {
  // Reactive site image configured in Admin Dashboard (plane_aha)
  const { url: ahaBgUrl, alt: ahaBgAlt } = useSiteImage(
    'plane_aha',
    '/assets/images/eusatis_aha_moment_1792624721004.jpg'
  );

  // Slideshow active index: 0 through 6
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Snell's Law dedicated state for Slide 0
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [incidenceAngle, setIncidenceAngle] = useState<number>(38);
  const [material, setMaterial] = useState<{ name: string; n: number }>({
    name: 'Crown Glass',
    n: 1.52
  });
  const [dispersionMode, setDispersionMode] = useState<boolean>(true);
  const [activeStep, setActiveStep] = useState<number>(2);

  // Materials list
  const materials = [
    { name: 'Water', n: 1.33 },
    { name: 'Crown Glass', n: 1.52 },
    { name: 'Dense Flint', n: 1.66 },
    { name: 'Diamond', n: 2.42 }
  ];

  // Mathematical Snell's law calculation
  const n1 = 1.0; // Air
  const n2 = material.n;
  const theta1Rad = (incidenceAngle * Math.PI) / 180;
  const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
  const theta2Rad = Math.asin(Math.min(1, Math.max(-1, sinTheta2)));
  const refractionAngleDeg = (theta2Rad * 180) / Math.PI;

  const getDispersedAngles = () => {
    const deltas = [
      { label: 'Red (700nm)', nOffset: -0.015, color: '#FF4D4D' },
      { label: 'Gold (580nm)', nOffset: 0.0, color: '#D6A348' },
      { label: 'Cyan (490nm)', nOffset: +0.015, color: '#47C3D3' },
      { label: 'Violet (400nm)', nOffset: +0.035, color: '#8B5CF6' }
    ];
    return deltas.map((d) => {
      const effectiveN = n2 + d.nOffset;
      const sinT = (n1 * Math.sin(theta1Rad)) / effectiveN;
      const deg = (Math.asin(Math.min(1, Math.max(-1, sinT))) * 180) / Math.PI;
      return { ...d, deg };
    });
  };

  // Draw Snell's Law simulation when slide 0 is active
  useEffect(() => {
    if (activeSlide !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const boundaryY = height * 0.48;
    const originX = width * 0.5;

    // Medium 1 (Air)
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, width, boundaryY);

    // Medium 2 (Refractive medium)
    ctx.fillStyle = '#EEF2F6';
    ctx.fillRect(0, boundaryY, width, height - boundaryY);

    // Boundary Line
    ctx.strokeStyle = '#D6A348';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, boundaryY);
    ctx.lineTo(width, boundaryY);
    ctx.stroke();

    // Normal line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(originX, 20);
    ctx.lineTo(originX, height - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#64748B';
    ctx.font = '11px sans-serif';
    ctx.fillText('Normal (0°)', originX + 6, 32);

    // Incident Ray
    const rayLength = 160;
    const startX = originX - rayLength * Math.sin(theta1Rad);
    const startY = boundaryY - rayLength * Math.cos(theta1Rad);

    ctx.strokeStyle = dispersionMode ? '#D67546' : '#47C3D3';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(originX, boundaryY);
    ctx.stroke();

    const midIncX = (startX + originX) / 2;
    const midIncY = (startY + boundaryY) / 2;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(midIncX, midIncY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Incident angle arc
    ctx.strokeStyle = '#D67546';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(originX, boundaryY, 35, -Math.PI / 2 - theta1Rad, -Math.PI / 2, false);
    ctx.stroke();

    ctx.fillStyle = '#D67546';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`θ₁ = ${incidenceAngle}°`, originX - 60, boundaryY - 45);

    // Refracted rays
    if (dispersionMode) {
      const dispersed = getDispersedAngles();
      dispersed.forEach((item) => {
        const rad = (item.deg * Math.PI) / 180;
        const endX = originX + rayLength * Math.sin(rad);
        const endY = boundaryY + rayLength * Math.cos(rad);

        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(originX, boundaryY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });
    } else {
      const endX = originX + rayLength * Math.sin(theta2Rad);
      const endY = boundaryY + rayLength * Math.cos(theta2Rad);

      ctx.strokeStyle = '#47C3D3';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(originX, boundaryY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.strokeStyle = '#47C3D3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(originX, boundaryY, 35, Math.PI / 2 - theta2Rad, Math.PI / 2, false);
      ctx.stroke();

      ctx.fillStyle = '#0891B2';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`θ₂ = ${refractionAngleDeg.toFixed(1)}°`, originX + 20, boundaryY + 45);
    }
  }, [activeSlide, incidenceAngle, material, dispersionMode]);

  const presetSteps = [
    {
      title: '1. Perpendicular Passing',
      desc: 'At 0° incidence, velocity changes but no angle deviation occurs.',
      angle: 0,
      material: materials[1],
      dispersion: false
    },
    {
      title: '2. The Turning Point',
      desc: 'Snell\'s Law dictates refraction as light enters denser glass.',
      angle: 35,
      material: materials[1],
      dispersion: false
    },
    {
      title: '3. The Aha! Moment',
      desc: 'White light resolves into distinct spectral frequencies of insight.',
      angle: 52,
      material: materials[1],
      dispersion: true
    },
    {
      title: '4. High Density Shift',
      desc: 'In diamond (n=2.42), extreme refraction bends light sharply.',
      angle: 60,
      material: materials[3],
      dispersion: true
    }
  ];

  const applyPreset = (index: number) => {
    const s = presetSteps[index];
    setActiveStep(index + 1);
    setIncidenceAngle(s.angle);
    setMaterial(s.material);
    setDispersionMode(s.dispersion);
  };

  // Slides representing the 7 interactive lesson simulations (No icons, visually rich discipline palettes)
  const simulationSlides: SimulationSlide[] = [
    {
      id: 'sim-optics',
      subject: 'Physics & Optics',
      theme: 'gold',
      title: "Snell's Law Refraction & Chromatic Dispersion",
      lessonTitle: 'Refraction of Light & The Snell-Descartes Law',
      lessonSlug: 'refraction-of-light-snell-descartes',
      principle: 'Wave velocity changes across media boundaries, forcing wavefronts to pivot toward the surface normal and separating light frequencies into spectrums.',
      accentColor: '#D6A348',
      badgeLabel: 'Wave Optics',
      isSnellSpecial: true
    },
    {
      id: 'sim-soil',
      subject: 'Agriculture & Agronomy',
      theme: 'cyan',
      title: 'Soil Cation Exchange Capacity & pH Liming Visualizer',
      lessonTitle: 'Soil Chemistry & Plant Nutrition: The Science of Agronomic Yield',
      lessonSlug: 'soil-chemistry-plant-nutrition-agronomy',
      principle: 'At pH 6.2–7.0, microbial activity peaks and primary nutrients (N, P, K) reach maximal bioavailability, while clay humus complexes retain vital cations (Ca²⁺, Mg²⁺, K⁺).',
      accentColor: '#10B981',
      badgeLabel: 'Soil Chemistry',
      simulationConfig: {
        enabled: true,
        type: 'soil_agriculture',
        title: 'Soil pH & Cation Exchange Visualizer',
        description: 'Adjust soil pH to see how micronutrient bioavailability and toxic aluminum levels dynamically adjust.',
        param1Label: 'Soil Solution pH',
        param1Default: 6.5,
        param1Min: 4.0,
        param1Max: 9.0,
        param1Unit: 'pH',
        principleNote: 'At pH 6.2–7.0, microbial activity peaks and primary nutrients (N, P, K) reach maximal bioavailability.'
      }
    },
    {
      id: 'sim-beam',
      subject: 'Engineering Mechanics',
      theme: 'terracotta',
      title: 'Euler-Bernoulli Elastic Beam Deflection Simulator',
      lessonTitle: 'Euler-Bernoulli Beam Deflection & Moment of Inertia',
      lessonSlug: 'euler-bernoulli-beam-deflection-inertia',
      principle: 'Deflection varies with the cube of length (L³). Doubling span increases deflection 8-fold (2³ = 8). Deep I-beams maximize moment of inertia (I) to suppress sagging.',
      accentColor: '#D67546',
      badgeLabel: 'Structural Mechanics',
      simulationConfig: {
        enabled: true,
        type: 'beam_engineering',
        title: 'Euler-Bernoulli Beam Deflection Simulator',
        description: 'Manipulate applied load force and span distance to see real-time beam flexure curve and maximum center displacement.',
        param1Label: 'Applied Point Load',
        param1Default: 45,
        param1Min: 5,
        param1Max: 100,
        param1Unit: 'kN',
        param2Label: 'Beam Span Length',
        param2Default: 6,
        param2Min: 2,
        param2Max: 14,
        param2Unit: 'm',
        principleNote: 'Deflection varies with the cube of length (L³). Increasing beam depth increases the moment of inertia (I), drastically reducing deflection.'
      }
    },
    {
      id: 'sim-phyllotaxis',
      subject: 'Interdisciplinary & Biomimicry',
      theme: 'gold',
      title: 'Spiral Phyllotaxis & Golden Angle Explorer',
      lessonTitle: 'The Golden Ratio in Natural Algorithms & Biomimetic Design',
      lessonSlug: 'golden-ratio-natural-algorithms-biomimetics',
      principle: 'At exactly 137.5° (the golden angle), successive plant primordia never fall into straight radial spokes, packing florets with mathematical maximum density.',
      accentColor: '#06B6D4',
      badgeLabel: 'Biomimicry & Algorithms',
      simulationConfig: {
        enabled: true,
        type: 'geometry',
        title: 'Spiral Phyllotaxis & Golden Angle Explorer',
        description: 'Adjust the divergence angle to witness how only the 137.5° Golden Angle eliminates radial spoke gaps and achieves optimal packing density.',
        param1Label: 'Divergence Angle',
        param1Default: 137.5,
        param1Min: 120.0,
        param1Max: 150.0,
        param1Unit: '°',
        param2Label: 'Element Count',
        param2Default: 140,
        param2Min: 40,
        param2Max: 200,
        param2Unit: 'nodes',
        principleNote: 'At exactly 137.5° (the golden angle), successive nodes never overlap, packing with maximal efficiency.'
      }
    },
    {
      id: 'sim-photosynthesis',
      subject: 'Cellular Biology',
      theme: 'cyan',
      title: 'Photosynthetic Photon Flux & Saturation Visualizer',
      lessonTitle: 'The Architecture of Photosynthesis: Solar Conversion in Plant Cells',
      lessonSlug: 'architecture-of-photosynthesis',
      principle: 'Water photolysis in photosystem II supplies electrons, creating a proton gradient across thylakoid membranes to rotary-catalyze ATP synthesis.',
      accentColor: '#14B8A6',
      badgeLabel: 'Cellular Bioenergetics',
      simulationConfig: {
        enabled: true,
        type: 'photosynthesis',
        title: 'Photosynthetic Photon Flux & Saturation Visualizer',
        description: 'Observe how photosynthetic rate increases linearly with light photon flux before reaching enzyme saturation (Vmax).',
        param1Label: 'Photon Flux Intensity',
        param1Default: 420,
        param1Min: 0,
        param1Max: 1200,
        param1Unit: 'µmol/m²/s',
        principleNote: 'Photosynthetic light response exhibits an initial light-limited linear zone followed by an enzymatic saturation plateau.'
      }
    },
    {
      id: 'sim-chemistry',
      subject: 'Physical Chemistry & Kinetics',
      theme: 'terracotta',
      title: 'Arrhenius Kinetics & Maxwell-Boltzmann Energy Visualizer',
      lessonTitle: 'Chemical Kinetics & The Arrhenius Activation Energy Barrier',
      lessonSlug: 'chemical-kinetics-arrhenius-activation-energy',
      principle: 'Only molecular collisions possessing kinetic energy exceeding Ea lead to products. Elevating temperature by 10 K exponentially expands the reactive population.',
      accentColor: '#F97316',
      badgeLabel: 'Reaction Kinetics',
      simulationConfig: {
        enabled: true,
        type: 'kinetics_chemistry',
        title: 'Arrhenius Kinetics & Maxwell-Boltzmann Energy Visualizer',
        description: 'Manipulate temperature and activation energy barrier (Ea) to see how the Maxwell-Boltzmann kinetic energy distribution shifts and controls the reactive fraction.',
        param1Label: 'System Temperature',
        param1Default: 310,
        param1Min: 260,
        param1Max: 500,
        param1Unit: 'K',
        param2Label: 'Activation Energy (Ea)',
        param2Default: 45,
        param2Min: 20,
        param2Max: 80,
        param2Unit: 'kJ/mol',
        principleNote: 'Only collisions possessing energy exceeding the activation threshold (Ea) result in chemical reaction. Raising temperature exponentially expands the reactive population.'
      }
    },
    {
      id: 'sim-calculus',
      subject: 'Differential Mathematics',
      theme: 'cyan',
      title: 'Calculus Derivative & Secant Line Limit Simulator',
      lessonTitle: 'The Limit Definition of the Derivative: Instantaneous Change in Calculus',
      lessonSlug: 'calculus-limit-definition-derivative',
      principle: 'As the sampling interval h collapses to zero, secant approximations converge into the instantaneous velocity and curvature of the curve.',
      accentColor: '#818CF8',
      badgeLabel: 'Infinitesimal Calculus',
      simulationConfig: {
        enabled: true,
        type: 'calculus_math',
        title: 'Calculus Derivative & Secant-to-Tangent Limit Simulator',
        description: 'Shrink the secant interval step h toward zero to witness how secant lines rotate and converge into the exact instantaneous tangent line.',
        param1Label: 'Curve Point (x)',
        param1Default: 1.5,
        param1Min: 0.5,
        param1Max: 3.5,
        param1Unit: '',
        param2Label: 'Secant Increment (h)',
        param2Default: 1.2,
        param2Min: 0.05,
        param2Max: 2.5,
        param2Unit: 'Δx',
        principleNote: 'As h → 0, the Newton difference quotient [f(x+h) - f(x)]/h resolves from indeterminacy into the exact instantaneous derivative f\'(x) = 2x.'
      }
    }
  ];

  const current = simulationSlides[activeSlide];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? simulationSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev === simulationSlides.length - 1 ? 0 : prev + 1));
  };

  const handleGoToLesson = (slug: string) => {
    if (onNavigate) {
      onNavigate('mind-detail', slug);
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden">
      {/* 1. Official Eusatis Aha Background Picture from Admin Media Manager (plane_aha) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={ahaBgUrl}
          alt={ahaBgAlt || 'The Eusatis Aha: Understanding in Action'}
          className="w-full h-full object-cover object-center scale-105 filter blur-[0.5px] transition-transform duration-1000 ease-out"
        />
        {/* Layered cinematic gradients: preserving the stunning light-refraction visual while guaranteeing text contrast & readability */}
        <div className="absolute inset-0 bg-linear-to-b from-[#1F272A]/90 via-[#1F272A]/82 to-[#1F272A]/95 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial-[at_top_right] from-[#47C3D3]/20 via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-radial-[at_bottom_left] from-[#D6A348]/15 via-transparent to-transparent opacity-80" />
      </div>

      {/* 2. Interactive Foreground Stage */}
      <div className="relative z-10 p-6 md:p-8 space-y-6">
        {/* Title & Stage Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/15">
          <div>
            <div className="mb-2">
              <CreativeBadge label="INTERACTIVE LEARNING STAGE" theme="gold" size="md" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold font-['Outfit'] text-white tracking-tight drop-shadow-xs">
              The Eusatis Aha: Understanding in Action
            </h3>
            <p className="text-base text-slate-200 mt-1 max-w-2xl font-normal drop-shadow-xs">
              Experience the joy when confusion transforms into clarity. Explore physical simulations embedded across our Eusatis Mind lessons and see their direct linkage in action.
            </p>
          </div>

          {/* Slideshow Controls Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-sm">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                title="Previous Simulation"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-2 text-slate-200">
                {activeSlide + 1} / {simulationSlides.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                title="Next Simulation"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {current.isSnellSpecial && (
              <button
                onClick={() => applyPreset(1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg transition-colors cursor-pointer backdrop-blur-xs shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#47C3D3]" />
                <span>Reset Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Discipline Slideshow Tabs (Clean typography-driven, no icons, visually appealing jewel-toned badges) */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-0.5 no-scrollbar border-b border-white/10">
          {simulationSlides.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`group relative px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer font-['Outfit'] select-none flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-white text-[#1F272A] shadow-xl ring-2 ring-white/95 scale-102 z-10 font-extrabold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-125' : 'opacity-70 group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: slide.accentColor,
                    boxShadow: isActive ? `0 0 10px ${slide.accentColor}` : undefined
                  }}
                />
                <span className="tracking-tight text-xs sm:text-[13px] whitespace-nowrap">
                  {slide.subject}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full pointer-events-none"
                    style={{ backgroundColor: slide.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Lesson Linkage & Context Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#0891B2] font-['Outfit']">
                LINKED EUSATIS MIND LESSON
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A348]/20 text-[#B47818] font-mono">
                {current.badgeLabel}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-900">
              {current.lessonTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {current.principle}
            </p>
          </div>

          <button
            onClick={() => handleGoToLesson(current.lessonSlug)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#1F272A] hover:bg-slate-800 text-white transition-colors cursor-pointer shrink-0 font-['Outfit'] shadow-xs"
          >
            <span>Explore Lesson in Eusatis Mind</span>
            <ArrowRight className="w-4 h-4 text-[#47C3D3]" />
          </button>
        </div>

        {/* Active Simulation Stage */}
        {current.isSnellSpecial ? (
          <div className="space-y-6">
            {/* Guided Progression Steps for Snell's law */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(idx)}
                  className={`p-3 text-left rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                    activeStep === idx + 1
                      ? 'border-[#47C3D3] bg-[#47C3D3]/25 ring-1 ring-[#47C3D3] text-white shadow-xs'
                      : 'border-white/15 hover:border-white/30 bg-white/10 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">
                      {step.title}
                    </span>
                    {activeStep === idx + 1 && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#47C3D3]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">{step.desc}</p>
                </button>
              ))}
            </div>

            {/* Two-Zone Sandbox Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Canvas Stage */}
              <div className="lg:col-span-7 flex flex-col items-center bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md">
                <div className="w-full flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 mb-2 font-mono">
                  <span>Medium 1: Air (n₁ = 1.00)</span>
                  <span>
                    Medium 2: {material.name} (n₂ = {material.n})
                  </span>
                </div>

                <div className="relative w-full max-w-[480px] aspect-[4/3] flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={360}
                    className="w-full h-full rounded-lg shadow-inner bg-slate-50"
                  />
                </div>

                <div className="w-full flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-200 mt-2 font-mono">
                  <span className="tabular-nums">
                    Incidence: {incidenceAngle}°
                  </span>
                  <span className="tabular-nums text-[#0891B2] font-semibold">
                    Refraction: {refractionAngleDeg.toFixed(1)}°
                  </span>
                  <span className="text-slate-500">
                    Velocity Ratio: {(1 / material.n).toFixed(2)}x
                  </span>
                </div>
              </div>

              {/* Right: Parameter Controls & Real-Time Insights */}
              <div className="lg:col-span-5 flex flex-col gap-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-md">
                {/* Slider 1: Angle */}
                <div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-800 mb-2">
                    <label htmlFor="angle-slider" className="font-semibold text-slate-800 font-['Outfit']">
                      Angle of Incidence (θ₁)
                    </label>
                    <span className="font-mono tabular-nums text-xs font-bold text-[#D67546] bg-[#D67546]/10 px-2 py-0.5 rounded">
                      {incidenceAngle}°
                    </span>
                  </div>
                  <input
                    id="angle-slider"
                    type="range"
                    min="0"
                    max="75"
                    value={incidenceAngle}
                    onChange={(e) => setIncidenceAngle(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D67546]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>0° (Perpendicular)</span>
                    <span>45°</span>
                    <span>75° (Grazing)</span>
                  </div>
                </div>

                {/* Material Select */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2 font-['Outfit']">
                    Refractive Material (n₂)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {materials.map((mat) => (
                      <button
                        key={mat.name}
                        onClick={() => setMaterial(mat)}
                        className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-colors cursor-pointer ${
                          material.name === mat.name
                            ? 'border-[#D6A348] bg-[#D6A348]/10 text-slate-900 font-bold shadow-2xs'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="truncate font-semibold">{mat.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          n = {mat.n}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispersion Mode Toggle */}
                <div className="pt-2 border-t border-slate-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-slate-900 font-['Outfit']">
                        Prismatic Dispersion
                      </span>
                      <p className="text-xs text-slate-500">
                        Separate wavelengths into visible spectrum
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDispersionMode(!dispersionMode)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        dispersionMode ? 'bg-[#47C3D3]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          dispersionMode ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Mathematical & Philosophical Callout */}
                <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4">
                  <div className="text-xs font-bold text-[#7E22CE] mb-1 font-['Outfit']">
                    The Eusatis Principle
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    When light enters a denser medium, it slows down and reorganizes. Similarly, learning begins when we encounter a dense, difficult concept. With patience and proper structure, that initial friction gives way to sharp, beautiful comprehension.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          current.simulationConfig && (
            <div className="space-y-4">
              <LessonSimulation config={current.simulationConfig} />
            </div>
          )
        )}

        {/* Slideshow Bottom Navigation */}
        <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors cursor-pointer font-['Outfit'] backdrop-blur-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Simulation</span>
          </button>

          <div className="flex items-center gap-2">
            {simulationSlides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeSlide === idx ? 'w-7 bg-white shadow-xs' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                title={`Jump to simulation ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-[#1F272A] bg-[#47C3D3] hover:bg-[#3db0bf] rounded-xl transition-colors cursor-pointer font-['Outfit'] shadow-md"
          >
            <span>Next Simulation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
