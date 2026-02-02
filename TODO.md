  
 

# Eco Warrior - Roadmap

## Objectif
Transformer le site en arme de combat contre les climatosceptiques avec du contenu viral et des outils percutants.

---

## Tâches à faire

### Priorité haute
- [ ] **Article Trump/Groenland** - Créer l'article viral sur l'ironie de Trump qui veut le Groenland dont les ressources sont accessibles grâce au réchauffement qu'il nie
- [ ] **Système Quote Check** - Outil pour coller une citation climatosceptique et obtenir les sources pour la démonter

### Priorité moyenne
- [ ] **Section Actualités** - Ajouter une section news climat dynamique
- [ ] **Optimiser partage social** - Meta tags OG, images de partage optimisées pour viralité

### Priorité basse (nice to have)
- [ ] **Bullshit-o-meter** - Compteur des mensonges climatosceptiques de la semaine
- [ ] **Infographies partageables** - Visuels clés à partager sur les réseaux

---

## Dashboard Climat - Refonte Complète

### Phase 1 - Graphiques & Visualisations ✅
- [x] Graphiques historiques (évolution 5/10/20 ans pour chaque métrique)
- [x] Graphiques comparatifs (CO₂ 2000 vs 2024, température par région)
- [x] Mini-charts sparkline dans les cartes KPI
- [x] Indicateurs visuels (barres de progression, jauges pour seuils alarmants)

### Phase 2 - Filtres & Interactivité ✅
- [x] Sélecteur de période (5 ans / 10 ans / 20 ans / Tout)
- [ ] Sélecteur de région (Mondial/Continent/Pays) - données non disponibles
- [ ] Filtre de source de données (choisir entre sources scientifiques) - une seule source actuellement
- [x] Mode comparaison (2000 vs 2025 côte à côte avec graphique barres)

