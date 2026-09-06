'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';

export default function AppearancePage() {
  const { setAccentColor, setTheme, setThemeMode, theme, themeMode } = useApp();
  const [themeConfig, setThemeConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await adminApi.getSettings();
      setThemeConfig(settings.theme || {
        default_theme: 'dark',
        accent_color: '#e8b339',
        animation_enabled: true,
        cursor_enabled: true,
        parallax_enabled: true,
        animation_intensity: 'medium',
        transition_speed: 0.6,
      });
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSetting('theme', themeConfig);
      setAccentColor(themeConfig.accent_color);
      if (themeConfig.default_theme === 'system') {
        setThemeMode('system');
      } else {
        setTheme(themeConfig.default_theme);
        setThemeMode(themeConfig.default_theme);
      }
      toast.success('Appearance saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !themeConfig) return <div className="animate-pulse h-64 bg-secondary/30 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Appearance</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize the visual identity</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl border border-border/40 p-5 space-y-4">
          <h2 className="font-heading font-semibold text-sm">Theme</h2>
          <div>
            <Label className="mb-1.5 block">Default Theme</Label>
            <Select value={themeConfig.default_theme} onValueChange={(v) => setThemeConfig({ ...themeConfig, default_theme: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 p-5 space-y-4">
          <h2 className="font-heading font-semibold text-sm">Accent Color</h2>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={themeConfig.accent_color}
              onChange={(e) => setThemeConfig({ ...themeConfig, accent_color: e.target.value })}
              className="w-12 h-12 rounded-lg border border-border/40 cursor-pointer"
            />
            <Input
              value={themeConfig.accent_color}
              onChange={(e) => setThemeConfig({ ...themeConfig, accent_color: e.target.value })}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['#e8b339', '#3b82f6', '#10b981', '#ef4444', '#f97316', '#ec4899'].map(color => (
              <button
                key={color}
                onClick={() => setThemeConfig({ ...themeConfig, accent_color: color })}
                className="w-8 h-8 rounded-lg border border-border/40"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/40 p-5 space-y-4">
          <h2 className="font-heading font-semibold text-sm">Animation</h2>
          <div className="flex items-center justify-between">
            <Label>Enable Animations</Label>
            <Switch checked={themeConfig.animation_enabled} onCheckedChange={(v) => setThemeConfig({ ...themeConfig, animation_enabled: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Custom Cursor</Label>
            <Switch checked={themeConfig.cursor_enabled} onCheckedChange={(v) => setThemeConfig({ ...themeConfig, cursor_enabled: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Parallax Effects</Label>
            <Switch checked={themeConfig.parallax_enabled} onCheckedChange={(v) => setThemeConfig({ ...themeConfig, parallax_enabled: v })} />
          </div>
          <div>
            <Label className="mb-1.5 block">Animation Intensity</Label>
            <Select value={themeConfig.animation_intensity} onValueChange={(v) => setThemeConfig({ ...themeConfig, animation_intensity: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="subtle">Subtle</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Transition Speed: {themeConfig.transition_speed}s</Label>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.1"
              value={themeConfig.transition_speed}
              onChange={(e) => setThemeConfig({ ...themeConfig, transition_speed: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
