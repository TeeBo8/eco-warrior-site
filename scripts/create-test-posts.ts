import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { posts, users } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

const testPosts = [
  {
    mythFr: "Les éoliennes tuent plus d'oiseaux que les centrales fossiles",
    realityFr: "Les études montrent que les chats domestiques, les bâtiments et les véhicules tuent bien plus d'oiseaux que les éoliennes. Les centrales fossiles causent plus de morts d'oiseaux par unité d'énergie produite.",
    mythEn: "Wind turbines kill more birds than fossil fuel plants",
    realityEn: "Studies show that domestic cats, buildings, and vehicles kill far more birds than wind turbines. Fossil fuel plants cause more bird deaths per unit of energy produced.",
    source: "https://www.audubon.org/news/will-wind-turbines-ever-be-safe-birds",
  },
  {
    mythFr: "Le réchauffement climatique s'est arrêté depuis 1998",
    realityFr: "C'est faux. Les années 2010-2020 ont été les plus chaudes jamais enregistrées. Le réchauffement se poursuit de manière continue.",
    mythEn: "Global warming stopped since 1998",
    realityEn: "This is false. The 2010-2020 decade was the warmest ever recorded. Warming continues steadily.",
    source: "https://climate.nasa.gov/evidence/",
  },
  {
    mythFr: "Les volcans émettent plus de CO₂ que les activités humaines",
    realityFr: "Les activités humaines émettent environ 100 fois plus de CO₂ que tous les volcans de la planète réunis.",
    mythEn: "Volcanoes emit more CO₂ than human activities",
    realityEn: "Human activities emit about 100 times more CO₂ than all the world's volcanoes combined.",
    source: "https://www.usgs.gov/observatories/hawaiian-volcano-observatory/hazards",
  },
];

async function createTestPosts() {
  console.log("Création de posts de test en statut 'pending'...");

  try {
    // Récupérer un utilisateur existant (le premier trouvé)
    const testUser = await db.query.users.findFirst();
    
    if (!testUser) {
      console.log("❌ Aucun utilisateur trouvé. Veuillez d'abord vous connecter à l'app.");
      return;
    }

    console.log(`✅ Utilisateur trouvé: ${testUser.name} (${testUser.email})`);

    // Créer les posts en statut pending
    const postsWithAuthor = testPosts.map(post => ({
      ...post,
      authorId: testUser.id,
      status: "pending" as const,
    }));

    await db.insert(posts).values(postsWithAuthor);

    console.log(`🎉 ${testPosts.length} posts de test créés en statut 'pending' !`);
    console.log("Vous pouvez maintenant tester l'interface d'administration.");
    
  } catch (error) {
    console.error("❌ Erreur lors de la création des posts de test:", error);
  }
}

createTestPosts().then(() => {
  console.log("Script terminé");
  process.exit(0);
}).catch((err) => {
  console.error("Script échoué:", err);
  process.exit(1);
}); 