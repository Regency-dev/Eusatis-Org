import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  LearningResource,
  PodcastEpisode,
  ImpactStory,
  ContactSubmission,
  NewsletterSubscriber,
  VolunteerApplication
} from '../types';
import {
  INITIAL_LEARNING_RESOURCES,
  INITIAL_PODCAST_EPISODES,
  INITIAL_IMPACT_STORIES
} from '../data/initialData';

// Canonical Eusatis Supabase Project configuration
const DEFAULT_SUPABASE_URL = "https://rwjfxzylfcxibdfkcbaz.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3amZ4enlsZmN4aWJkZmtjYmF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NzgxNTEsImV4cCI6MjEwODQ1NDE1MX0.0Mizb3xPzYzwHmY7592lgvDg1RD-RYvItxnc1LURUlU";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Clean up any trailing /rest/v1 or trailing slashes automatically
export const supabaseUrl = (rawSupabaseUrl || '')
  .trim()
  .replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '');

export const supabaseAnonKey = (rawSupabaseAnonKey || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('example')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Local storage fallback keys for sandbox & preview mode
const STORAGE_KEYS = {
  RESOURCES: 'eusatis_learning_resources_v2',
  EPISODES: 'eusatis_podcast_episodes_v1',
  STORIES: 'eusatis_impact_stories_v1',
  CONTACTS: 'eusatis_contact_submissions_v1',
  SUBSCRIBERS: 'eusatis_newsletter_subscribers_v1',
  VOLUNTEERS: 'eusatis_volunteer_applications_v1'
};

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}`, err);
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}`, err);
  }
}

// Initialize seed data in local store if empty
if (typeof window !== 'undefined') {
  try {
    const storedRes = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, []);
    if (!storedRes || storedRes.length === 0) {
      setLocal(STORAGE_KEYS.RESOURCES, INITIAL_LEARNING_RESOURCES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EPISODES)) {
      setLocal(STORAGE_KEYS.EPISODES, INITIAL_PODCAST_EPISODES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      setLocal(STORAGE_KEYS.STORIES, INITIAL_IMPACT_STORIES);
    }
  } catch (err) {
    console.warn('Error syncing initial storage', err);
  }
}

