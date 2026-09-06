/*
# Create Portfolio CMS Schema

## Overview
Creates the complete database schema for a premium video editor portfolio with a full CMS.
Single-admin architecture: public reads via anon key (published content only),
all writes go through edge functions using the service role key.

## Tables Created
1. admin_config - stores admin password hash for authentication
2. admin_sessions - session tokens for authenticated admin sessions
3. settings - global site settings (hero, about, contact, theme, seo, etc.)
4. categories - project categories for portfolio filtering
5. projects - portfolio projects with video embed support
6. services - offered services
7. skills - professional skills
8. tools - software/tools used
9. experience - work experience timeline
10. education - education entries
11. certifications - professional certifications
12. testimonials - client testimonials
13. stats - animated statistics
14. content_items - content creation entries (videos, articles, scripts)
15. social_links - social media links
16. nav_items - navigation menu items
17. sections - custom sections builder
18. pages - custom pages
19. media - media library
20. analytics_events - privacy-conscious analytics
21. contact_submissions - contact form submissions

## Security
- RLS enabled on ALL tables
- SELECT policies: anon can read published/visible content only
- No INSERT/UPDATE/DELETE policies for anon (writes blocked at RLS level)
- All admin writes go through edge functions using service role key (bypasses RLS)
- Admin auth via password hash comparison + session tokens

## Bilingual Support
- Text fields use jsonb with {"en": "...", "ar": "..."} structure
- Allows manual entry of both Arabic and English content
*/

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============ ADMIN CONFIG ============
CREATE TABLE IF NOT EXISTS admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash text NOT NULL,
  password_salt text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- ============ ADMIN SESSIONS ============
