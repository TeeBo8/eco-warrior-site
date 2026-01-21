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
