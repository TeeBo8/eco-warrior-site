import {
  publicProcedure,
  router,
} from "@/server/trpc/trpc";
import { db } from "@/server/db";
import { posts, anonymousLikes } from "@/server/db/schema";
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
        const userLikes = await db.select()
          .from(anonymousLikes)
          .where(eq(anonymousLikes.sessionId, input.sessionId));
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

      // Vérifier si la session a déjà liké ce post
      const existingLike = await db.select()
        .from(anonymousLikes)
        .where(and(
          eq(anonymousLikes.sessionId, sessionId),
          eq(anonymousLikes.postId, postId)
        ))
        .limit(1);

      if (existingLike.length > 0) {
        // Retirer le like
        await db.delete(anonymousLikes).where(
          and(
            eq(anonymousLikes.sessionId, sessionId),
            eq(anonymousLikes.postId, postId)
          )
        );
        // Décrémenter le compteur
        await db.update(posts)
          .set({ likes: sql`${posts.likes} - 1` })
          .where(eq(posts.id, postId));

        return { liked: false };
      } else {
        // Ajouter le like
        await db.insert(anonymousLikes).values({
          sessionId: sessionId,
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
