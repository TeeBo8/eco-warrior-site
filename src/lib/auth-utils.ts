import { type User } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UserWithSubscription = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: Date | null;
  freeTrialMessageCount: number;
};

/**
 * Vérifie si un utilisateur a un accès premium.
 * Un utilisateur est considéré comme premium s'il a un abonnement Stripe actif
 * OU s'il a le rôle 'admin' dans ses métadonnées Clerk.
 * @param clerkUser - L'objet utilisateur de Clerk
 * @param dbUser - L'objet utilisateur de notre base de données
 * @returns boolean - True si l'utilisateur a un accès premium
 */
export function hasPremiumAccess(
  clerkUser: User | null,
  dbUser: UserWithSubscription | null
): boolean {
  if (!clerkUser) return false;

  // Condition 1: L'utilisateur est un admin
  const isAdmin = clerkUser.publicMetadata?.role === "admin";
  if (isAdmin) return true;

  // Condition 2: L'utilisateur a un abonnement Stripe actif
  const isSubscribed = !!dbUser?.stripeSubscriptionId; // Simplifié pour l'exemple
  // (Dans une vraie app, on vérifierait aussi stripeCurrentPeriodEnd)
  
  return isSubscribed;
}

/**
 * Version simplifiée pour les composants client utilisant useUser de Clerk
 * @param clerkUser - L'objet utilisateur de Clerk (depuis useUser hook)
 * @returns boolean - True si l'utilisateur a un accès premium
 */
export function hasClientPremiumAccess(clerkUser: { publicMetadata?: Record<string, unknown> } | null): boolean {
  if (!clerkUser) return false;

  // Condition 1: L'utilisateur est un admin
  const isAdmin = clerkUser.publicMetadata?.role === "admin";
  if (isAdmin) return true;

  // Condition 2: L'utilisateur a un abonnement Stripe actif (via publicMetadata)
  const isSubscribed = Boolean(
    clerkUser.publicMetadata?.stripe && 
    typeof clerkUser.publicMetadata.stripe === 'object' && 
    'isSubscribed' in clerkUser.publicMetadata.stripe &&
    clerkUser.publicMetadata.stripe.isSubscribed === true
  );
  
  return isSubscribed;
}

/**
 * Une fonction côté serveur pour vérifier l'abonnement Stripe uniquement
 * La vérification du rôle admin se fait côté client avec hasClientPremiumAccess
 */
export async function checkServerSidePremiumAccess(userId: string | null): Promise<boolean> {
    if (!userId) return false;
    
    // Vérification de l'abonnement Stripe via la base de données
    const dbUser = await db.query.users.findFirst({ where: eq(users.id, userId) });
    const isSubscribed = Boolean(dbUser?.stripeSubscriptionId && 
      dbUser?.stripeCurrentPeriodEnd && 
      new Date(dbUser.stripeCurrentPeriodEnd) > new Date());

    return isSubscribed;
} 