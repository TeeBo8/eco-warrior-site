'use client';

import { FeatureCard } from "@/components/landing/FeatureCard";
import { ContactDialog } from "@/components/landing/ContactDialog";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import Link from "next/link";

import {
  LayoutDashboard,
  ShieldCheck,
  Clock,
  Map,
  Calculator,
  Scan,
  FileText,
  Sparkles,
  Heart
} from 'lucide-react';

export default function HomePage() {
  const featureCards = [
    {
      title: "Surveillez le climat en temps réel",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: "CO₂, température, niveau des mers"
    },
    {
      title: "Démontez les idées reçues",
      href: "/debunk",
      icon: <ShieldCheck className="w-5 h-5" />,
      description: "Mythes vs réalités scientifiques"
    },
    {
      title: "L'histoire de la science du climat",
      href: "/timeline",
      icon: <Clock className="w-5 h-5" />,
      description: "200 ans de découvertes"
    },
    {
      title: "Visualisez les impacts près de chez vous",
      href: "/map",
      icon: <Map className="w-5 h-5" />,
      description: "Carte interactive mondiale"
    },
    {
      title: "Mesurez votre empreinte carbone",
      href: "/calculator",
      icon: <Calculator className="w-5 h-5" />,
      description: "Calculez et réduisez votre impact"
    },
    {
      title: "Scanner Carbone Visuel",
      href: "/scanner",
      icon: <Scan className="w-5 h-5" />,
      description: "Analysez avec l'IA Gemini"
    },
    {
      title: "Analyses approfondies du climat",
      href: "/articles",
      icon: <FileText className="w-5 h-5" />,
      description: "Articles d'experts"
    },
  ];

  return (
    <main className="relative h-screen w-full bg-background overflow-hidden flex flex-col">
      {/* Background gradient animé */}
      <div className="fixed inset-0 w-full h-full -z-10">
        {/* Gradient de fond avec animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-emerald-800/20 to-teal-900/30 animate-gradient" />

        {/* Deuxième couche de gradient pour effet de profondeur */}
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-800/20 via-transparent to-green-900/20 animate-gradient-slow" />

        {/* Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-background/75 dark:bg-background/85" />
      </div>

      {/* Badge tout en haut (style Perplexity) */}
      <div className="relative w-full flex justify-center pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Données climatiques en temps réel
        </div>
      </div>

      {/* Contenu principal centré */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center justify-center text-center">
        {/* Titre principal avec gradient */}
        <div className="w-full mb-6 sm:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400">
              Agissez pour la planète
            </span>
            <br />
            <span className="text-foreground">
              avec des données fiables
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            L&apos;application tout-en-un pour comprendre, mesurer et réduire votre impact environnemental.
            Basée sur la science, conçue pour l&apos;action.
          </p>
        </div>

        {/* Feature Tiles Grid (Perplexity-like) */}
        <div className="w-full mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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

        {/* Statistique d'impact - élément de crédibilité */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Données de la NASA, NOAA, IPCC</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>100% open source</span>
          </div>
        </div>
      </section>

      {/* Footer en bas (Contact + Switch + Mention) */}
      <div className="relative w-full pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            <ContactDialog />
            <ThemeSwitch />
            <span className="text-xs text-muted-foreground/80">Projet personnel développé avec Next.js</span>
          </div>
        </div>
      </div>

      {/* Bouton Stripe discret en bas à droite (style Perplexity) */}
      <Link
        href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background/80 dark:bg-background/60 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/30">
          <Heart className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
            Soutenir le projet
          </span>
        </div>
      </Link>
    </main>
  );
}
