import { privateProcedure, router } from "@/server/trpc/trpc";
import { db } from "@/server/db";
import { userBadges, badges } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const gamificationRouter = router({
  getMyBadges: privateProcedure.query(async ({ ctx }) => {
    const unlockedBadges = await db.select({
        unlockedAt: userBadges.unlockedAt,
        badge: badges,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, ctx.userId))
      .orderBy(userBadges.unlockedAt);
    return unlockedBadges;
  }),
}); 