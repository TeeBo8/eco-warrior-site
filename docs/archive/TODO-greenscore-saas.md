# GreenScore — Bilan Carbone TPE SaaS

## Vision

Transformer **Eco Warrior** en **GreenScore** : un micro-SaaS B2B de bilan carbone pour TPE/freelances français.
Les features existantes (dashboard climat, debunk, timeline, map, calculator perso, scanner IA, articles) restent en **vitrine de contenu gratuit / SEO**.
Le nouveau produit SaaS vit sous `/app` (authentifié).

**Stack** : Next.js 16, TypeScript (strict), shadcn/ui, Tailwind CSS, tRPC, Drizzle ORM, Neon PostgreSQL, Better Auth, Stripe, Resend, Zustand, Vitest, Vercel AI SDK (Gemini), Vercel

---

## Architecture

```
Routes publiques (existantes) :
  /                   → Landing page GreenScore
  /dashboard          → Dashboard climat public
  /debunk             → Mythes & Réalités
  /timeline           → Frise historique
  /map                → Carte des impacts
  /calculator         → Calculateur perso (gratuit, SEO)
  /scanner            → Scanner IA Gemini
  /articles           → Articles & enquêtes
  /pricing            → Tableau comparatif des plans

Routes SaaS (nouvelles, authentifiées) :
  /sign-in            → Better Auth login
  /sign-up            → Better Auth register
  /app/dashboard      → Dashboard GreenScore
  /app/bilan          → Calculateur B2B (5 catégories pro)
  /app/bilan/[id]     → Détail d'un bilan passé
  /app/reports        → Historique des bilans
  /app/team           → Gestion équipe (plan Business)
  /app/settings       → Paramètres organisation
  /app/billing        → Abonnement Stripe
  /app/onboarding     → Wizard première connexion

API :
  /api/auth/*         → Better Auth
  /api/trpc/[trpc]    → tRPC
  /api/webhooks/stripe → Stripe webhooks
  /api/badge/[orgSlug] → Badge embed public
  /api/cron/sync-climate → Existant
```

---

# PHASES SAAS

---

## Phase S0 — Migration Auth : Clerk → Better Auth (~3-4 jours)

- [ ] Installer `better-auth` et ses dépendances
- [ ] Configurer Better Auth (email/password + Google OAuth + GitHub OAuth)
- [ ] Créer le schéma Better Auth dans Drizzle (tables user/session/account/verification)
- [ ] Créer les routes API `/api/auth/[...all]` (handler Better Auth)
- [ ] Créer le client auth (`src/lib/auth-client.ts`)
- [ ] Créer le server auth (`src/lib/auth.ts`)
- [ ] Middleware de protection des routes `/app/*`
- [ ] Refactorer les pages `/sign-in` et `/sign-up` avec Better Auth
- [ ] Migrer `src/lib/auth-utils.ts` (hasPremiumAccess → Better Auth sessions)
- [ ] Migrer `src/lib/anonymous-auth.ts` pour link session → compte
- [ ] Supprimer toutes les dépendances Clerk (`@clerk/nextjs`, etc.)
- [ ] Supprimer les env vars Clerk
- [ ] Tester auth complète (register, login, logout, session, protected routes)

---

## Phase S1 — Fondations Techniques (~2-3 jours)

- [ ] Upgrade Next.js 15 → 16 (adapter breaking changes)
- [ ] Setup Vitest + config (`vitest.config.ts`, scripts package.json)
- [ ] Écrire premiers tests unitaires (auth utils, calcul émissions)
- [ ] Nouvelles tables Drizzle :
  - `organizations` (id, name, slug, sector, size, logo_url)
  - `organization_members` (organization_id, user_id, role)
  - `carbon_reports` (organization_id, period, status, total_emissions, scope1/2/3)
  - `emission_entries` (report_id, category, subcategory, value, emission_factor, co2_kg)
  - `recommendations` (report_id, category, priority, title, estimated_reduction_kg, implemented)
  - `subscriptions` (organization_id, stripe_customer_id, plan, status, current_period_end)
- [ ] Migration Drizzle (`pnpm db:push`)
- [ ] Nouveaux tRPC routers skeleton : `organization`, `report`, `billing`
- [ ] Layout `/app` avec sidebar SaaS (navigation GreenScore)
- [ ] Store Zustand `useOrganization` (org active, membres)
- [ ] Page placeholder `/app/dashboard`

---

## Phase S2 — Calculateur B2B (~5-7 jours)

- [ ] Composant wizard multi-step avec stepper visuel
- [ ] **Catégorie Transport pro** :
  - Trajets domicile-bureau (distance, fréquence, mode)
  - Déplacements clients (km/mois, mode)
  - Véhicule de société (type, km/an)
  - Voyages train/avion pro (nb/an, distances)
