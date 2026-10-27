import React from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Share2, HandHeart, CheckCircle2, Play, ExternalLink } from 'lucide-react';
import { ImpactStory } from '../types';
import { renderUniversalVideoPlayer } from '../lib/videoUtils';

function renderVideoPlayer(url: string) {
  return renderUniversalVideoPlayer(url, 'Impact Video Documentary');
}

interface ImpactDetailPageProps {
  slug: string;
  stories: ImpactStory[];
  onNavigate: (route: string, slug?: string) => void;
  onOpenVolunteer: (initiative?: string) => void;
}

export const ImpactDetailPage: React.FC<ImpactDetailPageProps> = ({
  slug,
  stories,
  onNavigate,
  onOpenVolunteer
}) => {
  const story = stories.find((s) => s.slug === slug);

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-['Outfit'] text-slate-800">
          Impact Story Not Found
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested community initiative record could not be found.
        </p>
        <button
          onClick={() => onNavigate('impact')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Eusatis Impact
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('impact')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Eusatis Impact</span>
        </button>

        <button
          onClick={() => onOpenVolunteer(story.title)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#D67546] text-white hover:bg-[#c06336] transition-colors cursor-pointer"
        >
          <HandHeart className="w-3.5 h-3.5" />
          <span>Volunteer for this Project</span>
        </button>
      </div>

      {/* Header section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-[#D67546]">{story.category}</span>
          {story.location && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {story.location}
              </span>
            </>
          )}
          {story.project_date && (
            <>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {story.project_date}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight leading-tight">
          {story.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          {story.summary}
        </p>
      </div>

      {/* Hero Image & Video Documentation */}
      <div className="space-y-4">
        <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 shadow-xs">
          <img
            src={story.featured_image}
            alt={story.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {story.video_url && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D67546] flex items-center justify-center text-white shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Documentary Video
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                    {story.title}
                  </h4>
                </div>
              </div>
              <a
                href={story.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#47C3D3] hover:underline flex items-center gap-1 font-mono shrink-0"
              >
                <span>External</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="aspect-video w-full">
              {renderVideoPlayer(story.video_url)}
            </div>
          </div>
        )}
      </div>

      {/* Measurable Outcomes Strip */}
      {story.outcomes && story.outcomes.length > 0 && (
        <div className="bg-[#FAF7F5] border border-slate-200 rounded-3xl p-6 sm:p-8">
          <div className="text-xs font-bold text-[#D67546] uppercase tracking-wider mb-4 font-mono">
            Documented Outcomes & Impact
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {story.outcomes.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {item.metric}
                </div>
                <div className="text-xs text-slate-600 font-medium mt-1">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Narrative */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-5 text-sm sm:text-base">
        {story.full_story.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[#1F272A] pt-4 tracking-tight"
              >
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n');
            return (
              <ul key={idx} className="space-y-1.5 list-disc pl-5 text-slate-700">
                {items.map((it, i) => (
                  <li key={i}>{it.replace(/^- /, '')}</li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-slate-700 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Partners */}
      {story.partner_names && story.partner_names.length > 0 && (
        <div className="pt-6 border-t border-slate-200">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
            Verified Community Partners
          </div>
          <div className="flex flex-wrap gap-2">
            {story.partner_names.map((partner, i) => (
              <span
                key={i}
                className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-medium"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
