import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Mic, Heart, ArrowRight } from 'lucide-react';
import { LearningResource, PodcastEpisode, ImpactStory } from '../types';
import { contentService } from '../lib/supabaseClient';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string, slug?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mind' | 'talks' | 'impact'>('all');
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        contentService.getLearningResources(true),
        contentService.getPodcastEpisodes(true),
        contentService.getImpactStories(true)
      ])
        .then(([r, e, s]) => {
          setResources(r);
          setEpisodes(e);
          setStories(s);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredResources =
    filterType === 'all' || filterType === 'mind'
      ? resources.filter(
          (r) =>
            !q ||
            r.title.toLowerCase().includes(q) ||
            r.summary.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q) ||
            r.tags.some((t) => t.toLowerCase().includes(q))
        )
      : [];

  const filteredEpisodes =
    filterType === 'all' || filterType === 'talks'
      ? episodes.filter(
          (e) =>
            !q ||
            e.title.toLowerCase().includes(q) ||
            e.summary.toLowerCase().includes(q) ||
            (e.guest_name && e.guest_name.toLowerCase().includes(q))
        )
      : [];

  const filteredStories =
    filterType === 'all' || filterType === 'impact'
      ? stories.filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.summary.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        )
      : [];

  const totalResults =
    filteredResources.length + filteredEpisodes.length + filteredStories.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, Beyoutiful Talks, impact stories..."
            className="w-full text-base bg-transparent border-none outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Filter:</span>
          {(['all', 'mind', 'talks', 'impact'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'all'
                ? 'All Content'
                : type === 'mind'
                ? 'Mind Lessons'
                : type === 'talks'
                ? 'Talks Episodes'
                : 'Impact Stories'}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Searching knowledge library...
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No matching resources found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for terms like &ldquo;refraction&rdquo;, &ldquo;photosynthesis&rdquo;, &ldquo;authenticity&rdquo;, or &ldquo;solar&rdquo;.
              </p>
            </div>
          ) : (
            <>
              {/* Eusatis Mind Results */}
              {filteredResources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#47C3D3]" />
                    <span>Eusatis Mind ({filteredResources.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredResources.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => {
                          onNavigate('mind-detail', res.slug);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-[#47C3D3] hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-semibold text-[#0891B2]">
                              {res.subject}
                            </span>
                            <span>·</span>
                            <span>{res.learner_level}</span>
                            <span>·</span>
                            <span>{res.reading_time_minutes} min read</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {res.title}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {res.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beyoutiful Talks Results */}
              {filteredEpisodes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    <Mic className="w-3.5 h-3.5 text-[#D6A348]" />
                    <span>Beyoutiful Talks ({filteredEpisodes.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredEpisodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          onNavigate('talks', ep.slug);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-[#D6A348] hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-semibold text-[#D6A348]">
                              Episode {ep.episode_number}
                            </span>
                            {ep.guest_name && (
                              <>
                                <span>·</span>
                                <span>With {ep.guest_name}</span>
                              </>
                            )}
                            <span>·</span>
                            <span>{ep.duration_minutes} mins</span>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {ep.title}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {ep.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Eusatis Impact Results */}
              {filteredStories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    <Heart className="w-3.5 h-3.5 text-[#D67546]" />
                    <span>Eusatis Impact ({filteredStories.length})</span>
                  </div>
                  <div className="space-y-2">
                    {filteredStories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => {
                          onNavigate('impact-detail', story.slug);
                          onClose();
                        }}
                        className="p-3 rounded-xl border border-slate-100 hover:border-[#D67546] hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                            <span className="font-semibold text-[#D67546]">
                              {story.category}
                            </span>
                            {story.location && (
                              <>
                                <span>·</span>
                                <span>{story.location}</span>
                              </>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {story.title}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {story.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 ml-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
