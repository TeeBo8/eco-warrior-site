import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { posts, mapPoints, articles } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

// 👇 NOUVEAU : IMPACTS MONDIAUX POUR LA CARTE 👇
const globalImpactPoints = [
  // --- AMÉRIQUE DU NORD ---
  { 
    lat: 34.0522, lng: -118.2437, 
    name_en: "California Wildfires", name_fr: "Feux de forêt en Californie",
    impact_en: "The fire season is becoming longer and more intense, with recent years seeing record-breaking megafires fueled by extreme heat and drought.",
    impact_fr: "La saison des feux devient plus longue et plus intense, les dernières années ayant connu des mégafeux records alimentés par une chaleur et une sécheresse extrêmes.",
    category: "heatwave", image_url: null
  },
  { 
    lat: 25.7617, lng: -80.1918, 
    name_en: "Miami Sea Level Rise", name_fr: "Montée des eaux à Miami",
    impact_en: "Regular 'sunny-day flooding' now occurs as sea levels rise, threatening trillions of dollars in property and vital infrastructure.",
    impact_fr: "Des 'inondations par temps ensoleillé' se produisent régulièrement avec la montée du niveau de la mer, menaçant des billions de dollars de biens immobiliers et d'infrastructures vitales.",
    category: "erosion", image_url: null
  },

  // --- AMÉRIQUE DU SUD ---
  { 
    lat: -14.2350, lng: -51.9253, 
    name_en: "Amazon Rainforest Deforestation", name_fr: "Déforestation de la Forêt Amazonienne",
    impact_en: "Deforestation, often linked to agricultural expansion exacerbated by climate change, is pushing parts of the rainforest towards a tipping point, turning it from a carbon sink to a source.",
    impact_fr: "La déforestation, souvent liée à l'expansion agricole exacerbée par le changement climatique, pousse des parties de la forêt vers un point de bascule, la transformant d'un puits de carbone en une source.",
    category: "biodiversity", image_url: null
  },

  // --- AFRIQUE ---
  { 
    lat: 9.0765, lng: 7.3986, 
    name_en: "Lake Chad Shrinking", name_fr: "Assèchement du Lac Tchad",
    impact_en: "The lake has shrunk by 90% since the 1960s due to climate change, overuse of water, and prolonged drought, affecting millions of people who depend on it.",
    impact_fr: "Le lac a diminué de 90% depuis les années 1960 à cause du changement climatique, de la surexploitation de l'eau et de sécheresses prolongées, affectant des millions de personnes qui en dépendent.",
    category: "drought", image_url: null
  },

  // --- ASIE ---
  { 
    lat: 27.9881, lng: 86.9250, 
    name_en: "Himalayan Glaciers Melting", name_fr: "Fonte des Glaciers de l'Himalaya",
    impact_en: "Glaciers are melting at an unprecedented rate, threatening water supplies for billions of people in Asia and increasing the risk of glacial lake outburst floods (GLOFs).",
    impact_fr: "Les glaciers fondent à un rythme sans précédent, menaçant l'approvisionnement en eau de milliards de personnes en Asie et augmentant le risque d'inondations par rupture de lac glaciaire (GLOF).",
    category: "drought", image_url: null
  },
  { 
    lat: 35.6895, lng: 139.6917, 
    name_en: "Tokyo Typhoons", name_fr: "Typhons à Tokyo",
    impact_en: "Warmer ocean waters are fueling more powerful and slower-moving typhoons, bringing extreme rainfall and record-breaking flooding to the world's largest metropolis.",
    impact_fr: "Le réchauffement des eaux océaniques alimente des typhons plus puissants et plus lents, apportant des pluies extrêmes et des inondations records à la plus grande métropole du monde.",
    category: "storm", image_url: null
  },
  
  // --- OCÉANIE ---
  { 
    lat: -18.2871, lng: 147.6992, 
    name_en: "Great Barrier Reef Bleaching", name_fr: "Blanchissement de la Grande Barrière de Corail",
    impact_en: "Mass bleaching events, caused by rising ocean temperatures, have severely damaged the world's largest coral reef system, threatening a massive and unique ecosystem.",
    impact_fr: "Des épisodes de blanchissement massif, causés par la hausse des températures de l'océan, ont gravement endommagé le plus grand système de récifs coralliens du monde, menaçant un écosystème immense et unique.",
    category: "biodiversity", image_url: null
  },
  
  // --- ANTARCTIQUE ---
  {
    lat: -75.250973, lng: -0.071389,
    name_en: "Antarctic Ice Sheet Melting", name_fr: "Fonte de la calotte glaciaire de l'Antarctique",
    impact_en: "The West Antarctic Ice Sheet is losing mass at an accelerating rate, contributing significantly to global sea-level rise.",
    impact_fr: "La calotte glaciaire de l'Antarctique occidental perd de la masse à un rythme accéléré, contribuant de manière significative à l'élévation du niveau de la mer à l'échelle mondiale.",
    category: "erosion", image_url: null
  },

  // --- EUROPE ---
  {
    lat: 46.8182, lng: 8.2275,
    name_en: "Alpine Glaciers Retreat", name_fr: "Recul des glaciers alpins",
    impact_en: "Alpine glaciers have lost over 60% of their volume since 1850, with accelerated melting in recent decades affecting water resources and mountain ecosystems.",
    impact_fr: "Les glaciers alpins ont perdu plus de 60% de leur volume depuis 1850, avec une fonte accélérée ces dernières décennies affectant les ressources en eau et les écosystèmes montagnards.",
    category: "drought", image_url: null
  },
  {
    lat: 52.3676, lng: 4.9041,
    name_en: "Netherlands Sea Level Defense", name_fr: "Défense contre la montée des eaux aux Pays-Bas",
    impact_en: "Two-thirds of the Netherlands lies below sea level, making it one of the most vulnerable countries to sea-level rise, requiring constant adaptation of flood defenses.",
    impact_fr: "Les deux tiers des Pays-Bas se situent sous le niveau de la mer, en faisant l'un des pays les plus vulnérables à la montée du niveau de la mer, nécessitant une adaptation constante des défenses contre les inondations.",
    category: "erosion", image_url: null
  }
];