### Phase 3 - Statistiques Avancées ✅
- [x] Taux de variation (% d'augmentation/diminution sur différentes périodes)
- [x] Seuils d'alerte (rouge/orange/vert selon le danger)
- [x] Projections futures (2050, 2100)
- [x] Points de non-retour (seuils critiques)

### Phase 4 - Informations Contextuelles ✅
- [x] Explications détaillées (modals/tooltips pour chaque métrique)
- [x] Sources + dernière mise à jour (date/heure précise)
- [x] Références scientifiques (liens vers études officielles)
- [x] Impact humain (équivalences concrètes: "X catastrophes naturelles", "Y voitures")

### Phase 5 - Tables de Données ✅
- [x] Top 10 pays (plus grands émetteurs, plus affectés)
- [x] Ranking progrès climatique par pays
- [x] Tableau détaillé + export CSV

### Phase 6 - Alertes & Notifications ✅
- [x] Système d'alerte ("⚠️ Nouveau record CO₂ atteint")
- [x] Bannière événements climatiques majeurs du jour

### Phase 7 - Analyses & Insights ✅
- [x] Widget "Insight du jour" (fait clé sur le climat)
- [x] Articles recommandés liés
- [x] Comparaisons intéressantes ("CO₂ en baisse cette année pour la 1ère fois")

### Phase 8 - User Experience ✅
- [x] Dark mode toggle
- [x] Personnalisation cartes (drag & drop, afficher/cacher)
- [x] Boutons partage réseaux sociaux
- [x] Export PDF/PNG du dashboard
- [x] Optimisation responsive mobile/tablette

### Phase 9 - Indicateurs Supplémentaires ✅
- [x] Émissions CO₂ globales (tonnes/an - source IEA)
- [x] Biodiversité (perte d'espèces, déforestation)
- [x] Qualité de l'air (index AQI global)
- [x] % énergie renouvelable mondiale
- [x] Population affectée (réfugiés climatiques)

### Phase 10 - Stats de Performance Globale ✅
- [x] Score durabilité globale (0-100 de l'état du climat)
- [x] Tendance générale ("S'améliore" ✅ ou "Empire" ❌)
- [x] Progression objectifs 2030/2050

### Phase 11 - Footer & Crédibilité ✅
- [x] Badge "Données vérifiées scientifiquement"
- [x] Section Sources officielles (NASA, NOAA, GIEC, IEA, WWF) avec liens
- [x] Last sync + API status

### Phase 12 - Données Temps Réel (API) ✅
- [x] Connecter API météo/climat (Open-Meteo - gratuit)
- [x] Cron job pour sync données officielles (Vercel Cron toutes les 15min)
- [x] Cache serveur + fallback données statiques
- [x] Indicateur "Dernière MAJ" avec vraie date source
- [x] Badge Live/Cache/Statique dans le header
- [x] Bouton refresh manuel

### Phase 13 - Événements Climatiques Temps Réel ✅
- [x] Connecter API NASA EONET (catastrophes naturelles en cours)
- [x] Connecter API GDACS (alertes ONU catastrophes mondiales)
- [x] Remplacer bannière statique par événements réels
- [x] Filtrer par type (feux, inondations, tempêtes, volcans)
- [x] Liens vers sources officielles (NASA, NOAA, Copernicus)
- [x] Géolocalisation des événements sur la carte

### Phase 14 - Bonus Pro (optionnel)
- [ ] Benchmark empreinte carbone personnel
- [ ] Widget embeddable pour autres sites
- [ ] Alertes email (résumé hebdo/mensuel)
- [ ] Mode kiosk (affichage plein écran pour écrans publics)

---

## Page Mythes & Réalités - Refonte Complète 🎯

### Phase M1 - Quick Wins UI/UX ✅
- [x] Hero Section avec stats dynamiques (X mythes démontés, Y sources)
- [x] Search bar intelligent avec highlight résultats
- [x] Filtres visuels par catégorie (Science, Énergie, Solutions, Économie)
- [x] Filtres par difficulté (Débutant, Intermédiaire, Avancé)
- [x] Cards améliorées avec preview 2-3 lignes + badges
- [x] Animations Framer Motion (stagger entrée, hover states)
- [x] Progression utilisateur localStorage (mythes lus, favoris)

### Phase M2 - Contenu & BDD (Moyen ~5-6h)
- [x] Migration BDD : ajouter champs category, difficulty, keyFacts, shortExplanation
- [x] Migration BDD : ajouter champ relatedMyths (IDs connexes)
- [x] Enrichir les 19 mythes existants avec nouvelles données
- [x] Ajouter 10-15 nouveaux mythes :
  - "Le méthane des vaches est négligeable"
  - "Les énergies renouvelables ne sont pas fiables"
  - "Le réchauffement s'est arrêté depuis 15 ans"
  - "La couche d'ozone et le climat c'est pareil"
  - "Planter des arbres suffit pour compenser"
  - "Les panneaux solaires consomment plus qu'ils produisent"
  - "L'hydrogène est la solution miracle"
  - "Le recyclage résout le problème du plastique"
  - "Les océans absorbent tout le CO2"
  - "La fonte en Antarctique est normale"
- [x] Sources multiples par mythe (GIEC, Jancovici, Bon Pote, Le Réveilleur)
- [x] KeyFacts (3 bullet points) pour chaque mythe

### Phase M3 - Features Avancées ✅
- [x] Mode comparaison (2-3 mythes côte à côte)
- [x] Mythes connexes en bas de modal
- [x] Modal enrichie avec sections visuelles
- [x] Quiz Mode "Vrai ou Faux" avec scoring
- [x] Partage social avec quotes pré-remplies
- [x] Bouton "J'ai appris quelque chose" (analytics)

### Phase M4 - Polish & SEO ✅ COMPLETED
- [x] Graphiques interactifs (Recharts) pour mythes avec data
- [x] Section "Sources & Méthodologie"
- [x] Form "Proposer un mythe" (avec modération)
- [x] Newsletter CTA "Mythe du mois"
- [x] SEO : Schema FAQ structured data
- [x] OpenGraph images dynamiques par mythe
- [x] Page dédiée par mythe (/debunk/[slug])

### Sources à intégrer
- GIEC (AR6)
- Jean-Marc Jancovici (jancovici.com)
- Le Réveilleur (YouTube)
- Bon Pote (blog)
- Carbon Brief
- Our World in Data
- NASA Climate
- NOAA

---

## Fait
- [x] **Repositionnement du site** - Ton combatif direct "La science contre les climatosceptiques" (commit 691abf9)
- [x] **Enrichir la section Debunk** - 20 mythes climatosceptiques avec sources scientifiques (8 → 20)
- [x] **Badge "En développement"** - Ajout d'un badge visible dans la sidebar pour prévenir les utilisateurs

---

## Notes techniques
- Stack: Next.js 15, tRPC, PostgreSQL (Drizzle), Tailwind
- Articles en JSON dans `src/data/articles.json`
- Posts Debunk en BDD via tRPC `post.getPosts`
- Scanner IA avec Gemini

---

---

## Page Articles - Refonte Complète 🎯

### Phase A1 - Quick Wins & Fixes (~2-3h) ✅
- [x] Fixer images avec next/image + placeholder blur
- [x] Fallback images gradient si erreur de chargement
- [x] Animations staggerées cards (Framer Motion)
- [x] Hover effects améliorés (glow + elevation)
- [x] Progress bar de lecture dans article détail

### Phase A2 - Structure & Filtres (~4-5h) ✅
- [x] Migration BDD : ajouter champ `category` aux articles
- [x] Migration BDD : ajouter champ `featured` (boolean) pour À la une
- [x] Migration BDD : ajouter champ `views` pour compteur lectures
- [x] Système de filtres par catégorie (Climat, Océans, Énergie, Biodiversité, Solutions)
- [x] Section "À la une" avec article featured plus grand
- [x] Pagination ou infinite scroll
- [x] Sidebar "Articles populaires" (triés par vues)
- [x] Breadcrumb navigation dans les articles

### Phase A3 - Composants Enrichis (~3-4h) ✅
- [x] `<CategoryBadge />` avec couleurs dynamiques par catégorie
- [x] `<StatHighlight />` pour les chiffres clés (ex: +1.5°C)
- [x] `<SourceCitation />` pour les références scientifiques
- [x] `<TableOfContents />` sticky pour les longs articles
- [x] `<RelatedArticles />` carousel en fin d'article
- [x] `<ShareButtons />` améliorés (Twitter, LinkedIn, copie lien)

### Phase A4 - Engagement & Polish (~3-4h) ✅
- [x] Système de réactions (😱 Alarmant / 💡 Éclairant / 💪 Motivant)
- [x] Compteur de lectures visible sur les cards
- [x] Bookmarks/favoris (localStorage)
- [x] Newsletter CTA en fin d'article (réutiliser composant debunk)
- [x] Grain/noise background subtle
- [x] Typography distinctive (Playfair Display pour titres)
- [x] SEO : Schema Article structured data
- [x] OpenGraph images dynamiques par article

### Catégories d'Articles Prévues
| Catégorie | Icône | Couleur |
|-----------|-------|---------|
| 🌡️ Climat | thermomètre | blue |
| 🌊 Océans | vague | cyan |
| 🔥 Énergie | éclair | yellow |
| 🌳 Biodiversité | feuille | green |
| 💡 Solutions | ampoule | emerald |
| 🔬 Science | microscope | purple |

---

---

## Page Chronologie (Timeline) - Refonte Complète 🎯

### Phase T1 - Timeline Custom & Animations ✅
- [x] Créer composant `<TimelineCustom />` pour remplacer react-vertical-timeline-component
- [x] Ajouter vraie ligne verticale de progression (gradient animé)
- [x] Points de connexion animés sur la ligne pour chaque date
- [x] Animations fade-in + slide au scroll (Framer Motion)
- [x] Stagger animation (délai séquentiel entre les cartes)
- [x] Animation ligne qui se "remplit" au scroll (scroll progress)

### Phase T2 - Design & Différenciation Visuelle ✅
- [x] Code couleur par période dans timeline.json :
  - 🟡 Découvertes scientifiques (1824-1958) - amber/gold
  - 🟠 Alertes climatiques (1988-2015) - orange
  - 🔴 Urgence climatique (2023-2024) - red gradient
- [x] Icônes uniques par événement (🔬 Microscope, 📊 BarChart, 🌍 Globe, etc.)
- [x] Taille de carte variable selon importance (Accord de Paris plus grand)
- [x] Hover state avec scale + glow sur les cartes
- [x] Gradient subtil background + noise texture overlay

### Phase T3 - Navigation & Interactivité ✅
- [x] Mini-timeline fixe en sidebar avec années cliquables
- [x] Scroll-to smooth quand on clique sur une date
- [x] Indicateur "année active" dans la mini-timeline
- [x] Indicateur de progression scroll (barre latérale)

### Phase T4 - Modal Détails & Contenu Enrichi ✅
- [x] Cartes cliquables pour ouvrir modal avec :
  - Plus de détails
  - Image/graphique associé (mini graphique CO2, jauge température)
  - Sources/liens officiels
  - Fun facts
- [x] Animation modal smooth (AnimatePresence)
- [x] Enrichir timeline.json avec nouveaux champs (sources, funFacts, detailsFr, co2Data, temperatureData)
- [x] Ajouter 3 événements manquants (Rapport Meadows 1972, Protocole Kyoto 1997, Rapport Stern 2006)
- [x] Mini graphique CO2 pour Courbe de Keeling
- [x] Compteur animé pour seuils (+1.5°C)

### Phase T5 - Responsive & Performance (~1-2h) ✅
- [x] Mobile : Timeline centrée, cartes empilées verticalement
- [x] Tablet : Réduire marges, adapter tailles
- [x] Lazy loading cartes non visibles (Intersection Observer)
- [x] Préférer CSS animations quand possible
- [x] will-change sur éléments animés

### Palette Timeline
```css
--timeline-discovery: #f59e0b;  /* Amber - découvertes */
--timeline-warning: #f97316;    /* Orange - alertes */
--timeline-danger: #ef4444;     /* Red - urgence */
--timeline-line: linear-gradient(180deg, #22c55e, #f97316, #ef4444);
```

---

## Page Calculateur Carbone - Refonte Complète 🎯

### Phase C1 - Animations & Micro-interactions ✅
- [x] Page load stagger (titre, subtitle, form fields avec délai séquentiel)
- [x] Counter animation pour le résultat (0 → X.XX tonnes en 1.5s)
- [x] Button loading state avec spinner pendant le calcul
- [x] Hover states sur toutes les cards (scale + glow subtil)
- [x] Slider avec gradient dynamique qui suit la valeur
- [x] Results cards apparition staggerée (transport, diet, energy)
- [x] Pulse effect sur le chiffre final

### Phase C2 - Layout & Design Visuel (~3-4h)
- [ ] Layout asymétrique : Form (7 cols) + Preview live (5 cols sticky)
- [ ] Background gradient mesh animé subtil (style landing page)
- [ ] Glass morphism sur les cards (backdrop-blur)
- [ ] Section méthodologie : cards cliquables/expandables
- [ ] Icônes Lucide au lieu des emojis (Car, Utensils, Zap)
- [ ] Séparateurs visuels entre sections (lignes gradient)

### Phase C3 - Contenu Enrichi & Contexte (~4-5h)
- [ ] InfoCard "Le saviez-vous ?" (moyenne FR 9t, objectif 2030 2t)
- [ ] Chart radial comparaison (Recharts) : Vous vs Moyenne vs Objectif
- [ ] Cards équivalences visuelles :
  - 🌳 X arbres à planter pour compenser
  - 🚗 X km en voiture équivalent
  - ✈️ X vols Paris-NYC
  - 🏠 X mois de chauffage
- [ ] Jauge visuelle avec zones colorées (vert < 4t, orange 4-8t, rouge > 8t)
- [ ] Breakdown en % (pie chart ou bar chart horizontal)

### Phase C4 - Recommandations & Actions (~3-4h)
- [ ] Système de recommandations personnalisées basées sur le breakdown :
  - Si transport > 40% → suggestions mobilité douce
  - Si alimentation > 30% → suggestions régime
  - Si énergie > 30% → suggestions économies
- [ ] Cards recommandations avec priorité (haute/moyenne/basse)
- [ ] CTA "Télécharger mon rapport PDF" (jsPDF déjà installé)
- [ ] CTA "Partager mes résultats" (Twitter, LinkedIn, copie lien)
- [ ] Section "Passer à l'action" avec liens ressources (ADEME, Nos Gestes Climat)
- [ ] Bouton "Recalculer" pour modifier ses réponses

### Phase C5 - Accessibilité & Polish (~2-3h)
- [ ] Focus-visible sur tous les éléments interactifs
- [ ] aria-labels pour les sliders et résultats
- [ ] prefers-reduced-motion : désactiver animations
- [ ] Keyboard navigation complète (Tab, Enter)
- [ ] Mobile responsive (stack vertical, touch-friendly sliders)
- [ ] Loading skeleton pendant le calcul
- [ ] SEO : Schema FAQ pour la méthodologie
- [ ] Meta tags OG avec résultat partageable

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

### Priorités Quick Wins
1. ⚡ Counter animation + stagger (impact immédiat)
2. ⚡ InfoCard contexte + jauge colorée (valeur éducative)
3. ⚡ Layout asymétrique + preview live (UX moderne)

---

## Idées futures
- Fiches sur les personnalités climatosceptiques connues
- Système de gamification (badges pour utilisateurs actifs)
- API publique pour partager les données de debunk
- Commentaires modérés avec système de vote
- Quiz interactif en fin d'article
- Widget embeddable pour autres sites
