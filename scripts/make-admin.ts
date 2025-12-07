import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// import { clerkClient } from "@clerk/nextjs/server";

const ADMIN_EMAIL = "t.leture@gmail.com"; // Ton email

async function makeUserAdmin() {
  console.log(`⚠️  Script désactivé : Clerk n'est pas configuré`);
  console.log(`Pour activer ce script, installez @clerk/nextjs et décommentez le code.`);
  // console.log(`Attribution du rôle admin à l'utilisateur: ${ADMIN_EMAIL}`);

  // try {
  //   const client = await clerkClient();
  //   
  //   // Récupérer la liste des utilisateurs par email
  //   const users = await client.users.getUserList({
  //     emailAddress: [ADMIN_EMAIL]
  //   });

  //   if (users.data.length === 0) {
  //     console.log(`❌ Aucun utilisateur trouvé avec l'email: ${ADMIN_EMAIL}`);
  //     return;
  //   }

  //   const user = users.data[0];
  //   console.log(`✅ Utilisateur trouvé: ${user?.firstName} ${user?.lastName} (${user?.id})`);

  //   // Mettre à jour les métadonnées publiques avec le rôle admin
  //   await client.users.updateUserMetadata(user!.id, {
  //     publicMetadata: {
  //       role: "admin"
  //     }
  //   });

  //   console.log(`🎉 Rôle admin attribué avec succès !`);
  //   console.log(`L'utilisateur ${ADMIN_EMAIL} est maintenant administrateur.`);
  //   
  // } catch (error) {
  //   console.error("❌ Erreur lors de l'attribution du rôle admin:", error);
  // }
}

makeUserAdmin().then(() => {
  console.log("Script terminé");
  process.exit(0);
}).catch((err) => {
  console.error("Script échoué:", err);
  process.exit(1);
});
