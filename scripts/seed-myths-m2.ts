import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { posts } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

// Types pour les données enrichies
type Category = 'science' | 'energie' | 'solutions' | 'economie';
type Difficulty = 'debutant' | 'intermediaire' | 'avance';

interface Source {
  name: string;
  url?: string;
}

interface MythData {
  mythFr: string;
  realityFr: string;
  mythEn: string;
  realityEn: string;
  source?: string; // Ancienne source simple
  category: Category;
  difficulty: Difficulty;
  shortExplanation: string;
  keyFacts: string[];
  sources: Source[];
  relatedMythsSlugs?: string[]; // On résoudra les IDs après
}

// =========================================
// DONNÉES DES MYTHES EXISTANTS À ENRICHIR
// =========================================
const existingMythsEnrichment: Record<string, Partial<MythData>> = {
  // Mythe sur les volcans
  "volcans": {
    category: 'science',
    difficulty: 'debutant',
    shortExplanation: "Les humains émettent 100 fois plus de CO₂ que tous les volcans réunis chaque année.",
    keyFacts: [
      "Volcans : ~300 millions tonnes CO₂/an",
      "Humains : ~36 milliards tonnes CO₂/an",
      "Ratio : environ 1 pour 100"
    ],
    sources: [
      { name: "USGS", url: "https://www.usgs.gov/programs/VHP/volcanoes-can-affect-climate" },
      { name: "GIEC AR6", url: "https://www.ipcc.ch/report/ar6/wg1/" }
    ]
  },
  // Mythe sur le soleil
  "soleil": {
    category: 'science',
    difficulty: 'intermediaire',
    shortExplanation: "L'activité solaire est stable depuis 50 ans, elle ne peut pas expliquer le réchauffement actuel.",
    keyFacts: [
      "Irradiance solaire stable depuis 1950",
      "Réchauffement accéléré depuis 1980",
      "Corrélation parfaite avec hausse du CO₂"
    ],
    sources: [
      { name: "NASA Solar Irradiance", url: "https://climate.nasa.gov/causes/" },
      { name: "GIEC AR6 Chap. 7" }
    ]
  },
  // Mythe sur les scientifiques pas d'accord
  "consensus": {
    category: 'science',
    difficulty: 'debutant',
    shortExplanation: "97% des climatologues s'accordent sur l'origine humaine du réchauffement climatique.",
    keyFacts: [
      "97% de consensus parmi les experts",
      "Plus de 11 000 études analysées",
      "Aucune académie des sciences ne conteste"
    ],
    sources: [
      { name: "Cook et al. 2013", url: "https://iopscience.iop.org/article/10.1088/1748-9326/8/2/024024" },
      { name: "NASA Scientific Consensus", url: "https://climate.nasa.gov/scientific-consensus/" }
    ]
  },
  // Mythe climat a toujours changé
  "climat-change": {
    category: 'science',
    difficulty: 'intermediaire',
    shortExplanation: "La vitesse actuelle du réchauffement est 10 fois plus rapide que les changements naturels passés.",
    keyFacts: [
      "Sortie d'ère glaciaire : +4°C en 10 000 ans",
      "Réchauffement actuel : +1.2°C en 150 ans",
      "Vitesse sans précédent depuis 65 millions d'années"
    ],
    sources: [
      { name: "GIEC AR6 WG1", url: "https://www.ipcc.ch/report/ar6/wg1/" },
      { name: "Marcott et al. 2013" }
    ]
  },
  // Mythe CO2 c'est bon pour les plantes
  "co2-plantes": {
    category: 'solutions',
    difficulty: 'intermediaire',
    shortExplanation: "L'excès de CO₂ réduit la valeur nutritive des plantes et augmente les sécheresses.",
    keyFacts: [
      "Rendements agricoles menacés par les sécheresses",
      "Baisse de la teneur en protéines des céréales",
      "Effet de fertilisation limité par l'eau et les nutriments"
    ],
    sources: [
      { name: "Nature Climate Change", url: "https://www.nature.com/nclimate/" },
      { name: "GIEC AR6 WGII Chap. 5" }
    ]
  },
  // Mythe Groenland vert
  "groenland": {
    category: 'science',
    difficulty: 'avance',
    shortExplanation: "Le Groenland était vert il y a 400 000 ans, mais les conditions actuelles sont très différentes.",
    keyFacts: [
      "Vert il y a 400 000-800 000 ans",
      "Niveau mer 6-9m plus haut à l'époque",
      "Conditions climatiques incompatibles avec civilisation actuelle"
    ],
    sources: [
      { name: "Christ et al. 2021, Science" },
      { name: "GIEC AR6 WG1 Chap. 9" }
    ]
  },
  // Mythe modèles pas fiables
  "modeles": {
    category: 'science',
    difficulty: 'avance',
    shortExplanation: "Les modèles climatiques ont correctement prédit le réchauffement depuis 50 ans.",
    keyFacts: [
      "Prédictions de 1990 confirmées par observations",
      "Marge d'erreur de ±0.3°C sur 30 ans",
      "Physique des modèles basée sur lois connues"
    ],
    sources: [
      { name: "Hausfather et al. 2020, Geophysical Research Letters" },
      { name: "GIEC AR6 WG1 Chap. 4" }
    ]
  },
  // Mythe nucléaire dangereux
  "nucleaire": {
    category: 'energie',
    difficulty: 'intermediaire',
    shortExplanation: "Le nucléaire cause moins de morts par TWh que toutes les autres sources d'énergie, y compris le solaire.",
    keyFacts: [
      "0.03 morts/TWh pour le nucléaire",
      "24.6 morts/TWh pour le charbon",
      "4.6 morts/TWh pour le gaz"
    ],
    sources: [
      { name: "Our World in Data", url: "https://ourworldindata.org/safest-sources-of-energy" },
      { name: "Lancet 2007" }
    ]
  },
  // Mythe éoliennes tuent oiseaux
  "eoliennes-oiseaux": {
    category: 'energie',
    difficulty: 'debutant',
    shortExplanation: "Les chats tuent 1000 fois plus d'oiseaux que les éoliennes chaque année.",
    keyFacts: [
      "Chats : 1-4 milliards d'oiseaux/an (USA)",
      "Bâtiments : 600 millions/an",
      "Éoliennes : 140 000-500 000/an"
    ],
    sources: [
      { name: "Audubon Society", url: "https://www.audubon.org/news/will-wind-turbines-ever-be-safe-birds" },
      { name: "Loss et al. 2013, Nature Communications" }
    ]
  },
  // Mythe trop tard
  "trop-tard": {
    category: 'solutions',
    difficulty: 'debutant',
    shortExplanation: "Chaque dixième de degré évité compte. Il n'est jamais trop tard pour agir.",
    keyFacts: [
      "Différence majeure entre +1.5°C et +2°C",
      "Chaque action réduit les impacts futurs",
      "Effets positifs visibles en quelques années"
    ],
    sources: [
      { name: "GIEC SR15", url: "https://www.ipcc.ch/sr15/" },
      { name: "Jancovici - Plan de transformation" }
    ]
  },
  // Mythe réchauffement = plus de froid
  "rechauffement-froid": {
    category: 'science',
    difficulty: 'avance',
    shortExplanation: "Le réchauffement global cause des hivers plus instables avec des vagues de froid extrêmes.",
    keyFacts: [
      "Affaiblissement du vortex polaire",
      "Descentes d'air arctique plus fréquentes",
      "Température moyenne globale en hausse"
    ],
    sources: [
      { name: "Cohen et al. 2020, Nature Climate Change" },
      { name: "GIEC AR6 WG1 Chap. 11" }
    ]
  },
  // Mythe économie vs climat
  "economie-climat": {
    category: 'economie',
    difficulty: 'intermediaire',
    shortExplanation: "L'inaction climatique coûtera bien plus cher que la transition écologique.",
    keyFacts: [
      "Coût de l'inaction : 5-20% du PIB mondial",
      "Coût de la transition : 1-2% du PIB/an",
      "Création de millions d'emplois verts"
    ],
    sources: [
      { name: "Rapport Stern 2006" },
      { name: "IRENA Jobs Review 2023" },
      { name: "GIEC AR6 WGIII" }
    ]
  }
};

