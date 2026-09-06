'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { ArrowUp } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useScrollProgress } from '@/hooks/use-scroll';
import type { SocialLink, SiteSettings, NavItem } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export function Footer({
  settings,
  socialLinks,
  navItems,
}: {
  settings: SiteSettings;
  socialLinks: SocialLink[];
  navItems: NavItem[];
}) {
  const { locale } = useApp();
  const [showTop, setShowTop] = useState(false);
  const progress = useScrollProgress();

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Keyboard shortcut for admin
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className="h-4 w-4" /> : <Icons.Globe className="h-4 w-4" />;
  };

  const profile = settings.profile;
  const footer = settings.footer;

  return (
    <>
      {/* Scroll progress */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full border border-border bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all',
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <footer className="relative border-t border-border/30 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2 space-y-3">
              <a href="#" className="font-heading text-xl font-bold">
                {profile?.name || 'Portfolio'}
              </a>
              <p className="text-sm text-muted-foreground max-w-xs">
                {getLocalizedValue(footer?.statement, locale)}
              </p>
            </div>

            {/* Nav */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                {locale === 'ar' ? 'الروابط' : 'Links'}
              </div>
              <ul className="space-y-2">
                {navItems.filter(n => n.visible).map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.link_value}
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      {getLocalizedValue(item.label, locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                {locale === 'ar' ? 'تواصل اجتماعي' : 'Social'}
              </div>
              <div className="flex flex-wrap gap-2">
                {socialLinks.filter(s => s.visible).map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                    aria-label={s.label}
                  >
                    {getIcon(s.icon)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
            <p className="text-xs text-muted-foreground">{footer?.copyright}</p>

            {/* Hidden admin trigger */}
            <button
              onClick={() => window.location.href = '/admin'}
              className="text-muted-foreground/30 hover:text-muted-foreground transition-colors p-1"
              aria-label="·"
              title=""
            >
              <Icons.Circle className="h-3 w-3" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
