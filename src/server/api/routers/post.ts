import {
  privateProcedure,
  publicProcedure,
  router,
} from "@/server/trpc/trpc";
import { posts, likes } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";

export const postRouter = router({
  // Récupère tous les posts, triés par nombre de likes
  getPosts: publicProcedure.query(async ({ ctx }) => {
    const postList = await db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.likes)],
    });

    // On vérifie si l'utilisateur actuel a liké chaque post
    const { userId } = ctx;
    if (!userId) return postList.map(p => ({ ...p, isLiked: false }));

    const userLikes = await db.query.likes.findMany({ 
      where: eq(likes.userId, userId) 
    });
    const likedPostIds = new Set(userLikes.map(like => like.postId));

    return postList.map(post => ({
      ...post,
      isLiked: likedPostIds.has(post.id),
    }));
  }),

  // Procédure privée pour liker/unliker un post
  toggleLike: privateProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { postId } = input;
      
      const existingLike = await db.query.likes.findFirst({
        where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
      });

      await db.transaction(async (tx) => {
        if (existingLike) {
          // Unliker : supprimer le like et décrémenter le compteur
          await tx.delete(likes).where(eq(likes.id, existingLike.id));
          await tx.update(posts)
            .set({ likes: sql`${posts.likes} - 1` })
            .where(eq(posts.id, postId));
        } else {
          // Liker : ajouter le like et incrémenter le compteur
          await tx.insert(likes).values({ userId, postId });
          await tx.update(posts)
            .set({ likes: sql`${posts.likes} + 1` })
            .where(eq(posts.id, postId));
        }
      });
      
      return { success: true };
    }),
  getLikeStatus: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      const totalLikes = await db.select({ count: sql`count(*)` }).from(likes).where(eq(likes.postId, input.postId));
      const likesCount = totalLikes[0].count;
      if (!ctx.userId) return { isLiked: false, likes: likesCount };
      const userLike = await db.query.likes.findFirst({
        where: and(eq(likes.postId, input.postId), eq(likes.userId, ctx.userId)),
      });
      return { isLiked: !!userLike, likes: likesCount };
    }),
}); 