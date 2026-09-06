'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Loader2, Download, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [about, setAbout] = useState<any>(null);
  const [footer, setFooter] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const settings = await adminApi.getSettings();
      setProfile(settings.profile || {});
      setAbout(settings.about || {});
      setFooter(settings.footer || {});
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try { await adminApi.updateSetting('profile', profile); toast.success('Profile saved'); } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const saveAbout = async () => {
    setSaving(true);
    try { await adminApi.updateSetting('about', about); toast.success('About saved'); } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };
  const saveFooter = async () => {
    setSaving(true);
    try { await adminApi.updateSetting('footer', footer); toast.success('Footer saved'); } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) { toast.error('Fill both fields'); return; }
    setChangingPassword(true);
    try {
      await adminApi.changePassword(currentPassword, newPassword);
      toast.success('Password changed');
      setCurrentPassword(''); setNewPassword('');
    } catch (e: any) { toast.error(e.message); } finally { setChangingPassword(false); }
  };

  const exportData = async () => {
    try {
      const data = await adminApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `portfolio-export-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported');
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <div className="animate-pulse h-64 bg-secondary/30 rounded-xl" />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Global configuration</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile">
          <div className="space-y-4 max-w-2xl rounded-xl border border-border/40 p-5">
            <div><Label className="mb-1.5 block">Name</Label><Input value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">Title (English)</Label><Input value={profile.title?.en || ''} onChange={(e) => setProfile({ ...profile, title: { ...profile.title, en: e.target.value } })} /></div>
            <div><Label className="mb-1.5 block">Title (Arabic)</Label><Input value={profile.title?.ar || ''} onChange={(e) => setProfile({ ...profile, title: { ...profile.title, ar: e.target.value } })} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Positioning (English)</Label><Textarea value={profile.positioning?.en || ''} onChange={(e) => setProfile({ ...profile, positioning: { ...profile.positioning, en: e.target.value } })} rows={3} /></div>
            <div><Label className="mb-1.5 block">Positioning (Arabic)</Label><Textarea value={profile.positioning?.ar || ''} onChange={(e) => setProfile({ ...profile, positioning: { ...profile.positioning, ar: e.target.value } })} rows={3} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Profile Photo URL</Label><Input value={profile.profile_photo || ''} onChange={(e) => setProfile({ ...profile, profile_photo: e.target.value })} /></div>
            <div><Label className="mb-1.5 block">CV URL</Label><Input value={profile.cv_url || ''} onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })} /></div>
            <Button onClick={saveProfile} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save Profile</Button>
          </div>
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <div className="space-y-4 max-w-2xl rounded-xl border border-border/40 p-5">
            <div><Label className="mb-1.5 block">Short Bio (English)</Label><Textarea value={about.short_bio?.en || ''} onChange={(e) => setAbout({ ...about, short_bio: { ...about.short_bio, en: e.target.value } })} rows={2} /></div>
            <div><Label className="mb-1.5 block">Short Bio (Arabic)</Label><Textarea value={about.short_bio?.ar || ''} onChange={(e) => setAbout({ ...about, short_bio: { ...about.short_bio, ar: e.target.value } })} rows={2} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Long Bio (English)</Label><Textarea value={about.long_bio?.en || ''} onChange={(e) => setAbout({ ...about, long_bio: { ...about.long_bio, en: e.target.value } })} rows={6} /></div>
            <div><Label className="mb-1.5 block">Long Bio (Arabic)</Label><Textarea value={about.long_bio?.ar || ''} onChange={(e) => setAbout({ ...about, long_bio: { ...about.long_bio, ar: e.target.value } })} rows={6} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Philosophy (English)</Label><Textarea value={about.philosophy?.en || ''} onChange={(e) => setAbout({ ...about, philosophy: { ...about.philosophy, en: e.target.value } })} rows={2} /></div>
            <div><Label className="mb-1.5 block">Philosophy (Arabic)</Label><Textarea value={about.philosophy?.ar || ''} onChange={(e) => setAbout({ ...about, philosophy: { ...about.philosophy, ar: e.target.value } })} rows={2} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Years of Experience</Label><Input type="number" value={about.years_experience || 0} onChange={(e) => setAbout({ ...about, years_experience: Number(e.target.value) })} /></div>
            <div><Label className="mb-1.5 block">Industries (comma-separated)</Label><Input value={(about.industries || []).join(', ')} onChange={(e) => setAbout({ ...about, industries: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></div>
            <Button onClick={saveAbout} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save About</Button>
          </div>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer">
          <div className="space-y-4 max-w-2xl rounded-xl border border-border/40 p-5">
            <div><Label className="mb-1.5 block">Statement (English)</Label><Input value={footer.statement?.en || ''} onChange={(e) => setFooter({ ...footer, statement: { ...footer.statement, en: e.target.value } })} /></div>
            <div><Label className="mb-1.5 block">Statement (Arabic)</Label><Input value={footer.statement?.ar || ''} onChange={(e) => setFooter({ ...footer, statement: { ...footer.statement, ar: e.target.value } })} dir="rtl" /></div>
            <div><Label className="mb-1.5 block">Copyright</Label><Input value={footer.copyright || ''} onChange={(e) => setFooter({ ...footer, copyright: e.target.value })} /></div>
            <Button onClick={saveFooter} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}Save Footer</Button>
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-4 max-w-md rounded-xl border border-border/40 p-5">
            <div className="flex items-center gap-2 mb-2"><Lock className="h-4 w-4 text-accent" /><h2 className="font-heading font-semibold text-sm">Change Password</h2></div>
            <div><Label className="mb-1.5 block">Current Password</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
            <div><Label className="mb-1.5 block">New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <Button onClick={changePassword} disabled={changingPassword}>{changingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}Change Password</Button>
          </div>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup">
          <div className="space-y-4 max-w-md rounded-xl border border-border/40 p-5">
            <h2 className="font-heading font-semibold text-sm">Export / Backup</h2>
            <p className="text-sm text-muted-foreground">Download all your portfolio content as a JSON file. This includes all projects, settings, and content.</p>
            <Button onClick={exportData}><Download className="h-4 w-4 mr-2" />Export Data</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
