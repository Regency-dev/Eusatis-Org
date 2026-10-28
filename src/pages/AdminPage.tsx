import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Mic,
  Heart,
  Mail,
  Users,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Image as ImageIcon,
  UploadCloud,
  Link as LinkIcon
} from 'lucide-react';
import { EusatisLogo } from '../components/EusatisLogo';
import { DynamicIcon } from '../components/DynamicIcon';
import { DynamicImage } from '../components/DynamicImage';
import { iconManager, SiteIconConfig, useAllSiteIcons, DEFAULT_SITE_ICONS } from '../lib/iconManager';
import {
  imageManager,
  SiteImageConfig,
  useAllSiteImages,
  DEFAULT_SITE_IMAGES
} from '../lib/imageManager';
import {
  LearningResource,
  PodcastEpisode,
  ImpactStory,
  ContactSubmission,
  NewsletterSubscriber,
  Subject,
  LearnerLevel,
  PublicationStatus
} from '../types';
import { contentService, adminAuth, isSupabaseConfigured } from '../lib/supabaseClient';
import { storageService } from '../lib/storageService';

interface AdminPageProps {
  onNavigateHome: () => void;
  onRefreshData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome, onRefreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('regencyasieduemma@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'mind' | 'talks' | 'impact' | 'icons' | 'images' | 'contacts' | 'subscribers' | 'database'
  >('overview');

  // Data states
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Site icons state & editor
  const siteIcons = useAllSiteIcons();
  const [editingIcon, setEditingIcon] = useState<SiteIconConfig | null>(null);
  const [iconFormType, setIconFormType] = useState<'lucide' | 'svg' | 'url'>('lucide');
  const [iconFormValue, setIconFormValue] = useState<string>('');
  const [iconUploadLoading, setIconUploadLoading] = useState<boolean>(false);
  const [iconUploadError, setIconUploadError] = useState<string | null>(null);

  const PRESET_ICONS = [
    'BookOpen', 'Sparkles', 'Lightbulb', 'Compass', 'Users', 'Heart', 'Mic',
    'Sprout', 'Cpu', 'Atom', 'Dna', 'FlaskConical', 'Calculator', 'Binary',
    'GraduationCap', 'School', 'Globe', 'Layers', 'Eye', 'Shield', 'PhoneCall',
    'MessageCircle', 'CheckCircle', 'Flame', 'Sun', 'Target', 'Feather', 'Award', 'Zap'
  ];

  // Site images state & upload editor
  const siteImages = useAllSiteImages();
  const [editingImage, setEditingImage] = useState<SiteImageConfig | null>(null);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [imageFormUrl, setImageFormUrl] = useState<string>('');
  const [imageFormAlt, setImageFormAlt] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const BRAND_IMAGE_PRESETS = [
    {
      name: 'STEM Education & Lab',
      url: '/assets/images/eusatis_stem_learning_1792624719640.jpg',
      category: 'Science & Education'
    },
    {
      name: 'Beyoutiful Talks Studio',
      url: '/assets/images/eusatis_talks_studio_1792624720801.jpg',
      category: 'Podcast & Reflection'
    },
    {
      name: 'Impact Community Outreach',
      url: '/assets/images/eusatis_impact_community_1792624720900.jpg',
      category: 'Community & Society'
    },
    {
      name: 'Aha Moment of Discovery',
      url: '/assets/images/eusatis_aha_moment_1792624721004.jpg',
      category: 'Discovery & Insight'
    },
    {
      name: 'Brand Band Pattern (Coloured)',
      url: '/assets/eusatis-assets-Band-Pattern-Coloured.png',
      category: 'Official Brand Asset'
    }
  ];

  // Modal editor states
  const [editingResource, setEditingResource] = useState<Partial<LearningResource> | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<Partial<PodcastEpisode> | null>(null);
  const [editingStory, setEditingStory] = useState<Partial<ImpactStory> | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'resource' | 'episode' | 'story';
    id: string;
    title: string;
  } | null>(null);

