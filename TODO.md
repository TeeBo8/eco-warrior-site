# Eco Warrior — L'œuvre

## Vision

Faire d'Eco Warrior une œuvre : un site beau, cohérent, qui fait basculer quelqu'un d'indifférent ou de climatosceptique vers « on veut vivre ».

Squelette = les 4 thèmes de la marche du 26 septembre 2026 ([26septembre.org](https://26septembre.org/)) :
**Climat · Vivant · Paix · Justice sociale**

- **Cible prioritaire** : le sceptique / l'indifférent. On l'accueille par ce qui compte déjà pour lui (santé, portefeuille, enfants, sa région, l'indépendance du pays), on le fait basculer, puis on l'arme.
- **Ton** : ferme, factuel, jamais méprisant. Les slogans de rue vivent dans « La Rue », jamais comme arguments.
- **Monétisation** : dons uniquement (lien Stripe existant). Tout reste gratuit.
- **Visuels** : illustrations codées maison (SVG animés, style affiche militante). Pas de photos de presse sans autorisation.

> Ancienne feuille de route SaaS GreenScore archivée dans `docs/archive/TODO-greenscore-saas.md` (abandonnée).

---

## Phase 0 — Ménage ✅

- [x] Branche `feat/oeuvre`
- [x] Commit des retouches SEO en cours (images hero locales, metadata, OG image)
- [x] Retirer le Scanner IA (page, composant, server action Gemini, tracking)
- [x] Retirer les pages auth vides (sign-in, sign-up, profile, user-profile) + `auth-utils`
- [x] Nettoyer le sitemap (`/profile`, `/pricing`, `/scanner`)
- [x] Archiver le TODO GreenScore

## Phase 1 — Direction artistique

- [x] 3 directions artistiques en planche de tendance
- [x] Choix : les 3 ! Clair = « Herbier vivant », sombre = « Nuit & aube », La Rue = « Affiche de lutte »
- [x] Tokens CSS (clair/sombre + `--lutte-*`, `miel`, `aube`, `ciel`…) + typo (Fraunces, Work Sans ; Anton, Caveat, Bricolage en ambiance)
- [ ] Une illustration SVG « étalon » par thème pour valider le style
- [ ] Refaire les images OG (4 fichiers en runtime `edge`, à passer en Node — le prérendu plante sur une URL invalide)

## Phase 2 — Le récit (page d'accueil)

- [x] Scroll narratif, la lumière suit l'histoire (jour → soir → crépuscule → nuit → aube)
- [x] Ouverture « On veut vivre » + choix « ce que tu aimes »
- [x] Chapitres Vivant / Justice sociale / Paix / Climat, chiffres vérifiés et sourcés (2026-09-28)
- [x] Final « Je rêvais d'un autre monde » + 4 exemples réels + section Agir
- [x] Mobile, animations réduites (prefers-reduced-motion), contrastes AA

## Phase 3 — On repart propre (plan validé le 2026-09-28)

> Règle : rien ne part sur `main` tant que les mythes et les hubs ne sont pas reconstruits (zéro lien cassé en ligne).

**3.0 Filet de sécurité**
- [x] Tag git `avant-table-rase` sur main avant toute suppression
- [x] Base Neon : débranchée, pas supprimée (Leture la supprimera plus tard)

**3.1 Sauver le fond en fichiers statiques**
- [x] Les 30 mythes (table `posts` : mythe, réalité, shortExplanation, keyFacts, sources, catégorie) → `src/content/mythes.ts`, un slug pour chacun (19 n'en ont pas), classés dans les 4 thèmes
- [x] Frise (`src/data/timeline.json` + table `timeline_events`), points de carte (`map-points.json` + table `map_points`), `climate-history.ts`, `countries-climate.ts` → gardés pour les hubs
- [x] Ne PAS migrer les comptes utilisateurs (données perso inutiles)

**3.2 Table rase**
- [x] Supprimer : anciennes pages (dashboard, debunk, timeline, map, calculator, articles), `src/server` (tRPC, db, services, gamification), Drizzle, `anonymous-auth`, `useUserTracking`, `scripts/`, cron `sync-climate`, `api/og/myth`
- [x] Supprimer les dépendances inutiles (trpc, react-query, drizzle, neon, @vercel/postgres, leaflet, recharts, jspdf, dom-to-image, react-vertical-timeline, zustand…)
- [x] Formulaire de contact : refait en server action Resend (sans tRPC)
- [x] Abandonnés : calculateur, quiz, comparateur, likes/commentaires, dashboard « temps réel »

**3.3 Next.js 16**
- [x] Upgrade Next 15.1.9 → 16.3.7 (+ React à jour) sur le code allégé
- [x] `next lint` supprimé en v16 → script `eslint .` (toujours 0 erreur, 0 warning)

**3.4 Reconstruire dans la DA**
- [x] `/mythes` + `/mythes/[slug]` : 30 pages statiques (reste : image OG par mythe)
- [ ] Hubs `/vivant`, `/justice-sociale`, `/paix`, `/climat` : chiffres sourcés + mythes du thème + assos
- [ ] Hub Climat : données climat en statique, sourcées et datées (remplace le dashboard)
- [x] Brancher les liens du récit et de la sidebar sur les nouvelles pages (+ redirections des anciennes URL)
- [ ] Réécrire les images OG (fin du runtime `edge`)

## Phase 4 — La Rue

- [ ] Mur de pancartes illustrées (« cacapipitalisme », « je rêvais d'un autre monde », « On veut vivre », « On n'a plus le temps d'attendre »…)
- [ ] Option : proposer son slogan (participatif)

## Phase 5 — Agir

- [ ] Page dons (lien Stripe existant)
- [ ] Assos à rejoindre (26 septembre, Cancer Colère, collectifs locaux…)
- [ ] Prochaines marches

## Phase 6 — La vidéo

- [ ] Teaser 60 s codé en React (Remotion) avec les illustrations du site

## Plus tard

- [ ] Nom de domaine + Search Console
- [ ] Traduction EN (branche `feat/full-en`) avant mise en ligne finale
