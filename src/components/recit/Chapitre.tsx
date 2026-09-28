"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { useScroll, type MotionValue } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CountUp } from "./CountUp";
import type { ChapitreContenu, Choix } from "./types";
import { useMouvementReduit } from "./useMouvementReduit";

interface ChapitreProps {
  contenu: ChapitreContenu;
  choix: Choix | null;
  illustration: (progression: MotionValue<number>) => ReactNode;
}

export function Chapitre({ contenu, choix, illustration }: ChapitreProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const { fait, complement, objection, hub } = contenu;
  // Remonte l'illustration si la préférence de mouvement change après l'hydratation.
  const reduit = useMouvementReduit();

  return (
    <section
      ref={ref}
      id={contenu.id}
      data-ambiance-cible={contenu.ambiance}
      aria-labelledby={`${contenu.id}-titre`}
      className="relative px-5 sm:px-8 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2 md:gap-16 items-start">
        <div className="order-2 md:order-1 flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-r-accent">
              {contenu.numero} — {contenu.theme}
            </p>
            <h2
              id={`${contenu.id}-titre`}
              className="font-display italic text-5xl sm:text-6xl leading-[1.02] tracking-tight"
            >
              {contenu.titre}
            </h2>
            <p className="text-xl leading-relaxed">{contenu.accroche}</p>
            {choix && (
              <p className="font-display italic text-lg text-r-muted border-l-2 border-r-accent pl-4">
                {contenu.rappels[choix]}
              </p>
            )}
          </header>

          <div className="flex flex-col gap-3">
            <p className="font-display text-6xl sm:text-7xl font-semibold text-r-accent leading-none">
              {fait.valeur !== undefined ? (
                <CountUp valeur={fait.valeur} prefixe={fait.prefixe} suffixe={fait.suffixe} />
              ) : (
                fait.affichage
              )}
            </p>
            <p className="text-lg leading-relaxed">{fait.texte}</p>
            <SourceLien {...fait.source} />
          </div>

          {complement && (
            <div className="flex flex-col gap-2">
              <p className="leading-relaxed text-r-muted">{complement.texte}</p>
              {complement.source && <SourceLien {...complement.source} />}
            </div>
          )}

          <div className="rounded-2xl bg-r-card p-6 flex flex-col gap-3 shadow-sm">
            <p className="font-semibold text-lg">{objection.question}</p>
            <p className="leading-relaxed">{objection.reponse}</p>
            {objection.lien && (
              <Link
                href={objection.lien.href}
                className="inline-flex items-center gap-1 self-start font-medium text-r-accent underline underline-offset-4 min-h-11"
              >
                {objection.lien.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          <p className="font-display text-2xl sm:text-3xl leading-snug">{contenu.bascule}</p>

          {hub && (
            <Link
              href={hub.href}
              className="inline-flex items-center gap-2 self-start rounded-full border border-current px-5 py-3 font-medium hover:bg-r-card transition-colors min-h-11"
            >
              {hub.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div key={String(reduit)} className="order-1 md:order-2 md:sticky md:top-24">
          {illustration(scrollYProgress)}
        </div>
      </div>
    </section>
  );
}

function SourceLien({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 self-start text-sm text-r-muted underline underline-offset-4 hover:text-r-fg"
    >
      Source : {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}
