import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { mapPoints } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  console.log("🔍 Vérification des points actuels en base...");
  
  const currentPoints = await db.select().from(mapPoints);
  
  console.log(`📍 ${currentPoints.length} points trouvés en base :`);
  currentPoints.forEach(point => {
    console.log(`- ${point.name_fr} (${point.lat}, ${point.lng}) - ${point.category}`);
  });
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur :", err);
  process.exit(1);
}); 