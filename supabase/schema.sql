-- ==============================================================================
-- EUSATIS OFFICIAL SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Platform: Supabase (PostgreSQL 15+)
-- Run this in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1 LEARNING RESOURCES (Eusatis Mind)
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('Biology', 'Chemistry', 'Physics', 'Mathematics', 'Agriculture', 'Engineering', 'Interdisciplinary')),
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    learner_level TEXT NOT NULL DEFAULT 'Lower Secondary (JHS / KS3)' CHECK (learner_level IN (
        'Primary / Elementary (KS2)',
        'Lower Secondary (JHS / KS3)',
        'Upper Secondary (SHS / KS4&5)',
        'Tertiary (University & College)'
    )),
    featured_image TEXT,
    reading_time_minutes INTEGER DEFAULT 5,
    video_url TEXT,
    author TEXT NOT NULL DEFAULT 'Eusatis Academic Team',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    meta_title TEXT,
    meta_description TEXT,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    worked_examples JSONB DEFAULT '[]'::jsonb,
    knowledge_checks JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    simulation JSONB DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_status ON public.learning_resources(status);
CREATE INDEX IF NOT EXISTS idx_learning_resources_subject ON public.learning_resources(subject);
CREATE INDEX IF NOT EXISTS idx_learning_resources_slug ON public.learning_resources(slug);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created_at ON public.learning_resources(created_at DESC);

-- 2.2 PODCAST EPISODES (Beyoutiful Talks / Eusatis Talks)
CREATE TABLE IF NOT EXISTS public.podcast_episodes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    guest_name TEXT,
    guest_role TEXT,
    audio_url TEXT NOT NULL,
    video_url TEXT,
    cover_image TEXT,
    duration_minutes INTEGER DEFAULT 30,
    transcript TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_podcast_episodes_status ON public.podcast_episodes(status);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_number ON public.podcast_episodes(episode_number DESC);
CREATE INDEX IF NOT EXISTS idx_podcast_episodes_slug ON public.podcast_episodes(slug);

-- 2.3 IMPACT STORIES (Eusatis Impact)
CREATE TABLE IF NOT EXISTS public.impact_stories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    full_story TEXT NOT NULL,
    location TEXT,
    featured_image TEXT,
    video_url TEXT,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    project_date TEXT,
    outcomes JSONB DEFAULT '[]'::jsonb,
    partner_names TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_impact_stories_status ON public.impact_stories(status);
CREATE INDEX IF NOT EXISTS idx_impact_stories_slug ON public.impact_stories(slug);
CREATE INDEX IF NOT EXISTS idx_impact_stories_created_at ON public.impact_stories(created_at DESC);

-- 2.4 NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);

-- 2.5 CONTACT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'replied', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- 2.6 VOLUNTEER & PARTICIPATION APPLICATIONS
CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    initiative TEXT NOT NULL,
    skills TEXT NOT NULL,
    availability TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_volunteer_applications_created_at ON public.volunteer_applications(created_at DESC);

-- ==============================================================================
-- 3. AUTO-UPDATE TIMESTAMPS TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_learning_resources ON public.learning_resources;
CREATE TRIGGER set_updated_at_learning_resources
    BEFORE UPDATE ON public.learning_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_podcast_episodes ON public.podcast_episodes;
CREATE TRIGGER set_updated_at_podcast_episodes
    BEFORE UPDATE ON public.podcast_episodes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_impact_stories ON public.impact_stories;
CREATE TRIGGER set_updated_at_impact_stories
    BEFORE UPDATE ON public.impact_stories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- 4.1 LEARNING RESOURCES POLICIES
DROP POLICY IF EXISTS "Public can view published learning resources" ON public.learning_resources;
CREATE POLICY "Public can view published learning resources"
    ON public.learning_resources
    FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to learning resources" ON public.learning_resources;
CREATE POLICY "Admins have full access to learning resources"
    ON public.learning_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4.2 PODCAST EPISODES POLICIES
DROP POLICY IF EXISTS "Public can view published podcast episodes" ON public.podcast_episodes;
CREATE POLICY "Public can view published podcast episodes"
    ON public.podcast_episodes
    FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to podcast episodes" ON public.podcast_episodes;
CREATE POLICY "Admins have full access to podcast episodes"
    ON public.podcast_episodes
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4.3 IMPACT STORIES POLICIES
DROP POLICY IF EXISTS "Public can view published impact stories" ON public.impact_stories;
CREATE POLICY "Public can view published impact stories"
    ON public.impact_stories
    FOR SELECT
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to impact stories" ON public.impact_stories;
CREATE POLICY "Admins have full access to impact stories"
    ON public.impact_stories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4.4 NEWSLETTER SUBSCRIBERS POLICIES
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (true);

-- 4.5 CONTACT SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_submissions;
CREATE POLICY "Public can submit contact messages"
    ON public.contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage contact submissions"
    ON public.contact_submissions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4.6 VOLUNTEER APPLICATIONS POLICIES
DROP POLICY IF EXISTS "Public can submit volunteer applications" ON public.volunteer_applications;
CREATE POLICY "Public can submit volunteer applications"
    ON public.volunteer_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view volunteer applications" ON public.volunteer_applications;
CREATE POLICY "Admins can view volunteer applications"
    ON public.volunteer_applications
    FOR SELECT
    TO authenticated
    USING (true);
