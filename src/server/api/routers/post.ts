import {
  publicProcedure,
  router,
} from "@/server/trpc/trpc";
import { db } from "@/server/db";
import { posts, likes } from "@/server/db/schema";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";

export const postRouter = router({
  // Récupère tous les posts, triés par nombre de likes
  getPosts: publicProcedure
    .input(z.object({ sessionId: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const postList = await db.query.posts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.likes)],
      });

      // Si on a un sessionId, on vérifie quels posts sont likés
      if (input?.sessionId) {
        const userLikes = await db.query.likes.findMany({
          where: eq(likes.userId, input.sessionId),
        });
        const likedPostIds = new Set(userLikes.map(l => l.postId));
        return postList.map(p => ({ ...p, isLiked: likedPostIds.has(p.id) }));
      }

      return postList.map(p => ({ ...p, isLiked: false }));
    }),

  // Toggle like sur un post
  toggleLike: publicProcedure
    .input(z.object({
      postId: z.number(),
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { postId, sessionId } = input;

      // Vérifier si l'utilisateur a déjà liké ce post
      const existingLike = await db.query.likes.findFirst({
        where: and(
          eq(likes.userId, sessionId),
          eq(likes.postId, postId)
        ),
      });

      if (existingLike) {
        // Retirer le like
        await db.delete(likes).where(
          and(
            eq(likes.userId, sessionId),
            eq(likes.postId, postId)
          )
        );
        // Décrémenter le compteur
        await db.update(posts)
          .set({ likes: sql`${posts.likes} - 1` })
          .where(eq(posts.id, postId));

        return { liked: false };
      } else {
        // Ajouter le like
        await db.insert(likes).values({
          userId: sessionId,
          postId: postId,
        });
        // Incrémenter le compteur
        await db.update(posts)
          .set({ likes: sql`${posts.likes} + 1` })
          .where(eq(posts.id, postId));

        return { liked: true };
      }
    }),
});