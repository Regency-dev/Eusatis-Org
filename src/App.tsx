import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { VolunteerModal } from './components/VolunteerModal';
import { VoiceAccessibilityBar } from './components/VoiceAccessibilityBar';
import { HomePage } from './pages/HomePage';
import { MindPage } from './pages/MindPage';
import { MindDetailPage } from './pages/MindDetailPage';
import { TalksPage } from './pages/TalksPage';
import { ImpactPage } from './pages/ImpactPage';
import { ImpactDetailPage } from './pages/ImpactDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { LearningResource, PodcastEpisode, ImpactStory } from './types';
import { contentService } from './lib/supabaseClient';
import { voiceService } from './lib/voiceAccessibility';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(undefined);
  const [previousRoute, setPreviousRoute] = useState<string>('home');
  const [previousSlug, setPreviousSlug] = useState<string | undefined>(undefined);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Volunteer modal states
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [volunteerModalState, setVolunteerModalState] = useState<{
    isOpen: boolean;
    initiative?: string;
  }>({ isOpen: false });

  // Sync route from URL path or hash on initial load and navigation
  useEffect(() => {
    const parseUrl = () => {
      const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.replace(/^#\/?/, '');

      // Check pathname first, then hash fallback
      const target = pathname || hash;

      if (!target || target === '') {
        setCurrentRoute('home');
        setCurrentSlug(undefined);
        return;
      }

      if (target === 'admin' || target.startsWith('admin/')) {
        setCurrentRoute('admin');
        return;
      }

      if (target.startsWith('mind/')) {
        setCurrentRoute('mind-detail');
        setCurrentSlug(target.replace('mind/', ''));
        return;
      }

      if (target.startsWith('impact/')) {
        setCurrentRoute('impact-detail');
        setCurrentSlug(target.replace('impact/', ''));
        return;
      }

      if (['mind', 'impact', 'talks', 'about', 'contact'].includes(target)) {
        setCurrentRoute(target);
        setCurrentSlug(undefined);
        return;
      }

      // Default to home
      setCurrentRoute('home');
      setCurrentSlug(undefined);
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    window.addEventListener('hashchange', parseUrl);
    return () => {
      window.removeEventListener('popstate', parseUrl);
      window.removeEventListener('hashchange', parseUrl);
    };
  }, []);

  // Fetch initial public published content
  const loadContent = async () => {
    setIsLoading(true);
    try {
      const [r, e, s] = await Promise.all([
        contentService.getLearningResources(true),
        contentService.getPodcastEpisodes(true),
        contentService.getImpactStories(true)
      ]);
      setResources(r);
      setEpisodes(e);
      setStories(s);
    } catch (err) {
      console.error('Failed to load published content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // Global search keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (route: string, slug?: string) => {
    if (route !== currentRoute || slug !== currentSlug) {
      if (currentRoute !== 'contact') {
        setPreviousRoute(currentRoute);
        setPreviousSlug(currentSlug);
      }
    }
    setCurrentRoute(route);
    setCurrentSlug(slug);

    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (slug && route === 'mind-detail') {
      window.history.pushState(null, '', `/mind/${slug}`);
      voiceService.announce(`Navigated to lesson detail page.`, 'navigate');
    } else if (slug && route === 'impact-detail') {
      window.history.pushState(null, '', `/impact/${slug}`);
      voiceService.announce(`Navigated to impact story detail page.`, 'navigate');
    } else if (route === 'home') {
      window.history.pushState(null, '', '/');
      voiceService.announce('Navigated to Eusatis Home: The Joy of Understanding More.', 'navigate');
    } else if (route === 'mind') {
      window.history.pushState(null, '', '/mind');
      voiceService.announce('Navigated to Eusatis Mind educational curriculum. 7 academic disciplines available.', 'navigate');
    } else if (route === 'talks') {
      window.history.pushState(null, '', '/talks');
      voiceService.announce('Navigated to Beyoutiful Talks: Video and Audio Podcast Conversations.', 'navigate');
    } else if (route === 'impact') {
      window.history.pushState(null, '', '/impact');
      voiceService.announce('Navigated to Eusatis Impact: Real-world science and community initiatives.', 'navigate');
    } else if (route === 'about') {
      window.history.pushState(null, '', '/about');
      voiceService.announce('Navigated to About Eusatis: Our Philosophy and Three Arms.', 'navigate');
    } else if (route === 'contact') {
      window.history.pushState(null, '', '/contact');
      voiceService.announce('Navigated to Contact and Inquiries.', 'navigate');
    } else {
      window.history.pushState(null, '', `/${route}`);
      voiceService.announce(`Navigated to ${route}.`, 'navigate');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on private admin route, render isolated Admin interface
  if (currentRoute === 'admin') {
    return (
      <AdminPage
        onNavigateHome={() => navigate('home')}
        onRefreshData={loadContent}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1F272A] font-['Plus_Jakarta_Sans'] selection:bg-[#47C3D3]/20">
      {/* Public Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(r) => navigate(r)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={navigate}
            resources={resources}
            episodes={episodes}
            stories={stories}
            onOpenVolunteer={(initiative) =>
              setVolunteerModalState({ isOpen: true, initiative })
            }
          />
        )}

        {currentRoute === 'mind' && (
          <MindPage resources={resources} onNavigate={navigate} />
        )}

        {currentRoute === 'mind-detail' && currentSlug && (
          <MindDetailPage
            slug={currentSlug}
            resources={resources}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'talks' && (
          <TalksPage episodes={episodes} onNavigate={navigate} />
        )}

        {currentRoute === 'impact' && (
          <ImpactPage
            stories={stories}
            onNavigate={navigate}
            onOpenVolunteer={(initiative) =>
              setVolunteerModalState({ isOpen: true, initiative })
            }
          />
        )}

        {currentRoute === 'impact-detail' && currentSlug && (
          <ImpactDetailPage
            slug={currentSlug}
            stories={stories}
            onNavigate={navigate}
            onOpenVolunteer={(initiative) =>
              setVolunteerModalState({ isOpen: true, initiative })
            }
          />
        )}

        {currentRoute === 'about' && <AboutPage onNavigate={navigate} />}

        {currentRoute === 'contact' && (
          <ContactPage
            onNavigate={navigate}
            previousRoute={previousRoute}
            previousSlug={previousSlug}
          />
        )}
      </main>

      {/* Public Footer */}
      <Footer onNavigate={navigate} />

      {/* Site-wide Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Community Volunteer Modal */}
      <VolunteerModal
        isOpen={volunteerModalState.isOpen}
        onClose={() => setVolunteerModalState({ isOpen: false })}
        defaultInitiative={volunteerModalState.initiative}
      />

      {/* Floating Voice Accessibility & Screen Reader Engine */}
      <VoiceAccessibilityBar currentRoute={currentRoute} />
    </div>
  );
}
