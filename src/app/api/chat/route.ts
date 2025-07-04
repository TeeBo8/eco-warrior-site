import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const runtime = 'edge';

const FREE_TRIAL_LIMIT = 3;

export async function POST(req: Request) {
  // Vérifier l'authentification
  const { userId } = await auth();
  if (!userId) {
    return new Response("Vous devez être connecté pour utiliser l'assistant.", { status: 401 });
  }

  // Vérifier le statut de l'utilisateur
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  
  // Déterminer si l'utilisateur est premium
  const isPremium = !!user?.stripeSubscriptionId && 
    user?.stripeCurrentPeriodEnd && 
    new Date(user.stripeCurrentPeriodEnd) > new Date();
  
  const messageCount = user?.freeTrialMessageCount ?? 0;

  // Si l'utilisateur n'est pas premium et a atteint sa limite
  if (!isPremium && messageCount >= FREE_TRIAL_LIMIT) {
    return new Response("Limite d'essai gratuit atteinte. Devenez membre Premium pour un accès illimité.", { status: 403 });
  }

  // Si l'utilisateur n'est pas premium, on incrémente son compteur
  if (!isPremium) {
    await db.update(users).set({ 
      freeTrialMessageCount: sql`${users.freeTrialMessageCount} + 1` 
    }).where(eq(users.id, userId));
  }

  // Extrait les messages de la requête du front-end
  const { messages } = await req.json();

  // Utilise le provider Google avec la nouvelle syntaxe
  const result = streamText({
    model: google('gemini-1.5-flash-latest'),
    system: `Tu es EcoBot, un assistant IA amical, encourageant et expert en écologie. 
      Ta mission est de fournir des conseils pratiques, positifs et actionnables pour aider les utilisateurs à réduire leur impact environnemental.
      Base tes réponses sur des faits scientifiques et des données vérifiables.
      Réponds toujours dans la langue de la question de l'utilisateur (français ou anglais).
      Reste toujours sur le sujet de l'écologie et du développement durable.`,
    messages,
  });

  return result.toDataStreamResponse();
} 