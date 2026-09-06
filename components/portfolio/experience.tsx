'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue, formatDateRange } from '@/lib/i18n';
import { MapPin, CheckCircle2 } from 'lucide-react';
import type { Experience } from '@/lib/supabase';

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  const visibleExp = experience.filter(e => e.visible);
  if (visibleExp.length === 0) return null;

  return (
    <section id="experience" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'الخبرة' : 'Experience'}
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight">
            {locale === 'ar' ? 'المسار المهني' : 'Career Journey'}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {visibleExp.map((exp, i) => (
              <div
                key={exp.id}
                className="relative pl-12 sm:pl-16"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateX(0)' : 'translateX(-30px)',
                  transition: `opacity 0.6s ${0.1 * i}s ease-cinematic, transform 0.6s ${0.1 * i}s ease-cinematic`,
                }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 ${exp.is_current ? 'border-accent bg-accent/10' : 'border-border bg-background'} flex items-center justify-center`}>
                  {exp.is_current && <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading text-xl font-semibold">
                      {getLocalizedValue(exp.position, locale)}
                    </h3>
                    <span className="text-accent text-sm font-medium">{exp.company}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>{formatDateRange(exp.start_date, exp.end_date, exp.is_current, locale)}</span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getLocalizedValue(exp.description, locale)}
                    </p>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-1.5">
                      {exp.responsibilities.map((r, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="h-4 w-4 text-accent/60 mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {exp.achievements.map((a, j) => (
                        <span key={j} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                          {a}
                        </span>
                      ))}
                    </div>
                  )}

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((tech, j) => (
                        <span key={j} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border/30 text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
