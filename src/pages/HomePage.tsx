import React from 'react';
import { ArrowRight, BookOpen, Mic, Heart, Lightbulb, Compass, Users } from 'lucide-react';
import { EusatisLogo } from '../components/EusatisLogo';
import { BrandPattern } from '../components/BrandPattern';
import { AhaExperience } from '../components/AhaExperience';
import { AudioPlayer } from '../components/AudioPlayer';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicIcon } from '../components/DynamicIcon';
import { DynamicImage } from '../components/DynamicImage';
import { LearningResource, PodcastEpisode, ImpactStory } from '../types';

interface HomePageProps {
  onNavigate: (route: string, slug?: string) => void;
  resources: LearningResource[];
  episodes: PodcastEpisode[];
  stories: ImpactStory[];
  onOpenVolunteer: (initiative?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  resources,
  episodes,
  stories,
  onOpenVolunteer
}) => {
  const featuredEpisode = episodes[0];
  const featuredResources = resources.slice(0, 3);
  const featuredStory = stories[0];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-24 bg-linear-to-b from-white via-white to-slate-50/50">
        <BrandPattern opacity={0.06} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7">
              {/* Interactive EUSATIS Brand Logo: Official Monogram from Brand Manual Centered Exactly Where Oriented */}
              <div className="w-full flex justify-center">
                <div
                  className="inline-flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-white/95 border-2 border-amber-200/80 shadow-md hover:border-[#47C3D3] hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  title="Eusatis Official Monogram – Tap or hover to experience the AHA moment"
                >
                  <EusatisLogo variant="monogram" size="xl" interactive={true} />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight leading-[1.08] text-balance">
                The Joy of Understanding More.
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-700 max-w-xl leading-relaxed font-normal">
                Eusatis is a purpose-driven education and human-development platform. We exist to make complex ideas intuitive to understand, create space for genuine self-discovery, and turn knowledge into meaningful community action.
              </p>

              {/* Three Principal Pathways: Floating with Enticing Hover & Scalable Icons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('mind')}
                  className="animate-hero-float-1 group relative inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm text-[#1F272A] bg-[#47C3D3] hover:bg-[#3db6c6] hover:-translate-y-2 hover:scale-[1.03] active:translate-y-0 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#47C3D3]/40 cursor-pointer font-['Outfit'] tracking-wide ring-2 ring-[#47C3D3]/30 hover:ring-[#47C3D3]"
                  title="Explore Eusatis Mind educational resources and simulations"
                >
                  <span className="w-6 h-6 rounded-lg bg-white/30 flex items-center justify-center shrink-0 aspect-square overflow-hidden group-hover:rotate-6 transition-transform shadow-2xs">
                    <DynamicIcon id="hero_mind" className="w-4 h-4 text-[#1F272A]" fallback={<BookOpen className="w-4 h-4 text-[#1F272A]" />} />
                  </span>
                  <span>Explore Eusatis Mind</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onNavigate('talks')}
                  className="animate-hero-float-2 group relative inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm text-[#1F272A] bg-[#D6A348]/25 hover:bg-[#D6A348]/40 border-2 border-[#D6A348]/60 hover:border-[#D6A348] hover:-translate-y-2 hover:scale-[1.03] active:translate-y-0 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D6A348]/35 cursor-pointer font-['Outfit'] tracking-wide"
                  title="Tune in to Beyoutiful Talks conversations"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#D6A348]/30 flex items-center justify-center shrink-0 aspect-square overflow-hidden group-hover:scale-110 transition-transform shadow-2xs">
                    <DynamicIcon id="hero_talks" className="w-4 h-4 text-[#B47818]" fallback={<Mic className="w-4 h-4 text-[#B47818]" />} />
                  </span>
                  <span>Beyoutiful Talks</span>
                  <ArrowRight className="w-4 h-4 text-[#B47818] transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onNavigate('impact')}
                  className="animate-hero-float-3 group relative inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm text-[#1F272A] bg-[#D67546]/20 hover:bg-[#D67546]/35 border-2 border-[#D67546]/50 hover:border-[#D67546] hover:-translate-y-2 hover:scale-[1.03] active:translate-y-0 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#D67546]/35 cursor-pointer font-['Outfit'] tracking-wide"
                  title="Discover and join Eusatis Impact community initiatives"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#D67546]/30 flex items-center justify-center shrink-0 aspect-square overflow-hidden group-hover:scale-110 transition-transform shadow-2xs">
                    <DynamicIcon id="hero_impact" className="w-4 h-4 text-[#D67546]" fallback={<Heart className="w-4 h-4 text-[#D67546]" />} />
                  </span>
                  <span>Eusatis Impact</span>
                  <ArrowRight className="w-4 h-4 text-[#D67546] transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Core Philosophy Markers with Bold Uppercase & Larger Text */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/90 max-w-lg">
                <div>
                  <span className="block text-xs sm:text-sm font-black text-[#0891B2] uppercase tracking-[0.24em] font-['Outfit']">
                    UNDERSTAND
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                    Clarity across Sciences, Agriculture, and Engineering
                  </p>
                </div>
                <div>
                  <span className="block text-xs sm:text-sm font-black text-[#B47818] uppercase tracking-[0.24em] font-['Outfit']">
                    BECOME
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                    Authentic selfhood and personal courage
                  </p>
                </div>
                <div>
                  <span className="block text-xs sm:text-sm font-black text-[#D67546] uppercase tracking-[0.24em] font-['Outfit']">
                    IMPACT
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                    Knowledge serving schools and communities
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[4/3] bg-slate-100">
                <DynamicImage
                  id="hero_card"
                  fallbackSrc="/assets/images/eusatis_stem_learning_1792624719640.jpg"
                  alt="Students engaged in learning experiments at Eusatis"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="text-xs font-black tracking-[0.26em] uppercase text-[#47C3D3] font-['Outfit'] block">
                      THE EDUCATIONAL HEART
                    </span>
                    <p className="text-base font-bold font-['Outfit']">
                      Where confusion gives way to understanding.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Brand Arch accent badge */}
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                <EusatisLogo variant="monogram" size="sm" />
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block font-['Outfit']">
                    The Dual Reality
                  </span>
                  <span className="text-xs text-slate-600">
                    Complexity lifted, clarity unveiled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EUSATIS EXPERIENCE: BRAND PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#485358] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-sm">
          <BrandPattern opacity={0.1} />

          <div className="max-w-3xl relative space-y-4">
            <CreativeBadge label="THE EUSATIS EXPERIENCE" theme="cyan" size="md" />
            
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Outfit'] tracking-tight leading-snug">
              Understanding Has the Power to Transform People.
            </h2>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              At our heart is the belief that there is a unique joy in the moment something becomes clear. When confusion gives way to understanding, when curiosity becomes insight, and when insight gives people the confidence to move forward.
            </p>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-1 font-normal">
              We begin with education, but its ambition extends far beyond the classroom. It creates a connected ecosystem where people can learn, think, discover, become, and contribute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-slate-600/80 relative">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#47C3D3]/20 text-[#47C3D3] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-white/10">
                <DynamicIcon id="pillar_mind" className="w-6 h-6 text-[#47C3D3]" fallback={<Lightbulb className="w-6 h-6" />} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">Eusatis Mind</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                The educational heart. Focusing on Agriculture, Engineering, Interdisciplinary Studies, Physics, Biology, and Mathematics to make difficult ideas accessible and engaging through interactive simulations.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D6A348]/20 text-[#D6A348] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-white/10">
                <DynamicIcon id="pillar_talks" className="w-6 h-6 text-[#D6A348]" fallback={<Compass className="w-6 h-6" />} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">Beyoutiful Talks</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Rooted in authenticity. Beyoutiful Talks encourages people to remove masks, resist social conformity, and discover the quiet power of being genuinely themselves.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D67546]/20 text-[#D67546] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs ring-1 ring-inset ring-white/10">
                <DynamicIcon id="pillar_impact" className="w-6 h-6 text-[#D67546]" fallback={<Users className="w-6 h-6" />} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">Eusatis Impact</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Understanding should create responsibility. Knowledge should not end with the person who receives it—it must be applied to improve lives in our communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE EUSATIS AHA: INTERACTIVE LEARNING STAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AhaExperience onNavigate={onNavigate} resources={resources} />
      </section>

      {/* 4. FEATURED LEARNING: EUSATIS MIND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <CreativeBadge label="EUSATIS MIND" theme="cyan" size="md" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight mt-2">
              Curated Educational Resources
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 font-normal">
              Explorations across Agriculture, Engineering, Interdisciplinary Studies, Physics, Biology, and Mathematics.
            </p>
          </div>
          <button
            onClick={() => onNavigate('mind')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0891B2] hover:text-[#0e7490] transition-colors cursor-pointer font-['Outfit']"
          >
            <span>View All Lessons</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredResources.map((res) => (
            <article
              key={res.id}
              onClick={() => onNavigate('mind-detail', res.slug)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#47C3D3] transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={res.featured_image}
                  alt={res.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-extrabold bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs font-['Outfit']">
                  {res.subject}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Clean unboxed metadata (NO PILLS) with larger text */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mb-2 font-medium">
                    <span>{res.category}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-800">{res.learner_level}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span>{res.reading_time_minutes} min read</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 group-hover:text-[#0891B2] transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span className="font-medium">By {res.author}</span>
                  <span className="font-bold text-[#0891B2] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-['Outfit']">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. FEATURED TALKS: BEYOUTIFUL TALKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <CreativeBadge label="BEYOUTIFUL TALKS" theme="gold" size="md" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight mt-2">
              Beyoutiful Talks Podcast
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1 font-normal">
              Conversations celebrating authenticity, personal courage, and resisting the pressure to become someone else.
            </p>
          </div>
          <button
            onClick={() => onNavigate('talks')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B47818] hover:text-[#935f11] transition-colors cursor-pointer font-['Outfit']"
          >
            <span>View All Episodes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredEpisode && (
          <AudioPlayer episode={featuredEpisode} />
        )}
      </section>

      {/* 6. FEATURED IMPACT STORY: EUSATIS IMPACT */}
      {featuredStory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <CreativeBadge label="EUSATIS IMPACT SPOTLIGHT" theme="terracotta" size="md" />
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
                  {featuredStory.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {featuredStory.summary}
                </p>

                {/* Quantitative Outcomes Strip */}
                <div className="grid grid-cols-3 gap-4 pt-4 pb-2">
                  {featuredStory.outcomes.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#D67546] tabular-nums">
                        {item.metric}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 font-['Outfit']">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap gap-3.5">
                  <button
                    onClick={() => onNavigate('impact-detail', featuredStory.slug)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer font-['Outfit']"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenVolunteer(featuredStory.title)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-2xl bg-[#D67546]/15 text-[#D67546] hover:bg-[#D67546]/25 transition-colors cursor-pointer font-['Outfit']"
                  >
                    <span>Volunteer with Us</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 shadow-sm">
                  <img
                    src={featuredStory.featured_image}
                    alt={featuredStory.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
