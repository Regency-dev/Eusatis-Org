import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Volume2, VolumeX } from 'lucide-react';
import { EusatisLogo } from './EusatisLogo';
import { voiceService, VoiceState } from '../lib/voiceAccessibility';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>(voiceService.getState());

  useEffect(() => {
    const unsub = voiceService.subscribe((state) => setVoiceState(state));
    return () => unsub();
  }, []);

  const navLinks = [
    {
      id: 'home',
      label: 'Home',
      tag: 'Start',
      accentColor: '#1F272A',
      activeClass: 'text-white bg-[#1F272A] border-[#1F272A] font-bold shadow-xs',
      hoverClass: 'hover:text-[#1F272A] hover:bg-[#1F272A]/5',
      dotColor: 'bg-[#D6A348]'
    },
    {
      id: 'mind',
      label: 'Eusatis Mind',
      tag: 'Understand',
      accentColor: '#0891B2',
      activeClass: 'text-[#0891B2] bg-[#47C3D3]/18 border-[#47C3D3]/50 font-bold shadow-xs shadow-[#47C3D3]/20',
      hoverClass: 'hover:text-[#0891B2] hover:bg-[#47C3D3]/10',
      dotColor: 'bg-[#47C3D3]'
    },
    {
      id: 'talks',
      label: 'Beyoutiful Talks',
      tag: 'Become',
      accentColor: '#B47818',
      activeClass: 'text-[#9A6408] bg-[#D6A348]/20 border-[#D6A348]/50 font-bold shadow-xs shadow-[#D6A348]/20',
      hoverClass: 'hover:text-[#B47818] hover:bg-[#D6A348]/10',
      dotColor: 'bg-[#D6A348]'
    },
    {
      id: 'impact',
      label: 'Eusatis Impact',
      tag: 'Impact',
      accentColor: '#D67546',
      activeClass: 'text-[#C35B2B] bg-[#D67546]/20 border-[#D67546]/50 font-bold shadow-xs shadow-[#D67546]/20',
      hoverClass: 'hover:text-[#D67546] hover:bg-[#D67546]/10',
      dotColor: 'bg-[#D67546]'
    },
    {
      id: 'about',
      label: 'About',
      tag: 'Philosophy',
      accentColor: '#1F272A',
      activeClass: 'text-white bg-[#1F272A] border-[#1F272A] font-bold shadow-xs',
      hoverClass: 'hover:text-[#1F272A] hover:bg-slate-100',
      dotColor: 'bg-[#47C3D3]'
    },
    {
      id: 'contact',
      label: 'Contact',
      tag: 'Connect',
      accentColor: '#D6A348',
      activeClass: 'text-[#1F272A] bg-[#FAF9F6] border-[#D6A348]/60 font-bold shadow-xs ring-1 ring-[#D6A348]/40',
      hoverClass: 'hover:text-[#1F272A] hover:bg-[#D6A348]/10',
      dotColor: 'bg-[#D67546]'
    }
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#EAE5E7] shadow-xs transition-all relative overflow-hidden">
      {/* 1. Official Eusatis Multi-Tone Chromatic Brand Spectrum Ribbon */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#47C3D3] via-[#D6A348] via-[#D67546] to-[#0891B2] relative shadow-[0_1px_8px_rgba(71,195,211,0.2)]" />

      {/* 2. Soft Ambient Jewel-Tone Backlight Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_left,rgba(71,195,211,0.18),transparent_50%),radial-gradient(ellipse_at_top_right,rgba(214,163,72,0.16),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(214,117,70,0.12),transparent_60%)]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Zone 1: Brand Wordmark / Interactive Logo */}
          <div
            onClick={() => handleNav('home')}
            className="cursor-pointer shrink-0 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] flex items-center gap-3 group"
            title="Eusatis – The Joy of Understanding More"
          >
            <EusatisLogo variant="main" size="md" />
            <span className="hidden xl:inline-block text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 border-l border-slate-200 pl-3 font-['Outfit'] group-hover:text-[#0891B2] transition-colors">
              The Joy of Understanding More
            </span>
          </div>

          {/* Zone 2: Vibrant Multi-Color Navigation Planes with Brand Accents */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold font-['Outfit']">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? `${link.activeClass} scale-[1.02]`
                      : `border-transparent text-slate-700 ${link.hoverClass}`
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-transform duration-200 shrink-0 ${link.dotColor} ${
                      isActive ? 'scale-125 shadow-xs' : 'opacity-60'
                    }`}
                  />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tablet Nav fallback (sm-md) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 text-xs font-semibold font-['Outfit']">
            {navLinks.slice(0, 5).map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    isActive
                      ? `${link.activeClass}`
                      : `border-transparent text-slate-700 ${link.hoverClass}`
                  }`}
                >
                  {link.id === 'home' ? 'Home' : link.id.charAt(0).toUpperCase() + link.id.slice(1)}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive Action Hub & Search Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Voice Accessibility Trigger Button */}
            <button
              onClick={() => voiceService.toggleVoiceMode()}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-2xs group focus:ring-4 focus:ring-[#47C3D3] focus:outline-hidden ${
                voiceState.enabled
                  ? 'bg-[#D6A348]/20 border-[#D6A348]/60 text-[#9A6408] font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-[#47C3D3] text-slate-700'
              }`}
              title="Voice Accessibility Mode (Alt+V)"
              aria-label={voiceState.enabled ? 'Voice Mode is active. Click or press Alt+V to disable' : 'Turn on Voice Accessibility Mode (Alt+V)'}
              aria-pressed={voiceState.enabled}
            >
              {voiceState.enabled ? (
                <Volume2 className="w-4 h-4 text-[#9A6408] animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-[#0891B2]" />
              )}
              <span className="hidden xl:inline text-xs font-semibold font-['Outfit']">
                {voiceState.enabled ? 'Voice On' : 'Voice'}
              </span>
              <kbd className="hidden 2xl:inline-block px-1 py-0.5 text-[9px] font-mono text-slate-400 bg-white rounded border border-slate-200">
                Alt+V
              </kbd>
            </button>

            {/* Search Trigger with brand hover */}
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-700 hover:text-slate-900 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#47C3D3] transition-all cursor-pointer shadow-2xs group"
              title="Search educational topics, podcasts & stories (Cmd+K)"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#0891B2] transition-colors" />
              <span className="hidden sm:inline text-xs font-medium text-slate-600 font-['Outfit']">
                Search
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-50 rounded border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Brand Action CTA: No icons beside Explore Eusatis Mind */}
            <button
              onClick={() => handleNav('mind')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold font-['Outfit'] text-white bg-linear-to-r from-[#1F272A] via-[#0891B2] to-[#1F272A] hover:from-[#0891B2] hover:via-[#47C3D3] hover:to-[#D6A348] hover:text-[#1F272A] rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#47C3D3]/20 cursor-pointer whitespace-nowrap shrink-0 border border-[#47C3D3]/30 tracking-wide"
            >
              <span>Explore Eusatis Mind</span>
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-slate-700 hover:text-slate-900 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Vibrant Styled Rows */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2.5 shadow-xl animate-in slide-in-from-top-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 pt-1">
            Navigation Planes & Destinations
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold font-['Outfit'] transition-all cursor-pointer border ${
                    isActive
                      ? `${link.activeClass}`
                      : 'text-slate-700 hover:bg-slate-50 border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${link.dotColor} shrink-0`} />
                    <span>{link.label}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-normal">
                    {link.tag}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-bold font-['Outfit'] rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer"
            >
              Search Topics
            </button>
            <button
              onClick={() => handleNav('mind')}
              className="flex-1 py-2.5 text-center text-xs font-bold font-['Outfit'] rounded-xl bg-linear-to-r from-[#1F272A] to-[#0891B2] text-white shadow-sm cursor-pointer"
            >
              Explore Library
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
