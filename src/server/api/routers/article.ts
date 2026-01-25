import { router, publicProcedure } from "@/server/trpc/trpc";
import articlesData from "@/data/articles.json";
import { z } from "zod";

// Types pour les articles
export type ArticleCategory = "Climat" | "Océans" | "Énergie" | "Biodiversité" | "Solutions";

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "Climat",
  "Océans",
  "Énergie",
  "Biodiversité",
  "Solutions"
];

// Typage fort des articles
interface Article {
  id: number;
  slug: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  contentFr: string;
  contentEn: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  category: ArticleCategory;
  featured: boolean;
  views: number;
}

const articles = articlesData as Article[];

export const articleRouter = router({
  // Récupère tous les articles avec filtrage et pagination
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(9),
      excludeFeatured: z.boolean().default(false),
    }).optional())
    .query(async ({ input }) => {
      const { category, page = 1, limit = 9, excludeFeatured = false } = input ?? {};

      let filtered = [...articles];

      // Exclure l'article featured si demandé
      if (excludeFeatured) {
        filtered = filtered.filter(a => !a.featured);
      }

      // Filtrer par catégorie
      if (category && category !== "all") {
        filtered = filtered.filter(a => a.category === category);
      }

      // Tri par date (décroissant)
      const sorted = filtered.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Pagination
      const total = sorted.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = sorted.slice(start, end);

      return {
        articles: paginated.map(article => ({
          ...article,
          publishedAt: new Date(article.publishedAt)
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      };
    }),

  // Récupère l'article featured (À la une)
  getFeatured: publicProcedure.query(async () => {
    const featured = articles.find(a => a.featured);
    if (!featured) return null;
    return {
      ...featured,
      publishedAt: new Date(featured.publishedAt)
    };
  }),

  // Récupère les articles populaires (triés par vues)
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(10).default(5),
      excludeSlug: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const { limit = 5, excludeSlug } = input ?? {};

      let filtered = [...articles];

      if (excludeSlug) {
        filtered = filtered.filter(a => a.slug !== excludeSlug);
      }

      const sorted = filtered.sort((a, b) => b.views - a.views);

      return sorted.slice(0, limit).map(article => ({
        ...article,
        publishedAt: new Date(article.publishedAt)
      }));
    }),

  // Récupère les catégories avec le compte d'articles
  getCategories: publicProcedure.query(async () => {
    const counts: Record<string, number> = {};

    for (const article of articles) {
      counts[article.category] = (counts[article.category] || 0) + 1;
    }

    return ARTICLE_CATEGORIES.map(cat => ({
      name: cat,
      count: counts[cat] || 0
    }));
  }),

  // Récupère un article par son slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const article = articles.find(a => a.slug === input.slug);
      if (!article) return null;
      return {
        ...article,
        publishedAt: new Date(article.publishedAt)
      };
    }),

  // Récupère les articles relatifs (même catégorie)
  getRelated: publicProcedure
    .input(z.object({
      slug: z.string(),
      limit: z.number().min(1).max(5).default(3)
    }))
    .query(async ({ input }) => {
      const { slug, limit } = input;
      const currentArticle = articles.find(a => a.slug === slug);

      if (!currentArticle) return [];

      const related = articles
        .filter(a => a.slug !== slug && a.category === currentArticle.category)
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);

      return related.map(article => ({
        ...article,
        publishedAt: new Date(article.publishedAt)
      }));
    }),
});
