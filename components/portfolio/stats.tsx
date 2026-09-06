'use client';

import { useScrollReveal } from '@/hooks/use-scroll';
import { useCountUp } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import * as Icons from 'lucide-react';
import type { Stat } from '@/lib/supabase';

export function Stats({ stats }: { stats: Stat[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();

  const visibleStats = stats.filter(s => s.visible);
  if (visibleStats.length === 0) return null;

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className="h-5 w-5" /> : null;
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-7xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {visibleStats.map((stat, i) => (
            <StatItem key={stat.id} stat={stat} start={revealed} delay={i * 0.1} icon={getIcon(stat.icon)} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat, start, delay, icon, locale }: {
  stat: Stat; start: boolean; delay: number; icon: React.ReactNode; locale: 'en' | 'ar';
}) {
  const count = useCountUp(stat.number, 2000, start);

  return (
    <div
      className="text-center sm:text-left p-5 rounded-xl border border-border/30 bg-card/20"
      style={{
        opacity: start ? 1 : 0,
        transform: start ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ${delay}s ease-cinematic, transform 0.6s ${delay}s ease-cinematic`,
      }}
    >
      {icon && (
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent mb-3">
          {icon}
        </div>
      )}
      <div className="font-heading text-4xl lg:text-5xl font-bold tracking-tight">
        <span className="text-accent">{stat.prefix}</span>
        {Math.round(count)}
        <span className="text-accent">{stat.suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        {getLocalizedValue(stat.label, locale)}
      </div>
    </div>
  );
}