- [ ] **Catégorie Numérique** :
  - Hébergement cloud (provider, nb instances, type)
  - Trafic site web (pages vues/mois)
  - Emails envoyés/mois, stockage cloud (Go)
  - Postes informatiques
- [ ] **Catégorie Bureaux** :
  - Surface (m²), type de bâtiment
  - Chauffage/climatisation, électricité (kWh/mois)
- [ ] **Catégorie Achats** :
  - Matériel informatique (PC, écrans, téléphones)
  - Mobilier, fournitures
- [ ] **Catégorie Sous-traitance** :
  - Estimation par secteur d'activité + montant annuel → coefficient ADEME
- [ ] Base de coefficients ADEME (`src/data/ademe-coefficients.json`)
- [ ] Résultats par Scope (1: directes, 2: énergie, 3: indirectes)
- [ ] Comparaison sectorielle
- [ ] Sauvegarde en DB (carbon_reports + emission_entries via tRPC)
- [ ] Gating par plan (Free = 3 catégories max, Pro/Business = tout)

---

## Phase S3 — Dashboard GreenScore & Suivi (~5-7 jours)

- [ ] Dashboard principal (`/app/dashboard`) :
  - Score carbone total, graphique évolution (Recharts)
  - Répartition par catégorie (donut) + par scope (bar chart)
- [ ] Historique des bilans (`/app/reports`) :
  - Liste bilans passés, click → détail
  - Refaire un bilan (trimestriel/annuel)
- [ ] Détail bilan (`/app/bilan/[id]`) :
  - Breakdown complet, équivalences visuelles, jauge colorée
- [ ] Objectifs & Recommandations :
  - Suggestions personnalisées, priorité haute/moyenne/basse
  - Checkbox "implémenté" pour tracker progression
- [ ] Indicateur progression objectif 2030/2050
- [ ] Vue équipe (plan Business) : score par collaborateur

---

## Phase S4 — Exports & Valeur Pro (~3-5 jours)

- [ ] Export PDF (jsPDF) : rapport RSE brandé avec logo TPE
- [ ] Badge/Widget embed : "Notre empreinte : X tonnes — suivi par GreenScore"
- [ ] Export CSV des données brutes
- [ ] Rapport automatique par email (Resend) : mensuel/trimestriel
- [ ] Gating : PDF/Widget/auto-email = Pro et Business uniquement

---

## Phase S5 — Monétisation Stripe (~2-3 jours)

- [ ] 3 plans :
  - **Gratuit** : 1 bilan/an, 3 catégories, pas d'export PDF
  - **Pro (9€/mois)** : bilans illimités, toutes catégories, PDF, recommandations, badge
  - **Business (29€/mois)** : multi-users (10), rapports auto, white-label PDF
- [ ] Stripe Checkout session + Customer Portal
- [ ] Webhooks Stripe (`/api/webhooks/stripe`)
- [ ] Page `/app/billing` + page `/pricing` publique
- [ ] Middleware vérification du plan sur routes protégées

---

## Phase S6 — Landing Page & Onboarding (~3-5 jours)

- [ ] Refonte landing page : hero GreenScore, features SaaS, pricing, outils gratuits, CTA signup
- [ ] Onboarding wizard (créer org → inviter collaborateurs → premier bilan)
- [ ] Emails transactionnels (Resend) : welcome, rappel bilan, tips, confirmation paiement
- [ ] SEO : réutiliser contenu articles existants
- [ ] Pages légales : CGV, mentions légales, RGPD

---

## Phase S7 — Polish & Tests (~3-5 jours)

- [ ] Tests Vitest : routers tRPC, logique calcul, auth utils
- [ ] Responsive mobile : layout /app, wizard bilan, dashboard
- [ ] Accessibilité (WCAG) : focus-visible, aria-labels, keyboard nav
- [ ] Animations Framer Motion cohérentes dans /app
- [ ] Error boundaries, loading skeletons, rate limiting
- [ ] Security audit : input validation, CSRF, XSS

---

# FEATURES EXISTANTES (COMPLÉTÉES)

---

## Dashboard Climat — 13 phases ✅

### Phase 1-5 ✅
- [x] Graphiques historiques, comparatifs, sparklines, jauges
- [x] Filtres période (5/10/20 ans), mode comparaison 2000 vs 2025
- [x] Taux de variation, seuils d'alerte, projections, points de non-retour
- [x] Explications détaillées, sources, impact humain
- [x] Top 10 pays, ranking, export CSV

