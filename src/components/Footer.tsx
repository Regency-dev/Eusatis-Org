import React, { useState, useRef, useEffect } from 'react';
import { EusatisLogo } from './EusatisLogo';
import { contentService } from '../lib/supabaseClient';
import { ArrowRight, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { LegalModal, LegalDocType } from './LegalModal';
import { useSiteImage } from '../lib/imageManager';
import { DynamicImage } from './DynamicImage';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerRef = useRef<HTMLElement>(null);
  const [patternHeight, setPatternHeight] = useState<number>(12);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('privacy');
  const [appStoreNotification, setAppStoreNotification] = useState<string | null>(null);

  // Dynamic editable footer pictures with resilient local bundled default (never external imgbb)
  const localDefaultBand = '/assets/eusatis-assets-Band-Pattern-Coloured.png';
  const { url: rawFooterBandUrl } = useSiteImage(
    'footer_band_pattern',
    localDefaultBand
  );
  const footerBandUrl = (rawFooterBandUrl && !rawFooterBandUrl.includes('ibb.co') && !rawFooterBandUrl.includes('imgbb.com'))
    ? rawFooterBandUrl
    : localDefaultBand;

  // Auto-dismiss timer for Stay Connected feedback message
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const showStatusMessage = (msg: { type: 'success' | 'error'; text: string }, durationMs = 4500) => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    setStatusMsg(msg);
    statusTimeoutRef.current = setTimeout(() => {
      setStatusMsg(null);
    }, durationMs);
  };

  // Measure footer height dynamically so the band pattern height is strictly 1/60 of footer height
  useEffect(() => {
    const updateHeight = () => {
      if (footerRef.current) {
        const h = footerRef.current.offsetHeight;
        if (h > 0) {
          // Exactly 1/60 of footer height (with min 8px)
          setPatternHeight(Math.max(8, Math.round(h / 60)));
        }
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showStatusMessage({ type: 'error', text: 'Please enter a valid email address.' }, 4000);
      return;
    }
    if (!consent) {
      showStatusMessage({ type: 'error', text: 'Please agree to receive educational updates.' }, 4000);
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await contentService.subscribeNewsletter(email);
      showStatusMessage({ type: 'success', text: res.message }, 5000);
      setEmail('');
    } catch (err: any) {
      showStatusMessage({ type: 'error', text: err.message || 'Subscription failed. Please try again.' }, 4500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLegalDoc = (type: LegalDocType) => {
    setLegalDocType(type);
    setLegalModalOpen(true);
  };

  const handleAppDownload = (platform: string) => {
    setAppStoreNotification(`${platform} mobile application is currently in preview testing. Early access build invites are distributed via newsletter!`);
    setTimeout(() => setAppStoreNotification(null), 4000);
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#1F272A] text-white pb-12 border-t border-slate-800 relative overflow-hidden"
    >
      {/* Brand Band Pattern: Begins at the very start of the footer; height is strictly 1/60 of the footer's total height */}
      <div
        className="w-full overflow-hidden select-none border-b border-slate-800/80 bg-white"
        style={{
          height: `${patternHeight}px`,
          backgroundImage: `url('${footerBandUrl}')`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'left center'
        }}
        role="img"
        aria-label="Eusatis Brand Band Pattern"
      >
        <img
          src={footerBandUrl}
          alt="Eusatis Brand Band Pattern"
          className="sr-only"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <EusatisLogo variant="full" colorMode="white" size="md" />
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm pt-2">
              Eusatis is a purpose-driven education and human-development platform. Making complex ideas intuitive to understand, helping people discover who they are, and turning knowledge into meaningful action.
            </p>
            
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-black tracking-widest text-[#D6A348] uppercase font-['Outfit']">
                UNDERSTAND · BECOME · IMPACT
              </span>
            </div>

            {/* Follow Eusatis: Social Media Channels */}
            <div className="pt-4 space-y-2.5">
              <div className="text-xs font-black text-slate-300 uppercase tracking-widest font-['Outfit']">
                Follow Eusatis
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#47C3D3] hover:text-[#47C3D3] flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                {/* X (formerly Twitter) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#47C3D3] hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on X"
                  aria-label="X Twitter"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#D67546] hover:text-[#D67546] flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on Instagram"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-red-500 hover:text-red-500 flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on YouTube"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#47C3D3] hover:text-[#47C3D3] flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on Facebook"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-[#D6A348] hover:text-[#D6A348] flex items-center justify-center text-slate-300 transition-colors"
                  title="Follow Eusatis on TikTok"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Download the Eusatis App: Google Playstore & AppStore */}
            <div className="pt-4 space-y-2.5">
              <div className="text-xs font-black text-slate-300 uppercase tracking-widest font-['Outfit']">
                Download the Eusatis App
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* App Store Button */}
                <button
                  onClick={() => handleAppDownload('App Store (iOS)')}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-left cursor-pointer shadow-xs"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1.01.08 2.07-.52 2.69-1.27z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">Download on the</div>
                    <div className="text-xs font-bold text-white font-['Outfit'] leading-tight">App Store</div>
                  </div>
                </button>

                {/* Google Playstore Button */}
                <button
                  onClick={() => handleAppDownload('Google Playstore')}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-left cursor-pointer shadow-xs"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.8L13.8 12 3.6 22.2c-.4-.4-.6-1-.6-1.7V3.5c0-.7.2-1.3.6-1.7z"/>
                    <path fill="#FBBC04" d="M17.3 8.6L13.8 12l3.5 3.4 4-2.3c1.1-.6 1.1-1.6 0-2.2l-4-2.3z"/>
                    <path fill="#EA4335" d="M3.6 1.8l10.2 10.2 3.5-3.4L6.1.7c-.9-.6-2-.3-2.5 1.1z"/>
                    <path fill="#34A853" d="M13.8 12L3.6 22.2c.5 1.4 1.6 1.7 2.5 1.1l11.2-6.5-3.5-3.4z"/>
                  </svg>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-none">Get it on</div>
                    <div className="text-xs font-bold text-white font-['Outfit'] leading-tight">Google Play</div>
                  </div>
                </button>
              </div>

              {appStoreNotification && (
                <div className="text-xs p-2.5 rounded-xl bg-slate-900 border border-[#47C3D3] text-[#47C3D3] animate-in fade-in">
                  {appStoreNotification}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: The Three Eusatis Arms */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold font-['Outfit'] tracking-tight text-white text-xl sm:text-2xl">
              The Three Eusatis Arms
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('mind')}
                  className="hover:text-[#47C3D3] transition-colors cursor-pointer text-left font-medium block"
                >
                  Eusatis Mind
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('impact')}
                  className="hover:text-[#D67546] transition-colors cursor-pointer text-left font-medium block"
                >
                  Eusatis Impact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('talks')}
                  className="hover:text-[#D6A348] transition-colors cursor-pointer text-left font-medium block"
                >
                  Beyoutiful Talks
                </button>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.24em] font-['Outfit'] mb-2">
                Disciplines
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>Agriculture & Agronomy</li>
                <li>Engineering Mechanics</li>
                <li>Interdisciplinary Design</li>
                <li>Sciences & Mathematics</li>
              </ul>
            </div>
          </div>

          {/* Column 3: Ecosystem */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold font-['Outfit'] tracking-tight text-white text-xl sm:text-2xl">
              Ecosystem
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium block"
                >
                  About Purpose & Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium block"
                >
                  Contact & Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer text-left font-medium block"
                >
                  The Eusatis Aha Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalDoc('sitemap')}
                  className="hover:text-[#D6A348] transition-colors cursor-pointer text-left font-medium block text-[#D6A348]"
                >
                  Explore Sitemap
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold font-['Outfit'] tracking-tight text-white text-xl sm:text-2xl">
              Stay Connected
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Receive thoughtful educational notes across Agriculture, Engineering, Sciences, and new Beyoutiful Talks conversations directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#47C3D3]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold rounded-xl bg-[#47C3D3] hover:bg-[#3db0bf] text-[#1F272A] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shrink-0 font-['Outfit']"
                >
                  <span>Join</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-[#47C3D3] focus:ring-0"
                />
                <span className="leading-normal">I agree to receive educational notes from Eusatis. No spam, ever.</span>
              </label>

              {statusMsg && (
                <div
                  className={`text-xs p-2.5 rounded-xl flex items-center justify-between gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-1 ${
                    statusMsg.type === 'success'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {statusMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{statusMsg.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
                      setStatusMsg(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Dismiss notice"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>

            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => onNavigate('contact')}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-['Outfit']"
              >
                <span>For direct partnerships and phone assistance, visit Contact & Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#47C3D3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Linkable Legal / Sitemap (Scrapped Clarity & Warmth, STEM Accessibility, Human Development) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Eusatis. All rights reserved. The joy of understanding more.
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => openLegalDoc('privacy')}
              className="hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={() => openLegalDoc('terms')}
              className="hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              Terms of Use
            </button>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              onClick={() => openLegalDoc('sitemap')}
              className="hover:text-white transition-colors cursor-pointer underline-offset-4 hover:underline text-[#D6A348]"
            >
              Sitemap
            </button>
          </div>
        </div>
      </div>

      {/* Official Legal & Sitemap Viewer Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        docType={legalDocType}
        onClose={() => setLegalModalOpen(false)}
        onNavigate={onNavigate}
      />
    </footer>
  );
};