// =========================================
// NOUVEAUX MYTHES À AJOUTER (10-15)
// =========================================
const newMyths: MythData[] = [
  {
    mythFr: "Le méthane des vaches est négligeable",
    realityFr: "L'élevage est responsable de 14,5% des émissions mondiales de gaz à effet de serre, dont une grande partie est du méthane. Le méthane a un pouvoir réchauffant 80 fois supérieur au CO₂ sur 20 ans. Réduire la consommation de viande est un levier climatique majeur.",
    mythEn: "Cattle methane emissions are negligible",
    realityEn: "Livestock accounts for 14.5% of global greenhouse gas emissions, much of which is methane. Methane has 80 times the warming potential of CO₂ over 20 years. Reducing meat consumption is a major climate lever.",
    category: 'solutions',
    difficulty: 'debutant',
    shortExplanation: "L'élevage émet 14,5% des GES mondiaux, dont beaucoup de méthane ultra-réchauffant.",
    keyFacts: [
      "14,5% des émissions mondiales",
      "Méthane : 80x plus réchauffant que CO₂ (sur 20 ans)",
      "1kg boeuf = 27kg CO₂eq"
    ],
    sources: [
      { name: "FAO GLEAM", url: "https://www.fao.org/gleam/en/" },
      { name: "GIEC AR6 WGIII Chap. 7" }
    ]
  },
  {
    mythFr: "Les énergies renouvelables ne sont pas fiables",
    realityFr: "Le réseau électrique gère déjà l'intermittence via le stockage, l'interconnexion et les smart grids. L'Allemagne, le Danemark et le Portugal ont régulièrement plus de 50% d'électricité renouvelable. Le problème est technique et résolu, pas fondamental.",
    mythEn: "Renewable energies are unreliable",
    realityEn: "The power grid already manages intermittency through storage, interconnection and smart grids. Germany, Denmark and Portugal regularly have more than 50% renewable electricity. The problem is technical and solvable, not fundamental.",
    category: 'energie',
    difficulty: 'intermediaire',
    shortExplanation: "L'intermittence est un défi technique résolu par le stockage et les smart grids.",
    keyFacts: [
      "Danemark : 80% renouvelable en 2023",
      "Batteries : coût divisé par 10 en 10 ans",
      "Interconnexions européennes opérationnelles"
    ],
    sources: [
      { name: "RTE Futurs énergétiques 2050" },
      { name: "IRENA Global Renewables Outlook" },
      { name: "IEA World Energy Outlook 2023" }
    ]
  },
  {
    mythFr: "Le réchauffement s'est arrêté depuis 15 ans",
    realityFr: "Les 8 dernières années sont les plus chaudes jamais enregistrées. Le prétendu 'hiatus' de 1998-2012 était dû à un El Niño exceptionnel en 1998 qui a créé une anomalie statistique. La tendance à long terme montre un réchauffement continu et accéléré.",
    mythEn: "Global warming has stopped for 15 years",
    realityEn: "The last 8 years are the warmest ever recorded. The alleged 'hiatus' from 1998-2012 was due to an exceptional El Niño in 1998 that created a statistical anomaly. The long-term trend shows continued and accelerating warming.",
    category: 'science',
    difficulty: 'intermediaire',
    shortExplanation: "Les 8 dernières années sont les plus chaudes. Le 'hiatus' était une illusion statistique.",
    keyFacts: [
      "2023 : année la plus chaude de l'histoire",
      "El Niño 1998 : anomalie statistique",
      "Océans absorbent 90% de la chaleur excédentaire"
    ],
    sources: [
      { name: "NASA GISS", url: "https://climate.nasa.gov/vital-signs/global-temperature/" },
      { name: "NOAA Global Climate Report" }
    ]
  },
  {
    mythFr: "La couche d'ozone et le réchauffement climatique, c'est pareil",
    realityFr: "Ce sont deux problèmes distincts. La couche d'ozone protège des UV et a été endommagée par les CFC (interdits en 1987). Le réchauffement est causé par les gaz à effet de serre (CO₂, méthane). Le succès du Protocole de Montréal montre qu'on peut agir !",
    mythEn: "The ozone layer and climate change are the same thing",
    realityEn: "These are two distinct problems. The ozone layer protects from UV and was damaged by CFCs (banned in 1987). Warming is caused by greenhouse gases (CO₂, methane). The success of the Montreal Protocol shows we can act!",
    category: 'science',
    difficulty: 'debutant',
    shortExplanation: "Deux problèmes différents : ozone = UV/CFC, climat = GES/CO₂. Le succès ozone inspire !",
    keyFacts: [
      "Ozone : protection UV, problème CFC",
      "Climat : effet de serre, problème CO₂",
      "Montréal 1987 : preuve qu'on peut agir"
    ],
    sources: [
      { name: "ONU Environnement - Couche d'ozone" },
      { name: "NASA Ozone Watch", url: "https://ozonewatch.gsfc.nasa.gov/" }
    ]
  },
  {
    mythFr: "Planter des arbres suffit pour compenser nos émissions",
    realityFr: "Il faudrait planter une surface équivalente aux États-Unis chaque année pour compenser nos émissions. Les arbres mettent 20-50 ans à absorber le CO₂, et les incendies (plus fréquents) relâchent tout. La priorité est de réduire les émissions à la source.",
    mythEn: "Planting trees is enough to offset our emissions",
    realityEn: "We would need to plant an area equivalent to the United States every year to offset our emissions. Trees take 20-50 years to absorb CO₂, and wildfires (more frequent) release it all. The priority is reducing emissions at source.",
    category: 'solutions',
    difficulty: 'intermediaire',
    shortExplanation: "Il faudrait planter la superficie des USA chaque année. La vraie solution : réduire à la source.",
    keyFacts: [
      "36 Gt CO₂/an à absorber",
      "1 arbre = 25kg CO₂/an (mature)",
      "Incendies multipliés par 2 depuis 1980"
    ],
    sources: [
      { name: "Bastin et al. 2019, Science" },
      { name: "Jancovici - Les puits de carbone" }
    ]
  },
  {
    mythFr: "Les panneaux solaires consomment plus d'énergie qu'ils n'en produisent",
    realityFr: "Un panneau solaire rembourse son énergie de fabrication en 1-3 ans selon la région. Il produit ensuite de l'électricité propre pendant 25-30 ans. Le bilan énergétique est donc largement positif : 10 à 30 fois l'énergie investie.",
    mythEn: "Solar panels consume more energy than they produce",
    realityEn: "A solar panel pays back its manufacturing energy in 1-3 years depending on location. It then produces clean electricity for 25-30 years. The energy balance is therefore largely positive: 10 to 30 times the energy invested.",
    category: 'energie',
    difficulty: 'debutant',
    shortExplanation: "Remboursé en 1-3 ans, produit 25-30 ans : bilan 10-30x positif.",
    keyFacts: [
      "EROI solaire : 10-30x l'énergie investie",
      "Durée de vie : 25-30 ans",
      "Temps de retour : 1-3 ans"
    ],
    sources: [
      { name: "Fraunhofer ISE PV Report" },
      { name: "NREL Life Cycle Assessment" }
    ]
  },
  {
    mythFr: "L'hydrogène est la solution miracle",
    realityFr: "L'hydrogène est utile pour décarboner l'industrie lourde (acier, chimie) et certains transports. Mais 95% de l'hydrogène actuel est produit à partir de gaz fossile. L'hydrogène vert (électrolyse) perd 30% d'énergie. Ce n'est pas une solution universelle.",
    mythEn: "Hydrogen is the miracle solution",
    realityEn: "Hydrogen is useful for decarbonizing heavy industry (steel, chemicals) and some transport. But 95% of current hydrogen is produced from fossil gas. Green hydrogen (electrolysis) loses 30% of energy. It's not a universal solution.",
    category: 'energie',
    difficulty: 'avance',
    shortExplanation: "Utile pour l'industrie lourde, mais 95% vient du fossile et l'électrolyse perd 30% d'énergie.",
    keyFacts: [
      "95% hydrogène actuel = fossile (gris)",
      "Électrolyse : 30% pertes énergétiques",
      "Pertinent : sidérurgie, chimie, maritime"
    ],
    sources: [
      { name: "IEA Hydrogen Report" },
      { name: "Jancovici - L'hydrogène", url: "https://jancovici.com" },
      { name: "ADEME - Hydrogène" }
    ]
  },
  {
    mythFr: "Le recyclage résout le problème du plastique",
    realityFr: "Seulement 9% du plastique mondial est recyclé. Le reste finit en décharge, incinéré ou dans la nature. Chaque recyclage dégrade la qualité (downcycling). La vraie solution : réduire la production de plastique à la source et favoriser le réemploi.",
    mythEn: "Recycling solves the plastic problem",
    realityEn: "Only 9% of global plastic is recycled. The rest ends up in landfills, incinerated or in nature. Each recycling degrades quality (downcycling). The real solution: reduce plastic production at source and promote reuse.",
    category: 'solutions',
    difficulty: 'debutant',
    shortExplanation: "Seulement 9% recyclé. Le reste en décharge ou nature. Solution : réduire à la source.",
    keyFacts: [
      "9% recyclé mondialement",
      "91% en décharge, incinéré ou nature",
      "8 millions tonnes/an dans les océans"
    ],
    sources: [
      { name: "OCDE Global Plastics Outlook 2022" },
      { name: "ONU Environnement" }
    ]
  },
  {
    mythFr: "Les océans absorbent tout le CO₂, pas de souci",
    realityFr: "Les océans absorbent 25% de notre CO₂, ce qui cause leur acidification. Le pH a baissé de 30% depuis l'ère industrielle, menaçant coraux et coquillages. La capacité d'absorption diminue avec le réchauffement. C'est une bombe à retardement.",
    mythEn: "Oceans absorb all the CO₂, no worries",
    realityEn: "Oceans absorb 25% of our CO₂, causing their acidification. pH has dropped 30% since the industrial era, threatening corals and shellfish. Absorption capacity decreases with warming. It's a time bomb.",
    category: 'science',
    difficulty: 'intermediaire',
    shortExplanation: "Absorbent 25% du CO₂ mais s'acidifient (-30% pH). Coraux en danger. Capacité qui diminue.",
    keyFacts: [
      "25% du CO₂ absorbé par les océans",
      "pH : -30% depuis 1850 (acidification)",
      "50% des coraux déjà perdus"
    ],
    sources: [
      { name: "GIEC SROCC (Océans et Cryosphère)" },
      { name: "NOAA Ocean Acidification", url: "https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-acidification" }
    ]
  },
  {
    mythFr: "La fonte en Antarctique est naturelle et cyclique",
    realityFr: "La perte de glace en Antarctique a été multipliée par 3 depuis 2012. La calotte ouest est instable et contient assez de glace pour élever la mer de 3 mètres. Les cycles naturels n'expliquent pas cette accélération brutale.",
    mythEn: "Antarctic ice melt is natural and cyclical",
    realityEn: "Ice loss in Antarctica has tripled since 2012. The West Antarctic ice sheet is unstable and contains enough ice to raise sea levels by 3 meters. Natural cycles don't explain this sudden acceleration.",
    category: 'science',
    difficulty: 'avance',
    shortExplanation: "Perte de glace x3 depuis 2012. Calotte ouest = +3m de mer potentiel. Accélération anormale.",
    keyFacts: [
      "Perte de glace x3 depuis 2012",
      "Calotte ouest : +3m de mer potentiel",
      "Accélération incompatible avec cycles naturels"
    ],
    sources: [
      { name: "GIEC SROCC" },
      { name: "Shepherd et al. 2018, Nature" },
      { name: "NASA Ice Sheets", url: "https://climate.nasa.gov/vital-signs/ice-sheets/" }
    ]
  },
  {
    mythFr: "La transition écologique détruit l'emploi",
    realityFr: "La transition crée plus d'emplois qu'elle n'en détruit. Le secteur des énergies renouvelables emploie déjà 12 millions de personnes dans le monde. La rénovation thermique, l'économie circulaire et l'agriculture durable sont des gisements d'emplois locaux non délocalisables.",
    mythEn: "The ecological transition destroys jobs",
    realityEn: "The transition creates more jobs than it destroys. The renewable energy sector already employs 12 million people worldwide. Thermal renovation, circular economy and sustainable agriculture are sources of local, non-relocatable jobs.",
    category: 'economie',
    difficulty: 'debutant',
    shortExplanation: "Renouvelables = 12M emplois. Rénovation et économie circulaire = emplois locaux non délocalisables.",
    keyFacts: [
      "12 millions d'emplois dans les renouvelables",
      "Rénovation : 200 000 emplois potentiels/an (France)",
      "Emplois locaux, non délocalisables"
    ],
    sources: [
      { name: "IRENA Renewable Energy Jobs 2023" },
      { name: "ADEME Emplois de la transition" }
    ]
  },
  {
    mythFr: "La Chine pollue, donc nos efforts sont inutiles",
    realityFr: "La Chine émet 27% du CO₂ mondial mais produit 80% de nos panneaux solaires et est leader des batteries. Par habitant, un Américain émet 2x plus qu'un Chinois. Les émissions historiques (depuis 1850) sont dominées par l'Occident.",
    mythEn: "China pollutes, so our efforts are useless",
    realityEn: "China emits 27% of global CO₂ but produces 80% of our solar panels and leads in batteries. Per capita, an American emits 2x more than a Chinese person. Historical emissions (since 1850) are dominated by the West.",
    category: 'economie',
    difficulty: 'intermediaire',
    shortExplanation: "Chine = 27% CO₂ mais leader climat. Par habitant, USA = 2x Chine. Historique : Occident responsable.",
    keyFacts: [
      "Chine : 27% émissions mais 80% panneaux solaires",
      "Par habitant : USA 15t, Chine 8t, France 5t",
      "Émissions historiques : 47% USA+Europe"
    ],
    sources: [
      { name: "Global Carbon Project" },
      { name: "Our World in Data - CO₂ emissions", url: "https://ourworldindata.org/co2-emissions" }
    ]
  }
];