  // Notification message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check auth session on load and listen to auth changes
  useEffect(() => {
    adminAuth.getAdminSession().then((session) => {
      setIsAuthenticated(session.authenticated);
      if (session.userEmail) setAdminEmail(session.userEmail);
      if (session.authenticated) {
        fetchAllData();
      } else {
        setIsLoading(false);
      }
    });

    const subscription = adminAuth.onAuthStateChange((authenticated, email) => {
      setIsAuthenticated(authenticated);
      if (email) setAdminEmail(email);
      if (authenticated) {
        fetchAllData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Sync any initial materials into Supabase so all existing lessons, episodes, and stories are editable
      await contentService.syncMissingInitialDataToSupabase();

      const [r, e, s, c, sub] = await Promise.all([
        contentService.getLearningResources(false),
        contentService.getPodcastEpisodes(false),
        contentService.getImpactStories(false),
        contentService.getContactSubmissions(),
        contentService.getNewsletterSubscribers()
      ]);
      setResources(r);
      setEpisodes(e);
      setStories(s);
      setContacts(c);
      setSubscribers(sub);
    } catch (err: any) {
      console.error('Error fetching admin data', err);
      showFeedback(`Notice loading admin data: ${err.message || 'Check connection'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await adminAuth.signIn({
        email: emailInput,
        password: passwordInput
      });
      if (res.success) {
        setIsAuthenticated(true);
        if (res.userEmail) setAdminEmail(res.userEmail);
        setPasswordInput('');
        await fetchAllData();
      } else {
        setAuthError(res.error || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication verification failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await adminAuth.signOut();
    setIsAuthenticated(false);
    setAdminEmail('');
  };

  // Save Learning Resource
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editingResource.title) return;
    try {
      const saved = await contentService.saveLearningResource(editingResource);
      // Update local state with returned saved record from Supabase
      setResources((prev) => {
        const idx = prev.findIndex((r) => r.id === saved.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingResource(null);
      showFeedback('Learning resource successfully saved and persisted to database.');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      console.error('Error saving resource:', err);
      showFeedback(err.message || 'Failed to save learning resource.', 'error');
    }
  };

  // Save Podcast Episode
  const handleSaveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEpisode || !editingEpisode.title) return;
    try {
      const saved = await contentService.savePodcastEpisode(editingEpisode);
      setEpisodes((prev) => {
        const idx = prev.findIndex((ep) => ep.id === saved.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingEpisode(null);
      showFeedback('Podcast episode saved successfully.');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      console.error('Error saving episode:', err);
      showFeedback(err.message || 'Failed to save episode.', 'error');
    }
  };

  // Save Impact Story
  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory || !editingStory.title) return;
    try {
      const saved = await contentService.saveImpactStory(editingStory);
      setStories((prev) => {
        const idx = prev.findIndex((st) => st.id === saved.id);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      setEditingStory(null);
      showFeedback('Impact story saved successfully.');
      fetchAllData();
      onRefreshData();
    } catch (err: any) {
      console.error('Error saving story:', err);
      showFeedback(err.message || 'Failed to save impact story.', 'error');
    }
  };

  // Perform confirmed deletion
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      if (deleteConfirmation.type === 'resource') {
        await contentService.deleteLearningResource(deleteConfirmation.id);
      } else if (deleteConfirmation.type === 'episode') {
        await contentService.deletePodcastEpisode(deleteConfirmation.id);
      } else if (deleteConfirmation.type === 'story') {
        await contentService.deleteImpactStory(deleteConfirmation.id);
      }
      showFeedback(`${deleteConfirmation.title} deleted successfully.`);
      setDeleteConfirmation(null);
      fetchAllData();
      onRefreshData();
    } catch {
      showFeedback('Failed to delete item.', 'error');
    }
  };

  // Toggle publish status helper
  const handleToggleResourceStatus = async (item: LearningResource) => {
    const nextStatus: PublicationStatus = item.status === 'published' ? 'draft' : 'published';
    await contentService.saveLearningResource({ ...item, status: nextStatus });
    showFeedback(`Resource status changed to ${nextStatus}.`);
    fetchAllData();
    onRefreshData();
  };

  const handleToggleEpisodeStatus = async (item: PodcastEpisode) => {
    const nextStatus: PublicationStatus = item.status === 'published' ? 'draft' : 'published';
    await contentService.savePodcastEpisode({ ...item, status: nextStatus });
    showFeedback(`Episode status changed to ${nextStatus}.`);
    fetchAllData();
    onRefreshData();
  };

  const handleToggleStoryStatus = async (item: ImpactStory) => {
    const nextStatus: PublicationStatus = item.status === 'published' ? 'draft' : 'published';
    await contentService.saveImpactStory({ ...item, status: nextStatus });
    showFeedback(`Impact story status changed to ${nextStatus}.`);
    fetchAllData();
    onRefreshData();
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove ${email} from the subscriber list?`)) return;
    try {
      await contentService.deleteNewsletterSubscriber(id);
      showFeedback(`Removed ${email} from subscriber list.`);
      fetchAllData();
    } catch (err: any) {
      showFeedback(err.message || 'Failed to remove subscriber.', 'error');
    }
  };

  // Icon management handlers
  const handleOpenEditIcon = (icon: SiteIconConfig) => {
    setEditingIcon(icon);
    setIconFormType(icon.type === 'emblem' ? 'lucide' : icon.type);
    setIconFormValue(icon.value);
    setIconUploadError(null);
  };

  const handleIconFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIconUploadLoading(true);
    setIconUploadError(null);
    try {
      showFeedback('Processing icon file...', 'success');
      const processed = await iconManager.processUploadedIconFile(file);
      if (processed.type === 'url') {
        try {
          const uploadedUrl = await storageService.uploadMediaFile(file, 'site');
          setIconFormType('url');
          setIconFormValue(uploadedUrl);
          showFeedback('Icon image uploaded to Supabase Storage!');
        } catch {
          setIconFormType('url');
          setIconFormValue(processed.value);
          showFeedback('Icon processed locally!');
        }
      } else {
        setIconFormType('svg');
        setIconFormValue(processed.value);
        showFeedback('SVG vector icon processed and auto-fitted!');
      }
    } catch (err: any) {
      setIconUploadError(err.message || 'Failed to process icon file.');
      showFeedback(err.message || 'Icon processing failed', 'error');
    } finally {
      setIconUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleSaveIcon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIcon) return;
    try {
      await iconManager.update(editingIcon.id, {
        type: iconFormType,
        value: iconFormValue
      });
      showFeedback(`Successfully updated icon "${editingIcon.label}"`);
      setEditingIcon(null);
    } catch (err: any) {
      showFeedback(`Failed to update icon: ${err.message}`, 'error');
    }
  };

  const handleResetIcon = async (id: string, label: string) => {
    await iconManager.reset(id);
    showFeedback(`Restored "${label}" to brand default`);
  };

  const handleResetAllIcons = async () => {
    if (window.confirm('Reset all website icons to original brand defaults?')) {
      await iconManager.resetAll();
      showFeedback('All website icons restored to defaults.');
    }
  };

  // Picture & Media Handlers
  const handleOpenEditImage = (img: SiteImageConfig) => {
    setEditingImage(img);
    setImageFormUrl(img.currentUrl);
    setImageFormAlt(img.altText);
    setImageInputMode('upload');
    setFileError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setIsProcessingFile(true);
    setFileError(null);
    try {
      showFeedback('Uploading picture to Supabase Storage...', 'success');
      const uploadedUrl = await storageService.uploadMediaFile(file, 'site');
      setImageFormUrl(uploadedUrl);
      showFeedback('Picture uploaded to Supabase Storage!');
    } catch (err: any) {
      console.warn('Storage upload error, attempting local optimization fallback:', err);
      try {
        const dataUrl = await imageManager.processUploadedFile(file);
        setImageFormUrl(dataUrl);
        showFeedback(`Image processed locally (${err.message})`, 'error');
      } catch (e: any) {
        setFileError('Failed to process image: ' + err.message);
      }
    } finally {
      setIsProcessingFile(false);
      e.target.value = '';
    }
  };

  const handleModalImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: 'lessons' | 'episodes' | 'stories' | 'site',
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file (PNG, JPG, WebP, SVG).', 'error');
      return;
    }

    try {
      setIsProcessingFile(true);
      showFeedback('Uploading cover picture to Supabase Storage...', 'success');
      const uploadedUrl = await storageService.uploadMediaFile(file, folder);
      onSuccess(uploadedUrl);
      showFeedback('Cover picture uploaded to persistent Supabase Storage!');
    } catch (err: any) {
      console.warn('Storage upload error, attempting optimized fallback:', err);
      try {
        const fallbackDataUrl = await imageManager.processUploadedFile(file);
        onSuccess(fallbackDataUrl);
        showFeedback(
          `Image processed locally (${err.message}). For cloud persistence, ensure the Supabase Storage bucket is created.`,
          'error'
        );
      } catch {
        showFeedback(`Failed to process image: ${err.message}`, 'error');
      }
    } finally {
      setIsProcessingFile(false);
      e.target.value = '';
    }
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;
    if (!imageFormUrl.trim()) {
      setFileError('Please upload an image file or enter an image URL.');
      return;
    }

    try {
      await imageManager.updateImage(editingImage.id, imageFormUrl.trim(), imageFormAlt.trim());
      showFeedback(`Successfully updated picture for "${editingImage.label}" across website.`);
      setEditingImage(null);
      setImageFormUrl('');
      setImageFormAlt('');
      setFileError(null);
      onRefreshData();
    } catch (err: any) {
      setFileError(err.message || 'Failed to save picture.');
    }
  };

