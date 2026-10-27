import React, { useState } from 'react';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { LearningResource } from '../types';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicIcon } from '../components/DynamicIcon';
import { DynamicImage } from '../components/DynamicImage';
import { MathText } from '../components/MathText';

interface MindPageProps {
  resources: LearningResource[];
  onNavigate: (route: string, slug?: string) => void;
}

export const MindPage: React.FC<MindPageProps> = ({ resources, onNavigate }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'reading_time'>('newest');

  // Subjects with Science and STEM replaced by Agriculture, Engineering, and Interdisciplinary
  const subjects = [
    'All',
    'Agriculture',
    'Engineering',
    'Interdisciplinary',
    'Biology',
    'Chemistry',
    'Physics',
    'Mathematics'
  ];

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
        selectedSubject === 'All' || r.subject === selectedSubject;
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
          fallbackSrc="/src/assets/images/eusatis_stem_learning_1792624719640.jpg"
          alt="Eusatis Mind interactive educational learning"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Filter and Search Bar with enhanced readability */}
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-3 border-t border-slate-100">
          {/* Subject Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mr-1.5 shrink-0 font-['Outfit']">
              Subject:
            </span>
            {subjects.map((subj) => {
              const iconId = `subject_${subj.toLowerCase()}`;
              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                    selectedSubject === subj
                      ? 'bg-[#1F272A] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50'
                  }`}
                >
                  {subj !== 'All' && (
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 aspect-square overflow-hidden">
                      <DynamicIcon id={iconId} className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span>{subj}</span>
                </button>
              );
            })}
          </div>

          {/* Level Dropdown Menu & Sort */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 font-['Outfit']">
                Level:
              </span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 font-['Outfit']">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
              >
                <option value="newest">Newest First</option>
                <option value="reading_time">Shortest Read</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-slate-600 font-medium">
        <span>
          Showing <strong className="text-slate-900 font-mono text-base">{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'lesson' : 'lessons'}
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
