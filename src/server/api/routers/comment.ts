import { privateProcedure, router } from "@/server/trpc/trpc";
import { comments } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { checkAndAwardBadges } from "@/server/services/gamification";
// import { currentUser } from "@clerk/nextjs/server";
// import { hasPremiumAccess } from "@/lib/auth-utils";

export const commentRouter = router({
  // Récupère les commentaires pour un post donné
  getForPost: privateProcedure // Seuls les membres connectés peuvent voir
    .input(z.object({ postId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.comments.findMany({
        where: eq(comments.postId, input.postId),
        orderBy: [desc(comments.createdAt)],
        with: {
          author: { // On récupère les infos de l'auteur du commentaire
            columns: { name: true, id: true },
          },
        },
      });
    }),

  // Ajoute un nouveau commentaire (protégé pour les membres premium)
  add: privateProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string().min(1).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      // 🚨 MODE TEMPORAIRE : Tous les utilisateurs connectés peuvent commenter
      // 
      // Pour réactiver la vérification premium :
      // 1. Ajoute CLERK_SECRET_KEY dans .env.local  
      // 2. Lance : pnpm tsx scripts/make-admin.ts
      // 3. Décommente et utilise le code ci-dessous :
      //
      // const clerkUser = await currentUser();
      // const dbUser = await ctx.db.query.users.findFirst({ 
      //   where: eq(users.id, ctx.userId) 
      // });
      // const isPremium = hasPremiumAccess(clerkUser, dbUser ?? null);
      // if (!isPremium) {
      //   throw new Error("Seuls les membres premium peuvent commenter.");
      // }

      await ctx.db.insert(comments).values({
        postId: input.postId,
        content: input.content,
        authorId: ctx.userId,
      });

      // Ici, on déclenche la gamification
      await checkAndAwardBadges(ctx.userId, { action: 'comment' });

      return { success: true };
    }),
}); 