'use client';

import { usePortfolioData } from '@/hooks/use-portfolio-data';
import { useApp } from '@/components/providers/app-provider';
import { CustomCursor } from '@/components/portfolio/custom-cursor';
import { NavBar } from '@/components/portfolio/nav-bar';
import { Hero } from '@/components/portfolio/hero';
import { About } from '@/components/portfolio/about';
import { Services } from '@/components/portfolio/services';
import { Stats } from '@/components/portfolio/stats';
import { Projects } from '@/components/portfolio/projects';
import { ExperienceSection } from '@/components/portfolio/experience';
import { EducationSection, CertificationsSection, TestimonialsSection } from '@/components/portfolio/education-certs-testimonials';
import { ToolsSection } from '@/components/portfolio/tools';
import { ContentCreation } from '@/components/portfolio/content-creation';
import { ContactSection } from '@/components/portfolio/contact';
import { Footer } from '@/components/portfolio/footer';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data, loading } = usePortfolioData();
  const { settings } = useApp();

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const mergedSettings = { ...data.settings, ...settings };
  const name = mergedSettings.profile?.name || 'Portfolio';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <CustomCursor />
      <NavBar navItems={data.navItems} name={name} />
      <Hero settings={mergedSettings as any} socialLinks={data.socialLinks} />
      <Stats stats={data.stats} />
      <Projects projects={data.projects} categories={data.categories} />
      <About settings={mergedSettings as any} skills={data.skills} />
      <Services services={data.services} />
      <ContentCreation items={data.contentItems} />
      <ExperienceSection experience={data.experience} />
      <EducationSection education={data.education} />
      <CertificationsSection certifications={data.certifications} />
      <TestimonialsSection testimonials={data.testimonials} />
      <ToolsSection tools={data.tools} />
      <ContactSection settings={mergedSettings as any} socialLinks={data.socialLinks} />
      <Footer settings={mergedSettings as any} socialLinks={data.socialLinks} navItems={data.navItems} />
    </main>
  );
}
