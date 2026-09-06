'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import type { SocialLink, SiteSettings } from '@/lib/supabase';
import * as Icons from 'lucide-react';

export function Hero({ settings, socialLinks }: { settings: SiteSettings; socialLinks: SocialLink[] }) {
  const { locale, dir } = useApp();
  const profile = settings.profile;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className="h-4 w-4" /> : <Icons.Globe className="h-4 w-4" />;
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-cinematic">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-4xl">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-secondary/30 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8"
            style={{ animation: mounted ? 'fade-up 0.6s 0.1s both' : 'none' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {locale === 'ar' ? 'متاح للمشاريع' : 'Available for projects'}
          </div>

          {/* Title */}
          <h1
            className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
            style={{ animation: mounted ? 'blur-reveal 1s 0.2s both' : 'none' }}
          >
            {profile?.name || 'Kareem Al-Rashid'}
          </h1>

          {/* Professional title with separators */}
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-8"
            style={{ animation: mounted ? 'fade-up 0.6s 0.4s both' : 'none' }}
          >
            {getLocalizedValue(profile?.title, locale).split('•').map((part, i, arr) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-lg sm:text-xl font-heading font-medium text-foreground/90">
                  {part.trim()}
                </span>
                {i < arr.length - 1 && (
                  <span className="h-4 w-px bg-accent/50" />
                )}
              </span>
            ))}
          </div>

          {/* Positioning statement */}
          <p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10"
            style={{ animation: mounted ? 'fade-up 0.6s 0.5s both' : 'none' }}
          >
            {getLocalizedValue(profile?.positioning, locale)}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 mb-12"
            style={{ animation: mounted ? 'fade-up 0.6s 0.6s both' : 'none' }}
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-medium text-sm overflow-hidden transition-transform hover:scale-[1.02]"
              data-cursor="hover"
            >
              <span>{locale === 'ar' ? 'شاهد أعمالي' : 'View My Work'}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium text-sm hover:border-accent hover:text-accent transition-colors"
              data-cursor="hover"
            >
              <span>{locale === 'ar' ? 'لنعمل معًا' : "Let's Work Together"}</span>
            </a>
          </div>

          {/* Social links */}
          <div
            className="flex items-center gap-4"
            style={{ animation: mounted ? 'fade-up 0.6s 0.7s both' : 'none' }}
          >
            {socialLinks.filter(s => s.visible).slice(0, 6).map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-1"
                aria-label={social.label}
                data-cursor="hover"
              >
                {getIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50"
        style={{ animation: mounted ? 'fade-in 1s 1s both' : 'none' }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">
          {locale === 'ar' ? 'اسحب للأسفل' : 'Scroll'}
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
