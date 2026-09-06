'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/supabase';

export function NavBar({ navItems, name }: { navItems: NavItem[]; name: string }) {
  const { locale, setLocale, theme, setTheme } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const visibleNav = navItems.filter(n => n.visible);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-cinematic',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/40'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="group flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight">
                {name || 'Portfolio'}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-glow" />
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {visibleNav.map((item) => (
                <a
                  key={item.id}
                  href={item.link_value}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                >
                  {getLocalizedValue(item.label, locale)}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-px w-0 bg-accent transition-all duration-300 group-hover:w-3/4" />
                </a>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-md hover:bg-secondary/50 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{locale === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-secondary/50 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-secondary/50 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] lg:hidden transition-all duration-500 ease-cinematic',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <div className="relative flex flex-col h-full pt-20 px-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-md hover:bg-secondary/50"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="flex flex-col gap-2 mt-8">
            {visibleNav.map((item, i) => (
              <a
                key={item.id}
                href={item.link_value}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-heading font-medium py-3 border-b border-border/30 hover:text-accent transition-colors"
                style={{
                  animation: menuOpen ? `fade-up 0.5s ${i * 0.08}s both` : 'none',
                }}
              >
                {getLocalizedValue(item.label, locale)}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
