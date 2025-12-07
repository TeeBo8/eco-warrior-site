'use client';


import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslations } from 'next-intl';

export function MissionSection() {
  const t = useTranslations('MissionSection');
  const premiumCount = 42; // Example contributor count
  const goal = 1000; // Example goal
  const progress = (premiumCount / goal) * 100;

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Effets de fond décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Colonne Photo */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative group">
              <div className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-full overflow-hidden shadow-2xl backdrop-blur-sm border border-border/50 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                  {/* Placeholder si l'image n'existe pas */}
                  <span className="text-sm">{t('photoPlaceholder')}</span>
                </div>
              </div>
              {/* Décoration autour de la photo */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-accent/40 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>

          {/* Colonne Mission */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                  {t('title')}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Barre de progression avec design amélioré */}
            <div className="space-y-4 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
              <div className="flex justify-between items-center font-mono text-sm md:text-base">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  <strong>{premiumCount}</strong> {t('stats.members')}
                </span>
                <span className="text-muted-foreground">
                  {t('stats.goal')}: <strong>{goal}</strong>
                </span>
              </div>

              <div className="space-y-2">
                <Progress value={progress} className="w-full h-3" />
                <p className="text-center text-sm font-medium text-muted-foreground">
                  <span className="text-primary font-bold">{Math.round(progress)}%</span> {t('stats.progress')}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" className="inline-block w-full md:w-auto" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full md:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}