import { privateProcedure, router } from "@/server/trpc/trpc";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const FREE_TRIAL_LIMIT = 3;

export const chatRouter = router({
  getCredits: privateProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({ 
      where: eq(users.id, ctx.userId) 
    });
    
    const isPremium = !!user?.stripeSubscriptionId && 
      user?.stripeCurrentPeriodEnd && 
      new Date(user.stripeCurrentPeriodEnd) > new Date();
    
    const messageCount = user?.freeTrialMessageCount ?? 0;
    const creditsLeft = isPremium ? 'unlimited' : Math.max(0, FREE_TRIAL_LIMIT - messageCount);
    
    return { 
      creditsLeft,
      isPremium,
      totalFreeMessages: FREE_TRIAL_LIMIT,
      usedMessages: messageCount
    };
  }),
}); 