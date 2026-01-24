  
 

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

### Phase M4 - Polish & SEO (Optionnel ~4h)
- [ ] Graphiques interactifs (Recharts) pour mythes avec data
- [ ] Section "Sources & Méthodologie"
- [ ] Form "Proposer un mythe" (avec modération)
- [ ] Newsletter CTA "Mythe du mois"
- [ ] SEO : Schema FAQ structured data
- [ ] OpenGraph images dynamiques par mythe
- [ ] Page dédiée par mythe (/debunk/[slug])

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

## Idées futures
- Fiches sur les personnalités climatosceptiques connues
- Système de gamification (badges pour utilisateurs actifs)
- API publique pour partager les données de debunk
