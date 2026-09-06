'use client';

import { useState, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentItem } from '@/lib/supabase';

export function ContentCreation({ items }: { items: ContentItem[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [activeType, setActiveType] = useState('all');

  const visibleItems = items.filter(i => i.visible && i.status === 'published');
  const types = useMemo(() => [...new Set(visibleItems.map(i => i.content_type))], [visibleItems]);
  const filtered = activeType === 'all' ? visibleItems : visibleItems.filter(i => i.content_type === activeType);

  if (visibleItems.length === 0) return null;

  return (
    <section id="content" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-7xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
              {locale === 'ar' ? 'المحتوى' : 'Content'}
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
              {locale === 'ar' ? 'صناعة المحتوى' : 'Content Creation'}
            </h2>
          </div>
          {types.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveType('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeType === 'all' ? 'bg-foreground text-background' : 'border border-border/40 text-muted-foreground hover:text-foreground'
                )}
              >
                {locale === 'ar' ? 'الكل' : 'All'}
              </button>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                    activeType === t ? 'bg-foreground text-background' : 'border border-border/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filtered.map((item, i) => (
            <a
              key={item.id}
              href={item.external_url || item.video_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-2xl overflow-hidden border border-border/40 bg-card/30 aspect-video"
              data-cursor="video"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ${0.1 * i}s ease-cinematic, transform 0.6s ${0.1 * i}s ease-cinematic`,
              }}
            >
              {item.thumbnail_url && (
                <div className="absolute inset-0">
                  <img
                    src={item.thumbnail_url}
                    alt={getLocalizedValue(item.title, locale)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
              )}
              <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                <Play className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent mb-1 block">
                  {item.platform}
                </span>
                <h3 className="font-heading text-base font-semibold text-white line-clamp-2">
                  {getLocalizedValue(item.title, locale)}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
