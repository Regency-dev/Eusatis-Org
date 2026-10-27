-- ==============================================================================
-- EUSATIS MIGRATION: 20261025_repair_auth_storage_site_images.sql
-- Platform: Supabase (PostgreSQL 15+)
-- Run this script in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. SITE IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.site_images (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    location_description TEXT,
    category TEXT NOT NULL DEFAULT 'navigation' CHECK (category IN ('hero', 'navigation', 'footer')),
    current_url TEXT NOT NULL,
    default_url TEXT NOT NULL,
    alt_text TEXT,
    aspect_ratio_label TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_images_category ON public.site_images(category);

-- Enable RLS on site_images
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Public can view site images
DROP POLICY IF EXISTS "Public can view site images" ON public.site_images;
CREATE POLICY "Public can view site images"
    ON public.site_images
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Authenticated admins can update and insert site images
DROP POLICY IF EXISTS "Admins have full access to site images" ON public.site_images;
CREATE POLICY "Admins have full access to site images"
    ON public.site_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed initial default site images if they do not exist
INSERT INTO public.site_images (id, label, location_description, category, current_url, default_url, alt_text, aspect_ratio_label)
VALUES
    (
        'hero_card',
        'Hero Featured Showcase Visual',
        'The large visual card displayed on the right side of the Hero section on the homepage.',
        'hero',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        'Students engaged in learning experiments at Eusatis',
        '4:3 Landscape'
    ),
    (
        'plane_mind',
        'Eusatis Mind Navigation Plane',
        'Featured preview visual for the Eusatis Mind educational resources navigation plane.',
        'navigation',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        'Eusatis Mind interactive educational learning',
        '16:10 Wide'
    ),
    (
        'plane_talks',
        'Beyoutiful Talks Navigation Plane',
        'Featured podcast visual card for Beyoutiful Talks navigation plane.',
        'navigation',
        '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
        '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
        'Beyoutiful Talks podcast recording studio and conversations',
        '16:9 / 4:3'
    ),
    (
        'plane_impact',
        'Eusatis Impact Navigation Plane',
        'Featured community action and stewardship visual for Eusatis Impact.',
        'navigation',
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
        'Eusatis Impact community educational outreach in action',
        '4:3 Landscape'
    ),
    (
        'plane_aha',
        'The Eusatis Aha Experience Visual',
        'Discovery and clarity visual accompanying the interactive Snell refraction stage.',
        'navigation',
        '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
        '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
        'Student experiencing an Aha moment of clarity',
        '4:3 or 16:9'
    ),
    (
        'plane_about',
        'About Page Visual Philosophy Card',
        'Visual showcase displayed alongside the brand philosophy and dual reality metaphor.',
        'navigation',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        'Eusatis purpose, vision, and educational foundation',
        '4:3 Landscape'
    ),
    (
        'footer_band_pattern',
        'Footer Brand Band Pattern (Coloured)',
        'The official repeating coloured band pattern spanning across the top edge of the footer (height 1/20 of footer).',
        'footer',
        'https://i.ibb.co/Z1Bb3LgG/eusatis-assets-Band-Pattern-Coloured.png',
        'https://i.ibb.co/Z1Bb3LgG/eusatis-assets-Band-Pattern-Coloured.png',
        'Official Eusatis Brand Band Pattern Coloured',
        'Repeating Banner Pattern'
    )
ON CONFLICT (id) DO NOTHING;

-- 2. SUPABASE STORAGE BUCKET CONFIGURATION
-- Creates the public media bucket 'eusatis-media' for images & assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'eusatis-media',
    'eusatis-media',
    true,
    10485760, -- 10MB file size limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Storage RLS Policies for 'eusatis-media'
-- Public read access for all objects in 'eusatis-media'
DROP POLICY IF EXISTS "Public can view media assets" ON storage.objects;
CREATE POLICY "Public can view media assets"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'eusatis-media');

-- Authenticated admins can upload objects into 'eusatis-media'
DROP POLICY IF EXISTS "Admins can upload media assets" ON storage.objects;
CREATE POLICY "Admins can upload media assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'eusatis-media');

-- Authenticated admins can update objects in 'eusatis-media'
DROP POLICY IF EXISTS "Admins can update media assets" ON storage.objects;
CREATE POLICY "Admins can update media assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'eusatis-media');

-- Authenticated admins can delete objects in 'eusatis-media'
DROP POLICY IF EXISTS "Admins can delete media assets" ON storage.objects;
CREATE POLICY "Admins can delete media assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'eusatis-media');

-- 3. ENSURE LEARNING RESOURCES RLS IS TIGHT AND CORRECT
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published learning resources" ON public.learning_resources;
CREATE POLICY "Public can view published learning resources"
    ON public.learning_resources
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to learning resources" ON public.learning_resources;
CREATE POLICY "Admins have full access to learning resources"
    ON public.learning_resources
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
