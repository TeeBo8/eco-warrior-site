import { router, publicProcedure } from "@/server/trpc/trpc";
import articlesData from "@/data/articles.json";
import { z } from "zod";

export const articleRouter = router({
  // Récupère une liste d'articles pour la page de blog
  getAll: publicProcedure.query(async () => {
    // Tri décroissant
    const sorted = [...articlesData].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return sorted.map(article => ({
      ...article,
      publishedAt: new Date(article.publishedAt) // Conversion pour tRPC
    }));
  }),

  // Récupère un article par son slug (accès public illimité)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const article = articlesData.find(a => a.slug === input.slug);
      if (!article) return null;
      return {
        ...article,
        publishedAt: new Date(article.publishedAt)
      };
    }),
});