import { db } from "../db";
import { userBadges, comments } from "../db/schema";
import { and, eq } from "drizzle-orm";

// Fonction pour attribuer un badge s'il n'est pas déjà possédé
async function awardBadge(userId: string, badgeId: string) {
  // Vérifier si l'utilisateur a déjà ce badge
  const existingBadge = await db.query.userBadges.findFirst({
    where: and(
      eq(userBadges.userId, userId),
      eq(userBadges.badgeId, badgeId)
    ),
  });

  if (!existingBadge) {
    // Attribuer le badge
    await db.insert(userBadges).values({ userId, badgeId });
    console.log(`Badge '${badgeId}' awarded to user '${userId}'`);
    return true; // Un badge a été débloqué
  }
  return false; // L'utilisateur l'avait déjà
}

// Fonction principale qui vérifie tous les déclencheurs de badges
export async function checkAndAwardBadges(
  userId: string,
  // On passe les données de l'action qui vient de se produire
  context: {
    action: "calculation" | "save" | "subscription" | "comment",
    data?: {
      diet?: string;
      transportMode?: string;
    }
  }
) {
  const newlyUnlocked: string[] = [];
  
  if (context.action === "calculation" && context.data) {
    await awardBadge(userId, "first_calculation");
    
    if (context.data.diet && ["vegetarian", "vegan"].includes(context.data.diet)) {
      if (await awardBadge(userId, "vegetarian_choice")) newlyUnlocked.push("Plant-Powered");
    }
    if (context.data.transportMode && ["train", "car_electric"].includes(context.data.transportMode)) {
      if (await awardBadge(userId, "low_carbon_transport")) newlyUnlocked.push("Green Commuter");
    }
  }

  if (context.action === "save") {
    if (await awardBadge(userId, "first_save")) newlyUnlocked.push("Conscious Tracker");
  }
  
  if (context.action === "subscription") {
    if (await awardBadge(userId, "eco_supporter")) newlyUnlocked.push("Eco Supporter");
  }
  
  if (context.action === "comment") {
    // Compter tous les commentaires de l'utilisateur
    const userComments = await db.query.comments.findMany({ 
      where: eq(comments.authorId, userId) 
    });
    
    if (userComments.length === 1) {
      if (await awardBadge(userId, "first_comment")) newlyUnlocked.push("Contributeur");
    }
    if (userComments.length >= 10) {
      if (await awardBadge(userId, "prolific_commenter")) newlyUnlocked.push("Débatteur");
    }
  }
  
  return newlyUnlocked; // On renvoie les noms des badges qui viennent d'être débloqués
} 