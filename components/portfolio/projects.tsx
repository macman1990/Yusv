'use client';

import { useState, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { Play, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, Category } from '@/lib/supabase';
import { detectPlatform } from '@/lib/video-utils';

export function Projects({ projects, categories }: { projects: Project[]; categories: Category[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const visibleProjects = projects.filter(p => p.visible && p.status === 'published');
  const visibleCategories = categories.filter(c => c.visible);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return visibleProjects;
    return visibleProjects.filter(p => {
      const cat = categories.find(c => c.id === p.category_id);
      return cat?.slug === activeFilter;
    });
  }, [visibleProjects, activeFilter, categories]);

  if (visibleProjects.length === 0) return null;

  return (
    <section id="work" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-7xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'الأعمال' : 'Featured Work'}
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            {locale === 'ar' ? 'مشاريع مختارة' : 'Selected Projects'}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeFilter === 'all'
                ? 'bg-foreground text-background'
                : 'border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/40'
            )}
          >
            {locale === 'ar' ? 'الكل' : 'All'}
          </button>
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.slug)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeFilter === cat.slug
                  ? 'bg-foreground text-background'
                  : 'border border-border/40 text-muted-foreground hover:text-foreground hover:border-foreground/40'
              )}
            >
              {getLocalizedValue(cat.name, locale)}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
          {filtered.map((project, i) => {
            const cat = categories.find(c => c.id === project.category_id);
            const platform = project.platform || detectPlatform(project.full_video_url || project.external_video_url);

            return (
              <a
                key={project.id}
                href={`/project/${project.id}`}
                className={cn(
                  'group relative block rounded-2xl overflow-hidden border border-border/40 bg-card/30',
                  project.featured ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]',
                )}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                data-cursor="video"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(40px)',
                  transition: `opacity 0.7s ${0.1 * Math.min(i, 4)}s ease-cinematic, transform 0.7s ${0.1 * Math.min(i, 4)}s ease-cinematic`,
                }}
              >
                {/* Thumbnail */}
                {project.thumbnail_url && (
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={project.thumbnail_url}
                      alt={getLocalizedValue(project.title, locale)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}

                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-accent text-background text-[10px] font-mono uppercase tracking-widest">
                    {locale === 'ar' ? 'مميز' : 'Featured'}
                  </div>
                )}

                {/* Play indicator */}
                <div
                  className={cn(
                    'absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500',
                    hoveredId === project.id ? 'bg-accent scale-100' : 'bg-black/50 backdrop-blur-sm scale-90'
                  )}
                >
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                  {cat && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2 block">
                      {getLocalizedValue(cat.name, locale)}
                    </span>
                  )}
                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-white mb-1">
                    {getLocalizedValue(project.title, locale)}
                  </h3>
                  <p className="text-sm text-white/70 line-clamp-1">
                    {getLocalizedValue(project.subtitle, locale)}
                  </p>

                  {/* Hover details */}
                  <div
                    className={cn(
                      'flex items-center gap-4 mt-3 text-xs text-white/60 transition-all duration-500',
                      hoveredId === project.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    )}
                  >
                    {project.client && <span>{project.client}</span>}
                    {project.results?.[0] && <span className="text-accent">{project.results[0]}</span>}
                    <ArrowUpRight className="h-4 w-4 ml-auto" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            {locale === 'ar' ? 'لا توجد مشاريع في هذه الفئة' : 'No projects in this category yet'}
          </div>
        )}
      </div>
    </section>
  );
}
