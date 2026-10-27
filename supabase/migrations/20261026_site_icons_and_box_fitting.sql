-- ==============================================================================
-- EUSATIS MIGRATION: 20261026_site_icons_and_box_fitting.sql
-- Platform: Supabase (PostgreSQL 15+)
-- Run this script in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. SITE ICONS TABLE
CREATE TABLE IF NOT EXISTS public.site_icons (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hero Pathways', 'Core Pillars', 'Academic Subjects', 'Badges & Emblems', 'Contact Channels')),
    description TEXT,
    type TEXT NOT NULL DEFAULT 'lucide' CHECK (type IN ('lucide', 'svg', 'url', 'emblem')),
    value TEXT NOT NULL,
    fallback_lucide TEXT NOT NULL DEFAULT 'Sparkles',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_icons_category ON public.site_icons(category);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.site_icons ENABLE ROW LEVEL SECURITY;

-- Public can view site icons
DROP POLICY IF EXISTS "Public can view site icons" ON public.site_icons;
CREATE POLICY "Public can view site icons"
    ON public.site_icons
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated administrators have full write access
DROP POLICY IF EXISTS "Admins have full access to site icons" ON public.site_icons;
CREATE POLICY "Admins have full access to site icons"
    ON public.site_icons
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. SEED INITIAL SITE ICONS WITH CANONICAL SIZING DEFAULTS
INSERT INTO public.site_icons (id, label, category, description, type, value, fallback_lucide)
VALUES
    ('hero_mind', 'Explore Eusatis Mind (Hero Button)', 'Hero Pathways', 'Icon shown in the principal "Explore Eusatis Mind" hero action button', 'lucide', 'BookOpen', 'BookOpen'),
    ('hero_talks', 'Beyoutiful Talks (Hero Button)', 'Hero Pathways', 'Icon shown in the "Beyoutiful Talks" hero action button', 'lucide', 'Mic', 'Mic'),
    ('hero_impact', 'Eusatis Impact (Hero Button)', 'Hero Pathways', 'Icon shown in the "Eusatis Impact" hero action button', 'lucide', 'Heart', 'Heart'),
    ('pillar_mind', 'Eusatis Mind (Philosophy Pillar)', 'Core Pillars', 'Emblem for the Eusatis Mind educational card in The Eusatis Experience', 'lucide', 'Lightbulb', 'Lightbulb'),
    ('pillar_talks', 'Beyoutiful Talks (Philosophy Pillar)', 'Core Pillars', 'Emblem for the Beyoutiful Talks authenticity card in The Eusatis Experience', 'lucide', 'Compass', 'Compass'),
    ('pillar_impact', 'Eusatis Impact (Philosophy Pillar)', 'Core Pillars', 'Emblem for the Eusatis Impact action card in The Eusatis Experience', 'lucide', 'Users', 'Users'),
    ('subject_agriculture', 'Agriculture Subject Icon', 'Academic Subjects', 'Displayed for Agriculture & Soil Science lessons', 'lucide', 'Sprout', 'Sprout'),
    ('subject_engineering', 'Engineering Subject Icon', 'Academic Subjects', 'Displayed for Structural & Mechanical Engineering lessons', 'lucide', 'Cpu', 'Cpu'),
    ('subject_interdisciplinary', 'Interdisciplinary Subject Icon', 'Academic Subjects', 'Displayed for Biomimicry and cross-disciplinary topics', 'lucide', 'Compass', 'Compass'),
    ('subject_biology', 'Biology Subject Icon', 'Academic Subjects', 'Displayed for Biological and Life Sciences lessons', 'lucide', 'Dna', 'Dna'),
    ('subject_chemistry', 'Chemistry Subject Icon', 'Academic Subjects', 'Displayed for Molecular & Chemical Sciences lessons', 'lucide', 'FlaskConical', 'FlaskConical'),
    ('subject_physics', 'Physics Subject Icon', 'Academic Subjects', 'Displayed for Wave Optics, Mechanics & Classical Physics', 'lucide', 'Atom', 'Atom'),
    ('subject_mathematics', 'Mathematics Subject Icon', 'Academic Subjects', 'Displayed for Geometry, Calculus & Mathematical Algorithms', 'lucide', 'Calculator', 'Calculator'),
    ('badge_emblem', 'Creative Badge Graphic Motif', 'Badges & Emblems', 'The geometric emblem rendered beside uppercase section headers', 'emblem', 'brand_dual_oval', 'Sparkles'),
    ('contact_phone', 'Telephone Call Icon', 'Contact Channels', 'Vector scalable icon for phone lines (+233544272394 / +233544916847)', 'lucide', 'PhoneCall', 'PhoneCall'),
    ('contact_whatsapp', 'WhatsApp Messaging Icon', 'Contact Channels', 'Vector scalable icon for WhatsApp (+447925136956 / +233544272394)', 'svg', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.88-.38-4.13-1.11l-.3-.18-3.07.81.82-2.99-.19-.31a8.19 8.19 0 0 1-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.42.1-.13.19-.48.61-.59.74-.11.13-.22.14-.4.05-.19-.09-.79-.29-1.5-.93-.56-.49-.93-1.11-1.04-1.3-.11-.19-.01-.29.08-.38.08-.08.19-.22.28-.33.09-.11.13-.19.19-.31.06-.13.03-.24-.02-.33-.04-.09-.42-1.01-.58-1.39-.15-.36-.31-.31-.42-.31h-.36c-.13 0-.33.05-.5.24-.17.19-.66.65-.66 1.58s.68 1.83.77 1.96c.09.13 1.33 2.04 3.23 2.86.45.2.8.31 1.08.4.46.15.87.13 1.2.08.37-.06 1.12-.46 1.28-.9.16-.45.16-.83.11-.9-.05-.09-.19-.14-.38-.24z"/></svg>', 'MessageCircle')
ON CONFLICT (id) DO NOTHING;
