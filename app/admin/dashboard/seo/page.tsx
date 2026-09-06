'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

export default function SEOPage() {
  const [seo, setSeo] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const settings = await adminApi.getSettings();
      setSeo(settings.seo || {});
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSetting('seo', seo);
      toast.success('SEO settings saved');
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
          <h1 className="font-heading text-2xl font-bold">SEO Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Optimize for search engines</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-4 max-w-2xl rounded-xl border border-border/40 p-5">
        <div>
          <Label className="mb-1.5 block">Site Title</Label>
          <Input value={seo.site_title || ''} onChange={(e) => setSeo({ ...seo, site_title: e.target.value })} />
        </div>
        <div>
          <Label className="mb-1.5 block">Meta Description</Label>
          <Textarea value={seo.meta_description || ''} onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })} rows={3} />
        </div>
        <div>
          <Label className="mb-1.5 block">Keywords</Label>
          <Input value={seo.keywords || ''} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="comma, separated, keywords" />
        </div>
        <div>
          <Label className="mb-1.5 block">OG Image URL</Label>
          <Input value={seo.og_image || ''} onChange={(e) => setSeo({ ...seo, og_image: e.target.value })} placeholder="https://..." />
        </div>
        <div>
          <Label className="mb-1.5 block">Author</Label>
          <Input value={seo.author || ''} onChange={(e) => setSeo({ ...seo, author: e.target.value })} />
        </div>
        <div>
          <Label className="mb-1.5 block">Canonical URL</Label>
          <Input value={seo.canonical_url || ''} onChange={(e) => setSeo({ ...seo, canonical_url: e.target.value })} placeholder="https://yoursite.com" />
        </div>
        <div>
          <Label className="mb-1.5 block">Favicon URL</Label>
          <Input value={seo.favicon || ''} onChange={(e) => setSeo({ ...seo, favicon: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
