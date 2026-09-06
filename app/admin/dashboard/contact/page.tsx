'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

export default function ContactSettingsPage() {
  const [contact, setContact] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await adminApi.getSettings();
      setContact(settings.contact || {});
      const subs = await adminApi.list('contact_submissions');
      setSubmissions(subs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSetting('contact', contact);
      toast.success('Contact settings saved');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-secondary/30 rounded-xl" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Contact</h1>
          <p className="text-sm text-muted-foreground mt-1">Contact settings and submissions</p>
        </div>
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="space-y-4 max-w-2xl rounded-xl border border-border/40 p-5">
            <div>
              <Label className="mb-1.5 block">Contact Email</Label>
              <Input value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 block">WhatsApp</Label>
              <Input value={contact.whatsapp || ''} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="+1234567890" />
            </div>
            <div>
              <Label className="mb-1.5 block">CTA Text (English)</Label>
              <Input value={contact.cta_text?.en || ''} onChange={(e) => setContact({ ...contact, cta_text: { ...contact.cta_text, en: e.target.value } })} />
            </div>
            <div>
              <Label className="mb-1.5 block">CTA Text (Arabic)</Label>
              <Input value={contact.cta_text?.ar || ''} onChange={(e) => setContact({ ...contact, cta_text: { ...contact.cta_text, ar: e.target.value } })} dir="rtl" />
            </div>
            <div>
              <Label className="mb-1.5 block">Success Message (English)</Label>
              <Textarea value={contact.success_message?.en || ''} onChange={(e) => setContact({ ...contact, success_message: { ...contact.success_message, en: e.target.value } })} rows={2} />
            </div>
            <div>
              <Label className="mb-1.5 block">Success Message (Arabic)</Label>
              <Textarea value={contact.success_message?.ar || ''} onChange={(e) => setContact({ ...contact, success_message: { ...contact.success_message, ar: e.target.value } })} rows={2} dir="rtl" />
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          {submissions.length === 0 ? (
            <div className="text-center py-20 rounded-xl border border-dashed border-border/40">
              <p className="text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub) => (
                <div key={sub.id} className="rounded-xl border border-border/40 p-4 bg-card/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{sub.name} <span className="text-muted-foreground">({sub.email})</span></div>
                    <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
                  </div>
                  {sub.project_type && <div className="text-xs text-accent mb-1">{sub.project_type} · {sub.budget}</div>}
                  <p className="text-sm text-muted-foreground">{sub.message}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
