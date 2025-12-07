"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export function EcoFeatureShowcase() {
  const t = useTranslations("HomePage.features");

  const features = [
    {
      id: "1",
      name: t('dashboard.name'),
      title: t('dashboard.title'),
      description: t('dashboard.description'),
    },
    {
      id: "2",
      name: t('debunk.name'),
      title: t('debunk.title'),
      description: t('debunk.description'),
    },
    {
      id: "3",
      name: t('timeline.name'),
      title: t('timeline.title'),
      description: t('timeline.description'),
    },
    {
      id: "4",
      name: t('map.name'),
      title: t('map.title'),
      description: t('map.description'),
    },
    {
      id: "5",
      name: t('calculator.name'),
      title: t('calculator.title'),
      description: t('calculator.description'),
    },
    {
      id: "6",
      name: t('articles.name'),
      title: t('articles.title'),
      description: t('articles.description'),
    },
    {
      id: "7",
      name: t('scanner.name'),
      title: t('scanner.title'),
      description: t('scanner.description'),
    },
  ];

  return (
    <section className="w-full min-h-screen bg-background py-20 flex flex-col">
      <div className="container mx-auto px-4 flex-1 flex flex-col">
        {/* En-tête de section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {t('showcase.title')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('showcase.description')}
          </p>
        </div>

        {/* Grille de fonctionnalités - full screen avec espacement optimisé */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="group relative p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col"
                >
                  {/* Badge avec numéro */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold border-2 border-primary/20">
                      {feature.id}
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span className="text-base font-semibold text-primary">{feature.name}</span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base flex-1">
                    {feature.description}
                  </p>

                  {/* Décoration au survol */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
