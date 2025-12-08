"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export function EcoFeatureShowcase() {
  const t = useTranslations("HomePage.features");

  const features = [
    {
      id: "1",
      name: t('debunk.name'),
      title: t('debunk.title'),
      description: t('debunk.description'),
    },
    {
      id: "2",
      name: t('timeline.name'),
      title: t('timeline.title'),
      description: t('timeline.description'),
    },
    {
      id: "3",
      name: t('map.name'),
      title: t('map.title'),
      description: t('map.description'),
    },
    {
      id: "4",
      name: t('articles.name'),
      title: t('articles.title'),
      description: t('articles.description'),
    },
  ];

  return (
    <section className="relative w-full py-24 md:py-32 bg-gradient-to-b from-background via-muted/5 to-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-20 max-w-4xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            {t('showcase.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('showcase.description')}
          </p>
        </div>

        {/* Grille de fonctionnalités - Optimisée pour fullscreen */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="group relative p-8 lg:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full flex flex-col"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background gradient au survol */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Badge avec numéro - Plus chaleureux */}
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border-2 border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/15 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                    {feature.id}
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-500" />
                    <span className="text-base font-semibold text-primary group-hover:text-primary/90 transition-colors duration-500">{feature.name}</span>
                  </div>
                </div>

                {/* Contenu */}
                <h3 className="text-2xl font-bold text-foreground mb-5 leading-tight relative z-10">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base flex-1 relative z-10">
                  {feature.description}
                </p>

                {/* Accent line au survol */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
