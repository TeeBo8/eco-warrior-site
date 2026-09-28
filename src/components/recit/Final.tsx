"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { EXEMPLES } from "./contenu";
import { Lever } from "./illustrations";
import { useMouvementReduit } from "./useMouvementReduit";

export function Final() {
  const ref = useRef<HTMLElement>(null);
  const reduit = useMouvementReduit();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section
      ref={ref}
      id="autre-monde"
      data-ambiance-cible="aube"
      aria-labelledby="final-titre"
      className="relative px-5 sm:px-8 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-10 text-center">
        <div className="w-full max-w-2xl">
          <Lever key={String(reduit)} progression={scrollYProgress} />
        </div>
        <h2
          id="final-titre"
          className="font-aube font-extrabold text-5xl sm:text-7xl leading-[0.98] tracking-tight"
        >
          Je rêvais d&apos;un autre monde.
        </h2>
        <motion.p
          key={String(reduit)}
          initial={reduit ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="font-display italic text-3xl sm:text-4xl text-r-accent"
        >
          Il existe déjà, par morceaux.
        </motion.p>

        {EXEMPLES.length > 0 && (
          <ul className="grid w-full gap-5 sm:grid-cols-2 text-left">
            {EXEMPLES.map((ex) => (
              <li key={ex.titre} className="rounded-2xl bg-r-card p-6 flex flex-col gap-2 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-r-accent">
                  {ex.theme} · {ex.lieu}
                </p>
                <p className="font-display text-2xl leading-tight">{ex.titre}</p>
                <p className="leading-relaxed">{ex.texte}</p>
                <a
                  href={ex.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 self-start text-sm text-r-muted underline underline-offset-4 hover:text-r-fg"
                >
                  Source : {ex.source.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="max-w-2xl text-xl leading-relaxed">
          Le 26 septembre 2026, des milliers de personnes ont marché à Bordeaux et partout en
          France. Pas contre toi. Pour que tes enfants aient encore des étés.
        </p>
      </div>
    </section>
  );
}
