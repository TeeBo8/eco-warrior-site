import { router, publicProcedure } from "../../trpc/trpc";
import { desc } from "drizzle-orm";
import { mapPoints } from "../../db/schema";

export const mapRouter = router({
  getPoints: publicProcedure.query(async ({ ctx }) => {
    // Retourner tous les points sans restriction
    return await ctx.db.query.mapPoints.findMany({
      orderBy: [desc(mapPoints.id)],
    });
  }),
});