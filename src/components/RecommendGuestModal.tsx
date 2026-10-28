import React, { useState } from 'react';
import { X, Mic, Send, CheckCircle2, Sparkles, User, Mail, MessageSquare } from 'lucide-react';
import { EusatisLogo } from './EusatisLogo';
import { DynamicIcon } from './DynamicIcon';
import { contentService } from '../lib/supabaseClient';

interface RecommendGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendGuestModal: React.FC<RecommendGuestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    yourName: '',
    yourEmail: '',
    nomineeName: '',
    nomineeRole: '',
    nomineeLink: '',
    topicIdea: '',
    storyReason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [autoCloseActive, setAutoCloseActive] = useState(true);

  // Auto-dismiss and return visitor to Talks view
  React.useEffect(() => {
    if (!isSubmitted || !autoCloseActive) return;

    if (countdown <= 0) {
      handleReset();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSubmitted, autoCloseActive, countdown]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.yourName.trim() || !formData.yourEmail.trim() || !formData.nomineeName.trim() || !formData.storyReason.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Store submission through contact service with specialized topic tag
      await contentService.submitContact({
        name: formData.yourName,
        email: formData.yourEmail,
        subject: `[Beyoutiful Talks Guest Nomination]: ${formData.nomineeName}`,
        message: `Nominee: ${formData.nomineeName} (${formData.nomineeRole || 'Role not specified'})
Social / Portfolio: ${formData.nomineeLink || 'N/A'}
Proposed Discussion Theme: ${formData.topicIdea || 'General Authenticity & Purpose'}

Why their story inspires:
${formData.storyReason}`
      });

      setIsSubmitted(true);
    } catch {
      setErrorMessage('Unable to submit recommendation right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      yourName: '',
      yourEmail: '',
      nomineeName: '',
      nomineeRole: '',
      nomineeLink: '',
      topicIdea: '',
      storyReason: ''
    });
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF7F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#D6A348]/20 flex items-center justify-center text-[#B47818] shrink-0 aspect-square overflow-hidden shadow-2xs">
              <DynamicIcon id="talks_recommend_guest" className="w-5 h-5 text-[#B47818]" fallback={<Mic className="w-5 h-5" />} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#B47818] uppercase tracking-wider font-mono">
                Beyoutiful Talks
              </div>
              <h3 className="text-lg font-bold font-['Outfit'] text-slate-900 leading-tight">
                Recommend a Guest
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Thank You for Your Nomination!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  We have received your guest recommendation for <strong className="text-slate-900">{formData.nomineeName}</strong>. Our Beyoutiful Talks production team reviews every story of courage, self-discovery, and authenticity.
                </p>
              </div>

              {autoCloseActive ? (
                <div className="p-4 rounded-2xl bg-[#47C3D3]/10 border border-[#47C3D3]/30 max-w-sm mx-auto space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F6F7B] font-['Outfit']">
                    <span className="w-2 h-2 rounded-full bg-[#47C3D3] animate-ping" />
                    <span>Automating back to Beyoutiful Talks in {countdown}s...</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-[#47C3D3] to-[#D6A348] h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      onClick={handleReset}
                      className="px-5 py-2 rounded-xl font-bold text-xs bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer font-['Outfit']"
                    >
                      Return to Talks Now
                    </button>
                    <button
                      onClick={() => setAutoCloseActive(false)}
                      className="px-3 py-2 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Stay
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Close & Return to Talks
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Beyoutiful Talks invites guests who have navigated the struggle of comparison, discovered who they are, or brought thoughtful clarity to education and society. You may nominate a colleague, mentor, educator, or yourself!
              </p>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                  {errorMessage}
                </div>
              )}

              {/* Submitter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    placeholder="e.g. Ama Mensah"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.yourEmail}
                    onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                  />
                </div>
              </div>

              {/* Nominee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nominee&apos;s Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomineeName}
                    onChange={(e) => setFormData({ ...formData, nomineeName: e.target.value })}
                    placeholder="e.g. Dr. Kwame Asare"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Their Role / Profession
                  </label>
                  <input
                    type="text"
                    value={formData.nomineeRole}
                    onChange={(e) => setFormData({ ...formData, nomineeRole: e.target.value })}
                    placeholder="e.g. Agronomist & Rural Educator"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Proposed Discussion Topic or Episode Theme
                </label>
                <input
                  type="text"
                  value={formData.topicIdea}
                  onChange={(e) => setFormData({ ...formData, topicIdea: e.target.value })}
                  placeholder="e.g. Breaking free from academic comparison to pursue authentic passion"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Why Should We Have Them on Beyoutiful Talks? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.storyReason}
                  onChange={(e) => setFormData({ ...formData, storyReason: e.target.value })}
                  placeholder="Tell us about their journey, how they navigated moments of uncertainty, and what key insight or clarity our listeners would gain..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#D6A348] focus:ring-1 focus:ring-[#D6A348]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1F272A] hover:bg-slate-800 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#D6A348]" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Nomination'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
