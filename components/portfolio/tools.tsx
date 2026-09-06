'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import type { Tool } from '@/lib/supabase';

export function ToolsSection({ tools }: { tools: Tool[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const visibleTools = tools.filter(t => t.visible);
  if (visibleTools.length === 0) return null;

  const categories = [...new Set(visibleTools.map(t => t.category))];

  const levelColors: Record<string, string> = {
    Expert: 'bg-accent',
    Advanced: 'bg-accent/70',
    Intermediate: 'bg-accent/50',
    Beginner: 'bg-accent/30',
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'الأدوات' : 'Tools'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {locale === 'ar' ? 'برامجي وتقنياتي' : 'My Toolkit'}
          </h2>
        </div>

        {categories.map((cat) => (
          <div key={cat} className="mb-8 last:mb-0">
            <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">{cat}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {visibleTools.filter(t => t.category === cat).map((tool, i) => (
                <div
                  key={tool.id}
                  className="group rounded-xl border border-border/40 p-4 bg-card/30 hover:border-accent/30 transition-colors"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? 'translateY(0)' : 'translateY(15px)',
                    transition: `opacity 0.5s ${0.05 * i}s ease-cinematic, transform 0.5s ${0.05 * i}s ease-cinematic`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-heading font-medium text-sm">{tool.name}</span>
                    <span className={`h-2 w-2 rounded-full ${levelColors[tool.skill_level] || 'bg-accent/50'}`} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{tool.skill_level}</span>
                    <span>·</span>
                    <span>{tool.years_used}yr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
