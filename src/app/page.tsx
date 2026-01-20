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
      title: "Les chiffres qui dérangent",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      description: "CO₂, température, niveau des mers - en temps réel"
    },
    {
      title: "Détruire les arguments bidons",
      href: "/debunk",
      icon: <ShieldCheck className="w-5 h-5" />,
      description: "Chaque mythe climatosceptique démonté par la science"
    },
    {
      title: "200 ans de preuves ignorées",
      href: "/timeline",
      icon: <Clock className="w-5 h-5" />,
      description: "L'histoire de la science qu'ils refusent de voir"
    },
    {
      title: "Les dégâts sont déjà là",
      href: "/map",
      icon: <Map className="w-5 h-5" />,
      description: "Carte mondiale des impacts climatiques"
    },
    {
      title: "Calculez votre impact réel",
      href: "/calculator",
      icon: <Calculator className="w-5 h-5" />,
      description: "Votre empreinte carbone en chiffres"
    },
    {
      title: "Scanner Carbone IA",
      href: "/scanner",
      icon: <Scan className="w-5 h-5" />,
      description: "Analysez n'importe quoi avec Gemini"
    },
    {
      title: "Enquêtes & Analyses",
      href: "/articles",
      icon: <FileText className="w-5 h-5" />,
      description: "Les dossiers qui font mal"
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Urgence climatique : les faits, pas les opinions
        </div>
      </div>

      {/* Contenu principal centré */}
      <section className="relative max-w-3xl mx-auto px-4 sm:px-6 flex-1 flex flex-col items-center justify-center text-center">
        {/* Titre principal avec gradient */}
        <div className="w-full mb-6 sm:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400">
              La science contre
            </span>
            <br />
            <span className="text-foreground">
              les climatosceptiques
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ils nient, on prouve. Chaque argument climatosceptique démonté par des données vérifiables.
            <span className="block mt-2 text-foreground font-medium">NASA • NOAA • IPCC • GIEC</span>
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
            <span>Sources vérifiables uniquement</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Peer-reviewed science</span>
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
