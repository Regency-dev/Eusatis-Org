import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Map, ArrowRight, ExternalLink } from 'lucide-react';
import { EusatisLogo } from './EusatisLogo';

export type LegalDocType = 'privacy' | 'terms' | 'sitemap';

interface LegalModalProps {
  isOpen: boolean;
  docType: LegalDocType;
  onClose: () => void;
  onNavigate: (route: string, slug?: string) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  docType,
  onClose,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<LegalDocType>(docType);

  // Sync tab with prop when opened
  React.useEffect(() => {
    setActiveTab(docType);
  }, [docType, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <EusatisLogo variant="main" size="sm" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Official Documentation
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#0891B2] text-[#0891B2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#D6A348] text-[#B47818]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Use</span>
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sitemap'
                ? 'border-[#D67546] text-[#D67546]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Sitemap</span>
          </button>
        </div>

        {/* Document Content Scroll Area */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-slate-900 tracking-tight">
                  Eusatis Privacy Policy
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: October 2026 · Committed to transparency & ethical stewardship
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  1. Our Core Privacy Commitment
                </h4>
                <p>
                  At Eusatis (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;platform&rdquo;), we believe that curiosity and learning require a safe, trustworthy environment. We respect your autonomy and are committed to protecting your personal data in accordance with modern global privacy frameworks (including GDPR principles).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  2. Information We Collect
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Voluntary Submissions:</strong> Your name and email address when you subscribe to our educational newsletter, recommend a guest for Beyoutiful Talks, or contact us.</li>
                  <li><strong>Interactive Simulation Data:</strong> Numerical parameters adjusted during lesson simulations run strictly in your client browser session and are not logged to remote user tracking databases.</li>
                  <li><strong>Technical Usage:</strong> Aggregated anonymous diagnostics (e.g. browser type, screen viewport, page load latency) used solely to maintain platform performance and accessibility.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  3. How We Use Your Data
                </h4>
                <p>
                  Your information is utilized strictly to deliver requested educational dispatches, process Beyoutiful Talks guest inquiries, and answer direct communications. We never sell, lease, or monetize your contact details with external third-party advertisers.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  4. Your Rights & Unsubscribe
                </h4>
                <p>
                  You hold full control over your contact information. You may request data deletion or unsubscribe from any newsletter dispatch at any time via a direct note through our contact page or by emailing our privacy team.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-slate-900 tracking-tight">
                  Eusatis Terms of Use
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: October 2026 · Guidelines for responsible learning & participation
                </p>
              </div>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  1. Agreement to Terms
                </h4>
                <p>
                  By accessing the Eusatis web platform, interactive learning simulations, Beyoutiful Talks podcast materials, or community impact programs, you agree to abide by these terms of use.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  2. Intellectual Property & Fair Educational Use
                </h4>
                <p>
                  All curriculum materials, interactive simulation modules, editorial articles, brand assets, logos, and audio recordings of Beyoutiful Talks are the intellectual property of Eusatis and its contributors. Educational institutions, students, and educators are granted permission to reference and quote materials for non-commercial pedagogical purposes with appropriate attribution.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  3. Scientific & Mathematical Accuracy
                </h4>
                <p>
                  While our academic faculty rigorously drafts and verifies simulations across Physics, Agriculture, Engineering, Chemistry, Biology, and Mathematics, educational simulations provide simplified models of physical phenomena intended for conceptual clarity.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 font-['Outfit']">
                  4. Community Dignity & Storytelling
                </h4>
                <p>
                  All impact stories and beneficiary representations honor the dignity of the people involved. Users participating in community discussions or proposing podcast guests must interact with civility, empathy, and respect.
                </p>
              </section>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-2xl font-extrabold font-['Outfit'] text-slate-900 tracking-tight">
                  Eusatis Platform Sitemap
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Complete directory of public pages, divisions, and interactive learning resources
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Core Navigation */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#1F272A] font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0891B2]" />
                    Main Navigation
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      { id: 'home', label: 'Home Page (Understand · Become · Impact)' },
                      { id: 'mind', label: 'Eusatis Mind (Interactive Library)' },
                      { id: 'talks', label: 'Beyoutiful Talks (Podcasts & Conversations)' },
                      { id: 'impact', label: 'Eusatis Impact (Community Stories)' },
                      { id: 'about', label: 'About Purpose, Vision & Mission' },
                      { id: 'contact', label: 'Contact & Inquiries' }
                    ].map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            onNavigate(item.id);
                            onClose();
                          }}
                          className="hover:text-[#0891B2] hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left font-medium"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disciplines & Curricular Levels */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#1F272A] font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D6A348]" />
                    Curricular Disciplines
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      'Agriculture (Agronomy & Soil Science)',
                      'Engineering (Structural Load & Mechanics)',
                      'Interdisciplinary (Biomimetic Geometry)',
                      'Physics (Optics & Wave Refraction)',
                      'Biology (Photosynthetic Saturation)',
                      'Chemistry & Mathematics'
                    ].map((sub, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            onNavigate('mind');
                            onClose();
                          }}
                          className="hover:text-[#B47818] hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sub}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Tools & Talks */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#1F272A] font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D67546]" />
                    Beyoutiful Talks Highlights
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      'Episode 1: The Courage to Be Authentic',
                      'Episode 2: Overcoming Imposter Syndrome in STEM',
                      'Episode 3: Community Purpose in Education',
                      'Recommend a Guest Submission'
                    ].map((ep, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            onNavigate('talks');
                            onClose();
                          }}
                          className="hover:text-[#D67546] hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>{ep}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact Programs */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#1F272A] font-['Outfit'] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#485358]" />
                    Impact Initiatives
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {[
                      'Solar Science Labs for Rural Schools',
                      'Maternal Health Nutrition Workshops',
                      'Volunteer & Participation Requests'
                    ].map((prog, i) => (
                      <li key={i}>
                        <button
                          onClick={() => {
                            onNavigate('impact');
                            onClose();
                          }}
                          className="hover:text-slate-900 hover:translate-x-1 transition-all flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prog}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Eusatis Official Platform Documentation</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
