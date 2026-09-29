import type { ChapitreContenu, Choix, Exemple } from "./types";

export const CHOIX: { id: Choix; label: string }[] = [
  { id: "coin", label: "Mon coin" },
  { id: "sante", label: "Ma santé" },
  { id: "enfants", label: "Mes enfants" },
  { id: "portemonnaie", label: "Mon porte-monnaie" },
];

// Ordre voulu : de l'intime et incontestable (vivant, santé) vers le plus débattu (climat).
// Voir docs/scenario-recit.md. Un chiffre = une source vérifiable.
export const CHAPITRES: ChapitreContenu[] = [
  {
    id: "vivant",
    numero: "01",
    theme: "Vivant",
    titre: "Ce qui chante encore",
    ambiance: "jour",
    accroche:
      "Tu te souviens du pare-brise couvert d'insectes après un trajet d'été ? Regarde-le aujourd'hui.",
    fait: {
      valeur: 73,
      prefixe: "−",
      suffixe: " %",
      texte:
        "C'est la chute moyenne de la taille des populations d'animaux sauvages suivies dans le monde, entre 1970 et 2020.",
      source: {
        label: "WWF, Living Planet Report 2024",
        href: "https://www.worldwildlife.org/publications/2024-living-planet-report/",
      },
    },
    complement: {
      texte:
        "Et le vivant, c'est aussi nous : pour l'Inserm, le lien entre l'exposition professionnelle aux pesticides et six maladies est fortement présumé, dont les lymphomes non hodgkiniens, le cancer de la prostate et la maladie de Parkinson.",
      source: {
        label: "Inserm, expertise collective 2021",
        href: "https://www.inserm.fr/expertise-collective/pesticides-et-sante-nouvelles-donnees-2021/",
      },
    },
    objection: {
      question: "« Oui mais la nature s'adapte. »",
      reponse:
        "Elle s'adapte sur des milliers de générations. Là, tout se joue en une seule vie humaine : la tienne.",
    },
    bascule:
      "Ce qui empoisonne les abeilles finit dans ton assiette. Protéger le vivant, c'est te protéger toi.",
    rappels: {
      coin: "Ton coin, c'est d'abord ce qui y vit : les haies, les oiseaux, les grenouilles de la mare.",
      sante: "Ta santé commence dans ce que tu respires, ce que tu bois et ce que tu manges.",
      enfants: "Tes enfants verront-ils encore des lucioles un soir d'été ?",
      portemonnaie:
        "Sans pollinisateurs, fruits et légumes deviennent plus rares, donc plus chers.",
    },
  },
  {
    id: "justice-sociale",
    numero: "02",
    theme: "Justice sociale",
    titre: "Qui paie l'addition",
    ambiance: "soir",
    accroche:
      "Toi, on te demande de trier tes déchets, de baisser le chauffage et de prendre moins la voiture.",
    fait: {
      affichage: "1 % = 66 %",
      texte:
        "En 2019, les 1 % les plus riches de la planète ont émis autant de CO₂ que les deux tiers les plus pauvres de l'humanité.",
      source: {
        label: "Oxfam et SEI, Climate Equality, 2023",
        href: "https://www.oxfam.org/en/research/climate-equality-planet-99",
      },
    },
    complement: {
      texte:
        "Pendant ce temps, le Fonds vert, qui aide les communes à s'adapter, est passé de 2,5 milliards à 837 millions d'euros.",
      source: {
        label: "Rue89 Bordeaux, septembre 2026",
        href: "https://rue89bordeaux.com/2026/09/une-marche-pour-le-climat-et-le-vivant-ce-26-septembre-a-bordeaux/",
      },
    },
    objection: {
      question: "« Oui mais l'écologie, c'est un truc de riches. »",
      reponse:
        "C'est l'inverse. Les plus modestes polluent le moins et encaissent le plus : logements mal isolés, canicules, factures qui flambent.",
    },
    bascule:
      "L'écologie n'est pas contre toi. Elle est contre ceux qui te font payer leur addition.",
    rappels: {
      coin: "Les communes qui protègent ton coin ont vu leurs aides fondre.",
      sante: "Les plus modestes vivent souvent au bord des routes et des usines, et le paient dans leurs poumons.",
      enfants: "Une passoire thermique, c'est un enfant qui a froid l'hiver et trop chaud l'été.",
      portemonnaie: "Là, c'est littéralement ton porte-monnaie qui paie.",
    },
  },
  {
    id: "paix",
    numero: "03",
    theme: "Paix",
    titre: "L'énergie de la guerre",
    ambiance: "crepuscule",
    accroche: "Chaque plein d'essence envoie de l'argent quelque part. Tu sais où ?",
    fait: {
      valeur: 99,
      suffixe: " %",
      texte:
        "La part du pétrole consommé en France qui est importée. Pour le gaz, c'est 97 %. Facture énergétique du pays en 2025 : 45,8 milliards d'euros.",
      source: {
        label: "SDES, bilan énergétique de la France 2025",
        href: "https://www.statistiques.developpement-durable.gouv.fr/bilan-energetique-de-la-france-en-2025-donnees-provisoires",
      },
    },
    complement: {
      texte:
        "Pendant la troisième année de guerre en Ukraine, l'Union européenne a payé plus à la Russie pour son gaz et son pétrole (21,9 milliards d'euros) qu'elle n'a donné d'aide financière à l'Ukraine (18,7 milliards).",
      source: {
        label: "CREA, février 2025",
        href: "https://energyandcleanair.org/publication/eu-imports-of-russian-fossil-fuels-in-third-year-of-invasion-surpass-financial-aid-sent-to-ukraine/",
      },
    },
    objection: {
      question: "« Oui mais les renouvelables, c'est pas fiable. »",
      reponse:
        "Le soleil et le vent ne déclarent pas de guerre, et personne ne peut couper leur robinet.",
      lien: {
        href: "/mythes/les-energies-renouvelables-ne-sont-pas-fiables",
        label: "Le mythe décortiqué",
      },
    },
    bascule:
      "Sortir des fossiles, ce n'est pas un caprice d'écolo. C'est l'indépendance de ton pays.",
    rappels: {
      coin: "Un pays qui produit sa propre énergie décide pour lui-même, et pour ton coin.",
      sante: "Moins de pétrole brûlé, c'est aussi moins de particules fines dans tes poumons.",
      enfants: "Leur avenir ne devrait pas dépendre d'un dictateur et d'un robinet de gaz.",
      portemonnaie: "Quand le gaz flambe là-bas, c'est ta facture qui flambe ici.",
    },
  },
  {
    id: "climat",
    numero: "04",
    theme: "Climat",
    titre: "Ce qu'on vit déjà",
    ambiance: "nuit",
    accroche: "Été 2022, la Gironde brûle. Été 2026, encore.",
    fait: {
      valeur: 2.2,
      prefixe: "+",
      suffixe: " °C",
      texte:
        "C'est le réchauffement déjà mesuré en France depuis le début du XXᵉ siècle. Plus vite que la moyenne mondiale.",
      source: {
        label: "Météo-France, repris par le ministère de la Transition écologique",
        href: "https://www.ecologie.gouv.fr/impacts-du-changement-climatique-atmosphere-temperatures-et-precipitations",
      },
    },
    objection: {
      question: "« Oui mais le climat a toujours changé. »",
      reponse:
        "Oui, sur des dizaines de milliers d'années. Là, c'est en un siècle, et c'est nous : le GIEC le dit sans ambiguïté.",
      lien: { href: "/mythes/le-climat-a-toujours-change-c-est-naturel", label: "Le mythe décortiqué" },
    },
    bascule: "Ce n'est plus une prévision. C'est ton été.",
    rappels: {
      coin: "Ton coin a déjà changé : regarde tes étés, tes rivières, tes vignes.",
      sante: "Les canicules tuent, d'abord les plus fragiles.",
      enfants: "Ils vivront le climat qu'on leur laisse.",
      portemonnaie: "Sécheresses, incendies, assurances : tout ça finit par se payer.",
    },
    hub: { href: "/mythes", label: "Les 30 mythes décortiqués" },
  },
];

