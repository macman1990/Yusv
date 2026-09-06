'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await adminApi.list('analytics_events');
        const recent = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setEvents(recent);

        // Build summary
        const pageViews = data.filter((e: any) => e.event_type === 'page_view').length;
        const projectViews = data.filter((e: any) => e.event_type === 'project_view').length;
        const contactSubs = data.filter((e: any) => e.event_type === 'contact_submit').length;
        const byDevice: Record<string, number> = {};
        const byLanguage: Record<string, number> = {};
        const byTheme: Record<string, number> = {};
        data.forEach((e: any) => {
          if (e.device_type) byDevice[e.device_type] = (byDevice[e.device_type] || 0) + 1;
          if (e.language) byLanguage[e.language] = (byLanguage[e.language] || 0) + 1;
          if (e.theme) byTheme[e.theme] = (byTheme[e.theme] || 0) + 1;
        });
        setSummary({ pageViews, projectViews, contactSubs, byDevice, byLanguage, byTheme });
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>;
  }

  const cards = [
    { label: 'Page Views', value: summary.pageViews || 0 },
    { label: 'Project Views', value: summary.projectViews || 0 },
    { label: 'Contact Submissions', value: summary.contactSubs || 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Privacy-conscious visitor insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="text-3xl font-heading font-bold text-accent">{card.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border/40 p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">By Device</h3>
          {Object.entries(summary.byDevice || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-1">
              <span className="capitalize">{k}</span><span className="font-mono">{v as number}</span>
            </div>
          ))}
          {Object.keys(summary.byDevice || {}).length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
        </div>
        <div className="rounded-xl border border-border/40 p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">By Language</h3>
          {Object.entries(summary.byLanguage || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-1">
              <span className="uppercase">{k}</span><span className="font-mono">{v as number}</span>
            </div>
          ))}
          {Object.keys(summary.byLanguage || {}).length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
        </div>
        <div className="rounded-xl border border-border/40 p-5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">By Theme</h3>
          {Object.entries(summary.byTheme || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-1">
              <span className="capitalize">{k}</span><span className="font-mono">{v as number}</span>
            </div>
          ))}
          {Object.keys(summary.byTheme || {}).length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-lg font-semibold mb-4">Recent Events</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
          {events.slice(0, 50).map((e) => (
            <div key={e.id} className="flex items-center gap-3 text-xs py-2 px-3 rounded-lg border border-border/20">
              <span className="font-mono text-accent">{e.event_type}</span>
              <span className="text-muted-foreground">{e.page_path}</span>
              {e.device_type && <span className="text-muted-foreground ml-auto capitalize">{e.device_type}</span>}
              <span className="text-muted-foreground/50">{new Date(e.created_at).toLocaleString()}</span>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No events tracked yet</p>}
        </div>
      </div>
    </div>
  );
}
