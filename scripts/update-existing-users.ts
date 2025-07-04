// Script pour mettre à jour les utilisateurs existants avec les nouveaux champs
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm";
import { users } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function updateUserName() {
  console.log("Updating user name from Thomas to Thibault...");

  try {
    // Chercher l'utilisateur avec Thomas dans le nom
    const userToUpdate = await db.query.users.findFirst({
      where: (users, { like }) => like(users.name, '%Thomas%'),
    });

    if (!userToUpdate) {
      console.log("❌ No user found with 'Thomas' in the name");
      return;
    }

    console.log(`Found user: ${userToUpdate.name} (${userToUpdate.email})`);

    // Mettre à jour le nom
    const newName = userToUpdate.name?.replace('Thomas', 'Thibault') || 'Thibault Leture';
    
    await db.update(users)
      .set({ name: newName })
      .where(eq(users.id, userToUpdate.id));

    console.log(`✅ Successfully updated name to: ${newName}`);
    
  } catch (error) {
    console.error("❌ Error updating user name:", error);
  }
}

updateUserName().then(() => {
  console.log("Script finished");
  process.exit(0);
}).catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
}); 