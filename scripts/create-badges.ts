import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { badges } from "../src/server/db/schema";
import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  console.log("🏆 Création des badges de gamification...");
  
  const badgesContent = [
    // Badges de calcul carbone
    { 
      id: "first_calculation", 
      name_en: "Carbon Aware", 
      name_fr: "Éco-Calculateur", 
      description_en: "You calculated your first carbon footprint and took the first step towards awareness.", 
      description_fr: "Vous avez calculé votre première empreinte carbone et fait le premier pas vers la prise de conscience.", 
      icon: "Calculator" 
    },
    { 
      id: "vegetarian_choice", 
      name_en: "Plant-Powered", 
      name_fr: "Végé-Warrior", 
      description_en: "You chose a vegetarian or vegan diet, reducing your environmental impact.", 
      description_fr: "Vous avez choisi un régime végétarien ou végétalien, réduisant votre impact environnemental.", 
      icon: "Leaf" 
    },
    { 
      id: "low_carbon_transport", 
      name_en: "Green Commuter", 
      name_fr: "Mobilité Verte", 
      description_en: "You chose low-carbon transport like trains or electric vehicles.", 
      description_fr: "Vous avez choisi un transport bas carbone comme le train ou les véhicules électriques.", 
      icon: "Train" 
    },
    { 
      id: "first_save", 
      name_en: "Conscious Tracker", 
      name_fr: "Suivi Conscient", 
      description_en: "You saved your first carbon footprint calculation to track your progress.", 
      description_fr: "Vous avez sauvegardé votre premier calcul d'empreinte carbone pour suivre vos progrès.", 
      icon: "Save" 
    },
    
    // Badges d'engagement
    { 
      id: "eco_supporter", 
      name_en: "Eco Supporter", 
      name_fr: "Soutien Écologique", 
      description_en: "You became a Premium member and actively support the ecological mission.", 
      description_fr: "Vous êtes devenu membre Premium et soutenez activement la mission écologique.", 
      icon: "Heart" 
    },
    
    // Badges de commentaires (NOUVEAUX)
    { 
      id: "first_comment", 
      name_en: "Contributor", 
      name_fr: "Contributeur", 
      description_en: "You posted your first comment and joined the conversation.", 
      description_fr: "Vous avez posté votre premier commentaire et rejoint la conversation.", 
      icon: "MessageSquarePlus" 
    },
    { 
      id: "prolific_commenter", 
      name_en: "Debater", 
      name_fr: "Débatteur", 
      description_en: "You posted 10 comments and actively participate in discussions.", 
      description_fr: "Vous avez posté 10 commentaires et participez activement aux discussions.", 
      icon: "MessagesSquare" 
    },
    
    // Badges de likes
    { 
      id: "first_like", 
      name_en: "Appreciator", 
      name_fr: "Appréciateur", 
      description_en: "You liked your first myth-busting post.", 
      description_fr: "Vous avez liké votre premier post de démystification.", 
      icon: "ThumbsUp" 
    },
    { 
      id: "community_lover", 
      name_en: "Community Lover", 
      name_fr: "Ami de la Communauté", 
      description_en: "You liked 25 posts and actively support quality content.", 
      description_fr: "Vous avez liké 25 posts et soutenez activement le contenu de qualité.", 
      icon: "Users" 
    }
  ];

  // Nettoie les badges existants
  await db.delete(badges);
  
  // Insère les nouveaux badges
  await db.insert(badges).values(badgesContent);

  console.log(`✅ ${badgesContent.length} badges créés avec succès !`);
  console.log("🎯 Système de gamification prêt");
  
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erreur lors de la création des badges :", err);
  process.exit(1);
}); 