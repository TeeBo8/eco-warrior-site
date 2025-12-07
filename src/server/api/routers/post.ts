import {
  publicProcedure,
  router,
} from "@/server/trpc/trpc";
import { db } from "@/server/db";

export const postRouter = router({
  // Récupère tous les posts, triés par nombre de likes
  getPosts: publicProcedure.query(async () => {
    const postList = await db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.likes)],
    });

    return postList.map(p => ({ ...p, isLiked: false }));
  }),
});