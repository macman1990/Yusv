'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { useApp } from '@/components/providers/app-provider';
import {
  LayoutDashboard, FolderKanban, Video, Wrench, Briefcase, GraduationCap,
  Award, Star, BarChart3, FileText, Image, Settings, LogOut, Menu, X,
  ExternalLink, Search, Bell, Tag, Users, Link2, Layers, Navigation,
  Palette, Globe, Mail, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { label: 'Categories', href: '/admin/dashboard/categories', icon: Tag },
  { label: 'Services', href: '/admin/dashboard/services', icon: Wrench },
  { label: 'Skills', href: '/admin/dashboard/skills', icon: Star },
  { label: 'Tools', href: '/admin/dashboard/tools', icon: Briefcase },
  { label: 'Experience', href: '/admin/dashboard/experience', icon: BarChart3 },
  { label: 'Education', href: '/admin/dashboard/education', icon: GraduationCap },
  { label: 'Certifications', href: '/admin/dashboard/certifications', icon: Award },
  { label: 'Testimonials', href: '/admin/dashboard/testimonials', icon: Users },
  { label: 'Stats', href: '/admin/dashboard/stats', icon: BarChart3 },
  { label: 'Content', href: '/admin/dashboard/content', icon: Video },
  { label: 'Social Links', href: '/admin/dashboard/social', icon: Link2 },
  { label: 'Navigation', href: '/admin/dashboard/navigation', icon: Navigation },
  { label: 'Sections', href: '/admin/dashboard/sections', icon: Layers },
  { label: 'Pages', href: '/admin/dashboard/pages', icon: FileText },
  { label: 'Media Library', href: '/admin/dashboard/media', icon: Image },
  { label: 'Appearance', href: '/admin/dashboard/appearance', icon: Palette },
  { label: 'SEO', href: '/admin/dashboard/seo', icon: Globe },
  { label: 'Contact', href: '/admin/dashboard/contact', icon: Mail },
  { label: 'Analytics', href: '/admin/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useApp();

  const handleLogout = async () => {
    await adminApi.logout();
    toast.success('Logged out');
    router.push('/admin');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border/40 bg-card/30 hidden lg:flex flex-col z-30">
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-accent" />
            </div>
            <span className="font-heading font-bold text-sm">CMS Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive(item.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.label}</span>
                {isActive(item.href) && <ChevronRight className="h-3 w-3 ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/30 space-y-1">
          <button
            onClick={() => window.open('/', '_blank')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Preview Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-secondary/50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 border-r border-border/40 bg-card flex flex-col">
            <div className="p-5 border-b border-border/30 flex items-center justify-between">
              <span className="font-heading font-bold text-sm">CMS Dashboard</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1"><X className="h-4 w-4" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive(item.href) ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <button onClick={handleLogout} className="m-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 border-b border-border/30 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2">
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Dashboard</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{navItems.find(n => isActive(n.href))?.label || 'Overview'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-secondary/30">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="bg-transparent text-sm w-32 focus:outline-none focus:w-48 transition-all"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