export const contentService = {
  // --- LEARNING RESOURCES ---
  async getLearningResources(onlyPublished = true): Promise<LearningResource[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('learning_resources').select('*');
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (!error && data) {
        const existingIds = new Set(data.map((d: any) => d.id));
        const missingInitial = INITIAL_LEARNING_RESOURCES.filter(
          (init) => !existingIds.has(init.id) && (!onlyPublished || init.status === 'published')
        );
        return [...data, ...missingInitial] as LearningResource[];
      }
      console.warn('Supabase fetch failed, falling back to cached store:', error?.message);
    }
    const all = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_LEARNING_RESOURCES);
    return onlyPublished ? all.filter((r) => r.status === 'published') : all;
  },

  async getLearningResourceBySlug(slug: string): Promise<LearningResource | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as LearningResource;
    }
    const all = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_LEARNING_RESOURCES);
    return all.find((r) => r.slug === slug) || INITIAL_LEARNING_RESOURCES.find((r) => r.slug === slug) || null;
  },

  async saveLearningResource(resource: Partial<LearningResource>): Promise<LearningResource> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Real database persistence requires a connected Supabase database.');
    }

    // Require valid authenticated session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: You must be signed in with an authorized Supabase administrator account to modify learning resources.');
    }

    const now = new Date().toISOString();

    // Prepare payload without wiping fields that are undefined in partial updates
    const payload: Record<string, any> = {
      updated_at: now
    };

    if (resource.id) payload.id = resource.id;
    if (resource.title !== undefined) payload.title = resource.title;
    if (resource.slug !== undefined) payload.slug = resource.slug;
    if (resource.summary !== undefined) payload.summary = resource.summary;
    if (resource.content !== undefined) payload.content = resource.content;
    if (resource.subject !== undefined) payload.subject = resource.subject;
    if (resource.category !== undefined) payload.category = resource.category;
    if (resource.tags !== undefined) payload.tags = resource.tags;
    if (resource.learner_level !== undefined) payload.learner_level = resource.learner_level;
    if (resource.featured_image !== undefined) payload.featured_image = resource.featured_image;
    if (resource.reading_time_minutes !== undefined) payload.reading_time_minutes = resource.reading_time_minutes;
    if (resource.video_url !== undefined) payload.video_url = resource.video_url;
    if (resource.author !== undefined) payload.author = resource.author;
    if (resource.status !== undefined) payload.status = resource.status;
    if (resource.meta_title !== undefined) payload.meta_title = resource.meta_title;
    if (resource.meta_description !== undefined) payload.meta_description = resource.meta_description;
    if (resource.learning_objectives !== undefined) payload.learning_objectives = resource.learning_objectives;
    if (resource.worked_examples !== undefined) payload.worked_examples = resource.worked_examples;
    if (resource.knowledge_checks !== undefined) payload.knowledge_checks = resource.knowledge_checks;
    if (resource.faqs !== undefined) payload.faqs = resource.faqs;
    if (resource.simulation !== undefined) payload.simulation = resource.simulation;

    // Fill defaults only when creating a new record
    if (!resource.id) {
      payload.created_at = now;
      payload.tags = payload.tags || [];
      payload.learning_objectives = payload.learning_objectives || [];
      payload.worked_examples = payload.worked_examples || [];
      payload.knowledge_checks = payload.knowledge_checks || [];
      payload.faqs = payload.faqs || [];
      payload.status = payload.status || 'published';
      payload.author = payload.author || 'Eusatis Academic Team';
      payload.reading_time_minutes = payload.reading_time_minutes ?? 5;
    }

    const { data, error } = await supabase
      .from('learning_resources')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) {
      throw new Error(`Database error saving lesson: ${error.message} (${error.code || 'UNKNOWN'})`);
    }

    if (!data || data.length === 0) {
      throw new Error(
        `Save rejected: No record returned from database. Please verify your administrator session and database permissions.`
      );
    }

    return data[0] as LearningResource;
  },

  async deleteLearningResource(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: You must be signed in with an authorized Supabase administrator account to delete lessons.');
    }

    const { error, count } = await supabase
      .from('learning_resources')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw new Error(`Database error deleting lesson: ${error.message}`);
    if (count === 0) {
      throw new Error(`Delete failed: No lesson found with ID "${id}".`);
    }
  },

  // --- PODCAST EPISODES ---
  async getPodcastEpisodes(onlyPublished = true): Promise<PodcastEpisode[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('podcast_episodes').select('*');
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      query = query.order('episode_number', { ascending: false });
      const { data, error } = await query;
      if (!error && data) {
        const existingIds = new Set(data.map((d: any) => d.id));
        const missingInitial = INITIAL_PODCAST_EPISODES.filter(
          (init) => !existingIds.has(init.id) && (!onlyPublished || init.status === 'published')
        );
        return [...data, ...missingInitial] as PodcastEpisode[];
      }
    }
    const all = getLocal<PodcastEpisode[]>(STORAGE_KEYS.EPISODES, INITIAL_PODCAST_EPISODES);
    return onlyPublished ? all.filter((e) => e.status === 'published') : all;
  },

  async getPodcastEpisodeBySlug(slug: string): Promise<PodcastEpisode | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('podcast_episodes')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as PodcastEpisode;
    }
    const all = getLocal<PodcastEpisode[]>(STORAGE_KEYS.EPISODES, INITIAL_PODCAST_EPISODES);
    return all.find((e) => e.slug === slug) || INITIAL_PODCAST_EPISODES.find((e) => e.slug === slug) || null;
  },

  async savePodcastEpisode(episode: Partial<PodcastEpisode>): Promise<PodcastEpisode> {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: You must be signed in with an authorized Supabase administrator account to modify podcast episodes.');
    }

    const now = new Date().toISOString();
    const payload: Record<string, any> = {
      updated_at: now
    };

    if (episode.id) payload.id = episode.id;
    if (episode.episode_number !== undefined) payload.episode_number = episode.episode_number;
    if (episode.title !== undefined) payload.title = episode.title;
    if (episode.slug !== undefined) payload.slug = episode.slug;
    if (episode.summary !== undefined) payload.summary = episode.summary;
    if (episode.description !== undefined) payload.description = episode.description;
    if (episode.guest_name !== undefined) payload.guest_name = episode.guest_name;
    if (episode.guest_role !== undefined) payload.guest_role = episode.guest_role;
    if (episode.audio_url !== undefined) payload.audio_url = episode.audio_url;
    if (episode.video_url !== undefined) payload.video_url = episode.video_url;
    if (episode.cover_image !== undefined) payload.cover_image = episode.cover_image;
    if (episode.duration_minutes !== undefined) payload.duration_minutes = episode.duration_minutes;
    if (episode.transcript !== undefined) payload.transcript = episode.transcript;
    if (episode.tags !== undefined) payload.tags = episode.tags;
    if (episode.status !== undefined) payload.status = episode.status;
    if (episode.published_at !== undefined) payload.published_at = episode.published_at;

    if (!episode.id) {
      payload.created_at = now;
      payload.published_at = payload.published_at || now;
      payload.status = payload.status || 'published';
      payload.tags = payload.tags || [];
      payload.duration_minutes = payload.duration_minutes || 30;
      payload.description = payload.description || payload.summary || '';
    }

    const { data, error } = await supabase
      .from('podcast_episodes')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw new Error(`Database error saving episode: ${error.message}`);
    if (!data || data.length === 0) {
      throw new Error('Save rejected: No record returned from database.');
    }
    return data[0] as PodcastEpisode;
  },

  async deletePodcastEpisode(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase is not configured.');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const { error, count } = await supabase
      .from('podcast_episodes')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw new Error(`Database error deleting episode: ${error.message}`);
    if (count === 0) throw new Error(`Delete failed: No episode found with ID "${id}".`);
  },

  // --- IMPACT STORIES ---
  async getImpactStories(onlyPublished = true): Promise<ImpactStory[]> {
    if (isSupabaseConfigured() && supabase) {
      let query = supabase.from('impact_stories').select('*');
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (!error && data) {
        const existingIds = new Set(data.map((d: any) => d.id));
        const missingInitial = INITIAL_IMPACT_STORIES.filter(
          (init) => !existingIds.has(init.id) && (!onlyPublished || init.status === 'published')
        );
        return [...data, ...missingInitial] as ImpactStory[];
      }
    }
    const all = getLocal<ImpactStory[]>(STORAGE_KEYS.STORIES, INITIAL_IMPACT_STORIES);
    return onlyPublished ? all.filter((s) => s.status === 'published') : all;
  },

  async getImpactStoryBySlug(slug: string): Promise<ImpactStory | null> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('impact_stories')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as ImpactStory;
    }
    const all = getLocal<ImpactStory[]>(STORAGE_KEYS.STORIES, INITIAL_IMPACT_STORIES);
    return all.find((s) => s.slug === slug) || INITIAL_IMPACT_STORIES.find((s) => s.slug === slug) || null;
  },

  async saveImpactStory(story: Partial<ImpactStory>): Promise<ImpactStory> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase is not configured.');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const now = new Date().toISOString();
    const payload: Record<string, any> = {
      updated_at: now
    };

    if (story.id) payload.id = story.id;
    if (story.title !== undefined) payload.title = story.title;
    if (story.slug !== undefined) payload.slug = story.slug;
    if (story.category !== undefined) payload.category = story.category;
    if (story.summary !== undefined) payload.summary = story.summary;
    if (story.full_story !== undefined) payload.full_story = story.full_story;
    if (story.location !== undefined) payload.location = story.location;
    if (story.featured_image !== undefined) payload.featured_image = story.featured_image;
    if (story.video_url !== undefined) payload.video_url = story.video_url;
    if (story.gallery_images !== undefined) payload.gallery_images = story.gallery_images;
    if (story.project_date !== undefined) payload.project_date = story.project_date;
    if (story.outcomes !== undefined) payload.outcomes = story.outcomes;
    if (story.partner_names !== undefined) payload.partner_names = story.partner_names;
    if (story.status !== undefined) payload.status = story.status;
    if (story.published_at !== undefined) payload.published_at = story.published_at;

    if (!story.id) {
      payload.created_at = now;
      payload.published_at = payload.published_at || now;
      payload.status = payload.status || 'published';
      payload.gallery_images = payload.gallery_images || [];
      payload.outcomes = payload.outcomes || [];
      payload.partner_names = payload.partner_names || [];
    }

    const { data, error } = await supabase
      .from('impact_stories')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw new Error(`Database error saving impact story: ${error.message}`);
    if (!data || data.length === 0) {
      throw new Error('Save rejected: No record returned from database.');
    }
    return data[0] as ImpactStory;
  },

  async deleteImpactStory(id: string): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) throw new Error('Supabase is not configured.');
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error('Unauthorized: Admin authentication required.');
    }

    const { error, count } = await supabase
      .from('impact_stories')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw new Error(`Database error deleting story: ${error.message}`);
    if (count === 0) throw new Error(`Delete failed: No story found with ID "${id}".`);
  },

  // --- AUTOMATIC SEED SYNC TO PERSIST INITIAL CONTENT IN POSTGRESQL ---
  async syncMissingInitialDataToSupabase(): Promise<{
    syncedResources: number;
    syncedEpisodes: number;
    syncedStories: number;
  }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { syncedResources: 0, syncedEpisodes: 0, syncedStories: 0 };
    }
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      return { syncedResources: 0, syncedEpisodes: 0, syncedStories: 0 };
    }

    let syncedResources = 0;
    let syncedEpisodes = 0;
    let syncedStories = 0;

    try {
      // 1. Check and sync learning resources
      const { data: dbResources } = await supabase.from('learning_resources').select('id');
      const existingResourceIds = new Set((dbResources || []).map((r: any) => r.id));
      const missingResources = INITIAL_LEARNING_RESOURCES.filter((r) => !existingResourceIds.has(r.id));
      if (missingResources.length > 0) {
        const { error: rErr } = await supabase.from('learning_resources').upsert(missingResources, { onConflict: 'id' });
        if (!rErr) syncedResources = missingResources.length;
      }

      // 2. Check and sync podcast episodes
      const { data: dbEpisodes } = await supabase.from('podcast_episodes').select('id');
      const existingEpisodeIds = new Set((dbEpisodes || []).map((e: any) => e.id));
      const missingEpisodes = INITIAL_PODCAST_EPISODES.filter((e) => !existingEpisodeIds.has(e.id));
      if (missingEpisodes.length > 0) {
        const { error: eErr } = await supabase.from('podcast_episodes').upsert(missingEpisodes, { onConflict: 'id' });
        if (!eErr) syncedEpisodes = missingEpisodes.length;
      }

      // 3. Check and sync impact stories
      const { data: dbStories } = await supabase.from('impact_stories').select('id');
      const existingStoryIds = new Set((dbStories || []).map((s: any) => s.id));
      const missingStories = INITIAL_IMPACT_STORIES.filter((s) => !existingStoryIds.has(s.id));
      if (missingStories.length > 0) {
        const { error: sErr } = await supabase.from('impact_stories').upsert(missingStories, { onConflict: 'id' });
        if (!sErr) syncedStories = missingStories.length;
      }
    } catch (err) {
      console.warn('Initial data sync notice:', err);
    }

    return { syncedResources, syncedEpisodes, syncedStories };
  },

  // --- CONTACT SUBMISSIONS ---
  async submitContact(data: { name: string; email: string; subject: string; message: string }): Promise<void> {
    const submission: ContactSubmission = {
      id: 'msg-' + Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      status: 'unread'
    };
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('contact_submissions').insert([submission]);
      if (error) console.error('Supabase contact submission error:', error);
    }
    const existing = getLocal<ContactSubmission[]>(STORAGE_KEYS.CONTACTS, []);
    existing.unshift(submission);
    setLocal(STORAGE_KEYS.CONTACTS, existing);
  },

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as ContactSubmission[];
    }
    return getLocal<ContactSubmission[]>(STORAGE_KEYS.CONTACTS, []);
  },

  // --- NEWSLETTER SUBSCRIPTIONS ---
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const trimmed = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      throw new Error('Please enter a valid email address.');
    }

    const subscriberRecord = {
      email: trimmed,
      consent_given: true,
      status: 'active'
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([subscriberRecord]);

      if (error) {
        // PostgreSQL unique violation code 23505
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('duplicate key') ||
          error.message?.toLowerCase().includes('unique constraint')
        ) {
          return {
            success: true,
            message: 'You are already registered for Eusatis educational updates.'
          };
        }
        throw new Error(`Unable to complete subscription: ${error.message}`);
      }

      // Sync local cache
      const existing = getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
      if (!existing.some((s) => s.email === trimmed)) {
        existing.unshift({
          id: 'sub-' + Date.now(),
          email: trimmed,
          consent_given: true,
          subscribed_at: new Date().toISOString(),
          status: 'active'
        });
        setLocal(STORAGE_KEYS.SUBSCRIBERS, existing);
      }

      return {
        success: true,
        message: 'Thank you for subscribing to Eusatis updates.'
      };
    }

    // Local fallback when Supabase is not configured
    const existing = getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
    if (existing.some((s) => s.email === trimmed)) {
      return { success: true, message: 'You are already registered for Eusatis educational updates.' };
    }
    const localSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email: trimmed,
      consent_given: true,
      subscribed_at: new Date().toISOString(),
      status: 'active'
    };
    existing.unshift(localSub);
    setLocal(STORAGE_KEYS.SUBSCRIBERS, existing);
    return { success: true, message: 'Thank you for subscribing to Eusatis updates.' };
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (!error && data) {
        setLocal(STORAGE_KEYS.SUBSCRIBERS, data);
        return data as NewsletterSubscriber[];
      }
      if (error) {
        console.warn('Notice loading newsletter subscribers from database:', error.message);
      }
    }
    return getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
  },

  async deleteNewsletterSubscriber(id: string): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      if (error) throw new Error(`Failed to delete subscriber: ${error.message}`);
    }
    const existing = getLocal<NewsletterSubscriber[]>(STORAGE_KEYS.SUBSCRIBERS, []);
    setLocal(STORAGE_KEYS.SUBSCRIBERS, existing.filter((s) => s.id !== id));
  },

  // --- VOLUNTEER SUBMISSIONS ---
  async submitVolunteer(data: { name: string; email: string; initiative: string; skills: string; availability?: string }): Promise<void> {
    const app: VolunteerApplication = {
      id: 'vol-' + Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured() && supabase) {
      await supabase.from('volunteer_applications').insert([app]);
    }
    const existing = getLocal<VolunteerApplication[]>(STORAGE_KEYS.VOLUNTEERS, []);
    existing.unshift(app);
    setLocal(STORAGE_KEYS.VOLUNTEERS, existing);
  }
};

