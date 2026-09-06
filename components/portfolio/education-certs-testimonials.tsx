'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue, formatDate } from '@/lib/i18n';
import { GraduationCap, Award, ExternalLink, Star } from 'lucide-react';
import type { Education, Certification, Testimonial } from '@/lib/supabase';

export function EducationSection({ education }: { education: Education[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const visibleEdu = education.filter(e => e.visible);
  if (visibleEdu.length === 0) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'التعليم' : 'Education'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {locale === 'ar' ? 'المؤهلات الأكاديمية' : 'Academic Background'}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {visibleEdu.map((edu, i) => (
            <div
              key={edu.id}
              className="rounded-xl border border-border/40 p-6 bg-card/30"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ${0.1 * i}s ease-cinematic, transform 0.5s ${0.1 * i}s ease-cinematic`,
              }}
            >
              <GraduationCap className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-heading text-lg font-semibold mb-1">
                {getLocalizedValue(edu.degree, locale)}
              </h3>
              <p className="text-sm text-accent mb-2">{edu.institution}</p>
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                {formatDate(edu.start_date, locale)} — {formatDate(edu.end_date, locale)}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getLocalizedValue(edu.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const visibleCerts = certifications.filter(c => c.visible);
  if (visibleCerts.length === 0) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'الشهادات' : 'Certifications'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {locale === 'ar' ? 'الاعتمادات المهنية' : 'Professional Credentials'}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCerts.map((cert, i) => (
            <div
              key={cert.id}
              className={`relative rounded-xl border border-border/40 p-5 bg-card/30 ${cert.featured ? 'ring-1 ring-accent/30' : ''}`}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ${0.1 * i}s ease-cinematic, transform 0.5s ${0.1 * i}s ease-cinematic`,
              }}
            >
              {cert.featured && (
                <Star className="absolute top-4 right-4 h-4 w-4 text-accent fill-accent" />
              )}
              <Award className="h-6 w-6 text-accent mb-3" />
              <h3 className="font-heading text-base font-semibold mb-2 leading-snug">
                {getLocalizedValue(cert.name, locale)}
              </h3>
              <p className="text-sm text-accent mb-1">{cert.issuing_organization}</p>
              <p className="text-xs text-muted-foreground mb-3 font-mono">
                {formatDate(cert.issue_date, locale)}
              </p>
              {cert.credential_id && (
                <p className="text-[10px] font-mono text-muted-foreground/70 mb-2">
                  ID: {cert.credential_id}
                </p>
              )}
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:gap-2 transition-all"
                >
                  {locale === 'ar' ? 'عرض الشهادة' : 'View Credential'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const visibleTest = testimonials.filter(t => t.visible);
  if (visibleTest.length === 0) return null;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'آراء العملاء' : 'Testimonials'}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {locale === 'ar' ? 'ما يقوله العملاء' : 'What Clients Say'}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
          {visibleTest.map((t, i) => (
            <div
              key={t.id}
              className="rounded-xl border border-border/40 p-6 bg-card/30"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ${0.1 * i}s ease-cinematic, transform 0.6s ${0.1 * i}s ease-cinematic`,
              }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed text-foreground/90 mb-6">
                "{getLocalizedValue(t.testimonial, locale)}"
              </blockquote>
              <div className="flex items-center gap-3">
                {t.photo_url && (
                  <img src={t.photo_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <div className="font-medium text-sm">{t.client_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.position}{t.company ? `, ${t.company}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
