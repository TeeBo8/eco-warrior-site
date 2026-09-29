import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { MYTHES } from "@/content/mythes";
import { THEMES } from "@/content/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return MYTHES.map((m) => ({ slug: m.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mythe = MYTHES.find((m) => m.slug === slug);
  if (!mythe) return {};
  return {
    title: `« ${mythe.mythe} » : vrai ou faux ?`,
    description: mythe.resume ?? mythe.realite,
  };
}

export default async function MythePage({ params }: Props) {
  const { slug } = await params;
  const mythe = MYTHES.find((m) => m.slug === slug);
  if (!mythe) notFound();

  const voisins = MYTHES.filter((m) => m.theme === mythe.theme && m.slug !== mythe.slug).slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-5 sm:px-8 py-16 md:py-24 flex flex-col gap-12">
      <Link
        href="/mythes"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-muted-foreground hover:text-foreground min-h-11"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Tous les mythes
      </Link>

      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {THEMES[mythe.theme].nom} · Idée reçue
        </p>
        <h1 className="font-display italic text-4xl sm:text-5xl leading-[1.05] tracking-tight">
          « {mythe.mythe} »
        </h1>
      </header>

      <section aria-labelledby="realite" className="flex flex-col gap-4">
        <h2 id="realite" className="font-display text-2xl sm:text-3xl">
          Ce que dit la science
        </h2>
        <p className="text-xl leading-relaxed">{mythe.realite}</p>
        {mythe.resume && <p className="text-lg leading-relaxed text-muted-foreground">{mythe.resume}</p>}
      </section>

      {mythe.faits.length > 0 && (
        <section aria-labelledby="faits" className="rounded-2xl bg-card border p-6 flex flex-col gap-4">
          <h2 id="faits" className="font-semibold text-lg">
            En chiffres
          </h2>
          <ul className="flex flex-col gap-2">
            {mythe.faits.map((fait) => (
              <li key={fait} className="flex gap-3 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {fait}
              </li>
            ))}
          </ul>
        </section>
      )}

      {mythe.sources.length > 0 && (
        <section aria-labelledby="sources" className="flex flex-col gap-3">
          <h2 id="sources" className="font-semibold text-lg">
            Sources
          </h2>
          <ul className="flex flex-col gap-2 text-muted-foreground">
            {mythe.sources.map((s) => (
              <li key={s.nom}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
                  >
                    {s.nom}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                ) : (
                  s.nom
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {voisins.length > 0 && (
        <nav aria-labelledby="voisins" className="flex flex-col gap-4 border-t pt-10">
          <h2 id="voisins" className="font-display text-2xl">
            Autres idées reçues · {THEMES[mythe.theme].nom}
          </h2>
          <ul className="flex flex-col gap-2">
            {voisins.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/mythes/${v.slug}`}
                  className="group inline-flex items-center gap-2 font-display italic text-lg hover:text-primary min-h-11"
                >
                  « {v.mythe} »
                  <ArrowRight className="h-4 w-4 not-italic transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
