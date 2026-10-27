# Eusatis Official Website

**"The Joy of Understanding More."**  
*Understand · Become · Impact*

---

## 1. Project Overview & Philosophy

**Eusatis** is a purpose-driven education and human-development platform built around one core idea: **understanding has the power to transform people**.

The platform is organized around three interconnected pathways:
1. **Eusatis Mind**: The educational heart. Focuses on STEM (Science, Mathematics, Physics, Chemistry, Biology) with the broader ambition of making complex ideas accessible, engaging, and understandable.
2. **Eusatis Talks (Beyoutiful Talks)**: Rooted in authenticity. Celebrates being genuine, removing masks, resisting societal pressure to conform, and discovering the confidence of being true to oneself.
3. **Eusatis Impact**: Understanding creates responsibility. Knowledge applied directly to improve lives through school science kits, pediatric care discovery corners, and community mentorship.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **Client Data Layer**: `@supabase/supabase-js` with graceful local storage persistence fallback for rapid preview and testing
- **Deployment**: Vercel (SPA with zero-configuration rewrite)
- **Design System**: Strict adherence to the official *Eusatis Brand Manual*

---

## 3. Brand Identity & Visual Design Tokens

- **Main Colour 01 (Cyan)**: `#47c3d3` — Clarity and intellectual focus
- **Main Colour 02 (Gold)**: `#d6a348` — Warmth and enlightenment
- **Accent Colour (Terracotta)**: `#d67546` — High-intent focal points and action
- **Background / Foreground 01 (Slate Grey)**: `#485358` — Subtle and neutral
- **Background / Foreground 02 (Soft Neutral)**: `#eae5e7` — Quiet structural surfaces
- **Deep Slate**: `#1f272a` — High-contrast display surfaces
- **Typography**: Pacaembu / Outfit (display), Plus Jakarta Sans (body), Space Mono (tabular figures)
- **Logo Symbolism**: The dual reality of learning. The upper section is heavily filled and solid (symbolizing the clutter and confusion of a complex problem); the lower section is open and defined by negative space (symbolizing the effortless moment clarity breaks through).

---

## 4. Key Platform Features

- **Responsive Top Navigation Bar**: Strictly follows the Top Bar Contract (Single-line wordmark, 5 single-line clean nav links, 1 primary action, zero admin links on public pages).
- **The Eusatis Aha Interactive Simulation**: Interactive visual physics explorer featuring real Snell's Law calculations ($n_1 \sin\theta_1 = n_2 \sin\theta_2$) and chromatic dispersion, bringing the moment of clarity to life.
- **Eusatis Mind Library**: Full subject filtering (Physics, Biology, Math, Chemistry, Science, STEM), learner levels (Foundation, Intermediate, Advanced), reading times, worked examples with step-by-step solutions, and interactive knowledge check quizzes with instant pedagogical feedback.
- **Beyoutiful Talks Podcast**: Custom audio player with playback speeds (1x, 1.25x, 1.5x), audio scrubber, volume controls, guest credentials, and verified transcript drawer.
- **Eusatis Impact Hub**: Verified community outreach documentation, measurable outcome metrics, and interactive volunteer participation application modal.
- **Site-Wide Search**: Accessible via `Cmd+K` or navigation search trigger to search across lessons, podcast episodes, and impact stories.
- **Private Admin Portal (`/admin`)**:
  - Strictly unlinked from all public navigation and footer menus.
  - Requires authenticated administrator access.
  - Full CRUD operations: create, edit, save drafts, publish, and delete Mind resources, Talks episodes, and Impact stories.
  - Real-time inquiry and subscriber inspection.

---

## 5. Supabase Database Setup & SQL Migrations

### Migration Location
The schema and Row Level Security policies are maintained at:
`supabase/migrations/20261021000000_create_eusatis_tables.sql`

### How to Apply:
1. Log in to [Supabase](https://supabase.com) and create a project named `eusatis-official`.
2. Navigate to the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `supabase/migrations/20261021000000_create_eusatis_tables.sql` and run.
4. Tables created:
   - `learning_resources`
   - `podcast_episodes`
   - `impact_stories`
   - `newsletter_subscribers`
   - `contact_submissions`
   - `volunteer_applications`
5. Verified RLS policies allow the public to query only rows where `status = 'published'`, while authenticated administrators retain full access.

---

## 6. Environment Variables

Create `.env` in the root (see `.env.example`):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Canonical Deployment Host URL
APP_URL=https://eusatis.org
```

*Note: If `VITE_SUPABASE_URL` is omitted or contains placeholders, the application automatically runs in local preview mode with full local storage persistence, ensuring immediate testing without crash barriers.*

---

## 7. Vercel Deployment Instructions

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New... > Project** and select your GitHub repository.
3. Select framework preset **Vite**.
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `APP_URL`: Your production domain
5. Click **Deploy**. Vercel will build with `npm run build` using the provided `vercel.json` SPA rewrite rules.
