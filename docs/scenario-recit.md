# Scénario — Le récit de la page d'accueil

> Spec de la phase 2. À valider par Leture avant de coder.
> Cible : quelqu'un d'indifférent ou de climatosceptique. Règle : on part de ce qu'il aime, jamais de ce qu'on lui reproche.

## Le principe

Un long scroll en 6 temps. **La lumière suit l'histoire** : on commence en plein jour (Herbier), le ciel s'assombrit à mesure qu'on découvre ce qui menace (Nuit), puis le jour se lève au final (Aube). La palette du récit est pilotée par le scroll, indépendamment du switch clair/sombre du reste du site.

Chaque chapitre suit la même mécanique :

1. **L'accroche humaine** : une image, une phrase qui parle de sa vie.
2. **Le fait** : un seul chiffre fort, sourcé, animé.
3. **« Oui mais… »** : l'objection sceptique la plus courante, démontée en deux phrases (lien vers le mythe complet).
4. **La bascule** : ce que ça change pour lui.
5. **Le lien vers le hub** du thème, pour aller plus loin.

### Pourquoi cet ordre (et pas Climat en premier)

Le climat est le sujet le plus « politisé » : attaqué de front, le sceptique se braque. On commence donc par ce qui est **intime et incontestable** (sa santé, le vivant autour de lui), puis **son portefeuille** (justice sociale), puis **son pays** (paix, indépendance). Quand on arrive au climat, il a déjà dit « oui » trois fois.

---

## 0. Ouverture — « Ce que tu aimes »

- **Visuel** : planche d'herbier plein écran, fougère et abeille au trait fin qui se dessinent (animation du tracé SVG).
- **Titre** : *On veut vivre.*
- **Texte** : « Avant les chiffres, avant les débats : pense à un endroit que tu aimes. La forêt derrière chez toi. La plage de ton enfance. Le jardin de ta grand-mère. »
- **Interaction (option)** : 4 choix, « Mon coin », « Ma santé », « Mes enfants », « Mon porte-monnaie ». Ça ne change pas le parcours, mais le texte de chaque chapitre te rappelle ton choix.
- **Indice de scroll** : « Descends. On va se promener. »

## 1. Vivant — « Ce qui chante encore »

- **Visuel** : l'herbier se vide. Les insectes et les oiseaux s'effacent un à un au scroll.
- **Accroche** : « Tu te souviens du pare-brise couvert d'insectes après un trajet en été ? Plus maintenant. »
- **Le fait** : la taille moyenne des populations d'animaux sauvages suivies dans le monde a chuté de **73 % depuis 1970** (WWF, *Living Planet Report* 2024).
- **La santé** : l'Inserm (expertise collective 2021) établit une **présomption forte** de lien entre l'exposition professionnelle aux pesticides et certains cancers (lymphomes non hodgkiniens, prostate) ainsi que la maladie de Parkinson. Mention et lien : **Cancer Colère**.
- **« Oui mais la nature s'adapte »** → Elle s'adapte sur des millions d'années. Là, ça se joue en une vie humaine.
- **Bascule** : « Le vivant, c'est aussi toi. Ce qui empoisonne les abeilles finit dans ton assiette. »
- **Lien** → `/vivant`

## 2. Justice sociale — « Qui paie l'addition »

- **Visuel** : balance illustrée : un jet privé contre une rangée de petites maisons.
- **Accroche** : « Toi, on te demande de trier tes déchets et de baisser le chauffage. »
- **Le fait** : les **1 % les plus riches** émettent autant de CO₂ que les **66 % les plus pauvres** de la planète (Oxfam, *Climate Equality*, 2023).
- **Complément** : TotalEnergies a gagné **5,4 milliards de dollars en un trimestre** (chiffre cité par le mouvement du 26 septembre). Le Fonds vert, qui finance l'adaptation des communes, est passé de **2,5 milliards à 837 millions d'euros** (Rue89 Bordeaux).
- **« Oui mais l'écologie, c'est un truc de riches »** → C'est l'inverse : les plus modestes subissent le plus (logements mal isolés, canicules, factures) et polluent le moins.
- **Bascule** : « L'écologie n'est pas contre toi. Elle est contre ceux qui te font payer leur addition. »
- **Lien** → `/justice-sociale`