// 👇 POINTS D'IMPACT POUR LA FRANCE (existants ou nouveaux) 👇
const franceImpactPoints = [
  {
    lat: 43.2965, lng: 5.3698,
    name_en: "Mediterranean Coast Erosion", name_fr: "Érosion du littoral méditerranéen",
    impact_en: "Rising sea levels and intensified storms are accelerating coastal erosion, threatening seaside towns and their economies.",
    impact_fr: "La montée du niveau de la mer et l'intensification des tempêtes accélèrent l'érosion côtière, menaçant les villes balnéaires et leur économie.",
    category: "erosion", image_url: null
  },
  {
    lat: 45.4642, lng: 2.1640,
    name_en: "Central France Drought", name_fr: "Sécheresse en France centrale",
    impact_en: "Recurring droughts are becoming more frequent and severe, affecting agriculture and water resources in central regions.",
    impact_fr: "Les sécheresses récurrentes deviennent plus fréquentes et sévères, affectant l'agriculture et les ressources en eau des régions centrales.",
    category: "drought", image_url: null
  },
  {
    lat: 43.6047, lng: 1.4442,
    name_en: "Toulouse Heat Waves", name_fr: "Canicules à Toulouse",
    impact_en: "Urban heat islands intensify during heat waves, posing health risks to vulnerable populations and straining energy systems.",
    impact_fr: "Les îlots de chaleur urbains s'intensifient pendant les canicules, posant des risques sanitaires aux populations vulnérables et mettant à rude épreuve les systèmes énergétiques.",
    category: "heatwave", image_url: null
  },
  {
    lat: 45.7640, lng: 4.8357,
    name_en: "Lyon Air Quality", name_fr: "Qualité de l'air à Lyon",
    impact_en: "Climate change exacerbates air pollution episodes, with warmer temperatures increasing ozone formation and health impacts.",
    impact_fr: "Le changement climatique exacerbe les épisodes de pollution atmosphérique, les températures plus chaudes augmentant la formation d'ozone et les impacts sanitaires.",
    category: "heatwave", image_url: null
  },
  {
    lat: 46.2044, lng: 6.1432,
    name_en: "Alpine Ski Resort Impact", name_fr: "Impact sur les stations de ski alpines",
    impact_en: "Rising temperatures and changing precipitation patterns threaten the viability of low-altitude ski resorts, affecting mountain economies.",
    impact_fr: "L'augmentation des températures et le changement des régimes de précipitations menacent la viabilité des stations de ski de basse altitude, affectant l'économie montagnarde.",
    category: "drought", image_url: null
  }
];

