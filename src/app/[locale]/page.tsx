"use client";

import { EcoChat } from "@/components/eco-chat";
import { EcoFeatureShowcase } from "@/components/eco-feature-showcase";
import { ConsensusLogos } from "@/components/consensus-logos";
import { GlobalTestPanel } from "@/components/global-test-panel";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <main className="bg-background min-h-screen">
      {/* Header avec Theme Toggle */}
      <div className="container mx-auto pt-6 flex justify-between items-start">
        <GlobalTestPanel />
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Hero Section avec le nouveau thème nature */}
      <section className="container mx-auto text-center py-20">
        <div className="relative">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-foreground">
            {t('title')}
            <span className="block text-primary font-serif italic mt-2">
              {t('subtitle')}
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
          
          {/* Décoration nature */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"></div>
          <div className="absolute top-10 -right-6 w-6 h-6 bg-accent/30 rounded-full blur-sm"></div>
          <div className="absolute -bottom-2 left-1/3 w-4 h-4 bg-secondary/40 rounded-full blur-sm"></div>
        </div>
      </section>

      {/* Section Assistant IA avec style amélioré */}
      <section className="container mx-auto py-10">
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 shadow-lg p-6">
          <EcoChat />
        </div>
      </section>
      
      {/* Section Carrousel de Fonctionnalités */}
      <EcoFeatureShowcase />
      
      {/* Section Consensus Scientifique */}
      <div className="bg-muted/50">
        <ConsensusLogos />
      </div>
    </main>
  );
}
