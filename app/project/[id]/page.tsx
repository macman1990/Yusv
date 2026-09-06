'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { supabase, type Project, type Category } from '@/lib/supabase';
import { getLocalizedValue, formatDate } from '@/lib/i18n';
import { useApp } from '@/components/providers/app-provider';
import { getEmbedUrl, detectPlatform, getPlatformLabel } from '@/lib/video-utils';
import { CustomCursor } from '@/components/portfolio/custom-cursor';
import { NavBar } from '@/components/portfolio/nav-bar';
import { Footer } from '@/components/portfolio/footer';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function ProjectPage() {
  const { id } = useParams();
  const { locale, settings } = useApp();
  const [project, setProject] = useState<Project | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id as string)
        .maybeSingle();
      if (data) {
        setProject(data as Project);
        if (data.category_id) {
          const { data: cat } = await supabase
            .from('categories')
            .select('*')
            .eq('id', data.category_id)
            .maybeSingle();
          if (cat) setCategory(cat as Category);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Project not found</p>
          <Link href="/" className="text-accent hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const platform = project.platform || detectPlatform(project.full_video_url || project.external_video_url);
  const videoId = project.video_id || '';
  const aspectClass = project.aspect_ratio === '9:16' ? 'aspect-[9/16] max-w-sm mx-auto' : project.aspect_ratio === '1:1' ? 'aspect-square max-w-lg mx-auto' : 'aspect-video';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <NavBar navItems={[]} name={settings?.profile?.name || 'Portfolio'} />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {locale === 'ar' ? 'العودة للأعمال' : 'Back to Work'}
          </Link>

          {/* Title block */}
          <div className="mb-8">
            {category && (
              <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
                {getLocalizedValue(category.name, locale)}
              </span>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              {getLocalizedValue(project.title, locale)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {getLocalizedValue(project.subtitle, locale)}
            </p>
          </div>

          {/* Video / Thumbnail */}
          <div className={`relative ${aspectClass} rounded-2xl overflow-hidden border border-border/40 mb-10`}>
            {playing && videoId && (platform === 'youtube' || platform === 'vimeo') ? (
              <iframe
                src={getEmbedUrl(videoId, platform as any, { autoplay: true, muted: false, controls: true }) || undefined}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : playing && platform === 'direct' && project.full_video_url ? (
              <video src={project.full_video_url} controls autoPlay className="absolute inset-0 w-full h-full" />
            ) : playing && platform === 'custom' && project.external_video_url ? (
              <iframe src={project.external_video_url} className="absolute inset-0 w-full h-full" allowFullScreen />
            ) : (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full group"
                data-cursor="video"
              >
                {project.thumbnail_url && (
                  <img src={project.thumbnail_url} alt={getLocalizedValue(project.title, locale)} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Info grid */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {project.client && (
              <div className="rounded-xl border border-border/40 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{locale === 'ar' ? 'العميل' : 'Client'}</div>
                <div className="text-sm font-medium">{project.client}</div>
              </div>
            )}
            {project.project_date && (
              <div className="rounded-xl border border-border/40 p-4">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{locale === 'ar' ? 'التاريخ' : 'Date'}</div>
                <div className="text-sm font-medium">{formatDate(project.project_date, locale)}</div>
              </div>
            )}
            <div className="rounded-xl border border-border/40 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{locale === 'ar' ? 'المنصة' : 'Platform'}</div>
              <div className="text-sm font-medium">{getPlatformLabel(platform)}</div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-base text-foreground/80 leading-relaxed">{getLocalizedValue(project.description, locale)}</p>
            </div>
          )}

          {/* Results */}
          {project.results && project.results.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-xl font-semibold mb-4">{locale === 'ar' ? 'النتائج' : 'Results'}</h2>
              <div className="flex flex-wrap gap-2">
                {project.results.map((r, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Skills */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {project.tools_used && project.tools_used.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">{locale === 'ar' ? 'الأدوات' : 'Tools'}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools_used.map((t, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded border border-border/30">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {project.skills && project.skills.length > 0 && (
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">{locale === 'ar' ? 'المهارات' : 'Skills'}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.skills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded border border-border/30">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Credits */}
          {project.credits && project.credits.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">{locale === 'ar' ? 'الطاقم' : 'Credits'}</h3>
              <ul className="space-y-1">
                {project.credits.map((c, i) => (
                  <li key={i} className="text-sm text-foreground/70">{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* External link */}
          {project.external_video_url && (
            <a
              href={project.external_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors"
            >
              {locale === 'ar' ? 'مشاهدة على' : 'Watch on'} {getPlatformLabel(platform)}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {/* Case study */}
          {project.has_case_study && project.case_study && Object.keys(project.case_study).length > 0 && (
            <div className="mt-12 pt-12 border-t border-border/30 space-y-8">
              <h2 className="font-heading text-2xl font-bold">{locale === 'ar' ? 'دراسة الحالة' : 'Case Study'}</h2>
              {project.case_study.challenge && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{locale === 'ar' ? 'التحدي' : 'Challenge'}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{project.case_study.challenge[locale] || project.case_study.challenge.en}</p>
                </div>
              )}
              {project.case_study.strategy && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{locale === 'ar' ? 'الاستراتيجية' : 'Strategy'}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{project.case_study.strategy[locale] || project.case_study.strategy.en}</p>
                </div>
              )}
              {project.case_study.approach && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{locale === 'ar' ? 'المنهج' : 'Approach'}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{project.case_study.approach[locale] || project.case_study.approach.en}</p>
                </div>
              )}
              {project.case_study.results && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{locale === 'ar' ? 'النتائج' : 'Results'}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{project.case_study.results[locale] || project.case_study.results.en}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer settings={settings as any} socialLinks={[]} navItems={[]} />
    </main>
  );
}
