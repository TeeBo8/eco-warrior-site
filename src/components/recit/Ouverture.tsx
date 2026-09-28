"use client";

import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHOIX } from "./contenu";
import { PlancheOuverture } from "./illustrations";
import type { Choix } from "./types";

interface OuvertureProps {
  choix: Choix | null;
  onChoix: (choix: Choix | null) => void;
}

export function Ouverture({ choix, onChoix }: OuvertureProps) {
  return (
    <section
      data-ambiance-cible="jour"
      aria-labelledby="ouverture-titre"
      className="min-h-[100svh] px-5 sm:px-8 md:px-12 py-16 md:py-20 flex items-center"
    >
      <div className="mx-auto max-w-6xl w-full grid gap-10 md:grid-cols-2 md:gap-16 items-center">
        <div className="flex flex-col gap-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-r-muted">
            Climat · Vivant · Paix · Justice sociale
          </p>
          <h1
            id="ouverture-titre"
            className="font-display italic text-7xl sm:text-8xl leading-[0.95] tracking-tight"
          >
            On veut
            <br />
            vivre.
          </h1>
          <p className="text-xl leading-relaxed max-w-lg">
            Avant les chiffres, avant les débats : pense à ce que tu aimes. La forêt derrière chez
            toi. La plage de ton enfance. Le jardin de ta grand-mère.
          </p>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-medium">Ce qui compte le plus pour toi :</legend>
            <div className="flex flex-wrap gap-3">
              {CHOIX.map(({ id, label }) => {
                const actif = choix === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => onChoix(actif ? null : id)}
                    className={cn(
                      "rounded-full border border-current px-5 py-2.5 font-medium transition-colors min-h-11",
                      actif ? "bg-r-fg text-r-bg" : "hover:bg-r-card",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="min-h-6 text-r-muted italic font-display" aria-live="polite">
              {choix ? "Noté. On va en parler tout du long." : ""}
            </p>
          </fieldset>

          <a
            href="#vivant"
            className="inline-flex items-center gap-2 self-start font-medium text-r-accent underline underline-offset-4 min-h-11"
          >
            Descends. On va se promener.
            <ArrowDown className="h-4 w-4 motion-safe:animate-bounce" aria-hidden="true" />
          </a>
        </div>

        <div className="max-w-md md:max-w-none mx-auto w-full">
          <PlancheOuverture />
        </div>
      </div>
    </section>
  );
}
