'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

export function MissionSection() {
  const premiumCount = 42; // Example contributor count
  const goal = 1000; // Example goal
  const progress = (premiumCount / goal) * 100;

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-muted/10 via-background to-background overflow-hidden">
      {/* Effets de fond décoratifs - Plus chaleureux */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Colonne Photo */}
          <div className="flex justify-center lg:justify-start order-2 lg:order-1 animate-fade-in-up">
            <div className="relative group">
              <div className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-full overflow-hidden shadow-2xl backdrop-blur-sm border-2 border-border/30 group-hover:border-primary/50 transition-all duration-500 group-hover:scale-105 relative">
                <Image
                  src="/images/founder-portrait.jpg"
                  alt="Founder Portrait"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Décoration autour de la photo - Plus subtile */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full animate-pulse blur-sm"></div>
              <div className="absolute -bottom-8 -left-8 w-10 h-10 bg-accent/20 rounded-full animate-pulse delay-1000 blur-sm"></div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </div>
          </div>

          {/* Colonne Mission */}
          <div className="space-y-10 order-1 lg:order-2 animate-fade-in-up delay-200">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  Le mot du fondateur
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full"></div>
              </div>

              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                EcoWarrior est né d&apos;une frustration : l&apos;impuissance face aux chiffres. J&apos;ai codé ces outils pour que chacun puisse comprendre et agir concrètement, sans barrière. Votre soutien permet de garder cette technologie libre et indépendante.
              </p>
            </div>

            {/* Barre de progression avec design amélioré - Plus chaleureux */}
            <div className="space-y-5 p-8 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="flex justify-between items-center font-mono text-base md:text-lg">
                <span className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></span>
                  <strong className="text-foreground">{premiumCount}</strong> <span className="text-muted-foreground">Contributeurs</span>
                </span>
                <span className="text-muted-foreground">
                  Objectif de financement: <strong className="text-foreground">{goal}</strong>
                </span>
              </div>

              <div className="space-y-3">
                <Progress value={progress} className="w-full h-4" />
                <p className="text-center text-base font-medium text-muted-foreground">
                  <span className="text-primary font-bold text-lg">{Math.round(progress)}%</span> financé
                </p>
              </div>
            </div>

            {/* CTA Button - Plus chaleureux */}
            <div className="pt-6">
              <Link href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" className="inline-block w-full md:w-auto" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="w-full md:w-auto text-lg px-10 py-7 bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 font-semibold"
                >
                  Faire un don et soutenir le projet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}