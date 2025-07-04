import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { mapPoints } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  console.log("🗺️ Seeding des points de carte avec des impacts climatiques réels...");
  
  const climateImpactPoints = [
    {
      lat: 43.2,
      lng: 5.5,
      name_en: "Calanques National Park - Ocean Acidification",
      name_fr: "Parc National des Calanques - Acidification des Océans",
      impact_en: "Ocean acidification is threatening marine biodiversity in the Mediterranean. CO2 absorption by seawater lowers pH levels, affecting shell-forming organisms and entire food chains. Fish populations and coral reefs in the Calanques are particularly vulnerable to this silent crisis.",
      impact_fr: "L'acidification des océans menace la biodiversité marine en Méditerranée. L'absorption de CO2 par l'eau de mer fait baisser le pH, affectant les organismes à coquille et toute la chaîne alimentaire. Les populations de poissons et les récifs coralliens des Calanques sont particulièrement vulnérables à cette crise silencieuse.",
      category: "biodiversity",
      image_url: "/images/impacts/acidification-oceans.png"
    },
    {
      lat: 43.6,
      lng: 7.2,
      name_en: "French Riviera - Sea Level Rise",
      name_fr: "Côte d'Azur - Montée des Eaux",
      impact_en: "Rising sea levels threaten coastal infrastructure and beaches along the French Riviera. Studies show a 10-20cm rise since 1990, with accelerating trends. Coastal erosion and flooding during storms are becoming more frequent.",
      impact_fr: "La montée des eaux menace les infrastructures côtières et les plages de la Côte d'Azur. Les études montrent une élévation de 10-20cm depuis 1990, avec des tendances qui s'accélèrent. L'érosion côtière et les inondations lors des tempêtes deviennent plus fréquentes.",
      category: "sea-level"
    },
    {
      lat: 44.7,
      lng: 6.6,
      name_en: "Southern Alps - Glacier Retreat",
      name_fr: "Alpes du Sud - Recul des Glaciers",
      impact_en: "Alpine glaciers have lost 30% of their volume since 1980. This affects water resources, mountain ecosystems, and increases natural hazard risks. The Mer de Glace and other iconic glaciers are retreating at unprecedented rates.",
      impact_fr: "Les glaciers alpins ont perdu 30% de leur volume depuis 1980. Cela affecte les ressources en eau, les écosystèmes montagnards et augmente les risques de catastrophes naturelles. La Mer de Glace et autres glaciers emblématiques reculent à un rythme sans précédent.",
      category: "erosion"
    },
    {
      lat: 43.3,
      lng: 1.2,
      name_en: "Hérault - Extreme Drought",
      name_fr: "Hérault - Sécheresse Extrême",
      impact_en: "Southern France faces increasingly severe droughts. 2022 saw record-low precipitation levels, affecting agriculture, water supply, and increasing wildfire risks. Groundwater levels have dropped significantly.",
      impact_fr: "Le sud de la France fait face à des sécheresses de plus en plus sévères. 2022 a vu des niveaux de précipitations record, affectant l'agriculture, l'approvisionnement en eau et augmentant les risques d'incendies. Les nappes phréatiques ont significativement baissé.",
      category: "drought"
    },
    {
      lat: 43.5,
      lng: 3.8,
      name_en: "Languedoc - Forest Fires",
      name_fr: "Languedoc - Incendies de Forêt",
      impact_en: "Wildfire frequency and intensity have doubled in the region over the past 20 years. Rising temperatures and prolonged droughts create ideal conditions for megafires, threatening both natural habitats and human settlements.",
      impact_fr: "La fréquence et l'intensité des incendies de forêt ont doublé dans la région au cours des 20 dernières années. Les températures croissantes et les sécheresses prolongées créent des conditions idéales pour les méga-feux, menaçant à la fois les habitats naturels et les habitations.",
      category: "fire"
    },
    {
      lat: 44.8,
      lng: 4.6,
      name_en: "Rhône Valley - Heat Waves",
      name_fr: "Vallée du Rhône - Canicules",
      impact_en: "The Rhône Valley experiences more frequent and intense heat waves. Summer temperatures regularly exceed 40°C, impacting agriculture, energy consumption, and public health. The 2023 heat dome broke multiple temperature records.",
      impact_fr: "La vallée du Rhône connaît des canicules plus fréquentes et intenses. Les températures estivales dépassent régulièrement 40°C, impactant l'agriculture, la consommation d'énergie et la santé publique. Le dôme de chaleur de 2023 a battu de nombreux records.",
      category: "heatwave"
    }
  ];

  // Nettoie les points existants
  await db.delete(mapPoints);
  
  // Insère les nouveaux points d'impact climatique
  await db.insert(mapPoints).values(climateImpactPoints);

  console.log(`✅ ${climateImpactPoints.length} points d'impact climatique ajoutés avec succès !`);
  console.log("🌍 Carte interactive prête avec des données réelles");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur lors du seeding des points de carte :", err);
  process.exit(1);
}); 