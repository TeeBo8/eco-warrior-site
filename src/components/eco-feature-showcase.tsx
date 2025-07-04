"use client";

import { Component as FeatureCarousel } from "@/components/ui/feature-carousel";
import { useTranslations } from "next-intl";
import { type Step } from "@/components/ui/feature-carousel";

export function EcoFeatureShowcase() {
  const t = useTranslations("HomePage.features");

  const features: Step[] = [
    {
      id: "1",
      name: t('dashboard.name'),
      title: t('dashboard.title'),
      description: t('dashboard.description'),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "2",
      name: t('debunk.name'),
      title: t('debunk.title'),
      description: t('debunk.description'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "3",
      name: t('timeline.name'),
      title: t('timeline.title'),
      description: t('timeline.description'),
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "4",
      name: t('map.name'),
      title: t('map.title'),
      description: t('map.description'),
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "5",
      name: t('calculator.name'),
      title: t('calculator.title'),
      description: t('calculator.description'),
      image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "6",
      name: t('articles.name'),
      title: t('articles.title'),
      description: t('articles.description'),
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop&crop=center"
    },
    {
      id: "7",
      name: t('premium.name'),
      title: t('premium.title'),
      description: t('premium.description'),
      image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800&h=500&fit=crop&crop=center"
    },
  ];

  // Structure d'image pour la compatibilité avec le composant de base
  const imageSet = {
    step1light1: features[0].image,
    step1light2: features[0].image,
    step2light1: features[1].image,
    step2light2: features[1].image,
    step3light: features[2].image,
    step4light: features[3].image,
    step5light: features[4].image,
    step6light: features[5].image,
    step7light: features[6].image,
    alt: "EcoWarrior - Découvrez toutes nos fonctionnalités",
  };

  return (
    <section className="w-full bg-background py-20">
      <div className="container mx-auto px-4">
        {/* En-tête de section */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            {t('showcase.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('showcase.description')}
          </p>
        </div>

        {/* Carrousel de fonctionnalités */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[34px] bg-gradient-to-r from-emerald-500/20 to-green-500/20 p-2 dark:from-emerald-500/10 dark:to-green-500/10">
            <div className="relative z-10 rounded-[28px] bg-background/50 p-2 backdrop-blur-sm">
              <FeatureCarousel
                title="Fonctionnalités EcoWarrior"
                description="Découvrez comment notre plateforme vous aide à agir pour l'environnement"
                features={features}
                image={imageSet}
                bgClass="bg-gradient-to-tr from-emerald-900/90 to-green-800/90 dark:from-emerald-950/90 dark:to-green-800/90"
              />
            </div>
          </div>
        </div>


      </div>
    </section>
  );
} 