  const handleResetImage = async (id: string, label: string) => {
    await imageManager.reset(id);
    showFeedback(`Restored "${label}" picture to brand default`);
    onRefreshData();
  };

  const handleResetAllImages = async () => {
    if (window.confirm('Reset all website pictures (Hero, Navigation planes, Footer) to original brand defaults?')) {
      await imageManager.resetAll();
      showFeedback('All website pictures restored to defaults.');
      onRefreshData();
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F272A] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-700">
          <div className="text-center space-y-3 mb-8">
            <EusatisLogo variant="monogram" size="lg" className="mx-auto" />
            <h1 className="text-2xl font-bold font-['Outfit'] text-slate-900 tracking-tight">
              Eusatis Private Portal
            </h1>
            <p className="text-xs text-slate-500">
              Authorized content management and database governance
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@eusatis.org"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-[#1F272A] bg-[#47C3D3] hover:bg-[#3db0bf] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isLoggingIn ? 'Authenticating with Supabase...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1 leading-relaxed">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure Administrator Access</span>
            </div>
            <p>
              Authentication is validated directly by Supabase Auth with Row-Level Security. Administrator accounts are created in your Supabase Dashboard (<span className="font-mono text-slate-600">Authentication &rarr; Users</span>). Public registration is disabled.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>RLS Protected</span>
            </span>
            <button
              onClick={onNavigateHome}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Back to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1F272A] text-white p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <EusatisLogo variant="main" colorMode="white" size="sm" />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D6A348] text-[#1F272A] font-bold">
                ADMIN
              </span>
            </div>
            {adminEmail && (
              <div className="text-[11px] text-slate-400 font-mono truncate">
                <span className="text-slate-500">User:</span> {adminEmail}
              </div>
            )}
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('mind')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'mind'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Eusatis Mind ({resources.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('talks')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'talks'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Beyoutiful Talks ({episodes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'impact'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Eusatis Impact ({stories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('icons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D6A348]" />
              <span>Icons & Emblems ({Object.keys(siteIcons).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'images'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#47C3D3]" />
              <span>Pictures & Media ({Object.keys(siteImages).length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'contacts'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Messages ({contacts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'subscribers'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Newsletter ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[#47C3D3] text-[#1F272A]'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Supabase & Vercel</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top notification toast */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Status Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Database Engine:{' '}
                {isSupabaseConfigured()
                  ? 'Supabase Cloud (PostgreSQL)'
                  : 'AI Studio Development Sandbox (Local Persistence)'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isSupabaseConfigured()
                  ? 'Connected with Row Level Security (RLS) enforcement.'
                  : 'Full CRUD operations active with local persistence. Ready for Supabase link.'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('database')}
            className="text-xs font-semibold text-[#0891B2] hover:underline cursor-pointer"
          >
            View Connection Details →
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                Eusatis Administrative Overview
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Summary of published knowledge, episodes, community projects, and public submissions.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Mind Lessons</span>
                  <BookOpen className="w-4 h-4 text-[#47C3D3]" />
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900">
                  {resources.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {resources.filter((r) => r.status === 'published').length} published
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Talks Episodes</span>
                  <Mic className="w-4 h-4 text-[#D6A348]" />
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900">
                  {episodes.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {episodes.filter((e) => e.status === 'published').length} published
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Impact Stories</span>
                  <Heart className="w-4 h-4 text-[#D67546]" />
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900">
                  {stories.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {stories.filter((s) => s.status === 'published').length} published
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Contact Inquiries</span>
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold font-mono text-slate-900">
                  {contacts.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {subscribers.length} newsletter subscribers
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold font-['Outfit'] text-slate-900">
                Quick Content Management
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingResource({
                      title: '',
                      slug: '',
                      summary: '',
                      content: '',
                      subject: 'Agriculture',
                      category: 'Soil Science',
                      tags: ['Agriculture', 'Soil Science'],
                      learner_level: 'Lower Secondary (JHS / KS3)',
                      reading_time_minutes: 5,
                      author: 'Eusatis Academic Faculty',
                      status: 'published'
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#47C3D3] text-[#1F272A] hover:bg-[#3db0bf] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Mind Lesson</span>
                </button>

                <button
                  onClick={() => {
                    const nextNum =
                      episodes.reduce((m, ep) => Math.max(m, ep.episode_number), 0) + 1;
                    setEditingEpisode({
                      episode_number: nextNum,
                      title: '',
                      slug: '',
                      summary: '',
                      description: '',
                      audio_url: 'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
                      duration_minutes: 30,
                      tags: ['Authenticity'],
                      status: 'published'
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#D6A348]/20 text-[#1F272A] border border-[#D6A348]/40 hover:bg-[#D6A348]/30 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Podcast Episode</span>
                </button>

                <button
                  onClick={() => {
                    setEditingStory({
                      title: '',
                      slug: '',
                      category: 'Educational Outreach',
                      summary: '',
                      full_story: '',
                      location: '',
                      project_date: 'Fall 2026',
                      outcomes: [{ metric: '100+', label: 'Participants' }],
                      partner_names: [],
                      status: 'published'
                    });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#D67546]/10 text-[#D67546] border border-[#D67546]/30 hover:bg-[#D67546]/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Impact Story</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EUSATIS MIND */}
        {activeTab === 'mind' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Eusatis Mind Resources ({resources.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage published STEM lessons, worked examples, and learning objectives.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingResource({
                    title: '',
                    slug: '',
                    summary: '',
                    content: '',
                    subject: 'Agriculture',
                    category: 'Agronomy',
                    tags: ['Agriculture'],
                    learner_level: 'Lower Secondary (JHS / KS3)',
                    reading_time_minutes: 5,
                    author: 'Eusatis Academic Faculty',
                    status: 'published'
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#47C3D3] text-[#1F272A] hover:bg-[#3db0bf] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Lesson</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Title & Subject</th>
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Read Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {resources.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {item.subject} · {item.category}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.learner_level}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {item.reading_time_minutes} min
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleResourceStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {item.status === 'published' ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          <span className="capitalize">{item.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingResource(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'resource',
                              id: item.id,
                              title: item.title
                            })
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BEYOUTIFUL TALKS */}
        {activeTab === 'talks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Beyoutiful Talks Episodes ({episodes.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish episodes, transcripts, guest profiles, and audio links.
                </p>
              </div>
              <button
                onClick={() => {
                  const nextNum =
                    episodes.reduce((m, ep) => Math.max(m, ep.episode_number), 0) + 1;
                  setEditingEpisode({
                    episode_number: nextNum,
                    title: '',
                    slug: '',
                    summary: '',
                    description: '',
                    audio_url: 'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
                    duration_minutes: 30,
                    tags: ['Authenticity'],
                    status: 'published'
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D6A348] text-[#1F272A] hover:bg-[#c2923c] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Episode</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Ep #</th>
                    <th className="py-3.5 px-4">Episode Title</th>
                    <th className="py-3.5 px-4">Guest</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {episodes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        #{item.episode_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.summary}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.guest_name ? `${item.guest_name}` : 'Solo Host'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {item.duration_minutes} min
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleEpisodeStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span className="capitalize">{item.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingEpisode(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'episode',
                              id: item.id,
                              title: item.title
                            })
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EUSATIS IMPACT */}
        {activeTab === 'impact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Eusatis Impact Stories ({stories.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Document community projects, school partnerships, and verified outcomes.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingStory({
                    title: '',
                    slug: '',
                    category: 'Educational Outreach',
                    summary: '',
                    full_story: '',
                    location: '',
                    project_date: 'Spring 2026',
                    outcomes: [{ metric: '100+', label: 'Students' }],
                    partner_names: [],
                    status: 'published'
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#D67546] text-white hover:bg-[#c26538] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Impact Project</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Project & Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stories.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.category}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.location || 'Regional'}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStoryStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                            item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <span className="capitalize">{item.status}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingStory(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              type: 'story',
                              id: item.id,
                              title: item.title
                            })
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT INQUIRIES */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                Contact Inquiries ({contacts.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Confidential inquiries from schools, prospective guests, and community partners.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No inquiries received yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {contacts.map((c) => (
                    <div key={c.id} className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {c.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            &lt;{c.email}&gt;
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#0891B2] mb-1">
                        Subject: {c.subject}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {c.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                    Newsletter Subscribers
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#47C3D3]/20 text-[#0891B2]">
                    {subscribers.length} {subscribers.length === 1 ? 'Subscriber' : 'Subscribers'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Verified audience registered via public website footer for STEM notes and Beyoutiful Talks updates.
                </p>
              </div>

              <button
                onClick={fetchAllData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs font-['Outfit'] shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Refresh Subscribers</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
              {subscribers.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 font-['Outfit']">
                    No Subscribers Registered Yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When visitors enter their email into the website footer subscription form, their records will persist securely in Supabase and display here.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3.5 px-5">Subscriber Email</th>
                      <th className="py-3.5 px-5">Subscription Date</th>
                      <th className="py-3.5 px-5">Status</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subscribers.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-mono font-semibold text-slate-800 text-xs">
                              {s.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                          {new Date(s.subscribed_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{s.status || 'active'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(s.id, s.email)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ICONS & BRAND EMBLEMS MANAGER */}
        {activeTab === 'icons' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Website Icons & Brand Emblems
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Customise or replace any vector icon, hero pathway icon, or brand emblem. You can upload or paste custom SVG markup, supply image asset URLs, or pick from our curated icon library.
                </p>
              </div>

              <button
                onClick={handleResetAllIcons}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset All to Defaults</span>
              </button>
            </div>

            {/* Categorized Icon Cards */}
            {(['Hero Pathways', 'Core Pillars', 'Academic Subjects', 'Badges & Emblems', 'Contact Channels'] as const).map((category) => {
              const iconsInCategory = Object.values(siteIcons).filter((i) => i.category === category);
              if (iconsInCategory.length === 0) return null;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#47C3D3]" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 font-['Outfit']">
                      {category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {iconsInCategory.map((icon) => {
                      const isDefault = DEFAULT_SITE_ICONS[icon.id] &&
                        DEFAULT_SITE_ICONS[icon.id].type === icon.type &&
                        DEFAULT_SITE_ICONS[icon.id].value === icon.value;

                      return (
                        <div
                          key={icon.id}
                          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="flex items-start gap-4">
                            {/* Live Icon Visual Stage: Rendered inside canonical container box */}
                            <div className="flex flex-col items-center justify-center gap-1.5 shrink-0">
                              <div
                                className={`flex items-center justify-center shrink-0 aspect-square overflow-hidden border border-slate-200/90 shadow-2xs transition-all ${
                                  icon.defaultDimensions?.boxClassName || 'w-12 h-12 rounded-2xl bg-slate-100'
                                }`}
                                title={`Canonical Box: ${icon.defaultDimensions?.boxDescription || 'Standard Icon Box'}`}
                              >
                                <DynamicIcon id={icon.id} className={icon.defaultDimensions?.className || 'w-6 h-6'} />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {icon.defaultDimensions?.pixelSize || 20}×{icon.defaultDimensions?.pixelSize || 20}px
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-bold text-sm text-slate-900 truncate font-['Outfit']">
                                  {icon.label}
                                </h4>
                                {!isDefault && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6A348]/20 text-[#B47818] font-mono shrink-0">
                                    CUSTOM
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {icon.description}
                              </p>
                              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                                <span className="uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {icon.type}
                                </span>
                                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200/60">
                                  Auto-fit: {icon.defaultDimensions?.boxDescription}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleOpenEditIcon(icon)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1F272A] bg-[#47C3D3] hover:bg-[#3eb0bf] transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Replace / Edit</span>
                            </button>

                            {!isDefault && (
                              <button
                                onClick={() => handleResetIcon(icon.id, icon.label)}
                                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Reset to original brand default"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Default</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 6: PICTURES & MEDIA ASSETS (Hero, Navigation Planes, Footer) */}
        {activeTab === 'images' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                  Hero, Navigation Planes & Footer Pictures
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Upload custom pictures from your computer or provide image URLs for the Hero section, navigation planes, and footer. Changes apply immediately in real time across the website.
                </p>
              </div>

              <button
                onClick={handleResetAllImages}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset All Pictures to Defaults</span>
              </button>
            </div>

            {/* Categorized Pictures Grid: Hero Section, Navigation Planes, Footer & Brand */}
            {[
              {
                categoryKey: 'hero',
                title: 'Hero Section Pictures',
                description: 'Featured visual cards and hero imagery displayed to visitors upon landing.'
              },
              {
                categoryKey: 'navigation',
                title: 'Navigation Planes & Section Showcase Pictures',
                description: 'Pathway preview cards and visual storytelling for Eusatis Mind, Beyoutiful Talks, Impact, Aha Experience, and About.'
              },
              {
                categoryKey: 'footer',
                title: 'Footer & Brand Assets',
                description: 'Official coloured band pattern, decorative emblems, and footer brand identity imagery.'
              }
            ].map(({ categoryKey, title, description }) => {
              const imagesInCategory = Object.values(siteImages).filter((img) => img.category === categoryKey);
              if (imagesInCategory.length === 0) return null;

              return (
                <div key={categoryKey} className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#47C3D3]" />
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 font-['Outfit']">
                        {title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {imagesInCategory.map((img) => {
                      const isDefault =
                        DEFAULT_SITE_IMAGES[img.id] &&
                        DEFAULT_SITE_IMAGES[img.id].currentUrl === img.currentUrl;

                      return (
                        <div
                          key={img.id}
                          className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                        >
                          {/* Image Preview Container */}
                          <div className="relative aspect-[16/10] bg-slate-950/5 overflow-hidden border-b border-slate-100 flex items-center justify-center group">
                            <DynamicImage
                              id={img.id}
                              fallbackSrc={img.defaultUrl}
                              alt={img.altText}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-800 shadow-2xs backdrop-blur-xs font-['Outfit']">
                                {img.aspectRatioLabel || 'Image'}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3">
                              {!isDefault ? (
                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#D6A348] text-[#1F272A] shadow-xs font-mono">
                                  CUSTOM UPLOAD
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900/60 text-white backdrop-blur-xs font-mono">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="font-bold text-base text-slate-900 font-['Outfit']">
                                {img.label}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                {img.locationDescription}
                              </p>
                              <div className="mt-2.5 text-[11px] text-slate-400 font-mono truncate">
                                Alt: <span className="text-slate-600 font-sans italic">{img.altText}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => handleOpenEditImage(img)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1F272A] bg-[#47C3D3] hover:bg-[#3eb0bf] transition-colors cursor-pointer shadow-2xs font-['Outfit']"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Upload / Replace</span>
                              </button>

                              {!isDefault && (
                                <button
                                  onClick={() => handleResetImage(img.id, img.label)}
                                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Restore brand default picture"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Default</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 7: DATABASE & VERCEL DEPLOYMENT GUIDE */}
        {activeTab === 'database' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-slate-900">
                Supabase Architecture & Cloud Integration
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Database schema verification, storage configuration, and administrator identity governance.
              </p>
            </div>

            {/* Live Connection Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#0891B2]" />
                  <span className="font-bold font-['Outfit'] text-slate-900">Active Connection Status</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseConfigured() ? 'SUPABASE CONNECTED' : 'OFFLINE / FALLBACK'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">Authenticated Account</span>
                  <span className="text-slate-800 font-semibold">{adminEmail || 'Not signed in'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block mb-1">Target Media Bucket</span>
                  <span className="text-slate-800 font-semibold">eusatis-media (Public CDN)</span>
                </div>
              </div>
            </div>

            {/* Checklist & Instructions */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Supabase Dashboard Setup Steps</span>
              </div>
              <ol className="space-y-4 text-xs sm:text-sm text-slate-700 list-decimal pl-5 leading-relaxed">
                <li>
                  <strong>Create Administrator Account:</strong> In your Supabase Dashboard, navigate to <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">Authentication &rarr; Users &rarr; Add user &rarr; Create user</span>. Enter your administrator email (e.g. <span className="font-mono text-slate-900">admin@eusatis.org</span>) and choose a secure password. Uncheck &ldquo;Auto Confirm User&rdquo; if you wish to confirm via email, or check it for immediate login.
                </li>
                <li>
                  <strong>Apply SQL Schema & Storage Policies:</strong> Open the Supabase Dashboard <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-900">SQL Editor &rarr; New query</span>, copy and execute the script in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">supabase/migrations/20261025_repair_auth_storage_site_images.sql</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">supabase/migrations/20261026_site_icons_and_box_fitting.sql</code>. This will create the <code className="text-[#0891B2]">site_images</code> and <code className="text-[#0891B2]">site_icons</code> tables, the <code className="text-[#0891B2]">eusatis-media</code> bucket, and configure Row-Level Security policies.
                </li>
                <li>
                  <strong>Verify Row-Level Security (RLS):</strong> Public visitors have read-only access to published lessons, podcast episodes, and impact stories. All write, update, and upload permissions are strictly gated to authenticated Supabase accounts.
                </li>
                <li>
                  <strong>Environment Variables:</strong>
                  <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3.5 rounded-xl mt-2 select-all space-y-1">
                    <div>VITE_SUPABASE_URL=https://rwjfxzylfcxibdfkcbaz.supabase.co</div>
                    <div>VITE_SUPABASE_ANON_KEY=eyJhbGci...</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: EDIT RESOURCE */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingResource(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 mb-4">
              {editingResource.id ? 'Edit Learning Resource' : 'Create Learning Resource'}
            </h3>

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingResource.title || ''}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      title: e.target.value,
                      slug: editingResource.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={editingResource.subject || 'Agriculture'}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, subject: e.target.value as Subject })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Interdisciplinary">Interdisciplinary</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Learner Level
                  </label>
                  <select
                    value={editingResource.learner_level || 'Lower Secondary (JHS / KS3)'}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        learner_level: e.target.value as LearnerLevel
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Primary / Elementary (KS2)">Primary / Elementary (KS2)</option>
                    <option value="Lower Secondary (JHS / KS3)">Lower Secondary (JHS / KS3)</option>
                    <option value="Upper Secondary (SHS / KS4&5)">Upper Secondary (SHS / KS4&5)</option>
                    <option value="Tertiary (University & College)">Tertiary (University & College)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingResource.summary || ''}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Lesson Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingResource.content || ''}
                  onChange={(e) =>
                    setEditingResource({ ...editingResource, content: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              {/* Interactive Simulation Configuration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Interactive Simulation
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Embed an interactive visual sandbox/model into this lesson
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingResource.simulation?.enabled ?? false}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        const current = editingResource.simulation;
                        setEditingResource({
                          ...editingResource,
                          simulation: {
                            enabled,
                            type: current?.type || (editingResource.subject === 'Agriculture' ? 'soil_agriculture' : editingResource.subject === 'Engineering' ? 'beam_engineering' : 'optics'),
                            title: current?.title || `${editingResource.title || 'Lesson'} Simulation`,
                            description: current?.description || 'Interactive parameter explorer for concept verification.',
                            param1Label: current?.param1Label || 'Primary Variable',
                            param1Default: current?.param1Default ?? 50,
                            param1Min: current?.param1Min ?? 0,
                            param1Max: current?.param1Max ?? 100,
                            param1Unit: current?.param1Unit || 'units',
                            param2Label: current?.param2Label,
                            param2Default: current?.param2Default,
                            param2Min: current?.param2Min,
                            param2Max: current?.param2Max,
                            param2Unit: current?.param2Unit,
                            principleNote: current?.principleNote || 'Manipulate the parameters above to verify core principles.'
                          }
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0891B2]"></div>
                  </label>
                </div>

                {editingResource.simulation?.enabled && (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Simulation Model Engine
                      </label>
                      <select
                        value={editingResource.simulation.type}
                        onChange={(e) =>
                          setEditingResource({
                            ...editingResource,
                            simulation: {
                              ...editingResource.simulation!,
                              type: e.target.value as any
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="optics">Light Refraction & Snell's Law (Physics / Optics)</option>
                        <option value="soil_agriculture">Soil Chemistry & Nutrient Bioavailability (Agriculture)</option>
                        <option value="beam_engineering">Euler-Bernoulli Beam Deflection (Engineering / Structures)</option>
                        <option value="photosynthesis">Photosynthetic Photon Flux Saturation (Biology)</option>
                        <option value="geometry">Spiral Phyllotaxis & Golden Ratio (Interdisciplinary / Math)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Simulation Title
                      </label>
                      <input
                        type="text"
                        value={editingResource.simulation.title}
                        onChange={(e) =>
                          setEditingResource({
                            ...editingResource,
                            simulation: {
                              ...editingResource.simulation!,
                              title: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Simulation Instructions / Description
                      </label>
                      <input
                        type="text"
                        value={editingResource.simulation.description}
                        onChange={(e) =>
                          setEditingResource({
                            ...editingResource,
                            simulation: {
                              ...editingResource.simulation!,
                              description: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Param 1 Label
                        </label>
                        <input
                          type="text"
                          value={editingResource.simulation.param1Label}
                          onChange={(e) =>
                            setEditingResource({
                              ...editingResource,
                              simulation: {
                                ...editingResource.simulation!,
                                param1Label: e.target.value
                              }
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Default
                        </label>
                        <input
                          type="number"
                          value={editingResource.simulation.param1Default}
                          onChange={(e) =>
                            setEditingResource({
                              ...editingResource,
                              simulation: {
                                ...editingResource.simulation!,
                                param1Default: Number(e.target.value)
                              }
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Range (Min-Max)
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={editingResource.simulation.param1Min}
                            onChange={(e) =>
                              setEditingResource({
                                ...editingResource,
                                simulation: {
                                  ...editingResource.simulation!,
                                  param1Min: Number(e.target.value)
                                }
                              })
                            }
                            className="w-1/2 px-1.5 py-1.5 rounded-xl border border-slate-200 text-center"
                          />
                          <input
                            type="number"
                            value={editingResource.simulation.param1Max}
                            onChange={(e) =>
                              setEditingResource({
                                ...editingResource,
                                simulation: {
                                  ...editingResource.simulation!,
                                  param1Max: Number(e.target.value)
                                }
                              })
                            }
                            className="w-1/2 px-1.5 py-1.5 rounded-xl border border-slate-200 text-center"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={editingResource.simulation.param1Unit}
                          onChange={(e) =>
                            setEditingResource({
                              ...editingResource,
                              simulation: {
                                ...editingResource.simulation!,
                                param1Unit: e.target.value
                              }
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Core Insight / Pedagogical Note
                      </label>
                      <textarea
                        rows={2}
                        value={editingResource.simulation.principleNote}
                        onChange={(e) =>
                          setEditingResource({
                            ...editingResource,
                            simulation: {
                              ...editingResource.simulation!,
                              principleNote: e.target.value
                            }
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Picture & Video Integration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800 text-xs">
                  Cover Picture (Featured Visual)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <img
                      src={editingResource.featured_image || '/assets/images/eusatis_aha_moment_1792624721004.jpg'}
                      alt="Resource cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0891B2] text-white hover:bg-[#0e7490] transition-colors cursor-pointer font-['Outfit'] shadow-2xs">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Custom Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleModalImageUpload(e, 'lessons', (url) =>
                              setEditingResource({ ...editingResource, featured_image: url })
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingResource({
                            ...editingResource,
                            featured_image: '/assets/images/eusatis_aha_moment_1792624721004.jpg'
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Default</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter direct image URL (https://...)"
                      value={editingResource.featured_image || ''}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, featured_image: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lesson Video URL (YouTube, Vimeo, MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    value={editingResource.video_url || ''}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, video_url: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingResource.status || 'published'}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        status: e.target.value as PublicationStatus
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Private)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Reading Time (Minutes)
                  </label>
                  <input
                    type="number"
                    value={editingResource.reading_time_minutes || 5}
                    onChange={(e) =>
                      setEditingResource({
                        ...editingResource,
                        reading_time_minutes: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#47C3D3] text-[#1F272A] hover:bg-[#3db0bf] cursor-pointer"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PODCAST EPISODE */}
      {editingEpisode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingEpisode(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 mb-4">
              {editingEpisode.id ? 'Edit Beyoutiful Talks Episode' : 'New Episode'}
            </h3>

            <form onSubmit={handleSaveEpisode} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Episode #
                  </label>
                  <input
                    type="number"
                    required
                    value={editingEpisode.episode_number || 1}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        episode_number: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEpisode.title || ''}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        title: e.target.value,
                        slug:
                          editingEpisode.slug ||
                          e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={editingEpisode.guest_name || ''}
                    onChange={(e) =>
                      setEditingEpisode({ ...editingEpisode, guest_name: e.target.value })
                    }
                    placeholder="e.g. Dr. Elena Vance"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Guest Role
                  </label>
                  <input
                    type="text"
                    value={editingEpisode.guest_role || ''}
                    onChange={(e) =>
                      setEditingEpisode({ ...editingEpisode, guest_role: e.target.value })
                    }
                    placeholder="e.g. Cognitive Psychologist"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingEpisode.summary || ''}
                  onChange={(e) =>
                    setEditingEpisode({ ...editingEpisode, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Cover Picture & Video Integration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800 text-xs">
                  Episode Cover Picture (Visual Artwork)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <img
                      src={editingEpisode.cover_image || '/assets/images/eusatis_talks_studio_1792624720801.jpg'}
                      alt="Episode cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D6A348] text-[#1F272A] hover:bg-[#c2923c] transition-colors cursor-pointer font-['Outfit'] shadow-2xs">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Cover Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleModalImageUpload(e, 'episodes', (url) =>
                              setEditingEpisode({ ...editingEpisode, cover_image: url })
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingEpisode({
                            ...editingEpisode,
                            cover_image: '/assets/images/eusatis_talks_studio_1792624720801.jpg'
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Default</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter image URL (https://...)"
                      value={editingEpisode.cover_image || ''}
                      onChange={(e) =>
                        setEditingEpisode({ ...editingEpisode, cover_image: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Video Broadcast URL (YouTube, Vimeo, MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={editingEpisode.video_url || ''}
                    onChange={(e) =>
                      setEditingEpisode({ ...editingEpisode, video_url: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Audio Stream URL
                </label>
                <input
                  type="url"
                  required
                  value={editingEpisode.audio_url || ''}
                  onChange={(e) =>
                    setEditingEpisode({ ...editingEpisode, audio_url: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editingEpisode.status || 'published'}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        status: e.target.value as PublicationStatus
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={editingEpisode.duration_minutes || 30}
                    onChange={(e) =>
                      setEditingEpisode({
                        ...editingEpisode,
                        duration_minutes: Number(e.target.value)
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingEpisode(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#D6A348] text-[#1F272A] hover:bg-[#c2923c] cursor-pointer"
                >
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT IMPACT STORY */}
      {editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStory(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 mb-4">
              {editingStory.id ? 'Edit Impact Initiative' : 'New Impact Initiative'}
            </h3>

            <form onSubmit={handleSaveStory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Initiative Title
                </label>
                <input
                  type="text"
                  required
                  value={editingStory.title || ''}
                  onChange={(e) =>
                    setEditingStory({
                      ...editingStory,
                      title: e.target.value,
                      slug:
                        editingStory.slug ||
                        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingStory.category || 'Educational Outreach'}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Educational Outreach">Educational Outreach</option>
                    <option value="School-Based Projects">School-Based Projects</option>
                    <option value="Hospital & Care Support">Hospital & Care Support</option>
                    <option value="Community Mentorship">Community Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingStory.location || ''}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, location: e.target.value })
                    }
                    placeholder="e.g. Eastern District"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingStory.summary || ''}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Story Documentation
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingStory.full_story || ''}
                  onChange={(e) =>
                    setEditingStory({ ...editingStory, full_story: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>

              {/* Cover Picture & Video Integration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800 text-xs">
                  Initiative Cover Picture (Featured Photo)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <img
                      src={editingStory.featured_image || '/assets/images/eusatis_impact_community_1792624720900.jpg'}
                      alt="Impact initiative preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D67546] text-white hover:bg-[#c26538] transition-colors cursor-pointer font-['Outfit'] shadow-2xs">
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Cover Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleModalImageUpload(e, 'stories', (url) =>
                              setEditingStory({ ...editingStory, featured_image: url })
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingStory({
                            ...editingStory,
                            featured_image: '/assets/images/eusatis_impact_community_1792624720900.jpg'
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Default</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Or enter image URL (https://...)"
                      value={editingStory.featured_image || ''}
                      onChange={(e) =>
                        setEditingStory({ ...editingStory, featured_image: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Documentary Video URL (YouTube, Vimeo, MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={editingStory.video_url || ''}
                    onChange={(e) =>
                      setEditingStory({ ...editingStory, video_url: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-[#D67546] text-white hover:bg-[#c26538] cursor-pointer"
                >
                  Save Impact Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-['Outfit'] text-slate-900">
              Confirm Deletion
            </h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete &ldquo;{deleteConfirmation.title}&rdquo;? This action cannot be reversed.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / REPLACE ICON */}
      {editingIcon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingIcon(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-['Outfit'] text-slate-900 mb-1">
              Replace Website Icon
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Customise <strong className="text-slate-800">{editingIcon.label}</strong>. Choose from our curated vector catalog, paste raw custom SVG markup, or supply an image asset URL.
            </p>

            <form onSubmit={handleSaveIcon} className="space-y-6 text-xs">
              {/* Type Selection */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-2 font-['Outfit']">
                  Icon Source Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIconFormType('lucide');
                      if (!PRESET_ICONS.includes(iconFormValue)) {
                        setIconFormValue(editingIcon.fallbackLucide || 'Sparkles');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                      iconFormType === 'lucide'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Vector Catalog
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconFormType('upload' as any)}
                    className={`py-2 px-2.5 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                      (iconFormType as string) === 'upload'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Upload File
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconFormType('svg')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                      iconFormType === 'svg'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Custom SVG
                  </button>

                  <button
                    type="button"
                    onClick={() => setIconFormType('url')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-center border transition-all cursor-pointer ${
                      iconFormType === 'url'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Asset URL
                  </button>
                </div>
              </div>

              {/* Dynamic Form Control based on selected type */}
              {iconFormType === 'lucide' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Select Icon from Curated Library
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {PRESET_ICONS.map((name) => {
                      const isSelected = iconFormValue === name;
                      const IconComp = (LucideIcons as Record<string, any>)[name] || LucideIcons.Sparkles;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setIconFormValue(name)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#47C3D3]/20 border-[#47C3D3] text-[#0891B2] font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          title={name}
                        >
                          <IconComp className="w-5 h-5 mb-1" />
                          <span className="text-[9px] truncate w-full text-center">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {(iconFormType as string) === 'upload' && (
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-700">
                    Upload Icon File from Computer (SVG, PNG, JPG, WebP)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#47C3D3] transition-colors bg-slate-50/70 flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      id="admin-icon-upload-field"
                      className="hidden"
                      onChange={handleIconFileUpload}
                    />
                    <label
                      htmlFor="admin-icon-upload-field"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1F272A] text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs font-['Outfit']"
                    >
                      <UploadCloud className="w-4 h-4 text-[#47C3D3]" />
                      <span>{iconUploadLoading ? 'Processing & Fitting Icon...' : 'Choose Icon File from Device'}</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Automatically normalized to the exact default size ({editingIcon.defaultDimensions?.pixelSize || 20}×{editingIcon.defaultDimensions?.pixelSize || 20}px) to fit the {editingIcon.defaultDimensions?.boxDescription} perfectly.
                    </p>
                    {iconUploadError && (
                      <p className="text-xs text-rose-600 mt-2 font-medium">{iconUploadError}</p>
                    )}
                  </div>
                </div>
              )}

              {iconFormType === 'svg' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Paste Raw SVG Markup (<code className="text-[#0891B2]">&lt;svg ...&gt;...&lt;/svg&gt;</code>)
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={iconFormValue}
                    onChange={(e) => setIconFormValue(e.target.value)}
                    placeholder='<svg viewBox="0 0 24 24" fill="currentColor"><path d="..."/></svg>'
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-[11px] text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Auto-Fit: Any hardcoded width or height is automatically calibrated to fit the box container.
                  </p>
                </div>
              )}

              {iconFormType === 'url' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Asset Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={iconFormValue}
                    onChange={(e) => setIconFormValue(e.target.value)}
                    placeholder="https://example.com/icons/my-icon.svg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                  />
                </div>
              )}

              {/* Live Preview Stage: Container Box Symmetry */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="font-bold text-xs text-slate-900 font-['Outfit'] uppercase tracking-wider">
                    Box Fit Verification Stage
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    ✓ Auto-Sized to Default ({editingIcon.defaultDimensions?.pixelSize}×{editingIcon.defaultDimensions?.pixelSize}px)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Default in box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      Brand Default Box
                    </span>
                    <div className={`flex items-center justify-center shrink-0 aspect-square overflow-hidden border border-slate-200 shadow-2xs ${
                      editingIcon.defaultDimensions?.boxClassName || 'w-12 h-12 rounded-2xl'
                    }`}>
                      {(() => {
                        const DefComp = (LucideIcons as Record<string, any>)[editingIcon.fallbackLucide || 'Sparkles'] || LucideIcons.Sparkles;
                        return <DefComp className={editingIcon.defaultDimensions?.className || 'w-6 h-6'} />;
                      })()}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">
                      {editingIcon.fallbackLucide}
                    </span>
                  </div>

                  {/* Replacement in same box */}
                  <div className="p-3 rounded-xl bg-white border border-[#47C3D3] shadow-xs flex flex-col items-center justify-center gap-2">
                    <span className="text-[10px] font-bold text-[#0891B2] uppercase tracking-tight">
                      Replacement (Auto-Fitted)
                    </span>
                    <div className={`flex items-center justify-center shrink-0 aspect-square overflow-hidden border border-[#47C3D3]/40 shadow-2xs ${
                      editingIcon.defaultDimensions?.boxClassName || 'w-12 h-12 rounded-2xl'
                    }`}>
                      {iconFormType === 'svg' && iconFormValue.includes('<svg') ? (
                        <span
                          className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block ${editingIcon.defaultDimensions?.className || 'w-6 h-6'}`}
                          dangerouslySetInnerHTML={{ __html: iconFormValue }}
                        />
                      ) : (iconFormType === 'url' || (iconFormType as string) === 'upload') && iconFormValue ? (
                        <span className={`inline-flex items-center justify-center shrink-0 aspect-square overflow-hidden ${editingIcon.defaultDimensions?.className || 'w-6 h-6'}`}>
                          <img src={iconFormValue} alt="Preview" className="w-full h-full max-w-full max-h-full object-contain block shrink-0" />
                        </span>
                      ) : (
                        (() => {
                          const IconComp = (LucideIcons as Record<string, any>)[iconFormValue] || LucideIcons.Sparkles;
                          return <IconComp className={editingIcon.defaultDimensions?.className || 'w-6 h-6'} />;
                        })()
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      Matches Default Exactly
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  Both icons use identical {editingIcon.defaultDimensions?.pixelSize}×{editingIcon.defaultDimensions?.pixelSize}px dimensions and fit the {editingIcon.defaultDimensions?.boxDescription} with identical optical margins.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingIcon(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#1F272A] text-white hover:bg-slate-800 cursor-pointer shadow-sm font-['Outfit'] tracking-wide"
                >
                  Save & Apply Icon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PICTURE & MEDIA UPLOAD / EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0891B2] font-black">
                  {editingImage.category.toUpperCase()} PICTURE
                </span>
                <h3 className="text-xl font-bold font-['Outfit'] text-slate-900">
                  {editingImage.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingImage.locationDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="space-y-5">
              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Picture Source Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageInputMode === 'upload'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageInputMode === 'url'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Image URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageInputMode('presets')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageInputMode === 'presets'
                        ? 'bg-[#1F272A] text-white border-[#1F272A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Brand Library</span>
                  </button>
                </div>
              </div>

              {/* Upload Mode: File Picker */}
              {imageInputMode === 'upload' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Upload Picture from Computer / Device
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-[#47C3D3] rounded-2xl p-6 text-center transition-colors bg-slate-50/60 hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-8 h-8 text-[#0891B2] mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      {isProcessingFile ? 'Optimizing & loading picture...' : 'Click or drag picture here to upload'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports JPG, PNG, WebP, and SVG files. Automatically optimized for web performance.
                    </p>
                  </div>
                </div>
              )}

              {/* URL Mode */}
              {imageInputMode === 'url' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Image Address URL
                  </label>
                  <input
                    type="text"
                    required
                    value={imageFormUrl}
                    onChange={(e) => setImageFormUrl(e.target.value)}
                    placeholder="https://example.com/images/my-picture.jpg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                  />
                  <p className="text-[11px] text-slate-400">
                    Direct web URL or asset path (e.g., hosted on CDN or Cloud Storage).
                  </p>
                </div>
              )}

              {/* Presets Mode */}
              {imageInputMode === 'presets' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Pick from Approved Brand Manual Assets
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {BRAND_IMAGE_PRESETS.map((preset) => {
                      const isSelected = imageFormUrl === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setImageFormUrl(preset.url);
                            setImageFormAlt(`Eusatis ${preset.name}`);
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#47C3D3]/20 border-[#47C3D3] text-[#0891B2] font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">{preset.name}</div>
                            <div className="text-[10px] text-slate-400">{preset.category}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Accessible Alt Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Descriptive Alt Text (For Accessibility & SEO)
                </label>
                <input
                  type="text"
                  required
                  value={imageFormAlt}
                  onChange={(e) => setImageFormAlt(e.target.value)}
                  placeholder="Describe what appears in this picture..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#47C3D3]"
                />
              </div>

              {/* Error notice if any */}
              {fileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Live Preview Stage */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-700">Live Preview Output</div>
                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                  {imageFormUrl ? (
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-900/10">
                      <img
                        src={imageFormUrl}
                        alt={imageFormAlt || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={() => setFileError('Image could not be rendered from the provided source.')}
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white backdrop-blur-xs">
                        Preview: {editingImage.aspectRatioLabel || 'Active Aspect'}
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      No picture selected yet
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingFile || !imageFormUrl}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#1F272A] text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-sm font-['Outfit'] tracking-wide"
                >
                  Save & Apply Picture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

