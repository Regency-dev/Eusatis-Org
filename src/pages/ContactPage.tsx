import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, MessageSquare, AlertCircle, ArrowRight, CornerUpLeft } from 'lucide-react';
import { contentService } from '../lib/supabaseClient';
import { CreativeBadge } from '../components/CreativeBadge';
import { DynamicIcon } from '../components/DynamicIcon';

interface ContactPageProps {
  onNavigate?: (route: string, slug?: string) => void;
  previousRoute?: string;
  previousSlug?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  previousRoute = 'home',
  previousSlug
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Educational Collaboration (Eusatis Mind)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automated return navigation countdown
  const [countdown, setCountdown] = useState(3);
  const [autoRedirectActive, setAutoRedirectActive] = useState(true);

  // Friendly name for previous page
  const getDestinationLabel = (route: string): string => {
    switch (route) {
      case 'mind':
        return 'Eusatis Mind Lessons';
      case 'mind-detail':
        return 'Lesson Simulation';
      case 'talks':
        return 'Beyoutiful Talks';
      case 'impact':
        return 'Eusatis Impact';
      case 'impact-detail':
        return 'Impact Stories';
      case 'about':
        return 'About Eusatis';
      case 'home':
      default:
        return 'Home Page';
    }
  };

  const destinationLabel = getDestinationLabel(previousRoute);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await contentService.submitContact({
        name,
        email,
        subject,
        message
      });
      setIsSuccess(true);
      setCountdown(3);
      setAutoRedirectActive(true);
    } catch {
      setErrorMsg('Message transmission encountered an issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Automated return timer after form submission
  useEffect(() => {
    if (!isSuccess || !autoRedirectActive || !onNavigate) return;

    if (countdown <= 0) {
      onNavigate(previousRoute, previousSlug);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSuccess, autoRedirectActive, countdown, onNavigate, previousRoute, previousSlug]);

  const handleReturnImmediately = () => {
    if (onNavigate) {
      onNavigate(previousRoute, previousSlug);
    }
  };

  const handleStayAndReset = () => {
    setAutoRedirectActive(false);
    setName('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <CreativeBadge label="GET IN TOUCH" theme="cyan" size="md" />
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] text-[#1F272A] tracking-tight">
          Connect With Eusatis
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          Whether you represent an institution interested in learning resources, want to propose a guest for Beyoutiful Talks, or wish to partner on community impact initiatives, we welcome your voice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-2 font-['Outfit']">
                    Your Name <span className="text-[#D67546]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-2 font-['Outfit']">
                    Email Address <span className="text-[#D67546]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-2 font-['Outfit']">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] bg-white text-slate-800 font-medium"
                >
                  <option value="Educational Collaboration (Eusatis Mind)">
                    Educational Collaboration (Eusatis Mind)
                  </option>
                  <option value="Beyoutiful Talks Guest / Topic Proposal">
                    Beyoutiful Talks Guest / Topic Proposal
                  </option>
                  <option value="Eusatis Impact Community Partnership">
                    Eusatis Impact Community Partnership
                  </option>
                  <option value="Press & General Inquiries">
                    Press & General Inquiries
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-black text-slate-700 uppercase tracking-wider mb-2 font-['Outfit']">
                  Message <span className="text-[#D67546]">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help or collaborate? Please share your details..."
                  className="w-full px-4 py-3 text-sm sm:text-base rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#47C3D3] text-slate-900"
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 text-rose-800 text-xs sm:text-sm rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-[#1F272A] hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 cursor-pointer font-['Outfit'] uppercase tracking-wider"
              >
                {isSubmitting ? 'Transmitting Message...' : 'Send Message to Eusatis'}
              </button>
            </form>
          ) : (
            <div className="py-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-slate-900 tracking-tight">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Your communication has been dispatched to our team. We review all educational and community inquiries with utmost care.
                </p>
              </div>

              {/* Automated Return Notice Box */}
              {autoRedirectActive ? (
                <div className="p-5 rounded-2xl bg-[#47C3D3]/10 border border-[#47C3D3]/30 max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-center text-xs sm:text-sm font-black text-[#0F6F7B] font-['Outfit'] uppercase tracking-[0.2em]">
                    <span>Automating back to {destinationLabel} in {countdown}s...</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-[#47C3D3] to-[#D6A348] h-full transition-all duration-1000 ease-linear rounded-full"
                      style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={handleReturnImmediately}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#1F272A] hover:bg-slate-800 text-white transition-all cursor-pointer font-['Outfit']"
                    >
                      <span>Return to {destinationLabel} Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setAutoRedirectActive(false)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <span>Stay on Contact</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={handleStayAndReset}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer font-['Outfit']"
                  >
                    <CornerUpLeft className="w-4 h-4" />
                    <span>Send Another Message</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Contact Details & Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Phone & WhatsApp Communication Box */}
          <div className="bg-[#FAF7F5] rounded-3xl border-2 border-amber-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#B47818] font-['Outfit'] block">
                Direct Contact Lines
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#1F272A] mt-1">
                Reach Our Team Directly
              </h3>
            </div>

            <div className="space-y-4">
              {/* Call Us Section */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#0891B2] transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#47C3D3]/15 text-[#0891B2] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs">
                    <DynamicIcon id="contact_phone" className="w-5 h-5 text-[#0891B2]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-['Outfit'] block">
                      Call Us On
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-slate-900 font-bold font-mono text-sm sm:text-base">
                      <a
                        href="tel:+233544272394"
                        className="hover:text-[#0891B2] transition-colors underline decoration-dotted underline-offset-4"
                        title="Call +233544272394"
                      >
                        +233544272394
                      </a>
                      <span className="hidden sm:inline text-slate-400 font-sans">/</span>
                      <a
                        href="tel:+233544916847"
                        className="hover:text-[#0891B2] transition-colors underline decoration-dotted underline-offset-4"
                        title="Call +233544916847"
                      >
                        +233544916847
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal pt-0.5">
                      Available Monday – Friday, 8:00 AM – 6:00 PM GMT
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Us Section */}
              <div className="p-4 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/30 shadow-2xs hover:border-[#25D366] transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center shrink-0 aspect-square overflow-hidden shadow-2xs">
                    <DynamicIcon id="contact_whatsapp" className="w-5 h-5 text-[#128C7E]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider font-['Outfit'] block">
                      WhatsApp Us On
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-slate-900 font-bold font-mono text-sm sm:text-base">
                      <a
                        href="https://wa.me/447925136956"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-700 transition-colors underline decoration-dotted underline-offset-4"
                        title="Chat on WhatsApp +447925136956"
                      >
                        +447925136956
                      </a>
                      <span className="hidden sm:inline text-slate-400 font-sans">/</span>
                      <a
                        href="https://wa.me/233544272394"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-700 transition-colors underline decoration-dotted underline-offset-4"
                        title="Chat on WhatsApp +233544272394"
                      >
                        +233544272394
                      </a>
                    </div>
                    <p className="text-[11px] text-emerald-800 font-normal pt-0.5">
                      Fast mobile messaging & instant collaboration
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Channels */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#0891B2] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-slate-500 font-['Outfit']">
                      General & Academic Inquiries
                    </div>
                    <a
                      href="mailto:contact@eusatis.org"
                      className="text-slate-900 hover:text-[#0891B2] font-bold text-sm sm:text-base transition-colors"
                    >
                      contact@eusatis.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <MessageSquare className="w-5 h-5 text-[#B47818] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-xs uppercase tracking-wider text-slate-500 font-['Outfit']">
                      Beyoutiful Talks Production
                    </div>
                    <a
                      href="mailto:talks@eusatis.org"
                      className="text-slate-900 hover:text-[#B47818] font-bold text-sm sm:text-base transition-colors"
                    >
                      talks@eusatis.org
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/80">
              <div className="text-xs font-black uppercase tracking-widest text-[#B47818] font-['Outfit'] mb-2">
                Our Response Standard
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every inquiry is reviewed by academic and community leads. We aim to respond to collaboration proposals within 2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
