import React from 'react';
import { EusatisLogo } from '../components/EusatisLogo';
import { BookOpen, Mic, Heart } from 'lucide-react';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicImage } from '../components/DynamicImage';
import { DynamicIcon } from '../components/DynamicIcon';

interface AboutPageProps {
  onNavigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. Header with Creative Badge */}
      <div className="max-w-3xl space-y-4">
        <CreativeBadge label="OUR BRAND'S PURPOSE" theme="cyan" size="md" />
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight leading-tight">
          Understanding Has the Power to Transform People.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-normal">
          Eusatis is a purpose-driven education and human-development platform built around one powerful idea: when confusion gives way to understanding, curiosity becomes insight, and insight gives people the confidence to move forward.
        </p>
      </div>

      {/* 2. Official Vision and Mission from Brand Manual Page 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision */}
        <div className="bg-[#485358] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <CreativeBadge label="OUR VISION" theme="cyan" size="md" />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] tracking-tight leading-snug">
              To become a global platform that inspires people to understand more, become more, and create meaningful impact.
            </h2>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-600/80 text-sm text-slate-200 font-medium">
            Inspiring curiosity across generations, communities, and borders.
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <CreativeBadge label="OUR MISSION" theme="terracotta" size="md" />
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight leading-snug">
              To make complex ideas easier to understand, create spaces for meaningful self-discovery and conversation, and transform knowledge into opportunities that positively impact people and communities.
            </h2>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-600 font-medium">
            Rooted in educational clarity, personal authenticity, and community stewardship.
          </div>
        </div>
      </div>

      {/* 3. The Core Metaphor of Our Logo (From Brand Manual Page 5) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 bg-[#FAF7F5] rounded-3xl border border-slate-200">
            <EusatisLogo variant="monogram" size="xl" />
            <div className="text-center mt-6">
              <span className="text-base font-extrabold font-['Outfit'] text-[#1F272A] block">
                The Dual Reality
              </span>
              <span className="text-sm text-slate-600 mt-1 block">
                From confusion to effortless clarity
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <CreativeBadge label="VISUAL PHILOSOPHY" theme="gold" size="md" />
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
              The Story Behind Our Logo
            </h3>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              Every learning journey holds a dual reality: the heavy, dense weight of an unsolved problem, and the clean, open space of absolute clarity.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Our logomark captures this transition within a warm, inviting oval frame designed to make the brand feel deeply human and approachable. The mark centers on a bold letter E, but its upper section is heavily filled and solid—symbolizing the dense clutter of confusion, chaos, and academic struggle that students initially face.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              In contrast, the lower section is open and defined by clear negative space, representing the moment clarity breaks through. It is a visual metaphor for a simple philosophy: <strong className="text-slate-900 font-bold">when the heavy weight of complexity is lifted, what remains is the effortless, open space of true understanding.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Visual Philosophy Showcase (Admin Editable Plane Picture) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md relative aspect-[21/9] sm:aspect-[24/9] bg-slate-900 group">
        <DynamicImage
          id="plane_about"
          fallbackSrc="/assets/images/eusatis_stem_learning_1792624719640.jpg"
          alt="Eusatis mission and educational clarity"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent flex items-center p-6 sm:p-12">
          <div className="max-w-xl text-white space-y-2">
            <span className="text-xs font-black tracking-[0.26em] text-[#47C3D3] uppercase font-['Outfit'] block">
              THE JOURNEY OF UNDERSTANDING
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold font-['Outfit'] leading-tight">
              Where complexity turns into effortless understanding.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 hidden sm:block">
              Dedicated to lifting the heavy barriers to scientific knowledge and self-becoming.
            </p>
          </div>
        </div>
      </div>

      {/* 4. The Three Arms of Eusatis (From Brand Manual Page 4) */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <CreativeBadge label="CONNECTED ECOSYSTEM" theme="cyan" size="md" />
          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight mt-2">
            The Three Eusatis Arms
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A cohesive journey from intellectual understanding to authentic selfhood and community impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Mind */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#47C3D3]/15 text-[#0891B2] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-cyan-500/15">
                <DynamicIcon id="arm_mind" className="w-6 h-6 text-[#0891B2]" fallback={<BookOpen className="w-6 h-6" />} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                Eusatis Mind
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The educational heart of Eusatis. Focusing on Agriculture, Engineering, Interdisciplinary Studies, Physics, Biology, and Mathematics, making difficult ideas intuitive, engaging, and understandable through interactive simulations.
              </p>
            </div>
            <button
              onClick={() => onNavigate('mind')}
              className="text-sm font-bold text-[#0891B2] hover:underline pt-4 text-left cursor-pointer font-['Outfit']"
            >
              Explore Educational Library →
            </button>
          </div>

          {/* Talks */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D6A348]/15 text-[#B47818] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-amber-500/15">
                <DynamicIcon id="arm_talks" className="w-6 h-6 text-[#B47818]" fallback={<Mic className="w-6 h-6" />} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                Eusatis Talks
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Beyoutiful Talks is our signature conversational platform. Rooted in authenticity, it encourages people to remove masks, resist pressure to conform, and discover the quiet power of being genuinely themselves.
              </p>
            </div>
            <button
              onClick={() => onNavigate('talks')}
              className="text-sm font-bold text-[#B47818] hover:underline pt-4 text-left cursor-pointer font-['Outfit']"
            >
              Listen to Beyoutiful Talks →
            </button>
          </div>

          {/* Impact */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D67546]/15 text-[#D67546] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-orange-500/15">
                <DynamicIcon id="arm_impact" className="w-6 h-6 text-[#D67546]" fallback={<Heart className="w-6 h-6" />} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                Eusatis Impact
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Knowledge turned outward into action. We partner with underserved schools, healthcare institutions, and local communities to ensure understanding translates into improved lives and tangible opportunities.
              </p>
            </div>
            <button
              onClick={() => onNavigate('impact')}
              className="text-sm font-bold text-[#D67546] hover:underline pt-4 text-left cursor-pointer font-['Outfit']"
            >
              Discover Community Projects →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