## 3. Paix — « L'énergie de la guerre »

- **Visuel** : un pipeline qui serpente et se transforme en fil barbelé.
- **Accroche** : « Chaque plein d'essence envoie de l'argent quelque part. Tu sais où ? »
- **Le fait** : la France importe la quasi-totalité de son pétrole et de son gaz. Depuis 2022, l'Europe a versé à la Russie pour ses énergies fossiles des sommes du même ordre que son aide à l'Ukraine (CREA). **Chiffres exacts à sourcer.**
- **« Oui mais les renouvelables, c'est pas fiable »** → Le soleil et le vent ne font pas la guerre, et on ne les importe pas. Lien vers le mythe existant.
- **Bascule** : « Sortir des fossiles, ce n'est pas un caprice d'écolo. C'est l'indépendance de ton pays. »
- **Lien** → `/paix`

## 4. Climat — « Ce qu'on vit déjà »

- **Visuel** : c'est la nuit. Les « warming stripes » de la France (vraies données Météo-France) défilent de 1900 à aujourd'hui, du bleu au rouge sombre.
- **Accroche** : « Été 2022, la Gironde brûle. Été 2026, encore. »
- **Le fait** : la France s'est déjà réchauffée d'environ **+1,7 °C** depuis le début du XXᵉ siècle (Météo-France), plus vite que la moyenne mondiale. **Chiffre à revérifier.**
- **« Oui mais le climat a toujours changé »** → Oui, sur des dizaines de milliers d'années. Là, c'est en un siècle, et c'est nous (GIEC). Lien vers le mythe existant.
- **Bascule** : « Ce n'est plus une prévision. C'est ton été. »
- **Lien** → `/climat` (dashboard et mythes)

## 5. Final — « Je rêvais d'un autre monde »

- **Visuel** : le jour se lève. Palette Aube, soleil orange sur l'horizon.
- **Titre** : *Je rêvais d'un autre monde.* Puis, au scroll : *Il existe déjà, par morceaux.*
- **Contenu** : 4 exemples concrets et réels, un par thème (ex. une commune qui a replanté ses haies, un réseau de transports gratuits, une coopérative d'énergie citoyenne, une ferme bio qui vit bien). **À sourcer, de préférence en Nouvelle-Aquitaine.**
- **Texte** : « Le 26 septembre 2026, 3 000 personnes ont marché à Bordeaux. Pas contre toi. Pour que tes enfants aient un été. »

## 6. Agir

- **Trois portes, sans culpabiliser** :
  - **Comprendre** → les 4 hubs et les mythes.
  - **Rejoindre** → assos et prochaines marches (26 septembre, Cancer Colère, collectifs locaux).
  - **Soutenir** → le don (lien Stripe existant).
- **Clin d'œil** : un lien vers **La Rue**, le mur des pancartes, avec en aperçu « CACAPIPITALISME » en style Affiche de lutte.

---

## Règles de rédaction

- Un chiffre = une source cliquable. Aucun chiffre non vérifié ne part en prod.
- Tutoiement, phrases courtes, jamais « vous devriez ».
- Pas de moquerie envers le lecteur. L'humour et la colère vivent dans La Rue.

## Technique (pour plus tard)

- Animations au scroll : `motion` (déjà installé), en respectant `prefers-reduced-motion`.
- Illustrations : SVG inline codés, tracés animés (`pathLength`).
- La palette du récit bascule par chapitre via des variables CSS.
- Mobile d'abord : chaque « écran » du récit tient sur un téléphone.
