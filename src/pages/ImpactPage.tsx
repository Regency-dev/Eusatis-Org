import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, HandHeart } from 'lucide-react';
import { ImpactStory } from '../types';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicImage } from '../components/DynamicImage';

interface ImpactPageProps {
  stories: ImpactStory[];
  onNavigate: (route: string, slug?: string) => void;
  onOpenVolunteer: (initiative?: string) => void;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({
  stories,
  onNavigate,
  onOpenVolunteer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Educational Outreach',
    'School-Based Projects',
    'Hospital & Care Support'
  ];

  const filteredStories = stories.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <CreativeBadge label="KNOWLEDGE IN ACTION" theme="terracotta" size="md" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
          Eusatis Impact
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          Understanding should create responsibility. Knowledge should not end with the person who receives it—it must become something that can be shared, applied, and used to improve the lives of others.
        </p>
      </div>

      {/* Featured Navigation Plane Visual Showcase */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs aspect-[21/9] sm:aspect-[24/8] bg-slate-100">
        <DynamicImage
          id="plane_impact"
          fallbackSrc="/src/assets/images/eusatis_impact_community_1792624720900.jpg"
          alt="Eusatis Impact community action and stewardship"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Aggregate Impact KPI strip with enhanced legibility */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#D67546] tabular-nums">
            1,690+
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1 font-['Outfit']">
            Learners Reached
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Through school science kits & workshops
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#47C3D3] tabular-nums">
            14
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1 font-['Outfit']">
            Partner Schools
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Equipped with tactile experiment stations
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#D6A348] tabular-nums">
            3
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1 font-['Outfit']">
            Pediatric Discovery Corners
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            In regional healthcare facilities
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 tabular-nums">
            100%
          </div>
          <div className="text-sm font-bold text-slate-900 mt-1 font-['Outfit']">
            Open & Accessible
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Grassroots community focus
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mr-2 font-['Outfit']">
          Initiative:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1F272A] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
            Published Community Initiatives ({filteredStories.length})
          </h2>
          <button
            onClick={() => onOpenVolunteer()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#D67546] text-white hover:bg-[#c26538] transition-colors cursor-pointer font-['Outfit'] shadow-xs"
          >
            <HandHeart className="w-4 h-4" />
            <span>Volunteer With Us</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              onClick={() => onNavigate('impact-detail', story.slug)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={story.featured_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-black bg-white/95 text-[#D67546] backdrop-blur-xs font-['Outfit']">
                    {story.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {/* Clean unboxed metadata with larger font */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                    {story.location && (
                      <>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {story.location}
                        </span>
                        <span aria-hidden="true" className="text-slate-400">·</span>
                      </>
                    )}
                    {story.project_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {story.project_date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900 group-hover:text-[#D67546] transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-700 line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>

                  {/* Quantitative Outcomes Badges */}
                  {story.outcomes && story.outcomes.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {story.outcomes.map((out, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center"
                        >
                          <div className="text-base sm:text-lg font-bold font-mono text-[#D67546] tabular-nums">
                            {out.metric}
                          </div>
                          <div className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                            {out.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium">
                <span>Verified Documentation</span>
                <span className="font-bold text-[#D67546] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-['Outfit']">
                  Read Case Study <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
