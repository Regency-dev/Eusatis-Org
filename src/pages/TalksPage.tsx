import React, { useState, useEffect } from 'react';
import { Play, Clock, User, Share2, Sparkles, MessageSquare, PlusCircle } from 'lucide-react';
import { PodcastEpisode } from '../types';
import { AudioPlayer } from '../components/AudioPlayer';
import { CreativeBadge } from '../components/CreativeBadge';
import { RecommendGuestModal } from '../components/RecommendGuestModal';
import { DynamicImage } from '../components/DynamicImage';
import { renderUniversalVideoPlayer } from '../lib/videoUtils';

interface TalksPageProps {
  episodes: PodcastEpisode[];
  onNavigate: (route: string) => void;
}

export const TalksPage: React.FC<TalksPageProps> = ({ episodes, onNavigate }) => {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode>(
    episodes[0] || null
  );
  const [mediaMode, setMediaMode] = useState<'audio' | 'video'>('audio');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [recommendModalOpen, setRecommendModalOpen] = useState<boolean>(false);

  // Synchronize selected episode when episodes prop changes from database updates
  useEffect(() => {
    if (episodes && episodes.length > 0) {
      setSelectedEpisode((prev) => {
        if (!prev) return episodes[0];
        const match = episodes.find((ep) => ep.id === prev.id);
        return match || episodes[0];
      });
    }
  }, [episodes]);

  const tags = ['All', 'Authenticity', 'Identity', 'Learning', 'Social Responsibility', 'Curiosity'];

  const filteredEpisodes = episodes.filter((ep) => {
    if (selectedTag === 'All') return true;
    return ep.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  const renderEpisodeVideo = (url: string) => {
    return renderUniversalVideoPlayer(url, 'Beyoutiful Talks Broadcast');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
        <div className="max-w-3xl space-y-3">
          <CreativeBadge label="EUSATIS TALKS" theme="gold" size="md" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
            Beyoutiful Talks
          </h1>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            The concept is rooted in authenticity. In a world where people can easily become copies of one another, Beyoutiful Talks encourages people to remove the masks, resist the pressure to become someone else, and discover the quiet power of being genuinely themselves.
          </p>
        </div>

        {/* Action Plane Button: Recommend a Guest Opens Dedicated Modal (NOT Contact Page) */}
        <div className="shrink-0">
          <button
            onClick={() => setRecommendModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#1F272A] hover:bg-slate-800 text-white shadow-sm transition-all cursor-pointer font-['Outfit']"
          >
            <PlusCircle className="w-4 h-4 text-[#D6A348]" />
            <span>Recommend a Guest</span>
          </button>
        </div>
      </div>

      {/* Featured Podcast Navigation Visual */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs aspect-[21/9] sm:aspect-[24/8] bg-slate-100">
        <DynamicImage
          id="plane_talks"
          fallbackSrc="/src/assets/images/eusatis_talks_studio_1792624720801.jpg"
          alt="Beyoutiful Talks podcast recording studio and conversations"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Primary Featured Player with Audio / Video Switch */}
      {selectedEpisode && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm font-extrabold text-slate-500 uppercase tracking-widest font-['Outfit']">
              NOW PLAYING · EPISODE #{selectedEpisode.episode_number}
            </div>

            {selectedEpisode.video_url && (
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  onClick={() => setMediaMode('audio')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-['Outfit'] transition-all cursor-pointer ${
                    mediaMode === 'audio'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Audio Player
                </button>
                <button
                  onClick={() => setMediaMode('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-['Outfit'] transition-all cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-[#D6A348] text-[#1F272A] shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Watch Video Broadcast
                </button>
              </div>
            )}
          </div>

          {mediaMode === 'video' && selectedEpisode.video_url ? (
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md">
              <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D6A348] flex items-center justify-center text-[#1F272A] font-extrabold font-mono text-sm">
                    #{selectedEpisode.episode_number}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-['Outfit'] text-white">
                      {selectedEpisode.title}
                    </h3>
                    {selectedEpisode.guest_name && (
                      <p className="text-xs text-slate-400">
                        With {selectedEpisode.guest_name} ({selectedEpisode.guest_role})
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="aspect-video w-full">
                {renderEpisodeVideo(selectedEpisode.video_url)}
              </div>
            </div>
          ) : (
            <AudioPlayer episode={selectedEpisode} />
          )}
        </section>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <span className="text-xs sm:text-sm text-slate-500 mr-2 font-bold uppercase tracking-wider font-['Outfit']">
          Topic:
        </span>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 cursor-pointer ${
              selectedTag === tag
                ? 'bg-[#1F272A] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Episode Library */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
            All Episodes ({filteredEpisodes.length})
          </h2>
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            Available on Web & Mobile · Full Transcripts Included
          </span>
        </div>

        <div className="space-y-4">
          {filteredEpisodes.map((ep) => {
            const isCurrent = selectedEpisode?.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => {
                  setSelectedEpisode(ep);
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md ${
                  isCurrent
                    ? 'border-[#D6A348] ring-2 ring-[#D6A348]/40 bg-amber-50/25'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-5 sm:gap-6">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={ep.cover_image}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-[#D6A348] text-[#1F272A] font-['Outfit']">
                      #{ep.episode_number}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {/* Clean unboxed metadata (NO PILLS) with large legible text */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                      <span className="font-bold text-[#B47818]">Episode {ep.episode_number}</span>
                      {ep.guest_name && (
                        <>
                          <span aria-hidden="true" className="text-slate-400">·</span>
                          <span className="text-slate-900 font-bold">
                            With {ep.guest_name} ({ep.guest_role})
                          </span>
                        </>
                      )}
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        {ep.duration_minutes} mins
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 line-clamp-1">
                      {ep.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {ep.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEpisode(ep);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-['Outfit'] transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#D6A348] text-[#1F272A] shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isCurrent ? 'Playing Now' : 'Listen Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Invitation Callout with Creative Badge & Dedicated Nomination Action */}
      <div className="bg-[#FAF7F5] border border-amber-200/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
        <div className="space-y-3 max-w-xl">
          <CreativeBadge label="JOIN THE CONVERSATION" theme="terracotta" size="md" />
          <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-slate-900 tracking-tight">
            Have a story of authenticity or learning to share?
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Beyoutiful Talks welcomes educators, thinkers, practitioners, and students who have navigated the struggle of comparison and found clarity in being genuinely themselves.
          </p>
        </div>
        <button
          onClick={() => setRecommendModalOpen(true)}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold bg-[#1F272A] text-white hover:bg-slate-800 transition-all shrink-0 cursor-pointer shadow-sm font-['Outfit']"
        >
          <MessageSquare className="w-4 h-4 text-[#D6A348]" />
          <span>Recommend a Guest</span>
        </button>
      </div>

      {/* Dedicated Guest Recommendation Modal */}
      <RecommendGuestModal
        isOpen={recommendModalOpen}
        onClose={() => setRecommendModalOpen(false)}
      />
    </div>
  );
};
