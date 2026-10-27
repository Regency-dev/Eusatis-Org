import React, { useState } from 'react';
import { Search, Menu, X, ArrowUpRight } from 'lucide-react';
import { EusatisLogo } from './EusatisLogo';

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

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'mind', label: 'Mind' },
    { id: 'impact', label: 'Impact' },
    { id: 'talks', label: 'Talks' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 single-line links) - Zone 3 (1 primary action) */}
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Single text element / brand wordmark */}
          <div
            onClick={() => handleNav('home')}
            className="cursor-pointer shrink-0 transition-opacity hover:opacity-90"
            title="Eusatis – Home"
          >
            <EusatisLogo variant="main" size="md" />
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 relative cursor-pointer ${
                    isActive
                      ? 'text-[#1F272A] font-semibold'
                      : 'hover:text-[#1F272A]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#47C3D3] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action + Search Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Search website (Cmd+K)"
              aria-label="Open search dialog"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNav('mind')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1F272A] hover:bg-slate-800 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Explore Library</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#47C3D3]" />
            </button>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentRoute === link.id
                  ? 'bg-[#47C3D3]/10 text-[#0891B2] font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 bg-slate-50 cursor-pointer"
            >
              Search Topics
            </button>
            <button
              onClick={() => handleNav('mind')}
              className="flex-1 py-2.5 text-center text-xs font-semibold rounded-xl bg-[#1F272A] text-white cursor-pointer"
            >
              Explore Library
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
