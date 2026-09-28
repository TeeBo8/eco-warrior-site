import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Heart } from "lucide-react";
import { ContactDialog } from "@/components/landing/ContactDialog";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export const LIEN_DON = "https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04";

const COMPRENDRE = [
  { href: "/debunk", label: "Les mythes décortiqués" },
  { href: "/dashboard", label: "Les données en direct" },
  { href: "/timeline", label: "200 ans de science" },
  { href: "/map", label: "La carte des impacts" },
];

const REJOINDRE = [
  { href: "https://26septembre.org/", label: "Le mouvement du 26 septembre" },
  { href: "https://cancercolere.org/", label: "Cancer Colère" },
];

export function Agir() {
  return (
    <section
      id="agir"
      data-ambiance-cible="aube"
      aria-labelledby="agir-titre"
      className="px-5 sm:px-8 md:px-12 pt-8 pb-16"
    >
      <div className="mx-auto max-w-6xl flex flex-col gap-12">
        <header className="flex flex-col gap-3 text-center">
          <h2 id="agir-titre" className="font-display italic text-5xl sm:text-6xl">
            Et maintenant ?
          </h2>
          <p className="text-xl text-r-muted">Pas de leçon. Trois portes, tu choisis.</p>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <Porte titre="Comprendre" texte="Creuse les faits, à ton rythme.">
            {COMPRENDRE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-r-accent min-h-11">
                  {l.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </Porte>
          <Porte titre="Rejoindre" texte="On est plus forts à plusieurs.">
            {REJOINDRE.map((l) => (
              <li key={l.href}>
                <LienExterne href={l.href}>{l.label}</LienExterne>
              </li>
            ))}
          </Porte>
          <Porte titre="Soutenir" texte="Le site est gratuit et le restera. Un don l'aide à grandir.">
            <li>
              <a
                href={LIEN_DON}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-r-accent px-5 py-3 font-semibold text-r-card hover:opacity-90 transition-opacity min-h-11"
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                Faire un don
                <span className="sr-only">(nouvel onglet)</span>
              </a>
            </li>
          </Porte>
        </div>

        {/* Aperçu de La Rue, le mur des pancartes (phase 4) */}
        <aside
          aria-label="La Rue, le mur des pancartes"
          className="flex flex-col items-center gap-6 rounded-2xl bg-lutte-papier text-lutte-encre px-6 py-10"
        >
          <p className="font-lutte text-xl tracking-[0.08em]">LA RUE — BIENTÔT</p>
          <div className="-rotate-3 border-[3px] border-lutte-encre bg-lutte-carton px-7 py-5 shadow-[8px_8px_0_var(--lutte-encre)]">
            <p className="font-lutte text-4xl sm:text-5xl leading-none">CACAPIPI-</p>
            <p className="font-lutte text-4xl sm:text-5xl leading-none text-lutte-vermillon-carton">TALISME</p>
          </div>
          <p className="max-w-md text-center font-display italic text-lg">
            Les pancartes de la marche, et bientôt les tiennes.
          </p>
        </aside>

        <footer className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <ContactDialog />
          <ThemeSwitch />
          <span className="text-xs text-r-muted">Projet militant, gratuit et sans pub</span>
        </footer>
      </div>
    </section>
  );
}

function Porte({ titre, texte, children }: { titre: string; texte: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-r-card p-6 flex flex-col gap-4 shadow-sm">
      <h3 className="font-display text-3xl">{titre}</h3>
      <p className="text-r-muted">{texte}</p>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  );
}

function LienExterne({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-r-accent min-h-11"
    >
      {children}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  );
}
