'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, hasSupabaseConnection, type Project, type Category, type Service, type Skill, type Tool, type Experience, type Education, type Certification, type Testimonial, type Stat, type ContentItem, type SocialLink, type NavItem, type Section, type Page, type SiteSettings } from '@/lib/supabase';

export type PortfolioData = {
  settings: SiteSettings | null;
  categories: Category[];
  projects: Project[];
  services: Service[];
  skills: Skill[];
  tools: Tool[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  testimonials: Testimonial[];
  stats: Stat[];
  contentItems: ContentItem[];
  socialLinks: SocialLink[];
  navItems: NavItem[];
  sections: Section[];
  pages: Page[];
};

const emptyPortfolioData: PortfolioData = {
  settings: null,
  categories: [],
  projects: [],
  services: [],
  skills: [],
  tools: [],
  experience: [],
  education: [],
  certifications: [],
  testimonials: [],
  stats: [],
  contentItems: [],
  socialLinks: [],
  navItems: [],
  sections: [],
  pages: [],
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData | null>(emptyPortfolioData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!hasSupabaseConnection()) {
      setData(emptyPortfolioData);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [
        settingsRes, categoriesRes, projectsRes, servicesRes, skillsRes,
        toolsRes, experienceRes, educationRes, certificationsRes, testimonialsRes,
        statsRes, contentRes, socialRes, navRes, sectionsRes, pagesRes,
      ] = await Promise.all([
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('projects').select('*').order('sort_order'),
        supabase.from('services').select('*').order('sort_order'),
        supabase.from('skills').select('*').order('sort_order'),
        supabase.from('tools').select('*').order('sort_order'),
        supabase.from('experience').select('*').order('sort_order'),
        supabase.from('education').select('*').order('sort_order'),
        supabase.from('certifications').select('*').order('sort_order'),
        supabase.from('testimonials').select('*').order('sort_order'),
        supabase.from('stats').select('*').order('sort_order'),
        supabase.from('content_items').select('*').order('sort_order'),
        supabase.from('social_links').select('*').order('sort_order'),
        supabase.from('nav_items').select('*').order('sort_order'),
        supabase.from('sections').select('*').order('sort_order'),
        supabase.from('pages').select('*').order('sort_order'),
      ]);

      const errors = [settingsRes, projectsRes, servicesRes].filter(r => r.error);
      if (errors.length > 0) {
        console.error('Data fetch errors:', errors);
      }

      const settings: Record<string, any> = {};
      if (settingsRes.data) {
        settingsRes.data.forEach((row: any) => { settings[row.key] = row.value; });
      }

      setData({
        settings: settings as SiteSettings,
        categories: (categoriesRes.data || []) as Category[],
        projects: (projectsRes.data || []) as Project[],
        services: (servicesRes.data || []) as Service[],
        skills: (skillsRes.data || []) as Skill[],
        tools: (toolsRes.data || []) as Tool[],
        experience: (experienceRes.data || []) as Experience[],
        education: (educationRes.data || []) as Education[],
        certifications: (certificationsRes.data || []) as Certification[],
        testimonials: (testimonialsRes.data || []) as Testimonial[],
        stats: (statsRes.data || []) as Stat[],
        contentItems: (contentRes.data || []) as ContentItem[],
        socialLinks: (socialRes.data || []) as SocialLink[],
        navItems: (navRes.data || []) as NavItem[],
        sections: (sectionsRes.data || []) as Section[],
        pages: (pagesRes.data || []) as Page[],
      });
    } catch (err: any) {
      setError(err.message);
      setData(emptyPortfolioData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
