import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '../db';
import { users, likes, comments } from '../db/schema';
import { eq } from 'drizzle-orm';

export const createContext = async () => {
  const { userId } = await auth();
  
  // Si l'utilisateur est connecté, on s'assure qu'il existe dans notre DB
  if (userId) {
    try {
      // Vérifier si l'utilisateur existe déjà par ID
      const existingUserById = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });
      
      if (!existingUserById) {
        const user = await currentUser();
        if (user) {
          const userEmail = user.emailAddresses[0]?.emailAddress ?? '';
          
          // Vérifier si un utilisateur existe déjà avec cet email (cas de migration)
          const existingUserByEmail = await db.query.users.findFirst({
            where: eq(users.email, userEmail),
          });
          
          if (existingUserByEmail) {
            // Migration simplifiée avec transaction pour préserver les relations
            await db.transaction(async (tx) => {
              // 1. Mettre à jour les likes s'il y en a
              await tx.update(likes)
                .set({ userId: user.id })
                .where(eq(likes.userId, existingUserByEmail.id));
              
              // 2. Mettre à jour les commentaires s'il y en a
              await tx.update(comments)
                .set({ authorId: user.id })
                .where(eq(comments.authorId, existingUserByEmail.id));
              
              // 3. Supprimer l'ancien utilisateur
              await tx.delete(users).where(eq(users.id, existingUserByEmail.id));
              
              // 4. Créer le nouvel utilisateur avec le bon ID
              await tx.insert(users).values({
                id: user.id,
                email: userEmail,
                name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || existingUserByEmail.name || 'Utilisateur',
              });
            });
            console.log(`🔄 Migration complète réussie: ${userEmail} → ID: ${user.id}`);
          } else {
            // Créer un nouvel utilisateur
            await db.insert(users).values({
              id: user.id,
              email: userEmail,
              name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Utilisateur',
            });
            console.log(`✅ Utilisateur auto-créé: ${user.id} (${userEmail})`);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification/création utilisateur:', error);
    }
  }
  
  return {
    userId,
    db,
  };
}; 