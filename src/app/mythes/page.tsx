import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MYTHES } from "@/content/mythes";
import { THEMES, type Theme } from "@/content/types";

export const metadata: Metadata = {
  title: "Les mythes décortiqués",
  description:
    "Les idées reçues sur le climat, le vivant, l'énergie et la justice sociale, et ce que dit vraiment la science. Sources à l'appui.",
};

const ORDRE: Theme[] = ["vivant", "justice-sociale", "paix", "climat"];

export default function MythesPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 sm:px-8 py-16 md:py-24 flex flex-col gap-16">
      <header className="flex flex-col gap-4 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {MYTHES.length} idées reçues
        </p>
        <h1 className="font-display italic text-5xl sm:text-6xl leading-[1.02] tracking-tight">
          Les mythes, décortiqués.
        </h1>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Tu les as déjà entendus au repas de famille. Voici ce que dit vraiment la science, sans
          mépris et sources à l&apos;appui.
        </p>
      </header>

      {ORDRE.map((theme) => {
        const mythes = MYTHES.filter((m) => m.theme === theme);
        return (
          <section key={theme} aria-labelledby={`theme-${theme}`} className="flex flex-col gap-6">
            <h2 id={`theme-${theme}`} className="font-display text-3xl sm:text-4xl">
              {THEMES[theme].nom}
              <span className="text-muted-foreground"> · {mythes.length}</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {mythes.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/mythes/${m.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-colors hover:border-primary"
                  >
                    <p className="font-display italic text-xl leading-snug">« {m.mythe} »</p>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {m.resume ?? m.realite}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Ce que dit la science
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
