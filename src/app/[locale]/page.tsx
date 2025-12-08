'use client';

import { FeatureCard } from "@/components/landing/FeatureCard";
import { ContactDialog } from "@/components/landing/ContactDialog";
import { ThemeSwitch } from "@/components/ui/theme-switch";

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
    { title: t('features.dashboard.title'), href: `/${locale}/dashboard`, icon: <LayoutDashboard className="w-5 h-5" /> },
    { title: t('features.debunk.title'), href: `/${locale}/debunk`, icon: <ShieldCheck className="w-5 h-5" /> },
    { title: t('features.timeline.title'), href: `/${locale}/timeline`, icon: <Clock className="w-5 h-5" /> },
    { title: t('features.map.title'), href: `/${locale}/map`, icon: <Map className="w-5 h-5" /> },
    { title: t('features.calculator.title'), href: `/${locale}/calculator`, icon: <Calculator className="w-5 h-5" /> },
    { title: t('features.scanner.title'), href: `/${locale}/scanner`, icon: <Scan className="w-5 h-5" /> },
    { title: t('features.articles.title'), href: `/${locale}/articles`, icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <main className="relative h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[360px] h-[360px] bg-accent/12 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      {/* Badge tout en haut (comme Perplexity) - Un peu d'espace en haut */}
      <div className="relative w-full flex justify-center pt-4 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {t('hero.badge')}
        </div>
      </div>

      {/* Contenu principal centré */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-5 flex-1 flex flex-col items-center justify-center text-center">
        {/* Espacement après badge */}
        <div className="h-8 sm:h-12"></div>

        {/* Titre principal (à la place de la barre de recherche Perplexity) - SANS espace après */}
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('title')}
          </h1>
        </div>

        {/* Feature Tiles (Perplexity-like) */}
        <div className="w-full mb-8 sm:mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {featureCards.map((card) => (
              <FeatureCard
                key={card.href}
                title={card.title}
                icon={card.icon}
                href={card.href}
              />
            ))}
          </div>
        </div>

        {/* Espacement */}
        <div className="flex-1"></div>
      </section>

      {/* Footer en bas (Contact + Switch + Mention) */}
      <div className="relative w-full pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-5">
          <div className="flex flex-row flex-wrap items-center justify-center gap-2.5">
            <ContactDialog />
            <ThemeSwitch />
            <span className="text-xs text-muted-foreground/80">Projet personnel développé avec Next.js</span>
          </div>
        </div>
      </div>
    </main>
  );
}