### Phase 6-9 ✅
- [x] Alertes, bannière événements, insights du jour
- [x] Dark mode, personnalisation, export PDF/PNG, responsive
- [x] Émissions CO₂, biodiversité, qualité air, énergie renouvelable

### Phase 10-13 ✅
- [x] Score durabilité globale 0-100, tendance
- [x] Badges crédibilité, sources officielles, last sync
- [x] API temps réel (Open-Meteo, Vercel Cron 15min)
- [x] NASA EONET, GDACS, événements climatiques temps réel

### Phase 14 - Bonus Pro (optionnel)
- [ ] Benchmark empreinte carbone personnel
- [ ] Widget embeddable, alertes email, mode kiosk

---

## Mythes & Réalités — 4 phases ✅

### Phase M1-M2 ✅
- [x] Hero, search, filtres catégorie/difficulté, cards améliorées, animations
- [x] 20 mythes enrichis (category, difficulty, keyFacts, sources, relatedMyths)

### Phase M3-M4 ✅
- [x] Mode comparaison, quiz, partage social, mythes connexes
- [x] Graphiques, sources & méthodologie, proposer un mythe, newsletter, SEO, OG images

---

## Articles — 4 phases ✅

### Phase A1-A2 ✅
- [x] Images optimisées, animations, progress bar lecture
- [x] Catégories, featured, vues, filtres, pagination, sidebar populaires

### Phase A3-A4 ✅
- [x] CategoryBadge, StatHighlight, SourceCitation, TOC, RelatedArticles, ShareButtons
- [x] Réactions emoji, bookmarks, newsletter CTA, typography Playfair, SEO

---

## Timeline — 5 phases ✅

### Phase T1-T3 ✅
- [x] Timeline custom, animations scroll, gradient progression
- [x] Code couleur par période, icônes uniques, taille variable
- [x] Mini-timeline sidebar, scroll-to, indicateur année active

### Phase T4-T5 ✅
- [x] Modals détaillées (sources, fun facts, mini graphiques CO₂)
- [x] Responsive mobile/tablet, lazy loading, performance

---

## Calculateur Perso — 2/5 phases ✅

### Phase C1 ✅ — Animations & Micro-interactions
- [x] Stagger animations, counter animation, loading state, slider gradient, results stagger, pulse

### Phase C2 ✅ — Layout & Design Visuel
- [x] Layout asymétrique 7+5 cols, gradient mesh, glass morphism, méthodologie expandable, Lucide icons, séparateurs

### Phase C3 — Contenu Enrichi (à faire)
- [ ] InfoCard contexte, chart radial comparaison, équivalences visuelles, jauge colorée, breakdown %

### Phase C4 — Recommandations & Actions (à faire)
- [ ] Recommandations personnalisées, export PDF, partage social, bouton recalculer

### Phase C5 — Accessibilité & Polish (à faire)
- [ ] Focus-visible, aria-labels, prefers-reduced-motion, keyboard nav, responsive, skeleton, SEO

---

## Contenus prioritaires (backlog)

- [ ] Article Trump/Groenland (viral)
- [ ] Système Quote Check (coller citation → obtenir sources debunk)
- [ ] Section actualités climat dynamique
- [ ] Optimiser partage social (meta tags OG)

---

## Bonus / V2 (plus tard)

- [ ] Intégration API comptabilité (Pennylane, Indy) pour import achats
- [ ] Benchmark anonymisé ("Top 20% de votre secteur")
- [ ] IA : suggestions personnalisées de réduction (Gemini)
- [ ] Certification/label partenaire RSE
- [ ] API publique pour intégrateurs
- [ ] Bullshit-o-meter (compteur mensonges de la semaine)
- [ ] Infographies partageables réseaux sociaux

---

## Notes techniques

- Repo : eco-warrior-site (branding front : GreenScore)
- Calculateur perso existant = vitrine SEO gratuite
- Calculateur B2B = produit payant dans /app
- Coefficients ADEME déjà partiellement dans le projet → réutiliser + étendre
- UX : ultra simple, 15-20 KPI max, pas une usine à gaz
- Design : sobre et pro (pas militant/écolo-cliché), c'est un outil business
- Public cible ne connaît RIEN au carbone → tout vulgariser avec équivalences concrètes

### Données de référence
```
Moyenne française : 9.0 tonnes CO₂e/an
Objectif 2030 : 4.0 tonnes CO₂e/an
Objectif 2050 : 2.0 tonnes CO₂e/an
Seuil "soutenable" : < 2 tonnes

Équivalences (1 tonne CO₂) :
- 5 000 km en voiture essence
- 1 vol Paris-NYC aller
- 50 arbres pendant 1 an
- 12 mois de chauffage gaz (petit appart)
```
