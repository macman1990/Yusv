'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, hasSupabaseConnection } from '@/lib/supabase';
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
  const [settings, setSettingsState] = useState<Record<string, any> | null>(null);

  const dir = getDirection(locale);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedLocale) setLocaleState(savedLocale);
    if (savedTheme) setThemeState(savedTheme);
    if (savedThemeMode) setThemeModeState(savedThemeMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!settings?.theme) return;
    const t = settings.theme;
    const defaultTheme = t.default_theme || 'dark';
    if (defaultTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(prefersDark ? 'dark' : 'light');
      setThemeModeState('system');
      return;
    }
    setThemeState(defaultTheme);
    setThemeModeState(defaultTheme);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', hexToHsl(accentColor) || '41 77% 57%');
    root.style.setProperty('--glow', hexToHsl(accentColor) || '41 77% 57%');
    root.style.setProperty('--ring', hexToHsl(accentColor) || '41 77% 57%');
    root.style.setProperty('--accent-rgb', hexToRgb(accentColor) || '232 176 85');
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    root.setAttribute('dir', dir);
    localStorage.setItem('locale', locale);
  }, [locale, dir]);

  useEffect(() => {
    if (!hasSupabaseConnection()) return;

    let isMounted = true;

    const loadSettings = async () => {
      const { data, error } = await supabase.from('settings').select('*');
      if (!isMounted || error) return;
      const parsed: Record<string, any> = {};
      data?.forEach((row: any) => { parsed[row.key] = row.value; });
      setSettingsState(parsed);
      if (parsed.theme?.accent_color) setAccentColorState(parsed.theme.accent_color);
    };

    loadSettings();
    return () => { isMounted = false; };
  }, []);

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
  const setSettings = useCallback((s: Record<string, any>) => setSettingsState(s), []);

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
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const r = parseInt(m[1].slice(0, 2), 16) / 255;
  const g = parseInt(m[1].slice(2, 4), 16) / 255;
  const b = parseInt(m[1].slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
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

function hexToRgb(hex: string): string | null {
  if (!hex) return null;
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
