'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { FolderKanban, Video, Wrench, Award, BarChart3, FileText, Plus, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [projects, services, testimonials, certifications, experience, content] = await Promise.all([
          adminApi.list('projects'),
          adminApi.list('services'),
          adminApi.list('testimonials'),
          adminApi.list('certifications'),
          adminApi.list('experience'),
          adminApi.list('content_items'),
        ]);
        setStats({
          projects: projects.length,
          publishedProjects: projects.filter((p: any) => p.status === 'published').length,
          draftProjects: projects.filter((p: any) => p.status === 'draft').length,
          services: services.length,
          testimonials: testimonials.length,
          certifications: certifications.length,
          experience: experience.length,
          content: content.length,
        });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderKanban, action: () => router.push('/admin/dashboard/projects') },
    { label: 'Published', value: stats.publishedProjects, icon: TrendingUp },
    { label: 'Drafts', value: stats.draftProjects, icon: FileText },
    { label: 'Services', value: stats.services, icon: Wrench, action: () => router.push('/admin/dashboard/services') },
    { label: 'Testimonials', value: stats.testimonials, icon: Award, action: () => router.push('/admin/dashboard/testimonials') },
    { label: 'Certifications', value: stats.certifications, icon: Award, action: () => router.push('/admin/dashboard/certifications') },
    { label: 'Experience', value: stats.experience, icon: BarChart3, action: () => router.push('/admin/dashboard/experience') },
    { label: 'Content Items', value: stats.content, icon: Video, action: () => router.push('/admin/dashboard/content') },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/admin/dashboard/projects' },
    { label: 'Add Service', href: '/admin/dashboard/services' },
    { label: 'Add Experience', href: '/admin/dashboard/experience' },
    { label: 'Add Certificate', href: '/admin/dashboard/certifications' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)
          : cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Card
                  key={i}
                  className="cursor-pointer hover:border-accent/40 transition-colors"
                  onClick={card.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-2xl font-heading font-bold">{card.value ?? 0}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                  </CardContent>
                </Card>
              );
            })
        }
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((qa, i) => (
            <Button key={i} variant="outline" onClick={() => router.push(qa.href)}>
              <Plus className="h-4 w-4 mr-2" />
              {qa.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
