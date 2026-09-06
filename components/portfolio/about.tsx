'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { Download, Quote } from 'lucide-react';
import type { Skill, SiteSettings } from '@/lib/supabase';

export function About({ settings, skills }: { settings: SiteSettings; skills: Skill[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const about = settings.about;
  const profile = settings.profile;

  const visibleSkills = skills.filter(s => s.visible);
  const skillCategories = [...new Set(visibleSkills.map(s => s.category))];

  return (
    <section id="about" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-7xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'عني' : 'About'}
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
            {locale === 'ar'
              ? 'لا أقوم بقتطاع اللقطات فقط — أنحت الروايات'
              : "I don't just cut footage — I sculpt narratives"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: bio + profile */}
          <div className="lg:col-span-7 space-y-8">
            {/* Profile photo */}
            {profile?.profile_photo && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/40">
                <img
                  src={profile.profile_photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Short bio */}
            <p className="text-xl font-heading font-medium leading-relaxed text-foreground">
              {getLocalizedValue(about?.short_bio, locale)}
            </p>

            {/* Long bio */}
            <p className="text-base text-muted-foreground leading-relaxed">
              {getLocalizedValue(about?.long_bio, locale)}
            </p>

            {/* Philosophy */}
            {about?.philosophy && (
              <div className="border-l-2 border-accent pl-6 py-2">
                <Quote className="h-5 w-5 text-accent mb-3" />
                <p className="text-lg font-heading italic text-foreground/90 leading-relaxed">
                  {getLocalizedValue(about?.philosophy, locale)}
                </p>
              </div>
            )}

            {/* CV button */}
            {profile?.cv_url && (
              <a
                href={profile.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <Download className="h-4 w-4" />
                {locale === 'ar' ? 'تحميل السيرة الذاتية' : 'Download CV'}
              </a>
            )}
          </div>

          {/* Right: skills + info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Experience & industries */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                <div className="text-3xl font-heading font-bold text-accent">
                  {about?.years_experience || 0}+
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {locale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}
                </div>
              </div>
              <div className="rounded-xl border border-border/40 p-5 bg-card/50">
                <div className="text-3xl font-heading font-bold text-accent">
                  {about?.industries?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {locale === 'ar' ? 'قطاعات' : 'Industries'}
                </div>
              </div>
            </div>

            {/* Industries */}
            {about?.industries && about.industries.length > 0 && (
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
                  {locale === 'ar' ? 'القطاعات' : 'Industries'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {about.industries.map((ind, i) => (
                    <span key={i} className="px-3 py-1 rounded-full border border-border/40 text-xs text-foreground/80">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
                {locale === 'ar' ? 'المهارات' : 'Skills'}
              </h3>
              <div className="space-y-5">
                {skillCategories.map((cat) => (
                  <div key={cat}>
                    <div className="text-xs text-muted-foreground mb-2">{cat}</div>
                    <div className="space-y-2">
                      {visibleSkills.filter(s => s.category === cat).map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{getLocalizedValue(skill.name, locale)}</span>
                            <span className="text-muted-foreground font-mono">{skill.level}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-secondary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent transition-all duration-1000 ease-cinematic"
                              style={{ width: revealed ? `${skill.level}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
