import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Calendar, ChevronDown, ChevronUp, Share2, Check, Play, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { LearningResource } from '../types';
import { KnowledgeCheckQuiz } from '../components/KnowledgeCheckQuiz';
import { LessonSimulation } from '../components/LessonSimulation';
import { EquationBlock } from '../components/EquationBlock';
import { MathText } from '../components/MathText';
import { CreativeBadge } from '../components/CreativeBadge';
import { renderUniversalVideoPlayer } from '../lib/videoUtils';

function renderVideoPlayer(url: string) {
  return renderUniversalVideoPlayer(url, 'Interactive Lesson Video');
}

interface MindDetailPageProps {
  slug: string;
  resources: LearningResource[];
  onNavigate: (route: string, slug?: string) => void;
}

export const MindDetailPage: React.FC<MindDetailPageProps> = ({
  slug,
  resources,
  onNavigate
}) => {
  const resource = resources.find((r) => r.slug === slug);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-3xl font-bold font-['Outfit'] text-slate-800">
          Resource Not Found
        </h2>
        <p className="text-base text-slate-600 max-w-md mx-auto">
          The requested educational resource could not be found or may have been updated.
        </p>
        <button
          onClick={() => onNavigate('mind')}
          className="px-6 py-2.5 text-sm font-bold rounded-xl bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Eusatis Mind
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedResources = resources
    .filter((r) => r.id !== resource.id && (r.subject === resource.subject || r.category === resource.category))
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Bar: Back button & share action */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('mind')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer font-['Outfit']"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Eusatis Mind</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-bold">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share Lesson</span>
            </>
          )}
        </button>
      </div>

      {/* Header section with enhanced typography & clear metadata */}
      <div className="space-y-5">
        {/* Clean unboxed metadata with larger font sizes */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium">
          <span className="font-extrabold text-[#0891B2] font-['Outfit'] tracking-wide">{resource.subject}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-800 font-semibold">{resource.category}</span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="text-slate-700">Level: <strong className="text-slate-900 font-bold">{resource.learner_level}</strong></span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="flex items-center gap-1.5 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.reading_time_minutes} min read</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight leading-tight">
          {resource.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed max-w-3xl font-normal">
          <MathText content={resource.summary} />
        </p>

        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-medium">{resource.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              Updated {new Date(resource.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Featured visual or Masterclass Video */}
      <div className="space-y-4">
        <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100 shadow-sm">
          <img
            src={resource.featured_image}
            alt={resource.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {resource.video_url && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
            <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D67546] flex items-center justify-center text-white shrink-0">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    Interactive Video Masterclass
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                    {resource.title}
                  </h4>
                </div>
              </div>
              <a
                href={resource.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#47C3D3] hover:underline flex items-center gap-1 font-mono shrink-0"
              >
                <span>External Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="aspect-video w-full">
              {renderVideoPlayer(resource.video_url)}
            </div>
          </div>
        )}
      </div>

      {/* Learning Objectives Box with Creative Badge */}
      {resource.learning_objectives && resource.learning_objectives.length > 0 && (
        <div className="bg-[#EEF8FA] border border-[#C5E8EE] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <CreativeBadge label="LEARNING OBJECTIVES" theme="cyan" size="md" />
          <ul className="space-y-3 pt-1">
            {resource.learning_objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-800 leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-[#0891B2] mt-2 shrink-0" />
                <span><MathText content={obj} /></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Full Content Body with High-Quality Equation Formatting & Structured Lists */}
      <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-6 text-base sm:text-lg">
        {resource.content
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/(^|\n)[ \t]*(#{1,4}[ \t]+[^\n]+)/g, '\n\n$2\n\n')
          .replace(/(^|\n)[ \t]*(\$\$[^\$]+\$\$)/g, '\n\n$2\n\n')
          .split(/\n\s*\n/)
          .map((rawParagraph, idx) => {
            const paragraph = rawParagraph.trim();
            if (!paragraph) return null;

            // Check if paragraph is a markdown heading (#, ##, ###, ####)
            const headingMatch = paragraph.match(/^(#{1,4})[ \t]+(.+)$/);
            if (headingMatch) {
              const level = headingMatch[1].length;
              const headingContent = headingMatch[2].trim();
              if (level === 1 || level === 2) {
                return (
                  <h2
                    key={idx}
                    className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-[#1F272A] pt-4 tracking-tight"
                  >
                    <MathText content={headingContent} />
                  </h2>
                );
              }
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[#1F272A] pt-3 tracking-tight"
                >
                  <MathText content={headingContent} />
                </h3>
              );
            }

            if (paragraph.startsWith('$$')) {
              // Render high-fidelity formatted equation block
              return (
                <EquationBlock
                  key={idx}
                  rawEquation={paragraph}
                  contextSubject={resource.subject}
                />
              );
            }
            if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
              const listLines = paragraph.split('\n').filter((l) => l.trim().length > 0);
              return (
                <ul key={idx} className="space-y-3 my-4 list-none pl-0">
                  {listLines.map((line, liIdx) => {
                    const cleaned = line.replace(/^[ \t]*-[ \t]*/, '').trim();
                    return (
                      <li
                        key={liIdx}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 text-sm sm:text-base leading-relaxed shadow-2xs hover:border-[#0891B2]/50 transition-colors"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0891B2] mt-2 shrink-0 ring-4 ring-[#0891B2]/15" />
                        <div className="flex-1">
                          <MathText content={cleaned} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-slate-700 leading-relaxed font-normal">
                <MathText content={paragraph} />
              </p>
            );
          })}
      </div>

      {/* Embedded Interactive Lesson Simulation Linked to Eusatis Aha */}
      {resource.simulation && resource.simulation.enabled && (
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-linear-to-r from-[#FAF7F5] via-[#EEF8FA] to-white border border-[#C5E8EE] shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#0891B2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-6 h-6 text-[#D6A348]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0891B2] font-['Outfit']">
                    EUSATIS AHA: UNDERSTANDING IN ACTION
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D6A348]/20 text-[#B47818] font-mono">
                    LIVE STAGE
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold font-['Outfit'] text-slate-900 mt-0.5">
                  Interactive Phenomenon Model
                </h3>
                <p className="text-xs text-slate-600">
                  Manipulate real physical variables to witness mathematical principles in action.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigate('home');
                setTimeout(() => {
                  const elem = document.getElementById('angle-slider');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }, 300);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 border border-slate-300 hover:border-[#0891B2] hover:text-[#0891B2] transition-colors shadow-2xs cursor-pointer font-['Outfit'] shrink-0"
              title="Launch the Eusatis Aha: Understanding in Action interface"
            >
              <span>Explore Eusatis Aha Stage</span>
              <ArrowRight className="w-4 h-4 text-[#0891B2]" />
            </button>
          </div>

          <LessonSimulation config={resource.simulation} />
        </div>
      )}

      {/* Worked Examples with Creative Badge & Equation Typography */}
      {resource.worked_examples && resource.worked_examples.length > 0 && (
        <div className="space-y-6 pt-4">
          <CreativeBadge label="WORKED EXAMPLES" theme="gold" size="md" />
          
          {resource.worked_examples.map((ex, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5"
            >
              <h4 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900">
                {ex.title}
              </h4>
              
              <div className="text-sm sm:text-base text-slate-800 bg-slate-50 p-5 rounded-2xl border border-slate-200 leading-relaxed">
                <span className="font-black text-slate-900 block mb-1.5 font-['Outfit'] uppercase tracking-[0.22em] text-xs sm:text-[13px]">
                  Problem Scenario
                </span>
                <MathText content={ex.problem} />
              </div>

              <div className="text-sm sm:text-base text-slate-800 leading-relaxed space-y-2">
                <span className="font-black text-slate-900 block mb-1.5 font-['Outfit'] uppercase tracking-[0.22em] text-xs sm:text-[13px]">
                  Step-by-Step Solution
                </span>
                <div className="text-slate-700 space-y-2 overflow-x-auto max-w-full">
                  {ex.solution.split('\n\n').map((block, bIdx) => (
                    <div key={bIdx} className="overflow-x-auto py-0.5 max-w-full">
                      <MathText content={block} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-sm text-amber-900">
                <strong className="block mb-1 font-black text-[#B47818] uppercase tracking-[0.22em] font-['Outfit'] text-xs">
                  Key Pedagogical Insight
                </strong>
                <span className="leading-relaxed"><MathText content={ex.keyInsight} /></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Knowledge Check Quiz */}
      <KnowledgeCheckQuiz questions={resource.knowledge_checks} />

      {/* Frequently Asked Questions */}
      {resource.faqs && resource.faqs.length > 0 && (
        <div className="space-y-4 pt-4">
          <h4 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-[#1F272A]">
            Common Inquiries & Concept Notes
          </h4>
          <div className="space-y-3">
            {resource.faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-5 pt-0 text-sm sm:text-base text-slate-700 border-t border-slate-100 bg-slate-50/60 leading-relaxed">
                    <MathText content={faq.answer} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h4 className="text-lg sm:text-xl font-bold font-['Outfit'] text-[#1F272A]">
            Continue Learning in {resource.subject}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedResources.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onNavigate('mind-detail', rel.slug);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#47C3D3] bg-white transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="text-xs font-bold text-[#0891B2] mb-1 font-['Outfit']">
                  {rel.subject} · {rel.learner_level}
                </div>
                <div className="text-base font-bold text-slate-900 line-clamp-1">
                  {rel.title}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                  {rel.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
