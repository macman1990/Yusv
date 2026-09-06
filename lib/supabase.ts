'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null as any;

export function hasSupabaseConnection() {
  return hasSupabaseConfig && !!supabase;
}

export type Bilingual = { en: string; ar: string };

export type Project = {
  id: string;
  title: Bilingual;
  subtitle: Bilingual;
  description: Bilingual;
  category_id: string | null;
  client: string;
  project_date: string | null;
  thumbnail_url: string;
  preview_video_url: string;
  full_video_url: string;
  external_video_url: string;
  platform: string;
  video_id: string;
  aspect_ratio: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
  tools_used: string[];
  skills: string[];
  results: string[];
  tags: string[];
  credits: string[];
  featured: boolean;
  visible: boolean;
  status: string;
  sort_order: number;
  has_case_study: boolean;
  case_study: any;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: Bilingual;
  slug: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Service = {
  id: string;
  title: Bilingual;
  description: Bilingual;
  icon: string;
  image_url: string;
  tags: string[];
  cta_text: Bilingual;
  cta_link: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Skill = {
  id: string;
  name: Bilingual;
  level: number;
  category: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Tool = {
  id: string;
  name: string;
  icon: string;
  skill_level: string;
  years_used: number;
  description: Bilingual;
  category: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Experience = {
  id: string;
  company: string;
  position: Bilingual;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: Bilingual;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logo_url: string;
  location: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: Bilingual;
  field: Bilingual;
  start_date: string | null;
  end_date: string | null;
  description: Bilingual;
  certificate_url: string;
  logo_url: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
};

export type Certification = {
  id: string;
  name: Bilingual;
  issuing_organization: string;
  issue_date: string | null;
  credential_id: string;
  credential_url: string;
  certificate_image_url: string;
  description: Bilingual;
  logo_url: string;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  position: string;
  company: string;
  photo_url: string;
  testimonial: Bilingual;
  rating: number;
  project: string;
  testimonial_date: string | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
};

export type Stat = {
  id: string;
  number: number;
  label: Bilingual;
  icon: string;
  prefix: string;
  suffix: string;
  animate: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
};

export type ContentItem = {
  id: string;
  title: Bilingual;
  description: Bilingual;
  content_type: string;
  platform: string;
  video_url: string;
  video_id: string;
  thumbnail_url: string;
  external_url: string;
  tags: string[];
  visible: boolean;
  status: string;
  sort_order: number;
  created_at: string;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type NavItem = {
  id: string;
  label: Bilingual;
  link_type: string;
  link_value: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Section = {
  id: string;
  name: Bilingual;
  section_type: string;
  content: any;
  background: string;
  typography: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
};

export type Page = {
  id: string;
  title: Bilingual;
  slug: string;
  seo_title: Bilingual;
  seo_description: Bilingual;
  featured_image_url: string;
  sections: any[];
  visible: boolean;
  status: string;
  sort_order: number;
  created_at: string;
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  file_type: string;
  file_size: number;
  width: number;
  height: number;
  alt_text: string;
  created_at: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  event_type: string;
  event_data: any;
  page_path: string;
  device_type: string;
  language: string;
  theme: string;
  created_at: string;
};

export type SiteSettings = {
  profile?: {
    name: string;
    title: Bilingual;
    positioning: Bilingual;
    profile_photo: string;
    cv_url: string;
  };
  contact?: {
    email: string;
    whatsapp: string;
    cta_text: Bilingual;
    success_message: Bilingual;
  };
  theme?: {
    default_theme: string;
    accent_color: string;
    animation_enabled: boolean;
    cursor_enabled: boolean;
    parallax_enabled: boolean;
    animation_intensity: string;
    transition_speed: number;
  };
  seo?: {
    site_title: string;
    meta_description: string;
    keywords: string;
    og_image: string;
    favicon: string;
    author: string;
    canonical_url: string;
  };
  about?: {
    short_bio: Bilingual;
    long_bio: Bilingual;
    philosophy: Bilingual;
    years_experience: number;
    industries: string[];
    tools_list: string[];
  };
  footer?: {
    statement: Bilingual;
    copyright: string;
  };
};
