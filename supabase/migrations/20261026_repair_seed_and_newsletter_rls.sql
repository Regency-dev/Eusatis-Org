-- ==============================================================================
-- EUSATIS MIGRATION: 20261026_repair_seed_and_newsletter_rls.sql
-- Purpose:
--   1. Confirm administrator email for regencyasieduemma@gmail.com
--   2. Grant permissions & RLS policies for newsletter_subscribers (anon insert, auth read/manage)
--   3. Seed all initial learning resources (lr-1 to lr-7) in PostgreSQL with ON CONFLICT (id) DO UPDATE
--   4. Seed all initial podcast episodes (ep-1 to ep-3) in PostgreSQL with ON CONFLICT (id) DO UPDATE
--   5. Seed all initial impact stories (imp-1 to imp-3) in PostgreSQL with ON CONFLICT (id) DO UPDATE
-- Platform: Supabase (PostgreSQL 15+)
-- Run this script in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADMINISTRATOR ACCOUNT CONFIRMATION
-- ------------------------------------------------------------------------------
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'regencyasieduemma@gmail.com';

-- ------------------------------------------------------------------------------
-- 2. NEWSLETTER SUBSCRIBERS TABLE & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON public.newsletter_subscribers(subscribed_at DESC);

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can submit their email
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated administrators can view newsletter subscribers
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
    ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated administrators can delete/manage subscriber records
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers"
    ON public.newsletter_subscribers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. SEED ALL LEARNING RESOURCES (MIND: lr-1 through lr-7)
