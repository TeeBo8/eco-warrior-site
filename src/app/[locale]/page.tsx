'use client';

import { EcoFeatureShowcase } from "@/components/eco-feature-showcase";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MissionSection } from "@/components/landing/MissionSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';


export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <main className="bg-background min-h-screen">
      {/* Header avec Theme Toggle */}
      <div className="container mx-auto pt-6 flex justify-end items-start">
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>

      {/* Hero Section améliorée avec gradient et CTAs */}
      <section className="relative container mx-auto text-center py-20 md:py-28 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t('hero.badge')}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
            {t('title')}
            <span className="block text-primary font-serif italic mt-2 text-4xl md:text-5xl lg:text-6xl">
              {t('subtitle')}
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href={`/${locale}/dashboard`}>
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group">
                {t('hero.cta.exploreDashboard')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-muted transition-all duration-300 group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('hero.cta.discoverPlatform')}
              </Button>
            </Link>
          </div>

          {/* Preview Image Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden p-2">
              <div className="bg-muted/50 rounded-xl aspect-video flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <div className="text-center z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground font-medium">{t('hero.preview.title')}</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">{t('hero.preview.subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Logos Clients / Partenaires Scientifiques */}


      {/* Section Bénéfices */}
      <BenefitsSection />

      {/* Section Comment ça marche */}
      <HowItWorksSection />

      {/* Section Carrousel de Fonctionnalités */}
      <div id="features">
        <EcoFeatureShowcase />
      </div>



      {/* Section FAQ */}
      <FAQSection />

      {/* Section CTA Final - Mission */}
      <MissionSection />
    </main>
  );
}