export interface AdminSessionState {
  authenticated: boolean;
  userEmail?: string;
  userId?: string;
  error?: string;
}

// Administrator authentication service backed strictly by Supabase Auth
export const adminAuth = {
  /**
   * Retrieves active Supabase Auth session
   */
  async getAdminSession(): Promise<AdminSessionState> {
    if (!isSupabaseConfigured() || !supabase) {
      return { authenticated: false, error: 'Supabase client is not configured.' };
    }
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        return { authenticated: false };
      }
      return {
        authenticated: true,
        userEmail: data.session.user.email,
        userId: data.session.user.id
      };
    } catch (err: any) {
      return { authenticated: false, error: err.message };
    }
  },

  /**
   * Authenticates administrator using official Supabase Auth credentials.
   * Public registration is disabled; accounts must be provisioned in the Supabase Dashboard.
   */
  async signIn(credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string; userEmail?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        success: false,
        error: 'Supabase is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
      };
    }

    const email = credentials.email.trim();
    const password = credentials.password;

    if (!email || !password) {
      return { success: false, error: 'Both administrator email and password are required.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        let msg = error.message;
        if (msg.toLowerCase().includes('email not confirmed')) {
          msg = 'Administrator email confirmation is pending in Supabase. Please run the SQL migration or click "Confirm user" in Supabase Dashboard (Authentication > Users).';
        }
        return { success: false, error: msg };
      }

      if (!data.session?.user) {
        return { success: false, error: 'Authentication succeeded but no active session was returned.' };
      }

      return {
        success: true,
        userEmail: data.session.user.email
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication verification failed.' };
    }
  },

  /**
   * Signs out current administrator session from Supabase Auth
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut notice:', err);
      }
    }
  },

  /**
   * Subscribe to Supabase Auth state changes
   */
  onAuthStateChange(callback: (authenticated: boolean, email?: string) => void) {
    if (!isSupabaseConfigured() || !supabase) {
      return { unsubscribe: () => {} };
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(Boolean(session?.user), session?.user?.email);
    });
    return subscription;
  }
};