async function main() {
  console.log("🌱 Seeding posts avec du contenu éditorial de qualité...");
  
  const editorialPosts = [
    {
      mythFr: "Le nucléaire est plus dangereux pour le climat que le charbon.",
      realityFr: "C'est l'inverse. Sur son cycle de vie complet, le nucléaire émet environ 12g de CO2e/kWh, contre plus de 800g pour le charbon. C'est l'une des sources d'énergie les moins carbonées disponibles.",
      mythEn: "Nuclear energy is more dangerous for the climate than coal.",
      realityEn: "It's the opposite. Over its complete life cycle, nuclear emits about 12g CO2e/kWh, compared to over 800g for coal. It's one of the least carbon-intensive energy sources available.",
      source: "GIEC AR6, Jean-Marc Jancovici - theshiftproject.org"
    },
    {
      mythFr: "Les voitures électriques polluent plus que les voitures thermiques à cause de leurs batteries.",
      realityFr: "Faux. Même en incluant la fabrication des batteries, une voiture électrique émet 2 à 3 fois moins de CO2 sur son cycle de vie qu'une voiture thermique équivalente. L'avantage augmente avec un mix électrique décarboné.",
      mythEn: "Electric cars pollute more than thermal cars because of their batteries.",
      realityEn: "False. Even including battery manufacturing, an electric car emits 2 to 3 times less CO2 over its life cycle than an equivalent thermal car. The advantage increases with a low-carbon electricity mix.",
      source: "ADEME, Transport & Environment studies 2020-2023"
    },
    {
      mythFr: "Il faut choisir entre croissance économique et protection de l'environnement.",
      realityFr: "C'est un faux dilemme. La transition écologique peut être un moteur de croissance durable. Les investissements dans les énergies renouvelables créent plus d'emplois par euro investi que les énergies fossiles.",
      mythEn: "We must choose between economic growth and environmental protection.",
      realityEn: "This is a false dilemma. The ecological transition can be a driver of sustainable growth. Investments in renewable energy create more jobs per euro invested than fossil fuels.",
      source: "IRENA Global Energy Transformation, OECD Green Growth studies"
    },
    {
      mythFr: "Le réchauffement climatique s'est arrêté depuis 1998.",
      realityFr: "Faux. 2023 a été l'année la plus chaude jamais enregistrée. Les 10 années les plus chaudes ont toutes eu lieu depuis 2010. Le réchauffement continue de manière constante et s'accélère.",
      mythEn: "Global warming stopped since 1998.",
      realityEn: "False. 2023 was the hottest year ever recorded. The 10 hottest years have all occurred since 2010. Warming continues consistently and is accelerating.",
      source: "NASA GISS, NOAA, Copernicus Climate Change Service 2024"
    },
    {
      mythFr: "Le CO2 n'est pas un polluant, c'est de la nourriture pour les plantes.",
      realityFr: "Certes, les plantes utilisent le CO2, mais l'augmentation de sa concentration dans l'atmosphère perturbe l'équilibre climatique. Au-delà d'un certain seuil, même les plantes souffrent de la chaleur et des sécheresses.",
      mythEn: "CO2 is not a pollutant, it's plant food.",
      realityEn: "While plants do use CO2, increasing its concentration in the atmosphere disrupts climate balance. Beyond a certain threshold, even plants suffer from heat and droughts.",
      source: "GIEC AR6 Working Group I, NASA Earth Science Division"
    },
    {
      mythFr: "Les éoliennes tuent plus d'oiseaux que n'importe quelle autre cause.",
      realityFr: "Faux. Les éoliennes causent environ 0,3% de la mortalité aviaire. Les principales causes sont les collisions avec les bâtiments (58%), les chats domestiques (13%), et les lignes électriques (8%).",
      mythEn: "Wind turbines kill more birds than any other cause.",
      realityEn: "False. Wind turbines cause about 0.3% of bird mortality. The main causes are collisions with buildings (58%), domestic cats (13%), and power lines (8%).",
      source: "US Fish and Wildlife Service, BirdLife International"
    },
    {
      mythFr: "Il faut 1000 ans pour recycler une bouteille en plastique.",
      realityFr: "C'est la durée de dégradation naturelle, pas de recyclage. En réalité, une bouteille PET se recycle en 2-4 semaines et peut devenir une nouvelle bouteille ou d'autres produits. Le problème est le taux de collecte insuffisant.",
      mythEn: "It takes 1000 years to recycle a plastic bottle.",
      realityEn: "That's the natural degradation time, not recycling time. In reality, a PET bottle can be recycled in 2-4 weeks and become a new bottle or other products. The problem is insufficient collection rates.",
      source: "PlasticsEurope, Ellen MacArthur Foundation"
    },
    {
      mythFr: "La banquise arctique regagne de la superficie chaque année.",
      realityFr: "Faux. La banquise arctique perd environ 13% de sa superficie par décennie depuis 1979. Septembre 2023 a enregistré la 6e plus faible étendue depuis le début des mesures satellites.",
      mythEn: "Arctic sea ice is gaining area every year.",
      realityEn: "False. Arctic sea ice is losing about 13% of its area per decade since 1979. September 2023 recorded the 6th smallest extent since satellite measurements began.",
      source: "NSIDC (National Snow and Ice Data Center), NOAA Arctic Report Card"
    },
    {
      mythFr: "Le climat a toujours changé, c'est naturel.",
      realityFr: "Le climat a effectivement varié naturellement, mais jamais à cette vitesse. Le réchauffement actuel est 10 fois plus rapide que la sortie du dernier âge glaciaire. Et surtout, les causes sont identifiées : 100% du réchauffement depuis 1950 est attribuable aux activités humaines.",
      mythEn: "The climate has always changed, it's natural.",
      realityEn: "Climate has indeed varied naturally, but never at this speed. Current warming is 10 times faster than the exit from the last ice age. Most importantly, the causes are identified: 100% of warming since 1950 is attributable to human activities.",
      source: "GIEC AR6 WG1, NASA Paleoclimatology"
    },
    {
      mythFr: "Les scientifiques ne sont pas d'accord entre eux sur le réchauffement climatique.",
      realityFr: "Faux. 97% des climatologues actifs s'accordent sur la réalité du réchauffement anthropique. Les études récentes montrent même un consensus proche de 99,9% dans les publications scientifiques. Le débat porte sur les détails, pas sur la réalité du phénomène.",
      mythEn: "Scientists don't agree on climate change.",
      realityEn: "False. 97% of active climate scientists agree on the reality of anthropogenic warming. Recent studies show consensus close to 99.9% in scientific publications. The debate is about details, not the reality of the phenomenon.",
      source: "Cook et al. 2013, Lynas et al. 2021, Cornell Alliance for Science"
    },
    {
      mythFr: "C'est le soleil qui cause le réchauffement climatique.",
      realityFr: "L'activité solaire est stable ou en légère baisse depuis 1980, alors que les températures augmentent. Si le soleil était responsable, toute l'atmosphère se réchaufferait uniformément. Or, la stratosphère se refroidit tandis que la troposphère se réchauffe - signature typique de l'effet de serre.",
      mythEn: "The sun is causing global warming.",
      realityEn: "Solar activity has been stable or slightly declining since 1980, while temperatures rise. If the sun were responsible, the entire atmosphere would warm uniformly. But the stratosphere is cooling while the troposphere warms - a typical greenhouse effect signature.",
      source: "NASA Solar Science, IPCC AR6, Royal Society"
    },
    {
      mythFr: "La France ne représente que 1% des émissions mondiales, nos efforts sont inutiles.",
      realityFr: "La France est le 19e émetteur mondial. Si chaque pays en dessous de 3% des émissions ne faisait rien, 80% des émissions mondiales seraient ignorées. De plus, l'empreinte carbone réelle des Français (incluant les importations) est 2 fois plus élevée que les émissions territoriales.",
      mythEn: "France only represents 1% of global emissions, our efforts are useless.",
      realityEn: "France is the 19th largest emitter globally. If every country below 3% of emissions did nothing, 80% of global emissions would be ignored. Moreover, the real carbon footprint of French people (including imports) is 2 times higher than territorial emissions.",
      source: "Global Carbon Project, Haut Conseil pour le Climat 2023"
    },
    {
      mythFr: "Les modèles climatiques ne sont pas fiables.",
      realityFr: "Les modèles climatiques des années 1970-90 ont prédit avec précision le réchauffement observé aujourd'hui. Le modèle de James Hansen en 1988 prévoyait +0,5°C d'ici 2020 - nous avons mesuré exactement cela. Les modèles actuels sont encore plus précis.",
      mythEn: "Climate models are not reliable.",
      realityEn: "Climate models from the 1970s-90s accurately predicted the warming observed today. James Hansen's 1988 model predicted +0.5°C by 2020 - we measured exactly that. Current models are even more precise.",
      source: "Hausfather et al. 2020 (Geophysical Research Letters), NASA GISS"
    },
    {
      mythFr: "Le réchauffement climatique, c'est juste quelques degrés de plus, pas grave.",
      realityFr: "Pendant l'âge glaciaire, la température moyenne n'était que 4-5°C plus basse qu'aujourd'hui, et des kilomètres de glace recouvraient l'Europe. Chaque degré compte énormément : +1,5°C = 70% des récifs coralliens morts, +2°C = 99% des récifs morts et 400 millions de personnes exposées à la pénurie d'eau.",
      mythEn: "Global warming is just a few degrees more, no big deal.",
      realityEn: "During the ice age, average temperature was only 4-5°C lower than today, and kilometers of ice covered Europe. Every degree matters enormously: +1.5°C = 70% of coral reefs dead, +2°C = 99% of reefs dead and 400 million people exposed to water scarcity.",
      source: "GIEC Rapport Spécial 1.5°C, World Meteorological Organization"
    },
    {
      mythFr: "Les pays pauvres doivent d'abord se développer avant de penser au climat.",
      realityFr: "Les pays pauvres sont les premiers touchés par le changement climatique alors qu'ils en sont les moins responsables. Le Bangladesh subit les inondations, le Sahel la désertification. De plus, le développement via les énergies renouvelables est maintenant moins cher que via les fossiles.",
      mythEn: "Poor countries must develop first before thinking about climate.",
      realityEn: "Poor countries are the first hit by climate change while being the least responsible. Bangladesh suffers floods, the Sahel desertification. Moreover, development through renewable energy is now cheaper than through fossil fuels.",
      source: "Banque Mondiale Climate Change, IRENA Renewable Cost Report 2023"
    },
    {
      mythFr: "L'agriculture biologique ne peut pas nourrir le monde.",
      realityFr: "Des études montrent qu'une agriculture mondiale agroécologique pourrait nourrir 9 milliards d'humains, à condition de réduire le gaspillage alimentaire (30% de la production actuelle) et la consommation de viande. Le problème n'est pas la production mais la distribution et nos modes de consommation.",
      mythEn: "Organic farming cannot feed the world.",
      realityEn: "Studies show that worldwide agroecological farming could feed 9 billion humans, provided we reduce food waste (30% of current production) and meat consumption. The problem is not production but distribution and our consumption patterns.",
      source: "FAO Agroecology Report, IPES-Food 2016, Nature Plants 2017"
    },
    {
      mythFr: "La technologie nous sauvera, pas besoin de changer nos habitudes.",
      realityFr: "La technologie est nécessaire mais insuffisante. Même avec 100% d'électricité décarbonée, il faudrait encore réduire l'élevage, l'aviation, le béton, etc. Le GIEC est clair : sans sobriété énergétique ET technologies vertes, impossible de rester sous +2°C.",
      mythEn: "Technology will save us, no need to change our habits.",
      realityEn: "Technology is necessary but insufficient. Even with 100% decarbonized electricity, we would still need to reduce livestock, aviation, concrete, etc. The IPCC is clear: without energy sobriety AND green technologies, staying below +2°C is impossible.",
      source: "GIEC AR6 WG3, Agence Internationale de l'Énergie Net Zero 2050"
    },
    {
      mythFr: "Le Groenland était vert à l'époque des Vikings, preuve que le climat était plus chaud.",
      realityFr: "Le nom 'Groenland' (Terre Verte) était du marketing d'Erik le Rouge pour attirer des colons. Les Vikings cultivaient quelques zones côtières très limitées. Aujourd'hui, la fonte actuelle du Groenland libère des sols qui n'avaient pas vu le jour depuis 400 000 ans.",
      mythEn: "Greenland was green in Viking times, proof that climate was warmer.",
      realityEn: "The name 'Greenland' was marketing by Erik the Red to attract settlers. Vikings cultivated only very limited coastal areas. Today, Greenland's current melting is exposing soils that haven't seen daylight for 400,000 years.",
      source: "Nature 2016, Science Advances 2019, Archaeological Studies"
    },
    {
      mythFr: "Les glaciers fondent à cause des variations naturelles, pas du CO2.",
      realityFr: "Les glaciers du monde entier reculent de façon synchronisée depuis 1850, ce qui ne correspond à aucun cycle naturel connu. 90% des glaciers alpins ont reculé. Le glacier de la Mer de Glace à Chamonix a perdu 2,5 km depuis le début du XXe siècle.",
      mythEn: "Glaciers are melting due to natural variations, not CO2.",
      realityEn: "Glaciers worldwide are retreating synchronously since 1850, which doesn't match any known natural cycle. 90% of Alpine glaciers have retreated. The Mer de Glace glacier in Chamonix has lost 2.5 km since the early 20th century.",
      source: "World Glacier Monitoring Service, CNRS Glaciologie"
    }
  ];

  // Combine tous les points de carte
  const allMapPoints = [...franceImpactPoints, ...globalImpactPoints];

  console.log("🗺️ Seeding map points...");
  // Nettoie les anciens points
  await db.delete(mapPoints);
  // Insère tous les nouveaux points
  await db.insert(mapPoints).values(allMapPoints);

  // Nettoie les posts existants
  await db.delete(posts);
  // Insère le nouveau contenu éditorial
  await db.insert(posts).values(editorialPosts);

  console.log(`✅ ${editorialPosts.length} posts éditoriaux ajoutés avec succès !`);
  console.log(`✅ ${allMapPoints.length} points d'impact ajoutés sur la carte !`);

  // 👇 SEEDING DES ARTICLES 👇
  console.log("📰 Seeding articles...");
  
  const firstArticle = {
    slug: "transition-electrique-a-lepreuve-du-reel",
    titleFr: "La Transition Électrique à l'Épreuve du Réel : Pourquoi le Portefeuille des Européens Freine la Décarbonation ?",
    titleEn: "The Electric Transition's Reality Check: Why European Wallets Are Stalling Decarbonization",
    summaryFr: "La stratégie européenne pour les véhicules électriques, conçue pour un monde en croissance, se heurte à la réalité d'une économie stagnante. Analyse d'une transition à repenser.",
    summaryEn: "Europe's EV strategy, designed for a growing world, is colliding with a stagnant economy. An analysis of a transition that needs rethinking.",
    contentFr: `### Le Paradoxe de la Transition

Le chemin vers une mobilité décarbonée semble tracé : remplacer nos véhicules thermiques par des équivalents électriques. Poussés par les régulations comme le Pacte Vert européen, les constructeurs automobiles ont massivement investi. Pourtant, un obstacle majeur se dresse sur la route : les ventes ne suivent pas. Un dirigeant de Stellantis a récemment souligné cette tension, notamment sur le marché crucial des véhicules utilitaires. Comment expliquer ce décalage entre l'ambition écologique et la réalité économique ?

### L'Hypothèse Manquante : La Croissance Économique

Le modèle actuel repose sur une hypothèse implicite, héritée des décennies passées : une croissance économique continue. Dans ce paradigme, les ménages et les entreprises renouvellent régulièrement leur parc.

**Le rythme d'hier :** En France, près de 2 millions de voitures neuves étaient vendues chaque année, assurant un renouvellement complet du parc tous les 15-20 ans.

**La réalité d'aujourd'hui :** Dans une Europe où l'économie stagne, voire se contracte, ce rythme est brisé. Face à un pouvoir d'achat contraint, le réflexe est de conserver son véhicule plus longtemps ou de se tourner vers les options les moins onéreuses, qui sont rarement électriques.

### Repenser la Décarbonation pour un Monde en Contraction

Un plan de décarbonation basé sur la consommation de masse de produits neufs et chers est incompatible avec une économie en contraction. Il est impératif d'explorer des stratégies adaptées :

- **Miser sur la sobriété :** Encourager la réduction du nombre de véhicules via un soutien massif aux transports en commun.
- **Développer le "rétrofit" :** Accélérer la conversion de véhicules thermiques existants en électriques.
- **Favoriser les véhicules légers :** Orienter l'industrie vers des modèles plus petits, sobres et accessibles.

La transition énergétique ne doit pas être pensée uniquement pour une économie en croissance. Elle doit s'adapter à la réalité d'un monde aux ressources limitées.`,
    contentEn: `### The Transition Paradox

The path to decarbonized mobility seems clear: replace our thermal vehicles with electric equivalents. Driven by regulations like the European Green Deal, automakers have invested massively. Yet a major obstacle stands in the way: sales are not following. A Stellantis executive recently highlighted this tension, particularly in the crucial commercial vehicle market. How can we explain this gap between ecological ambition and economic reality?

### The Missing Assumption: Economic Growth

The current model relies on an implicit assumption inherited from past decades: continuous economic growth. In this paradigm, households and businesses regularly renew their fleet.

**Yesterday's pace:** In France, nearly 2 million new cars were sold each year, ensuring complete fleet renewal every 15-20 years.

**Today's reality:** In a Europe where the economy is stagnating or even contracting, this pace is broken. Faced with constrained purchasing power, the reflex is to keep vehicles longer or turn to the least expensive options, which are rarely electric.

### Rethinking Decarbonization for a Contracting World

A decarbonization plan based on mass consumption of new and expensive products is incompatible with a contracting economy. It is imperative to explore adapted strategies:

- **Focus on sobriety:** Encourage reducing the number of vehicles through massive support for public transport.
- **Develop "retrofit":** Accelerate the conversion of existing thermal vehicles to electric.
- **Favor light vehicles:** Orient the industry toward smaller, efficient, and accessible models.

The energy transition must not be designed only for a growing economy. It must adapt to the reality of a world with limited resources.`,
    imageUrl: "/images/articles/electric-car-charging.jpg",
    author: "Jean-Marc Jancovici (Analyse par EcoWarrior)",
  };

  await db.delete(articles);
  await db.insert(articles).values([firstArticle]);

  console.log("📰 Article de démonstration ajouté avec succès !");
  console.log("🎯 Base de données prête avec du contenu de qualité sourcé et une carte mondiale");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur lors du seeding :", err);
  process.exit(1);
}); 