// =========================================
// FONCTION PRINCIPALE DE SEED
// =========================================
async function seedMythsM2() {
  console.log("🚀 Phase M2 - Enrichissement des mythes...\n");

  try {
    // 1. Récupérer tous les posts existants
    const existingPosts = await db.query.posts.findMany();
    console.log(`📚 ${existingPosts.length} mythes existants trouvés\n`);

    // 2. Enrichir les posts existants
    console.log("📝 Enrichissement des mythes existants...");
    let enrichedCount = 0;

    for (const post of existingPosts) {
      // Déterminer la catégorie par analyse du contenu
      const mythLower = post.mythFr.toLowerCase();
      let enrichment: Partial<MythData> | undefined;

      // Matcher par mots-clés dans le mythe
      if (mythLower.includes('volcan')) {
        enrichment = existingMythsEnrichment['volcans'];
      } else if (mythLower.includes('soleil') || mythLower.includes('solar')) {
        enrichment = existingMythsEnrichment['soleil'];
      } else if (mythLower.includes('scientifique') || mythLower.includes('consensus') || mythLower.includes('accord')) {
        enrichment = existingMythsEnrichment['consensus'];
      } else if (mythLower.includes('toujours chang') || mythLower.includes('déjà chang')) {
        enrichment = existingMythsEnrichment['climat-change'];
      } else if (mythLower.includes('co2') && mythLower.includes('plant')) {
        enrichment = existingMythsEnrichment['co2-plantes'];
      } else if (mythLower.includes('groenland')) {
        enrichment = existingMythsEnrichment['groenland'];
      } else if (mythLower.includes('modèle') || mythLower.includes('prédiction') || mythLower.includes('prévision')) {
        enrichment = existingMythsEnrichment['modeles'];
      } else if (mythLower.includes('nucléaire') || mythLower.includes('nuclear')) {
        enrichment = existingMythsEnrichment['nucleaire'];
      } else if (mythLower.includes('éolien') && mythLower.includes('oiseau')) {
        enrichment = existingMythsEnrichment['eoliennes-oiseaux'];
      } else if (mythLower.includes('trop tard') || mythLower.includes('foutu')) {
        enrichment = existingMythsEnrichment['trop-tard'];
      } else if (mythLower.includes('froid') || mythLower.includes('hiver') || mythLower.includes('neige')) {
        enrichment = existingMythsEnrichment['rechauffement-froid'];
      } else if (mythLower.includes('économi') || mythLower.includes('coût') || mythLower.includes('emploi') || mythLower.includes('cher')) {
        enrichment = existingMythsEnrichment['economie-climat'];
      }

      // Si pas de match spécifique, assigner des valeurs par défaut intelligentes
      if (!enrichment) {
        // Analyse automatique pour assigner catégorie
        let category: Category = 'solutions';
        if (mythLower.includes('température') || mythLower.includes('climat') || mythLower.includes('réchauff') || mythLower.includes('glace') || mythLower.includes('mer')) {
          category = 'science';
        } else if (mythLower.includes('énergie') || mythLower.includes('nucléaire') || mythLower.includes('éolien') || mythLower.includes('solaire')) {
          category = 'energie';
        } else if (mythLower.includes('économi') || mythLower.includes('argent') || mythLower.includes('coût')) {
          category = 'economie';
        }

        // Difficulté basée sur la longueur
        const length = post.realityFr.length;
        let difficulty: Difficulty = 'debutant';
        if (length > 500) difficulty = 'avance';
        else if (length > 250) difficulty = 'intermediaire';

        // Short explanation = premières 120 caractères de la réalité
        const shortExplanation = post.realityFr.slice(0, 150).trim() + (post.realityFr.length > 150 ? '...' : '');

        enrichment = {
          category,
          difficulty,
          shortExplanation,
          keyFacts: [],
          sources: post.source ? [{ name: post.source }] : []
        };
      }

      // Mettre à jour le post
      await db.update(posts)
        .set({
          category: enrichment.category,
          difficulty: enrichment.difficulty,
          shortExplanation: enrichment.shortExplanation,
          keyFacts: JSON.stringify(enrichment.keyFacts || []),
          sources: JSON.stringify(enrichment.sources || []),
          relatedMyths: JSON.stringify([])
        })
        .where(eq(posts.id, post.id));

      enrichedCount++;
      console.log(`  ✓ [${enrichedCount}/${existingPosts.length}] "${post.mythFr.slice(0, 50)}..." → ${enrichment.category}`);
    }

    console.log(`\n✅ ${enrichedCount} mythes existants enrichis !\n`);

    // 3. Ajouter les nouveaux mythes
    console.log("➕ Ajout des nouveaux mythes...");
    let addedCount = 0;

    for (const myth of newMyths) {
      // Vérifier si le mythe existe déjà (par similarité du titre)
      const exists = existingPosts.some(p =>
        p.mythFr.toLowerCase().includes(myth.mythFr.toLowerCase().slice(0, 20)) ||
        myth.mythFr.toLowerCase().includes(p.mythFr.toLowerCase().slice(0, 20))
      );

      if (exists) {
        console.log(`  ⏭ Mythe similaire existe déjà: "${myth.mythFr.slice(0, 40)}..."`);
        continue;
      }

      // Générer un slug unique
      const slug = myth.mythFr
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 60);

      await db.insert(posts).values({
        mythFr: myth.mythFr,
        realityFr: myth.realityFr,
        mythEn: myth.mythEn,
        realityEn: myth.realityEn,
        source: myth.sources[0]?.name || null,
        slug: slug,
        category: myth.category,
        difficulty: myth.difficulty,
        shortExplanation: myth.shortExplanation,
        keyFacts: JSON.stringify(myth.keyFacts),
        sources: JSON.stringify(myth.sources),
        relatedMyths: JSON.stringify([]),
        likes: 0
      });

      addedCount++;
      console.log(`  ✓ [${addedCount}] "${myth.mythFr.slice(0, 50)}..." ajouté`);
    }

    console.log(`\n✅ ${addedCount} nouveaux mythes ajoutés !`);

    // 4. Résumé final
    const finalPosts = await db.query.posts.findMany();
    console.log(`\n🎉 Phase M2 terminée !`);
    console.log(`   Total mythes en BDD : ${finalPosts.length}`);
    console.log(`   Mythes enrichis : ${enrichedCount}`);
    console.log(`   Nouveaux mythes : ${addedCount}`);

  } catch (error) {
    console.error("❌ Erreur:", error);
    throw error;
  }
}

// Exécution
seedMythsM2()
  .then(() => {
    console.log("\n✅ Script terminé avec succès");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\n❌ Script échoué:", err);
    process.exit(1);
  });
