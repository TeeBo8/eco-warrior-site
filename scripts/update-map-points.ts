import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { mapPoints } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  console.log("🗺️ Mise à jour des points de carte avec des coordonnées précises...");
  
  // D'abord nettoyer les points existants
  await db.delete(mapPoints);
  
  const preciseClimatePoints = [
    // POINTS EXISTANTS CORRIGÉS AVEC BONNES COORDONNÉES
    {
      lat: 43.2084, // Parc National des Calanques - coordonnées précises
      lng: 5.4328,
      name_en: "Calanques National Park - Ocean Acidification",
      name_fr: "Parc National des Calanques - Acidification des Océans", 
      impact_en: "Ocean acidification is threatening marine biodiversity in the Mediterranean. CO2 absorption by seawater lowers pH levels, affecting shell-forming organisms and entire food chains. Fish populations and coral reefs in the Calanques are particularly vulnerable to this silent crisis.",
      impact_fr: "L'acidification des océans menace la biodiversité marine en Méditerranée. L'absorption de CO2 par l'eau de mer fait baisser le pH, affectant les organismes à coquille et toute la chaîne alimentaire. Les populations de poissons et les récifs coralliens des Calanques sont particulièrement vulnérables à cette crise silencieuse.",
      category: "biodiversity",
      image_url: "/images/impacts/acidification-oceans.png"
    },
    {
      lat: 43.6934, // Nice - Côte d'Azur
      lng: 7.2663,
      name_en: "French Riviera - Sea Level Rise",
      name_fr: "Côte d'Azur - Montée des Eaux",
      impact_en: "Rising sea levels threaten coastal infrastructure and beaches along the French Riviera. Studies show a 10-20cm rise since 1990, with accelerating trends. Coastal erosion and flooding during storms are becoming more frequent.",
      impact_fr: "La montée des eaux menace les infrastructures côtières et les plages de la Côte d'Azur. Les études montrent une élévation de 10-20cm depuis 1990, avec des tendances qui s'accélèrent. L'érosion côtière et les inondations lors des tempêtes deviennent plus fréquentes.",
      category: "sea-level"
    },
    {
      lat: 45.9237, // Chamonix - Mer de Glace
      lng: 6.8694,
      name_en: "Mont Blanc Massif - Glacier Retreat",
      name_fr: "Massif du Mont-Blanc - Recul des Glaciers",
      impact_en: "Alpine glaciers have lost 30% of their volume since 1980. The Mer de Glace glacier has retreated 2.3km and lost 120m in thickness. This affects water resources, mountain ecosystems, and increases natural hazard risks.",
      impact_fr: "Les glaciers alpins ont perdu 30% de leur volume depuis 1980. Le glacier de la Mer de Glace a reculé de 2,3km et perdu 120m d'épaisseur. Cela affecte les ressources en eau, les écosystèmes montagnards et augmente les risques de catastrophes naturelles.",
      category: "erosion"
    },
    {
      lat: 43.6047, // Montpellier - Hérault
      lng: 3.8767,
      name_en: "Hérault Region - Extreme Drought",
      name_fr: "Région de l'Hérault - Sécheresse Extrême",
      impact_en: "Southern France faces increasingly severe droughts. 2022 saw record-low precipitation levels, affecting agriculture, water supply, and increasing wildfire risks. Groundwater levels have dropped by 50% in some areas.",
      impact_fr: "Le sud de la France fait face à des sécheresses de plus en plus sévères. 2022 a vu des niveaux de précipitations records, affectant l'agriculture, l'approvisionnement en eau et augmentant les risques d'incendies. Les nappes phréatiques ont baissé de 50% dans certaines zones.",
      category: "drought"
    },
    {
      lat: 43.3220, // Nîmes - Languedoc feux
      lng: 4.3600,
      name_en: "Languedoc Region - Forest Fires",
      name_fr: "Région Languedoc - Incendies de Forêt",
      impact_en: "Wildfire frequency and intensity have doubled in the region over the past 20 years. Rising temperatures and prolonged droughts create ideal conditions for megafires, threatening both natural habitats and human settlements.",
      impact_fr: "La fréquence et l'intensité des incendies de forêt ont doublé dans la région au cours des 20 dernières années. Les températures croissantes et les sécheresses prolongées créent des conditions idéales pour les méga-feux, menaçant à la fois les habitats naturels et les habitations.",
      category: "fire"
    },
    {
      lat: 45.7578, // Lyon - Vallée du Rhône
      lng: 4.8320,
      name_en: "Rhône Valley - Heat Waves",
      name_fr: "Vallée du Rhône - Canicules",
      impact_en: "The Rhône Valley experiences more frequent and intense heat waves. Summer temperatures regularly exceed 40°C, impacting agriculture, energy consumption, and public health. The 2023 heat dome broke multiple temperature records.",
      impact_fr: "La vallée du Rhône connaît des canicules plus fréquentes et intenses. Les températures estivales dépassent régulièrement 40°C, impactant l'agriculture, la consommation d'énergie et la santé publique. Le dôme de chaleur de 2023 a battu de nombreux records.",
      category: "heatwave"
    },
    // NOUVEAUX POINTS BIEN PLACÉS
    {
      lat: 48.8566, // Paris - îlot de chaleur urbain
      lng: 2.3522,
      name_en: "Paris - Urban Heat Island",
      name_fr: "Paris - Îlot de Chaleur Urbain",
      impact_en: "Paris experiences severe urban heat island effects, with temperatures up to 10°C higher than surrounding areas during heat waves. This affects air quality, energy consumption, and public health, particularly for vulnerable populations.",
      impact_fr: "Paris connaît de sévères effets d'îlots de chaleur urbains, avec des températures jusqu'à 10°C plus élevées que les zones environnantes lors des canicules. Cela affecte la qualité de l'air, la consommation d'énergie et la santé publique, particulièrement pour les populations vulnérables.",
      category: "heatwave"
    },
    {
      lat: 50.6292, // Lille - inondations
      lng: 3.0573,
      name_en: "Northern France - Flooding",
      name_fr: "Nord de la France - Inondations",
      impact_en: "Northern France faces increased flooding risks due to more intense precipitation events. Climate change brings more frequent extreme weather, overwhelming drainage systems and threatening urban and agricultural areas.",
      impact_fr: "Le nord de la France fait face à des risques d'inondations accrus dus à des événements de précipitations plus intenses. Le changement climatique apporte des phénomènes météorologiques extrêmes plus fréquents, saturant les systèmes de drainage et menaçant les zones urbaines et agricoles.",
      category: "storm"
    }
  ];

  // Insérer tous les points avec les bonnes coordonnées
  await db.insert(mapPoints).values(preciseClimatePoints);

  console.log(`✅ ${preciseClimatePoints.length} points d'impact climatique mis à jour avec succès !`);
  console.log("🎯 Coordonnées précises appliquées pour un placement optimal sur la carte");
  console.log("🖼️ Image PNG configurée pour les Calanques");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur lors de la mise à jour des points de carte :", err);
  process.exit(1);
}); 