CREATE TABLE IF NOT EXISTS admin_sessions (
  token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- ============ SETTINGS ============
CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  slug text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============ PROJECTS ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  subtitle jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  client text DEFAULT '',
  project_date date,
  thumbnail_url text DEFAULT '',
  preview_video_url text DEFAULT '',
  full_video_url text DEFAULT '',
  external_video_url text DEFAULT '',
  platform text DEFAULT 'youtube',
  video_id text DEFAULT '',
  aspect_ratio text DEFAULT '16:9',
  autoplay boolean DEFAULT false,
  muted boolean DEFAULT true,
  loop boolean DEFAULT false,
  controls boolean DEFAULT true,
  tools_used jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  results jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  credits jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published',
  sort_order int NOT NULL DEFAULT 0,
  has_case_study boolean DEFAULT false,
  case_study jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

-- ============ SERVICES ============
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  icon text DEFAULT '',
  image_url text DEFAULT '',
  tags jsonb DEFAULT '[]'::jsonb,
  cta_text jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  cta_link text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ============ SKILLS ============
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  level int NOT NULL DEFAULT 80,
  category text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- ============ TOOLS ============
CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text DEFAULT '',
  skill_level text DEFAULT 'Intermediate',
  years_used int DEFAULT 1,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  category text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- ============ EXPERIENCE ============
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL DEFAULT '',
  position jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  responsibilities jsonb DEFAULT '[]'::jsonb,
  achievements jsonb DEFAULT '[]'::jsonb,
  technologies jsonb DEFAULT '[]'::jsonb,
  logo_url text DEFAULT '',
  location text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

-- ============ EDUCATION ============
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL DEFAULT '',
  degree jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  field jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  start_date date,
  end_date date,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  certificate_url text DEFAULT '',
  logo_url text DEFAULT '',
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- ============ CERTIFICATIONS ============
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  issuing_organization text NOT NULL DEFAULT '',
  issue_date date,
  credential_id text DEFAULT '',
  credential_url text DEFAULT '',
  certificate_image_url text DEFAULT '',
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  logo_url text DEFAULT '',
  featured boolean DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL DEFAULT '',
  position text DEFAULT '',
  company text DEFAULT '',
  photo_url text DEFAULT '',
  testimonial jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  rating int NOT NULL DEFAULT 5,
  project text DEFAULT '',
  testimonial_date date,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- ============ STATS ============
CREATE TABLE IF NOT EXISTS stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number numeric NOT NULL DEFAULT 0,
  label jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  icon text DEFAULT '',
  prefix text DEFAULT '',
  suffix text DEFAULT '',
  animate boolean DEFAULT true,
  visible boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- ============ CONTENT ITEMS ============
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  content_type text NOT NULL DEFAULT 'video',
  platform text DEFAULT 'youtube',
  video_url text DEFAULT '',
  video_id text DEFAULT '',
  thumbnail_url text DEFAULT '',
  external_url text DEFAULT '',
  tags jsonb DEFAULT '[]'::jsonb,
  visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- ============ SOCIAL LINKS ============
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  icon text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- ============ NAV ITEMS ============
CREATE TABLE IF NOT EXISTS nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  link_type text NOT NULL DEFAULT 'section',
  link_value text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;

-- ============ SECTIONS ============
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  section_type text NOT NULL DEFAULT 'custom',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  background text DEFAULT 'default',
  typography text DEFAULT 'default',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- ============ PAGES ============
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL DEFAULT '{"en":"","ar":""}'::jsonb,
  slug text NOT NULL UNIQUE,
  seo_title jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  seo_description jsonb DEFAULT '{"en":"","ar":""}'::jsonb,
  featured_image_url text DEFAULT '',
  sections jsonb DEFAULT '[]'::jsonb,
  visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- ============ MEDIA ============
CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint DEFAULT 0,
  width int DEFAULT 0,
  height int DEFAULT 0,
  alt_text text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- ============ ANALYTICS EVENTS ============
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL DEFAULT 'page_view',
  event_data jsonb DEFAULT '{}'::jsonb,
  page_path text DEFAULT '',
  device_type text DEFAULT '',
  language text DEFAULT '',
  theme text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============ CONTACT SUBMISSIONS ============
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  project_type text DEFAULT '',
  budget text DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============ RLS POLICIES ============
-- Public read access for published content (anon + authenticated)
-- No write policies for anon - all writes through edge functions with service role key

-- admin_config: no public access
-- admin_sessions: no public access

-- settings: public read
DROP POLICY IF EXISTS "public_read_settings" ON settings;
CREATE POLICY "public_read_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);

-- categories: public read for visible
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (visible = true);

-- projects: public read for published+visible
DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (visible = true AND status = 'published');

-- services: public read for visible
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (visible = true);

-- skills: public read for visible
DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (visible = true);

-- tools: public read for visible
DROP POLICY IF EXISTS "public_read_tools" ON tools;
CREATE POLICY "public_read_tools" ON tools FOR SELECT
  TO anon, authenticated USING (visible = true);

-- experience: public read for visible
DROP POLICY IF EXISTS "public_read_experience" ON experience;
CREATE POLICY "public_read_experience" ON experience FOR SELECT
  TO anon, authenticated USING (visible = true);

-- education: public read for visible
DROP POLICY IF EXISTS "public_read_education" ON education;
CREATE POLICY "public_read_education" ON education FOR SELECT
  TO anon, authenticated USING (visible = true);

-- certifications: public read for visible
DROP POLICY IF EXISTS "public_read_certifications" ON certifications;
CREATE POLICY "public_read_certifications" ON certifications FOR SELECT
  TO anon, authenticated USING (visible = true);

-- testimonials: public read for visible
DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (visible = true);

-- stats: public read for visible
DROP POLICY IF EXISTS "public_read_stats" ON stats;
CREATE POLICY "public_read_stats" ON stats FOR SELECT
  TO anon, authenticated USING (visible = true);

-- content_items: public read for published+visible
DROP POLICY IF EXISTS "public_read_content" ON content_items;
CREATE POLICY "public_read_content" ON content_items FOR SELECT
  TO anon, authenticated USING (visible = true AND status = 'published');

-- social_links: public read for visible
DROP POLICY IF EXISTS "public_read_social" ON social_links;
CREATE POLICY "public_read_social" ON social_links FOR SELECT
  TO anon, authenticated USING (visible = true);

-- nav_items: public read for visible
DROP POLICY IF EXISTS "public_read_nav" ON nav_items;
CREATE POLICY "public_read_nav" ON nav_items FOR SELECT
  TO anon, authenticated USING (visible = true);

-- sections: public read for visible
DROP POLICY IF EXISTS "public_read_sections" ON sections;
CREATE POLICY "public_read_sections" ON sections FOR SELECT
  TO anon, authenticated USING (visible = true);

-- pages: public read for published+visible
DROP POLICY IF EXISTS "public_read_pages" ON pages;
CREATE POLICY "public_read_pages" ON pages FOR SELECT
  TO anon, authenticated USING (visible = true AND status = 'published');

-- media: public read
DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

-- analytics_events: public insert (for tracking), no read
DROP POLICY IF EXISTS "public_insert_analytics" ON analytics_events;
CREATE POLICY "public_insert_analytics" ON analytics_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- contact_submissions: public insert, no read
DROP POLICY IF EXISTS "public_insert_contact" ON contact_submissions;
CREATE POLICY "public_insert_contact" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);