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

- [ ] 2-3 directions artistiques (palette, typo, style d'illustration) en planche de tendance
- [ ] Choix de Leture
- [ ] Tokens CSS (clair/sombre) + typo appliqués au projet
- [ ] Une illustration SVG « étalon » par thème pour valider le style
- [ ] Refaire les images OG (4 fichiers en runtime `edge`, à passer en Node — le prérendu plante sur une URL invalide)

## Phase 2 — Le récit (page d'accueil)

- [ ] Scroll narratif en 4 chapitres, fil rouge « On veut vivre »
- [ ] Ouverture : ce que tu aimes (ton coin, ta santé, tes gosses)
- [ ] Chapitres Climat / Vivant / Paix / Justice sociale : ce qui est menacé et par qui
- [ ] Final : l'espoir et l'action (pas de culpabilisation)

## Phase 3 — Les 4 hubs thématiques

- [ ] `/climat` — faits clés + mythes démontés (recyclage Debunk / dashboard)
- [ ] `/vivant` — biodiversité + santé (pesticides, Cancer Colère)
- [ ] `/paix` — fossiles qui financent les guerres, indépendance énergétique
- [ ] `/justice-sociale` — superprofits, pollution des ultra-riches, qui paie
- [ ] Liens vers les assos de chaque thème
- [ ] Décider du sort de timeline / carte / calculateur (intégrés à un hub ou retirés)

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