-- ------------------------------------------------------------------------------
INSERT INTO public.learning_resources (
    id, title, slug, summary, content, subject, category, tags,
    learner_level, featured_image, reading_time_minutes, video_url, author,
    status, meta_title, meta_description, learning_objectives, worked_examples,
    knowledge_checks, faqs, simulation, created_at, updated_at
) VALUES
(
    'lr-1',
    'The Optics of Clarity: Refraction and the Science of Light',
    'optics-of-clarity-refraction',
    'Explore how light bends across medium boundaries, and how Snell''s Law reveals the mathematical order hidden within optical complexity.',
    'When light travels from one medium to another—such as from air into water or a glass prism—its velocity changes depending on the optical density of the material. This shift in speed causes the wavefront to change angle, an effect known as refraction.

### The Physics of Snell''s Law
The quantitative relationship governing refraction was formulated by Willebrord Snellius:

$$n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$$

Where:
- $n_1$ and $n_2$ represent the refractive indices of medium 1 and medium 2.
- $\theta_1$ is the angle of incidence measured from the normal.
- $\theta_2$ is the angle of refraction.

### Why Dispersion Occurs
White light consists of multiple wavelengths ranging from approximately 380 nm (violet) to 750 nm (red). Because different wavelengths experience slightly different refractive indices in dense media, shorter wavelengths (violet) refract at steeper angles than longer wavelengths (red). 

Passing light through a triangular prism thus separates chaotic compound light into its distinct, orderly spectral components—a perfect metaphor for how thoughtful inquiry resolves complex confusion into pristine clarity.',
    'Physics',
    'Wave Optics',
    ARRAY['Optics', 'Snell''s Law', 'Refraction', 'Light', 'Electromagnetism'],
    'Lower Secondary (JHS / KS3)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    6,
    'https://www.youtube.com/watch?v=y55tzg_jC9r',
    'Eusatis Physics Faculty',
    'published',
    'The Optics of Clarity – Eusatis Mind',
    'Discover how Snell''s Law and wave refraction transform light from complex chaos to clear spectral focus.',
    '[
        "Define refractive index and identify how it influences wave velocity",
        "Apply Snell''s Law to calculate angles of incidence and refraction",
        "Explain how chromatic dispersion creates spectral separation through glass prisms",
        "Understand total internal reflection and critical angle principles"
    ]'::jsonb,
    '[
        {
            "title": "Calculating the Refraction Angle in Crown Glass",
            "problem": "A ray of monochromatic light in air (n1 = 1.00) strikes a crown glass slab (n2 = 1.52) at an angle of incidence of 30°. What is the angle of refraction inside the glass?",
            "solution": "Applying Snell''s Law: 1.00 * sin(30°) = 1.52 * sin(θ2). Since sin(30°) = 0.50, we have sin(θ2) = 0.50 / 1.52 ≈ 0.3289. Taking arcsin yields θ2 ≈ 19.2°.",
            "keyInsight": "Because crown glass has a higher optical density than air, the refracted ray bends toward the surface normal."
        }
    ]'::jsonb,
    '[
        {
            "question": "What happens to the speed of light as it passes from air into water?",
            "options": [
                "It increases because water is more fluid than air",
                "It decreases because water has a higher optical density than air",
                "It remains constant at 3 × 10⁸ m/s regardless of medium",
                "It drops to zero instantaneously"
            ],
            "correctIndex": 1,
            "explanation": "The speed of light in a refractive medium is given by v = c / n. For water (n ≈ 1.33), light travels at approximately 75% of vacuum speed."
        }
    ]'::jsonb,
    '[
        {
            "question": "Can refraction happen without bending the path of light?",
            "answer": "Yes. If the incident beam enters precisely perpendicular (angle of incidence is 0° along the normal), the speed changes but the path does not bend."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "optics",
        "title": "Snell''s Law Refraction & Dispersion Stage",
        "interactiveParameters": [
            {"name": "n1 (Medium 1)", "value": 1.00, "min": 1.0, "max": 2.5, "step": 0.05, "unit": "index"},
            {"name": "n2 (Medium 2)", "value": 1.52, "min": 1.0, "max": 2.5, "step": 0.05, "unit": "index"},
            {"name": "Incidence Angle", "value": 45, "min": 0, "max": 85, "step": 1, "unit": "deg"}
        ],
        "principleNote": "Observe how increasing the optical density of Medium 2 bends the refracted beam closer to the surface normal."
    }'::jsonb,
    now() - interval '6 days',
    now()
),
(
    'lr-2',
    'Soil Chemistry and Plant Nutrition: The Science of Soil pH and Cation Exchange',
    'soil-chemistry-plant-nutrition',
    'Understand how soil pH, cation exchange capacity (CEC), and nutrient solubility govern agricultural fertility and crop yields.',
    'Soil is not mere inert dirt; it is a chemically active biomatrix teeming with electrostatic charges. The ability of soil particles (clays and organic humus) to hold and release positively charged mineral nutrients (cations) directly dictates agricultural productivity.

### The Mechanics of Cation Exchange Capacity (CEC)
Clay minerals and organic matter possess net negative surface charges. Essential plant macro- and micro-nutrients carry positive ionic charges:
- Calcium ($Ca^{2+}$)
- Magnesium ($Mg^{2+}$)
- Potassium ($K^+$)
- Ammonium ($NH_4^+$)

The Cation Exchange Capacity (CEC) measures the soil''s reservoir capacity to retain these nutrients against water leaching while allowing plant root hairs to absorb them through proton exchange.

### Why Soil pH Dictates Nutrient Availability
At extreme acidic pH values (< 5.0), toxic aluminum ($Al^{3+}$) ions become soluble, stunting root development, while essential phosphorus becomes tightly bound with iron and aluminum precipitates. Conversely, in highly alkaline soils (> 8.0), phosphorus complexes with calcium, and trace elements like iron, zinc, and manganese become insoluble.',
    'Agriculture',
    'Agronomy & Soil Science',
    ARRAY['Soil Science', 'Chemistry', 'Agriculture', 'CEC', 'Plant Nutrition'],
    'Lower Secondary (JHS / KS3)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    7,
    'https://www.youtube.com/watch?v=0hYt5542s04',
    'Eusatis Agricultural Faculty',
    'published',
    'Soil Chemistry & Plant Nutrition – Eusatis Mind',
    'Explore the electrostatic foundations of soil fertility, cation exchange, and pH optimization.',
    '[
        "Explain Cation Exchange Capacity (CEC) and its significance for crop nutrition",
        "Describe how soil pH affects nutrient solubility and root uptake",
        "Identify chemical ameliorants used to adjust acidic and alkaline soils"
    ]'::jsonb,
    '[
        {
            "title": "Estimating Agricultural Lime Requirements",
            "problem": "A sandy loam soil tests at pH 4.8. To reach the optimal agronomic target of pH 6.5, agricultural limestone (CaCO3) must neutralize exchangeable acidity. Why does a clay soil with the same pH require more limestone than a sandy soil?",
            "solution": "Clay soils have a significantly higher CEC and higher buffering capacity, holding a larger reservoir of reserve hydrogen and aluminum ions that must be neutralized.",
            "keyInsight": "Target pH change requires measuring buffering capacity, not active pH alone."
        }
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '{
        "enabled": true,
        "type": "agriculture",
        "title": "Soil pH and Nutrient Bioavailability Interactive Stage",
        "interactiveParameters": [
            {"name": "Soil pH", "value": 6.5, "min": 4.0, "max": 9.0, "step": 0.1, "unit": "pH"},
            {"name": "Clay Content", "value": 25, "min": 5, "max": 60, "step": 5, "unit": "%"}
        ],
        "principleNote": "Notice how nutrient availability for Nitrogen, Phosphorus, and Potassium peaks in the slightly acidic to neutral range (6.0 - 7.0)."
    }'::jsonb,
    now() - interval '5 days',
    now()
),
(
    'lr-3',
    'Structural Mechanics: Beam Deflection and Load-Bearing Principles',
    'structural-mechanics-beam-deflection',
    'Analyze how moments of inertia, elastic modulus, and beam cross-sections govern modern civil and mechanical engineering structures.',
    'Every bridge, roof truss, and airplane wing relies on structural equilibrium. When an external force acts upon a horizontal beam, internal bending moments and shear stresses develop to resist deformation.

### Euler-Bernoulli Beam Theory
Under elastic conditions, the deflection $w(x)$ along the length of a beam is described by the fourth-order differential equation:

$$E I \frac{d^4 w}{dx^4} = q(x)$$

Where:
- $E$ is the Young''s Modulus of elasticity (a material property).
- $I$ is the Area Moment of Inertia (a geometric cross-sectional property).
- $q(x)$ is the distributed load per unit length.

### The Role of Cross-Sectional Geometry
The resistance to bending is governed by the moment of inertia $I$. For a rectangular beam of width $b$ and depth $h$, $I = \frac{b h^3}{12}$. Because depth is cubed, doubling the vertical depth of a beam increases its stiffness by a factor of eight, explaining why I-beams place the bulk of their material in the top and bottom flanges.',
    'Engineering',
    'Civil & Mechanical Engineering',
    ARRAY['Civil Engineering', 'Structural Mechanics', 'Beam Deflection', 'Statics'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    8,
    'https://www.youtube.com/watch?v=F_fT63o7gXg',
    'Eusatis Engineering Faculty',
    'published',
    'Structural Mechanics & Beam Deflection – Eusatis Mind',
    'Master the Euler-Bernoulli beam equation and cross-sectional inertia in structural design.',
    '[
        "Derive the relationship between beam depth and flexural stiffness",
        "Calculate maximum deflection for simply supported and cantilever beams",
        "Evaluate why I-beams maximize structural efficiency"
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '{
        "enabled": true,
        "type": "engineering",
        "title": "Beam Deflection & Load Distribution Stage",
        "interactiveParameters": [
            {"name": "Beam Length (L)", "value": 6.0, "min": 2.0, "max": 12.0, "step": 0.5, "unit": "m"},
            {"name": "Center Point Load (P)", "value": 15, "min": 1, "max": 50, "step": 1, "unit": "kN"},
            {"name": "Beam Depth (h)", "value": 300, "min": 100, "max": 600, "step": 20, "unit": "mm"}
        ],
        "principleNote": "Beam deflection is inversely proportional to depth cubed (h³), demonstrating how geometric shape dominates structural strength."
    }'::jsonb,
    now() - interval '4 days',
    now()
),
(
    'lr-4',
    'The Golden Ratio and Natural Morphology: Mathematics Across Biology and Design',
    'golden-ratio-natural-morphology',
    'Explore how the Fibonacci sequence and the golden ratio (phi = 1.618) optimize phyllotaxis in plants and modern architectural proportion.',
    'Why do sunflowers exhibit interlocking spirals of 34 and 55 seeds? Why do pinecones, nautilus shells, and hurricane arms follow logarithmic spirals? Mathematics provides the generative code behind biological growth and efficiency.

### The Golden Ratio ($\Phi$)
The golden ratio $\Phi \approx 1.6180339887...$ arises naturally from the Fibonacci sequence ($F_n = F_{n-1} + F_{n-2}$):

$$\lim_{n \to \infty} \frac{F_{n+1}}{F_n} = \Phi$$

### Optimal Phyllotaxis
In botanical morphogenesis, leaves and seeds emerge sequentially around a stem at a divergence angle. The golden angle $\approx 137.5^\circ$ (derived from $360^\circ / \Phi^2$) ensures that each successive leaf or seed does not directly shadow or block those below it, maximizing solar interception and packing density.',
    'Interdisciplinary',
    'Biomathematics & Morphology',
    ARRAY['Mathematics', 'Biology', 'Golden Ratio', 'Fibonacci', 'Design'],
    'Primary / Elementary (KS2)',
    '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    5,
    'https://www.youtube.com/watch?v=2tv6EjWGc80',
    'Eusatis Interdisciplinary Faculty',
    'published',
    'The Golden Ratio & Natural Morphology – Eusatis Mind',
    'Discover how mathematics, biology, and design converge in natural spiral structures.',
    '[
        "Compute terms of the Fibonacci sequence and observe convergence to Phi",
        "Explain how the golden angle maximizes sunlight interception in plants",
        "Identify examples of logarithmic spirals across natural scales"
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    now() - interval '3 days',
    now()
),
(
    'lr-5',
    'Cellular Respiration and ATP Synthase: The Nanomachine of Life',
    'cellular-respiration-atp-synthase',
    'Investigate the biochemical rotary motor ATP synthase and chemiosmotic proton gradients in mitochondria.',
    'Every human cell hydrolyzes and regenerates billions of ATP molecules each day. ATP synthase is a true molecular rotary engine, consisting of a rotor (c-ring) driven by proton flux across the inner mitochondrial membrane.',
    'Biology',
    'Cellular Biochemistry',
    ARRAY['Biology', 'Mitochondria', 'Cellular Respiration', 'ATP Synthase'],
    'Tertiary (University & College)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    9,
    'https://www.youtube.com/watch?v=kXpzp4RDG28',
    'Eusatis Biochemistry Faculty',
    'published',
    'Cellular Respiration & ATP Synthase – Eusatis Mind',
    'Explore the molecular rotor of ATP synthase and electrochemical proton gradients.',
    '[
        "Trace electron flow through the mitochondrial electron transport chain",
        "Describe rotary catalysis in the F1 and F0 subunits of ATP synthase",
        "Calculate the stoichiometric ATP yield per glucose molecule"
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    now() - interval '2 days',
    now()
),
(
    'lr-6',
    'Chemical Equilibrium and Le Chatelier''s Principle: Dynamic Balance in Solutions',
    'chemical-equilibrium-le-chatelier',
    'Analyze how dynamic equilibria respond to shifts in concentration, pressure, and temperature with the Haber-Bosch synthesis.',
    'Chemical equilibrium is not static cessation; it is a dynamic state where the forward and reverse reaction rates are precisely identical. Le Chatelier''s Principle explains how systems at equilibrium adjust to counteract disturbances.',
    'Chemistry',
    'Physical Chemistry',
    ARRAY['Chemistry', 'Equilibrium', 'Le Chatelier', 'Thermodynamics'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    7,
    'https://www.youtube.com/watch?v=dIDgP_Zc_mY',
    'Eusatis Chemistry Faculty',
    'published',
    'Chemical Equilibrium & Le Chatelier – Eusatis Mind',
    'Master dynamic equilibrium shifts and industrial thermodynamics.',
    '[
        "Write equilibrium constant expressions (Kc and Kp)",
        "Predict equilibrium shifts upon changes in temperature, pressure, and concentration",
        "Apply equilibrium principles to the industrial synthesis of ammonia"
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    now() - interval '1 day',
    now()
),
(
    'lr-7',
    'Electromagnetism: Faraday''s Law and the Induction of Electrical Energy',
    'electromagnetism-faradays-law',
    'Understand how magnetic flux variations generate electromotive force (EMF), powering global electric grids and renewable turbines.',
    'Michael Faraday''s discovery in 1831 revealed that a changing magnetic field induces an electromotive force (EMF) in an electric circuit. This fundamental law underpins every hydroelectric dam, wind turbine, and electric motor on Earth.',
    'Physics',
    'Electromagnetism',
    ARRAY['Physics', 'Electromagnetism', 'Faraday''s Law', 'Lenz''s Law', 'Energy'],
    'Lower Secondary (JHS / KS3)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    6,
    'https://www.youtube.com/watch?v=txmKuf8GZfI',
    'Eusatis Physics Faculty',
    'published',
    'Faraday''s Law & Electrical Induction – Eusatis Mind',
    'Explore magnetic flux and the physical generation of electric current.',
    '[
        "Define magnetic flux and state Faraday''s Law mathematically",
        "Apply Lenz''s Law to predict the direction of induced current",
        "Explain how electrical generators convert mechanical kinetic energy into electricity"
    ]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    null,
    now(),
    now()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    subject = EXCLUDED.subject,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    learner_level = EXCLUDED.learner_level,
    featured_image = EXCLUDED.featured_image,
    video_url = EXCLUDED.video_url,
    status = EXCLUDED.status,
    updated_at = now();

-- ------------------------------------------------------------------------------
-- 4. SEED ALL PODCAST EPISODES (TALKS: ep-1 through ep-3)
-- ------------------------------------------------------------------------------
INSERT INTO public.podcast_episodes (
    id, episode_number, title, slug, summary, description,
    guest_name, guest_role, audio_url, video_url, cover_image,
    duration_minutes, transcript, tags, status, published_at, created_at, updated_at
) VALUES
(
    'ep-1',
    1,
    'The Quiet Revolution of Self-Permission',
    'the-quiet-revolution-of-self-permission',
    'Why true authenticity begins when we stop curating ourselves for the approval of others and cultivate intellectual honesty.',
    'In this opening episode of Beyoutiful Talks, we examine why societal comparison creates emotional friction, and how giving oneself permission to be genuinely authentic unlocks creative and intellectual clarity.',
    'Dr. Aris Thorne',
    'Cognitive Philosopher & Author',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=inpok4MKVLM',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    34,
    'Welcome to Beyoutiful Talks. In today''s inaugural episode, we explore the quiet revolution of self-permission...',
    ARRAY['Authenticity', 'Identity', 'Philosophy', 'Reflection'],
    'published',
    '2026-10-01T10:00:00Z',
    now() - interval '7 days',
    now()
),
(
    'ep-2',
    2,
    'Unmasking the Impostor: Intellectual Humility vs Fear',
    'unmasking-impostor-intellectual-humility',
    'Distinguishing between healthy awareness of what we do not yet know and the paralyzing fear of being exposed as fraudulent.',
    'Dr. Elena Vance joins Beyoutiful Talks to discuss cognitive psychology, imposter syndrome, and why admitting ''I do not know'' is the first step toward genuine scientific inquiry.',
    'Dr. Elena Vance',
    'Cognitive Psychologist & STEM Mentor',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=kGq_0k_l8Kk',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    42,
    'When we pretend to know things we do not, we create an exhausting psychological prison...',
    ARRAY['Psychology', 'Curiosity', 'Learning', 'Authenticity'],
    'published',
    '2026-10-08T10:00:00Z',
    now() - interval '6 days',
    now()
),
(
    'ep-3',
    3,
    'Knowledge as Responsibility: The Civic Duty of STEM',
    'knowledge-as-responsibility-civic-stem',
    'Why scientific and technical mastery must remain intimately bound to empathy, community stewardship, and societal improvement.',
    'Kwame Asante and the Eusatis host reflect on how technical knowledge should never be a private trophy, but an instrument for uplifting vulnerable communities.',
    'Kwame Asante',
    'Rural Renewable Energy Innovator',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=F0vS4jN8R0k',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    38,
    'What is the point of understanding thermodynamics or microcontrollers if your neighbor has no clean water or light?',
    ARRAY['Social Responsibility', 'Stewardship', 'STEM in Action', 'Community'],
    'published',
    '2026-10-15T10:00:00Z',
    now() - interval '5 days',
    now()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    guest_name = EXCLUDED.guest_name,
    guest_role = EXCLUDED.guest_role,
    audio_url = EXCLUDED.audio_url,
    video_url = EXCLUDED.video_url,
    cover_image = EXCLUDED.cover_image,
    status = EXCLUDED.status,
    updated_at = now();

-- ------------------------------------------------------------------------------
-- 5. SEED ALL IMPACT STORIES (IMPACT: imp-1 through imp-3)
-- ------------------------------------------------------------------------------
INSERT INTO public.impact_stories (
    id, title, slug, category, summary, full_story,
    location, featured_image, video_url, gallery_images,
    project_date, outcomes, partner_names, status, published_at, created_at, updated_at
) VALUES
(
    'imp-1',
    'Rural School Science Laboratory Revitalization in Ghana',
    'rural-school-science-laboratory-ghana',
    'School-Based Projects',
    'Equipping three rural secondary school science labs with microscopes, reagents, and solar electricity.',
    'In partnership with local headteachers and alumni associations, Eusatis provided foundational laboratory glassware, chemical reagents, and solar battery storage to three secondary schools that previously taught physics and chemistry purely from blackboards.',
    'Eastern Region, Ghana',
    '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    ARRAY[
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg'
    ],
    'September 2026',
    '[
        {"metric": "3", "label": "Laboratories Rebuilt"},
        {"metric": "850+", "label": "Students with Daily Lab Access"},
        {"metric": "14", "label": "Teachers Trained"}
    ]'::jsonb,
    ARRAY['Ministry of Education Regional Directorate', 'Rural STEM Alliance'],
    'published',
    '2026-10-01T10:00:00Z',
    now() - interval '7 days',
    now()
),
(
    'imp-2',
    'Clean Water Sensor Deployment & Community STEM Training',
    'clean-water-sensor-community-training',
    'Educational Outreach',
    'High school students assemble low-cost turbidity and pH sensor stations to safeguard community borehole wells.',
    'True understanding creates responsibility. In this pilot project, 120 senior high school students learned embedded computing and water chemistry by constructing solar-powered sensor stations for community wells.',
    'Volta Basin Communities',
    '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    'https://www.youtube.com/watch?v=RmsiH_qO_hI',
    ARRAY[
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
        '/src/assets/images/eusatis_aha_moment_1792624721004.jpg'
    ],
    'August 2026',
    '[
        {"metric": "12", "label": "Boreholes Monitored"},
        {"metric": "120", "label": "Student Technicians Trained"},
        {"metric": "9,800+", "label": "Residents Served"}
    ]'::jsonb,
    ARRAY['Water Quality Trust', 'District Health Directorate'],
    'published',
    '2026-10-05T10:00:00Z',
    now() - interval '6 days',
    now()
),
(
    'imp-3',
    'Youth Philosophy & Critical Thinking Circles',
    'youth-philosophy-critical-thinking',
    'Hospital & Care Support',
    'Weekly community dialogue spaces teaching logical reasoning, cognitive bias identification, and authentic discourse.',
    'In an era dominated by rapid digital reaction and social conformity, the ability to think independently and speak without pretense is vital for human flourishing. These circles provide a safe space for rigorous inquiry.',
    'Accra & Kumasi Hubs',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    'https://www.youtube.com/watch?v=X4Qm9cZeyGE',
    ARRAY[
        '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg'
    ],
    'Ongoing (Initiated July 2026)',
    '[
        {"metric": "28", "label": "Dialogues Hosted"},
        {"metric": "640+", "label": "Youth Participants"},
        {"metric": "94%", "label": "Confidence Rating"}
    ]'::jsonb,
    ARRAY['Beyoutiful Talks Circle', 'Community Youth Council'],
    'published',
    '2026-10-10T10:00:00Z',
    now() - interval '5 days',
    now()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    full_story = EXCLUDED.full_story,
    category = EXCLUDED.category,
    location = EXCLUDED.location,
    featured_image = EXCLUDED.featured_image,
    video_url = EXCLUDED.video_url,
    gallery_images = EXCLUDED.gallery_images,
    outcomes = EXCLUDED.outcomes,
    status = EXCLUDED.status,
    updated_at = now();
