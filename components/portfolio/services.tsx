'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import * as Icons from 'lucide-react';
import type { Service } from '@/lib/supabase';

export function Services({ services }: { services: Service[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  const visibleServices = services.filter(s => s.visible);

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? IconComp : Icons.Circle;
  };

  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-7xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
              {locale === 'ar' ? 'الخدمات' : 'Services'}
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
              {locale === 'ar' ? 'ما يمكنني تقديمه' : 'What I Can Do For You'}
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleServices.map((service, i) => {
            const Icon = getIcon(service.icon);
            return (
              <div
                key={service.id}
                className="group relative rounded-xl border border-border/40 p-6 bg-card/30 hover:bg-card/60 hover:border-accent/40 transition-all duration-500 ease-cinematic"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ${0.1 * i}s ease-cinematic, transform 0.6s ${0.1 * i}s ease-cinematic, background-color 0.3s, border-color 0.3s`,
                }}
                data-cursor="hover"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-lg border border-border/40 bg-secondary/50 group-hover:border-accent/40 group-hover:bg-accent/10 transition-colors">
                  <Icon className="h-5 w-5 text-accent" />
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {getLocalizedValue(service.title, locale)}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {getLocalizedValue(service.description, locale)}
                </p>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag, j) => (
                      <span key={j} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-border/30 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA */}
                {service.cta_link && (
                  <a
                    href={service.cta_link}
                    className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:gap-2 transition-all"
                  >
                    {getLocalizedValue(service.cta_text, locale)}
                    <Icons.ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
