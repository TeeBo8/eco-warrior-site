import { router, publicProcedure } from "@/server/trpc/trpc";
import { users } from "@/server/db/schema";
import { and, isNotNull, gt } from "drizzle-orm";

export const userRouter = router({
  getPremiumCount: publicProcedure.query(async ({ ctx }) => {
    // Compter les utilisateurs avec un abonnement Stripe actif
    const premiumUsers = await ctx.db.query.users.findMany({
      where: and(
        isNotNull(users.stripeSubscriptionId),
        gt(users.stripeCurrentPeriodEnd, new Date())
      ),
    });
    
    return premiumUsers.length;
  }),
}); 