'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type Locale, getDirection } from '@/lib/i18n';

type ThemeMode = 'dark' | 'light' | 'system';

interface AppContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  themeMode: ThemeMode;
  setThemeMode: (t: ThemeMode) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  settings: Record<string, any> | null;
  setSettings: (s: Record<string, any>) => void;
  dir: 'ltr' | 'rtl';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColorState] = useState('#e8b339');
  const [settings, setSettings] = useState<Record<string, any> | null>(null);

  const dir = getDirection(locale);

  // Load persisted preferences
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedLocale) setLocaleState(savedLocale);
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply locale/dir to document
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem('locale', locale);
  }, [locale, dir]);

  // Apply accent color as CSS variable
  useEffect(() => {
    const root = document.documentElement;
    const hsl = hexToHsl(accentColor);
    if (hsl) {
      root.style.setProperty('--accent', hsl);
      root.style.setProperty('--glow', hsl);
      root.style.setProperty('--ring', hsl);
    }
  }, [accentColor]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const setTheme = useCallback((t: 'dark' | 'light') => {
    setThemeState(t);
    setThemeModeState(t);
  }, []);
  const setThemeMode = useCallback((t: ThemeMode) => {
    setThemeModeState(t);
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
    } else {
      setThemeState(t);
    }
  }, []);
  const setAccentColor = useCallback((c: string) => setAccentColorState(c), []);

  // When settings load, apply theme config
  useEffect(() => {
    if (settings?.theme) {
      const t = settings.theme;
      if (t.accent_color && !localStorage.getItem('accentOverride')) {
        setAccentColorState(t.accent_color);
      }
    }
  }, [settings]);

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        theme,
        setTheme,
        themeMode,
        setThemeMode,
        accentColor,
        setAccentColor,
        settings,
        setSettings,
        dir,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function hexToHsl(hex: string): string | null {
  if (!hex) return null;
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const r = parseInt(m[1].slice(0, 2), 16) / 255;
  const g = parseInt(m[1].slice(2, 4), 16) / 255;
  const b = parseInt(m[1].slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
