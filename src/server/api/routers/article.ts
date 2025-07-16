import { router, publicProcedure, privateProcedure } from "@/server/trpc/trpc";
import { articles, users } from "@/server/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

const FREE_ARTICLE_LIMIT = 3;

export const articleRouter = router({
  // Récupère une liste d'articles pour la page de blog
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.articles.findMany({
      orderBy: [desc(articles.publishedAt)],
      // On ne sélectionne que ce qui est nécessaire pour la liste
      columns: { 
        id: true,
        slug: true, 
        titleFr: true, titleEn: true,
        summaryFr: true, summaryEn: true,
        imageUrl: true,
        publishedAt: true
      },
    });
  }),

  // Récupère un article par son slug (maintenant avec restriction premium)
  getBySlug: privateProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const user = await ctx.db.query.users.findFirst({ where: eq(users.id, userId) });

      if (!user) throw new Error("Utilisateur non trouvé.");

      const isPremium = !!user.stripeSubscriptionId; // ou votre logique admin
      
      // Vérifier si le compteur doit être réinitialisé (si on est dans un nouveau mois)
      const now = new Date();
      const resetDate = new Date(user.articleViewResetAt);
      if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
        await ctx.db.update(users).set({ articleViewCount: 0, articleViewResetAt: now }).where(eq(users.id, userId));
        user.articleViewCount = 0; // On met à jour l'objet local pour la suite
      }

      const canView = isPremium || user.articleViewCount < FREE_ARTICLE_LIMIT;

      if (!canView) {
        throw new Error("Limite d'articles gratuits atteinte pour ce mois.");
      }
      
      // On ne fait l'incrémentation que si l'utilisateur n'est pas premium
      if (!isPremium) {
         await ctx.db.update(users).set({ articleViewCount: sql`${users.articleViewCount} + 1` }).where(eq(users.id, userId));
      }

      return await ctx.db.query.articles.findFirst({ where: eq(articles.slug, input.slug) });
    }),
}); 