import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { mapPoints } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  console.log("🗺️ Seeding de 15 points d'impact climatique réels à travers le monde...");

  const climateImpactPoints = [
    // FRANCE (6 points)
    {
      lat: 43.2,
      lng: 5.5,
      name_en: "Calanques National Park - Ocean Acidification",
      name_fr: "Parc National des Calanques - Acidification des Océans",
      impact_en: "Ocean acidification is threatening marine biodiversity in the Mediterranean. CO2 absorption by seawater lowers pH levels, affecting shell-forming organisms and entire food chains. Fish populations and coral reefs in the Calanques are particularly vulnerable to this silent crisis.",
      impact_fr: "L'acidification des océans menace la biodiversité marine en Méditerranée. L'absorption de CO2 par l'eau de mer fait baisser le pH, affectant les organismes à coquille et toute la chaîne alimentaire. Les populations de poissons et les récifs coralliens des Calanques sont particulièrement vulnérables à cette crise silencieuse.",
      category: "biodiversity",
      image_url: null
    },
    {
      lat: 43.6,
      lng: 7.2,
      name_en: "French Riviera - Sea Level Rise",
      name_fr: "Côte d'Azur - Montée des Eaux",
      impact_en: "Rising sea levels threaten coastal infrastructure and beaches along the French Riviera. Studies show a 10-20cm rise since 1990, with accelerating trends. Coastal erosion and flooding during storms are becoming more frequent.",
      impact_fr: "La montée des eaux menace les infrastructures côtières et les plages de la Côte d'Azur. Les études montrent une élévation de 10-20cm depuis 1990, avec des tendances qui s'accélèrent. L'érosion côtière et les inondations lors des tempêtes deviennent plus fréquentes.",
      category: "sea-level",
      image_url: null
    },
    {
      lat: 44.7,
      lng: 6.6,
      name_en: "Southern Alps - Glacier Retreat",
      name_fr: "Alpes du Sud - Recul des Glaciers",
      impact_en: "Alpine glaciers have lost 30% of their volume since 1980. This affects water resources, mountain ecosystems, and increases natural hazard risks. The Mer de Glace and other iconic glaciers are retreating at unprecedented rates.",
      impact_fr: "Les glaciers alpins ont perdu 30% de leur volume depuis 1980. Cela affecte les ressources en eau, les écosystèmes montagnards et augmente les risques de catastrophes naturelles. La Mer de Glace et autres glaciers emblématiques reculent à un rythme sans précédent.",
      category: "erosion",
      image_url: null
    },
    {
      lat: 43.3,
      lng: 1.2,
      name_en: "Hérault - Extreme Drought",
      name_fr: "Hérault - Sécheresse Extrême",
      impact_en: "Southern France faces increasingly severe droughts. 2022 saw record-low precipitation levels, affecting agriculture, water supply, and increasing wildfire risks. Groundwater levels have dropped significantly.",
      impact_fr: "Le sud de la France fait face à des sécheresses de plus en plus sévères. 2022 a vu des niveaux de précipitations record, affectant l'agriculture, l'approvisionnement en eau et augmentant les risques d'incendies. Les nappes phréatiques ont significativement baissé.",
      category: "drought",
      image_url: null
    },
    {
      lat: 43.5,
      lng: 3.8,
      name_en: "Languedoc - Forest Fires",
      name_fr: "Languedoc - Incendies de Forêt",
      impact_en: "Wildfire frequency and intensity have doubled in the region over the past 20 years. Rising temperatures and prolonged droughts create ideal conditions for megafires, threatening both natural habitats and human settlements.",
      impact_fr: "La fréquence et l'intensité des incendies de forêt ont doublé dans la région au cours des 20 dernières années. Les températures croissantes et les sécheresses prolongées créent des conditions idéales pour les méga-feux, menaçant à la fois les habitats naturels et les habitations.",
      category: "fire",
      image_url: null
    },
    {
      lat: 44.8,
      lng: 4.6,
      name_en: "Rhône Valley - Heat Waves",
      name_fr: "Vallée du Rhône - Canicules",
      impact_en: "The Rhône Valley experiences more frequent and intense heat waves. Summer temperatures regularly exceed 40°C, impacting agriculture, energy consumption, and public health. The 2023 heat dome broke multiple temperature records.",
      impact_fr: "La vallée du Rhône connaît des canicules plus fréquentes et intenses. Les températures estivales dépassent régulièrement 40°C, impactant l'agriculture, la consommation d'énergie et la santé publique. Le dôme de chaleur de 2023 a battu de nombreux records.",
      category: "heatwave",
      image_url: null
    },

    // EUROPE (2 points)
    {
      lat: 45.4,
      lng: 12.3,
      name_en: "Venice - Frequent Flooding",
      name_fr: "Venise - Inondations Fréquentes",
      impact_en: "Venice faces increasingly frequent 'acqua alta' (high water) events. Sea level rise combined with land subsidence threatens this UNESCO World Heritage site. The MOSE flood barriers are activated more often each year.",
      impact_fr: "Venise fait face à des événements d''acqua alta' (haute eau) de plus en plus fréquents. La montée du niveau de la mer combinée à l'affaissement des terres menace ce site du patrimoine mondial de l'UNESCO. Les barrières anti-inondation MOSE sont activées plus souvent chaque année.",
      category: "flood",
      image_url: null
    },
    {
      lat: 71.7,
      lng: -42.6,
      name_en: "Greenland - Ice Sheet Melting",
      name_fr: "Groenland - Fonte de la Calotte Glaciaire",
      impact_en: "Greenland's ice sheet is melting at an alarming rate, losing approximately 280 billion tons of ice per year. This contributes significantly to global sea level rise and disrupts ocean currents.",
      impact_fr: "La calotte glaciaire du Groenland fond à un rythme alarmant, perdant environ 280 milliards de tonnes de glace par an. Cela contribue de manière significative à l'élévation du niveau de la mer et perturbe les courants océaniques.",
      category: "erosion",
      image_url: null
    },

    // OCÉANIE (1 point)
    {
      lat: -18.3,
      lng: 147.7,
      name_en: "Great Barrier Reef - Coral Bleaching",
      name_fr: "Grande Barrière de Corail - Blanchissement des Coraux",
      impact_en: "The Great Barrier Reef has experienced five mass bleaching events since 2016. Rising ocean temperatures stress corals, causing them to expel symbiotic algae. Without urgent action, most corals could die within decades.",
      impact_fr: "La Grande Barrière de Corail a connu cinq événements de blanchissement massif depuis 2016. L'augmentation de la température des océans stresse les coraux, les amenant à expulser les algues symbiotiques. Sans action urgente, la plupart des coraux pourraient mourir d'ici quelques décennies.",
      category: "biodiversity",
      image_url: null
    },

    // AMÉRIQUE DU SUD (1 point)
    {
      lat: -3.4,
      lng: -62.2,
      name_en: "Amazon Rainforest - Deforestation & Drought",
      name_fr: "Forêt Amazonienne - Déforestation et Sécheresse",
      impact_en: "The Amazon is approaching a tipping point. Deforestation combined with climate-driven droughts threatens to transform parts of the rainforest into savanna. This would release massive amounts of stored carbon and devastate biodiversity.",
      impact_fr: "L'Amazonie approche d'un point de basculement. La déforestation combinée aux sécheresses liées au climat menace de transformer des parties de la forêt tropicale en savane. Cela libérerait des quantités massives de carbone stocké et dévasterait la biodiversité.",
      category: "drought",
      image_url: null
    },

    // AMÉRIQUE DU NORD (1 point)
    {
      lat: 36.7,
      lng: -119.8,
      name_en: "California - Megafires & Drought",
      name_fr: "Californie - Méga-feux et Sécheresse",
      impact_en: "California experiences increasingly severe wildfires and prolonged droughts. The 2020 fire season burned over 4 million acres. Water scarcity threatens agriculture and urban areas, while smoke impacts air quality across the continent.",
      impact_fr: "La Californie connaît des incendies de forêt de plus en plus graves et des sécheresses prolongées. La saison des feux de 2020 a brûlé plus de 4 millions d'acres. La pénurie d'eau menace l'agriculture et les zones urbaines, tandis que la fumée impacte la qualité de l'air à travers le continent.",
      category: "fire",
      image_url: null
    },

    // ASIE (2 points)
    {
      lat: 23.8,
      lng: 90.4,
      name_en: "Bangladesh - Coastal Flooding & Cyclones",
      name_fr: "Bangladesh - Inondations Côtières et Cyclones",
      impact_en: "Bangladesh is one of the world's most climate-vulnerable nations. Rising sea levels and intensifying cyclones threaten millions living in low-lying coastal areas. Saltwater intrusion damages agriculture and freshwater supplies.",
      impact_fr: "Le Bangladesh est l'une des nations les plus vulnérables au climat. La montée du niveau de la mer et l'intensification des cyclones menacent des millions de personnes vivant dans les zones côtières basses. L'intrusion d'eau salée endommage l'agriculture et les réserves d'eau douce.",
      category: "storm",
      image_url: null
    },
    {
      lat: 75.0,
      lng: 100.0,
      name_en: "Arctic - Sea Ice & Permafrost Melt",
      name_fr: "Arctique - Fonte de la Banquise et du Permafrost",
      impact_en: "Arctic sea ice is disappearing at 13% per decade. Permafrost thaw releases methane and CO2, accelerating warming. Indigenous communities face habitat loss, and polar bears struggle to survive as their hunting grounds vanish.",
      impact_fr: "La banquise arctique disparaît à raison de 13% par décennie. Le dégel du permafrost libère du méthane et du CO2, accélérant le réchauffement. Les communautés autochtones font face à la perte d'habitat, et les ours polaires luttent pour survivre alors que leurs terrains de chasse disparaissent.",
      category: "erosion",
      image_url: null
    },

    // AFRIQUE (1 point)
    {
      lat: 14.5,
      lng: -14.5,
      name_en: "Sahel - Desertification & Famine",
      name_fr: "Sahel - Désertification et Famines",
      impact_en: "The Sahel region faces advancing desertification. Declining rainfall and rising temperatures devastate agriculture, leading to food insecurity and mass migration. Lake Chad has shrunk by 90% since the 1960s.",
      impact_fr: "La région du Sahel fait face à une désertification croissante. La baisse des précipitations et l'augmentation des températures dévastent l'agriculture, entraînant l'insécurité alimentaire et des migrations massives. Le lac Tchad a rétréci de 90% depuis les années 1960.",
      category: "drought",
      image_url: null
    },

    // OCÉAN INDIEN (1 point)
    {
      lat: 4.2,
      lng: 73.5,
      name_en: "Maldives - Island Submersion",
      name_fr: "Maldives - Submersion Insulaire",
      impact_en: "The Maldives, with an average elevation of just 1.5 meters, faces existential threat from sea level rise. Coastal erosion, saltwater intrusion, and storm surges threaten the nation's very existence. The government is considering relocating the entire population.",
      impact_fr: "Les Maldives, avec une altitude moyenne de seulement 1,5 mètre, font face à une menace existentielle due à la montée du niveau de la mer. L'érosion côtière, l'intrusion d'eau salée et les ondes de tempête menacent l'existence même de la nation. Le gouvernement envisage de relocaliser toute la population.",
      category: "sea-level",
      image_url: null
    }
  ];

  console.log(`📍 Préparation de ${climateImpactPoints.length} points d'impact...`);

  // Nettoie les points existants
  await db.delete(mapPoints);
  console.log("🧹 Points existants supprimés");

  // Insère les nouveaux points d'impact climatique
  await db.insert(mapPoints).values(climateImpactPoints);

  console.log(`✅ ${climateImpactPoints.length} points d'impact climatique ajoutés avec succès !`);
  console.log("🌍 Carte interactive prête avec des données réelles mondiales");
  console.log("\nRépartition géographique:");
  console.log("  - France: 6 points");
  console.log("  - Europe: 2 points");
  console.log("  - Océanie: 1 point");
  console.log("  - Amérique du Sud: 1 point");
  console.log("  - Amérique du Nord: 1 point");
  console.log("  - Asie: 2 points");
  console.log("  - Afrique: 1 point");
  console.log("  - Océan Indien: 1 point");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur lors du seeding des points de carte :", err);
  process.exit(1);
});