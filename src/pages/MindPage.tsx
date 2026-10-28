import React, { useState, useRef } from 'react';
import { Search, Clock, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, Volume2 } from 'lucide-react';
import { LearningResource } from '../types';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicImage } from '../components/DynamicImage';
import { MathText } from '../components/MathText';
import { voiceService } from '../lib/voiceAccessibility';

interface MindPageProps {
  resources: LearningResource[];
  onNavigate: (route: string, slug?: string) => void;
}

interface SubjectCardMeta {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  theme: string;
  borderClass: string;
  activeClass: string;
  inactiveClass: string;
  badgeClass: string;
  activeBadgeClass: string;
}

export const MindPage: React.FC<MindPageProps> = ({ resources, onNavigate }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'reading_time'>('newest');

  const subjectCarouselRef = useRef<HTMLDivElement>(null);

  // Curated Subject metadata without any icons, richly styled to captivate visitors
  const subjectMetadata: SubjectCardMeta[] = [
    {
      id: 'All',
      name: 'All Disciplines',
      shortName: 'All Topics',
      tagline: 'Comprehensive STEM & Applied Sciences',
      theme: 'cyan',
      borderClass: 'border-slate-200 hover:border-[#47C3D3]',
      activeClass: 'bg-[#1F272A] text-white border-[#47C3D3] ring-2 ring-[#47C3D3]/40 shadow-lg shadow-[#47C3D3]/20',
      inactiveClass: 'bg-white text-slate-800 hover:bg-slate-50',
      badgeClass: 'bg-slate-100 text-slate-700',
      activeBadgeClass: 'bg-[#47C3D3] text-[#1F272A] font-extrabold'
    },
    {
      id: 'Biology',
      name: 'Biology',
      shortName: 'Biology',
      tagline: 'Cellular Structures, Photosynthesis & Life Sciences',
      theme: 'teal',
      borderClass: 'border-teal-200 hover:border-teal-500',
      activeClass: 'bg-gradient-to-br from-teal-800 to-emerald-900 text-white border-teal-400 ring-2 ring-teal-400/40 shadow-lg shadow-teal-800/25',
      inactiveClass: 'bg-teal-50/40 text-slate-800 hover:bg-teal-50/80',
      badgeClass: 'bg-teal-100 text-teal-800',
      activeBadgeClass: 'bg-teal-300 text-teal-950 font-extrabold'
    },
    {
      id: 'Chemistry',
      name: 'Chemistry',
      shortName: 'Chemistry',
      tagline: 'Molecular Reactions, Kinetics & Chemical Energy',
      theme: 'orange',
      borderClass: 'border-orange-200 hover:border-[#D67546]',
      activeClass: 'bg-gradient-to-br from-[#D67546] to-rose-900 text-white border-orange-400 ring-2 ring-orange-400/40 shadow-lg shadow-[#D67546]/25',
      inactiveClass: 'bg-orange-50/40 text-slate-800 hover:bg-orange-50/80',
      badgeClass: 'bg-orange-100 text-[#D67546]',
      activeBadgeClass: 'bg-orange-300 text-orange-950 font-extrabold'
    },
    {
      id: 'Physics',
      name: 'Physics',
      shortName: 'Physics',
      tagline: 'Optics, Wave Mechanics & Physical Principles',
      theme: 'indigo',
      borderClass: 'border-indigo-200 hover:border-indigo-500',
      activeClass: 'bg-gradient-to-br from-indigo-800 to-cyan-900 text-white border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-800/25',
      inactiveClass: 'bg-indigo-50/40 text-slate-800 hover:bg-indigo-50/80',
      badgeClass: 'bg-indigo-100 text-indigo-800',
      activeBadgeClass: 'bg-indigo-300 text-indigo-950 font-extrabold'
    },
    {
      id: 'Mathematics',
      name: 'Mathematics',
      shortName: 'Mathematics',
      tagline: 'Calculus, Rates of Change & Quantitative Modeling',
      theme: 'rose',
      borderClass: 'border-rose-200 hover:border-rose-500',
      activeClass: 'bg-gradient-to-br from-rose-800 to-pink-900 text-white border-rose-400 ring-2 ring-rose-400/40 shadow-lg shadow-rose-800/25',
      inactiveClass: 'bg-rose-50/40 text-slate-800 hover:bg-rose-50/80',
      badgeClass: 'bg-rose-100 text-rose-800',
      activeBadgeClass: 'bg-rose-300 text-rose-950 font-extrabold'
    },
    {
      id: 'Engineering',
      name: 'Engineering',
      shortName: 'Engineering',
      tagline: 'Mechanics, Structural Elasticity & Applied Forces',
      theme: 'cyan',
      borderClass: 'border-cyan-200 hover:border-[#0891B2]',
      activeClass: 'bg-gradient-to-br from-[#0891B2] to-cyan-900 text-white border-[#47C3D3] ring-2 ring-[#47C3D3]/40 shadow-lg shadow-[#0891B2]/25',
      inactiveClass: 'bg-cyan-50/40 text-slate-800 hover:bg-cyan-50/80',
      badgeClass: 'bg-cyan-100 text-[#0891B2]',
      activeBadgeClass: 'bg-[#47C3D3] text-[#1F272A] font-extrabold'
    },
    {
      id: 'Agriculture',
      name: 'Agriculture',
      shortName: 'Agriculture',
      tagline: 'Soil Agronomy, Plant Nutrition & Crop Science',
      theme: 'emerald',
      borderClass: 'border-emerald-200 hover:border-emerald-500',
      activeClass: 'bg-gradient-to-br from-emerald-800 to-teal-900 text-white border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-800/25',
      inactiveClass: 'bg-emerald-50/40 text-slate-800 hover:bg-emerald-50/80',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      activeBadgeClass: 'bg-emerald-400 text-emerald-950 font-extrabold'
    },
    {
      id: 'Interdisciplinary',
      name: 'Interdisciplinary',
      shortName: 'Interdisciplinary',
      tagline: 'Biomimicry, Nature-Inspired Systems & Cross-Domain Science',
      theme: 'amber',
      borderClass: 'border-amber-200 hover:border-[#D6A348]',
      activeClass: 'bg-gradient-to-br from-amber-700 to-[#B47818] text-white border-[#D6A348] ring-2 ring-[#D6A348]/40 shadow-lg shadow-[#D6A348]/25',
      inactiveClass: 'bg-amber-50/40 text-slate-800 hover:bg-amber-50/80',
      badgeClass: 'bg-amber-100 text-[#B47818]',
      activeBadgeClass: 'bg-[#D6A348] text-[#1F272A] font-extrabold'
    }
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (subjectCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      subjectCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      voiceService.announce(
        direction === 'left' ? 'Scrolled to previous disciplines in carousel.' : 'Scrolled to next disciplines in carousel.',
        'navigate'
      );
    }
  };

  const getSubjectCount = (subjId: string) => {
    if (subjId === 'All') return resources.length;
    return resources.filter((r) => r.subject.toLowerCase() === subjId.toLowerCase()).length;
  };

  const handleSelectSubject = (subj: SubjectCardMeta) => {
    setSelectedSubject(subj.id);
    const count = getSubjectCount(subj.id);
    voiceService.announce(
      `Selected ${subj.name}. ${subj.tagline}. ${count} ${count === 1 ? 'lesson' : 'lessons'} available.`,
      'select'
    );
  };

  const readDisciplinesOverview = () => {
    const overview = [
      'Eusatis Mind Academic Disciplines overview.',
      'Seven specialized scientific and applied disciplines are available.',
      'One: Biology, covering cellular structures, photosynthesis, and life sciences.',
      'Two: Chemistry, covering molecular reactions, kinetics, and chemical energy.',
      'Three: Physics, covering optics, wave mechanics, and physical principles.',
      'Four: Mathematics, covering calculus, rates of change, and quantitative modeling.',
      'Five: Engineering, covering mechanics, structural elasticity, and applied forces.',
      'Six: Agriculture, covering soil agronomy, plant nutrition, and crop science.',
      'Seven: Interdisciplinary, covering biomimicry, nature-inspired systems, and cross-domain science.',
      'Press Tab to focus any discipline card, or press Enter to filter the lesson library.'
    ].join(' ');

    voiceService.speak(overview, { force: true, interrupt: true });
  };

  // Learner levels spanning Primary, Lower Secondary, Upper Secondary, and Tertiary
  const levels = [
    'All',
    'Primary / Elementary (KS2)',
    'Lower Secondary (JHS / KS3)',
    'Upper Secondary (SHS / KS4&5)',
    'Tertiary (University & College)'
  ];

  const filtered = resources
    .filter((r) => {
      const matchSubject =
        selectedSubject === 'All' || r.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchLevel =
        selectedLevel === 'All' || r.learner_level === selectedLevel;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      return matchSubject && matchLevel && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'reading_time') {
        return a.reading_time_minutes - b.reading_time_minutes;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <CreativeBadge label="THE EDUCATIONAL HEART" theme="cyan" size="md" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
          Eusatis Mind
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          Making difficult ideas accessible, engaging, and intuitive across Agriculture, Engineering, Interdisciplinary Studies, Biology, Chemistry, Physics, and Mathematics with interactive visual simulations.
        </p>
      </div>

      {/* Featured Navigation Plane Showcase */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs aspect-[21/9] sm:aspect-[24/8] bg-slate-100">
        <DynamicImage
          id="plane_mind"
          fallbackSrc="/assets/images/eusatis_stem_learning_1792624719640.jpg"
          alt="Eusatis Mind interactive educational learning"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 2. SUBJECT DISCOVERY CAROUSEL: Zero Icons, Fully Voice Accessible & Engaging */}
      <section
        role="region"
        aria-label="Academic Disciplines Carousel"
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#47C3D3] animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 tracking-tight">
                Academic Disciplines
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Swipe, use controls, or press Tab to focus curriculum by subject. All subjects feature interactive simulations and worked examples.
            </p>
          </div>

          {/* Action Row: Listen to Overview + Carousel Navigation Arrow Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            {/* Dedicated Voice Reader button for Blind / Auditory learners */}
            <button
              onClick={readDisciplinesOverview}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-[#0891B2] text-white text-xs font-bold font-['Outfit'] transition-all shadow-xs cursor-pointer focus:ring-4 focus:ring-[#47C3D3] focus:outline-hidden"
              aria-label="Listen to Academic Disciplines overview audio narration"
              title="Read all academic disciplines aloud"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#47C3D3]" />
              <span>Listen to Overview</span>
            </button>

            {/* Carousel Navigation Arrow Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#47C3D3] hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95 focus:ring-4 focus:ring-[#0891B2] focus:outline-hidden"
                title="Previous disciplines"
                aria-label="Scroll carousel to previous disciplines"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-xl bg-white border border-slate-200 hover:border-[#47C3D3] hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95 focus:ring-4 focus:ring-[#0891B2] focus:outline-hidden"
                title="Next disciplines"
                aria-label="Scroll carousel to next disciplines"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Scroll Track: Snap-aligned cards */}
        <div
          ref={subjectCarouselRef}
          role="tablist"
          aria-label="Select an academic discipline to filter learning resources"
          className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {subjectMetadata.map((subj, index) => {
            const isActive = selectedSubject === subj.id;
            const count = getSubjectCount(subj.id);

            return (
              <button
                key={subj.id}
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                aria-label={`${subj.name}, ${subj.tagline}. ${count} ${count === 1 ? 'lesson' : 'lessons'} available. ${isActive ? 'Currently active' : 'Click or press Enter to activate'}`}
                onClick={() => handleSelectSubject(subj)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSubject(subj);
                  }
                }}
                onFocus={() => {
                  if (voiceService.isEnabled()) {
                    voiceService.announce(
                      `Discipline ${index + 1} of ${subjectMetadata.length}: ${subj.name}. ${subj.tagline}. ${count} ${count === 1 ? 'lesson' : 'lessons'}. ${isActive ? 'Active' : 'Press Enter to select'}.`,
                      'select'
                    );
                  }
                }}
                className={`w-[260px] sm:w-[280px] shrink-0 snap-start text-left rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group select-none focus:outline-hidden focus:ring-4 focus:ring-[#0891B2] focus:ring-offset-2 ${
                  subj.borderClass
                } ${isActive ? subj.activeClass : subj.inactiveClass}`}
              >
                {/* Top Row: Tagline + Count Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                    isActive ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {subj.id === 'All' ? 'ALL FIELDS' : 'DISCIPLINE'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-tight shrink-0 transition-colors ${
                    isActive ? subj.activeBadgeClass : subj.badgeClass
                  }`}>
                    {count} {count === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                {/* Middle: Subject Title without icons */}
                <div>
                  <h3 className={`text-base sm:text-lg font-bold font-['Outfit'] leading-snug tracking-tight ${
                    isActive ? 'text-white' : 'text-slate-900 group-hover:text-[#0891B2]'
                  }`}>
                    {subj.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    isActive ? 'text-white/90 font-normal' : 'text-slate-500'
                  }`}>
                    {subj.tagline}
                  </p>
                </div>

                {/* Bottom Row: Selection Cue */}
                <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-bold font-['Outfit']">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#0891B2]'}>
                    {isActive ? '● Currently Active' : 'Select Subject'}
                  </span>
                  <span className={`transition-transform duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-1 group-hover:text-[#0891B2]'
                  }`}>
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, concept, or term (e.g. 'Soil pH', 'Beam Deflection', 'Snell', 'Phi')..."
            className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold font-['Outfit'] uppercase tracking-wider text-slate-500">
            <SlidersHorizontal className="w-4 h-4 text-[#0891B2]" />
            <span>Refine Criteria:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Level Dropdown Menu */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Outfit']">
                Level:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] cursor-pointer"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-['Outfit']">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="reading_time">Shortest Read</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
        <span>
          Showing <strong className="text-slate-900 font-mono text-base">{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'lesson' : 'lessons'}
          {selectedSubject !== 'All' && (
            <span className="ml-1.5 font-bold text-[#0891B2] font-['Outfit']">
              in {selectedSubject}
            </span>
          )}
        </span>
        {(selectedSubject !== 'All' || selectedLevel !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSubject('All');
              setSelectedLevel('All');
              setSearchQuery('');
            }}
            className="text-[#0891B2] hover:underline font-bold cursor-pointer text-sm font-['Outfit']"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Learning Resources */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <h3 className="text-xl font-bold font-['Outfit'] text-slate-800">
            No matching resources found
          </h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Try adjusting your search criteria or switching subject filters to discover other educational topics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((res) => (
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
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-black bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs font-['Outfit'] tracking-wider">
                  {res.subject}
                </div>
                {res.simulation?.enabled && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-black bg-[#D6A348] text-[#1F272A] shadow-xs font-['Outfit'] tracking-[0.2em]">
                    SIMULATION
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Clean unboxed metadata (NO PILLS) with large text */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 mb-2 font-medium">
                    <span>{res.category}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="font-bold text-slate-800">{res.learner_level}</span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {res.reading_time_minutes} min read
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 group-hover:text-[#0891B2] transition-colors line-clamp-2">
                    {res.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    <MathText content={res.summary} />
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                  <span className="font-medium">{res.author}</span>
                  <span className="font-bold text-[#0891B2] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-['Outfit']">
                    Explore Lesson <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