// « Il existe déjà, par morceaux » : exemples réels et sourcés, un par thème.
// Vérifiés le 2026-09-28.
export const EXEMPLES: Exemple[] = [
  {
    theme: "Vivant",
    titre: "200 km de haies replantées",
    lieu: "Nouvelle-Aquitaine",
    texte:
      "Pendant l'hiver 2024-2025, l'association Prom'Haies a accompagné 180 agriculteurs et fait planter plus de 200 km de haies.",
    source: {
      label: "Prom'Haies",
      href: "https://www.promhaies.net/news/sauvons-le-pacte-en-faveur-de-la-haie,20586/",
    },
  },
  {
    theme: "Justice sociale",
    titre: "Des bus gratuits pour tout le monde",
    lieu: "Dunkerque",
    texte:
      "Depuis la gratuité en 2018, la fréquentation a presque triplé : 9 millions de voyages en 2017, 24 millions en 2025.",
    source: {
      label: "La Gazette France, avril 2026",
      href: "https://www.lagazettefrance.fr/article/dunkerque-le-reseau-de-bus-gratuits-enregistre-de-nouveaux-records",
    },
  },
  {
    theme: "Paix",
    titre: "Des habitants qui produisent leur électricité",
    lieu: "Haute-Vienne et Dordogne",
    texte:
      "La Citoyenne Solaire, coopérative d'habitants, couvre 19 toitures de panneaux depuis 2017 : de quoi alimenter environ 329 foyers (hors chauffage).",
    source: {
      label: "Énergie Partagée",
      href: "https://energie-partagee.org/projets/la-citoyenne-solaire/",
    },
  },
  {
    theme: "Climat",
    titre: "−40 % d'électricité consommée",
    lieu: "Loos-en-Gohelle",
    texte:
      "Entre 2016 et 2021, la consommation d'électricité des bâtiments municipaux et de l'éclairage public a baissé de 40 %.",
    source: {
      label: "Ville de Loos-en-Gohelle",
      href: "https://loos-en-gohelle.fr/plan-de-sobriete-energetique/",
    },
  },
];
