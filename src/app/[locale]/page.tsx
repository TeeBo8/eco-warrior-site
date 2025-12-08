'use client';

import { FeatureCard } from "@/components/landing/FeatureCard";
import { ContactDialog } from "@/components/landing/ContactDialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  ShieldCheck,
  Clock,
  Map,
  Calculator,
  Scan,
  FileText
} from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  const featureCards = [
    { title: t('features.dashboard.title'), subtitle: t('features.dashboard.description'), href: `/${locale}/dashboard`, icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: t('features.debunk.title'), subtitle: t('features.debunk.description'), href: `/${locale}/debunk`, icon: <ShieldCheck className="w-5 h-5" /> },
    { title: t('features.timeline.title'), subtitle: t('features.timeline.description'), href: `/${locale}/timeline`, icon: <Clock className="w-5 h-5" /> },
    { title: t('features.map.title'), subtitle: t('features.map.description'), href: `/${locale}/map`, icon: <Map className="w-5 h-5" /> },
    { title: t('features.calculator.title'), subtitle: t('features.calculator.description'), href: `/${locale}/calculator`, icon: <Calculator className="w-5 h-5" /> },
    { title: t('features.scanner.title'), subtitle: t('features.scanner.description'), href: `/${locale}/scanner`, icon: <Scan className="w-5 h-5" /> },
    { title: t('features.articles.title'), subtitle: t('features.articles.description'), href: `/${locale}/articles`, icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <main className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Theme Toggle top-right */}
      <div className="absolute top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] bg-accent/12 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 items-center text-center">
        {/* Badge (top) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {t('hero.badge')}
        </div>

        {/* Title / Subtitle */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-primary">
            {t('subtitle')}
          </p>
        </div>

        {/* Feature Tiles (Perplexity-like) */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featureCards.map((card) => (
              <FeatureCard
                key={card.href}
                title={card.title}
                subtitle={card.subtitle}
                icon={card.icon}
                href={card.href}
              />
            ))}
          </div>
        </div>

        {/* Bottom contact button + mention */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <ContactDialog />
          <p className="text-xs text-muted-foreground/80">Projet personnel développé avec Next.js</p>
        </div>
      </section>
    </main>
  );
}
