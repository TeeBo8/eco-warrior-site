import { clerkClient } from "@clerk/nextjs/server";
import { router, publicProcedure } from "../../trpc/trpc";
import { desc } from "drizzle-orm";
import { mapPoints } from "../../db/schema";

export const mapRouter = router({
  getPoints: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    let isPremium = false;
    let isDeveloper = false;

    if (userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const isAdmin = user.publicMetadata?.role === 'admin';
        const stripeMetadata = user.publicMetadata?.stripe as { isSubscribed?: boolean } | undefined;
        const hasSubscription = stripeMetadata?.isSubscribed === true;
        
        // Vérifier si c'est le développeur
        isDeveloper = user.emailAddresses?.some(email => 
          email.emailAddress === 't.leture@gmail.com'
        ) || false;
        
        isPremium = isAdmin || hasSubscription || isDeveloper;
      } catch (error) {
        console.error('Erreur lors de la vérification du statut premium:', error);
        isPremium = false;
      }
    }

    // Pour le développeur, on envoie toujours tous les points
    // La limitation se fera côté client selon le mode de test
    const queryOptions = {
      orderBy: [desc(mapPoints.id)],
      // Pas de limite côté serveur pour le développeur, limitation côté client
      limit: isDeveloper ? undefined : (isPremium ? undefined : 5),
    };

    return await ctx.db.query.mapPoints.findMany(queryOptions);
  }),

  // Procédure pour obtenir le statut premium de l'utilisateur
  getPremiumStatus: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    
    if (!userId) {
      return { isPremium: false, isAuthenticated: false, isDeveloper: false };
    }

    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const isAdmin = user.publicMetadata?.role === 'admin';
      const stripeMetadata = user.publicMetadata?.stripe as { isSubscribed?: boolean } | undefined;
      const hasSubscription = stripeMetadata?.isSubscribed === true;
      
      // Vérifier si c'est le développeur
      const isDeveloper = user.emailAddresses?.some(email => 
        email.emailAddress === 't.leture@gmail.com'
      ) || false;
      
      const isPremium = isAdmin || hasSubscription || isDeveloper;
      
      return { isPremium, isAuthenticated: true, isDeveloper };
    } catch (error) {
      console.error('Erreur lors de la vérification du statut premium:', error);
      return { isPremium: false, isAuthenticated: true, isDeveloper: false };
    }
  }),
}); 