"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Heart } from "lucide-react";
import { TEMPERATURES_FRANCE } from "@/data/temperatures-france";
import { Agir, LIEN_DON } from "./Agir";
import { Chapitre } from "./Chapitre";
import { CHAPITRES } from "./contenu";
import { Final } from "./Final";
import { Balance, PlancheVivant, Pipeline, Rayures } from "./illustrations";
import { Ouverture } from "./Ouverture";
import type { Ambiance, ChapitreContenu, Choix } from "./types";
import type { MotionValue } from "framer-motion";

const ILLUSTRATIONS: Record<ChapitreContenu["id"], (p: MotionValue<number>) => ReactNode> = {
  vivant: (p) => <PlancheVivant progression={p} />,
  "justice-sociale": (p) => <Balance progression={p} />,
  paix: (p) => <Pipeline progression={p} />,
  climat: (p) => (
    <figure className="flex flex-col gap-3">
      <Rayures donnees={TEMPERATURES_FRANCE.annees} progression={p} />
      <figcaption className="text-sm text-r-muted">
        Chaque bande est une année : bleu, plus frais que la moyenne {TEMPERATURES_FRANCE.reference} ;
        rouge, plus chaud.{" "}
        <a
          href={TEMPERATURES_FRANCE.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-r-fg"
        >
          Données : {TEMPERATURES_FRANCE.source.label}
          <span className="sr-only"> (nouvel onglet)</span>
        </a>
      </figcaption>
    </figure>
  ),
};

/**
 * Le récit de la page d'accueil. La lumière suit l'histoire : chaque section
 * déclare son ambiance (data-ambiance-cible) et celle qui passe au milieu de
 * l'écran colore toute la page.
 */
export function Recit() {
  const ref = useRef<HTMLDivElement>(null);
  const [ambiance, setAmbiance] = useState<Ambiance>("jour");
  const [choix, setChoix] = useState<Choix | null>(null);

  useEffect(() => {
    const sections = ref.current?.querySelectorAll<HTMLElement>("[data-ambiance-cible]");
    if (!sections?.length) return;
    const observateur = new IntersectionObserver(
      (entrees) => {
        for (const entree of entrees) {
          if (entree.isIntersecting) {
            setAmbiance(entree.target.getAttribute("data-ambiance-cible") as Ambiance);
          }
        }
      },
      // Une ligne fine au milieu de l'écran : la section qui la croise donne la lumière.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => observateur.observe(s));
    return () => observateur.disconnect();
  }, []);

  return (
    <div ref={ref} className="recit min-h-screen" data-ambiance={ambiance}>
      <Ouverture choix={choix} onChoix={setChoix} />
      {CHAPITRES.map((chapitre) => (
        <Chapitre
          key={chapitre.id}
          contenu={chapitre}
          choix={choix}
          illustration={ILLUSTRATIONS[chapitre.id]}
        />
      ))}
      <Final />
      <Agir />

      <a
        href={LIEN_DON}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center gap-2 rounded-full border border-current/20 bg-r-card/90 p-3 sm:px-4 sm:py-2.5 text-sm font-medium shadow-lg backdrop-blur-md transition-transform hover:scale-105 min-h-11 min-w-11"
      >
        <Heart className="h-4 w-4 text-r-accent" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Soutenir le projet</span>
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    </div>
  );
}
