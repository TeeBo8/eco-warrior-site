import { privateProcedure, router, publicProcedure } from "@/server/trpc/trpc";
import { z } from "zod";
import { carbonFootprints, users } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";
import { checkAndAwardBadges } from "@/server/services/gamification";

// Schéma de validation pour le calcul
const calculationInputSchema = z.object({
  distanceKm: z.number().min(0),
  transportMode: z.enum(["car_gasoline", "car_electric", "plane", "train"]),
  diet: z.enum(["meat_lover", "average", "vegetarian", "vegan"]),
  energyKwh: z.number().min(0),
});

export const carbonRouter = router({
  // Procédure publique pour calculer l'empreinte carbone
  calculateFootprint: publicProcedure
    .input(calculationInputSchema)
    .mutation(({ input }) => {
      // Facteurs d'émission simplifiés (en kg de CO₂e par unité)
      const EMISSION_FACTORS = {
        transport: {
          car_gasoline: 0.192, // kg/km
          car_electric: 0.05,  // kg/km (mix électrique moyen)
          plane: 0.255,        // kg/km par passager
          train: 0.014,        // kg/km par passager
        },
        diet: {
          meat_lover: 3.3, // tCO2e/an -> kg/jour
          average: 2.5,
          vegetarian: 1.7,
          vegan: 1.5,
        },
        energy: {
          kwh: 0.057, // kg/kWh (pour la France, très décarboné)
        },
      };

      // Calcul pour le transport (annuel)
      const transportEmissions = input.distanceKm * EMISSION_FACTORS.transport[input.transportMode] * 365;

      // Calcul pour l'alimentation (annuel)
      const dietEmissions = EMISSION_FACTORS.diet[input.diet] * 1000; // t -> kg

      // Calcul pour l'énergie (annuel)
      const energyEmissions = input.energyKwh * EMISSION_FACTORS.energy.kwh * 12;

      const totalEmissionsKg = transportEmissions + dietEmissions + energyEmissions;
      
      // Conversion en tonnes pour un affichage plus lisible
      const totalEmissionsTonnes = totalEmissionsKg / 1000;

      return {
        totalEmissions: totalEmissionsTonnes,
        breakdown: {
          transport: transportEmissions / 1000,
          diet: dietEmissions / 1000,
          energy: energyEmissions / 1000,
        },
      };
    }),

  // Procédure privée pour sauvegarder un calcul (premium uniquement)
  saveFootprint: privateProcedure
    .input(z.object({
      totalEmissions: z.number(),
      transportEmissions: z.number(),
      dietEmissions: z.number(),
      energyEmissions: z.number(),
      // Ajout des données originales pour les badges
      transportMode: z.enum(["car_gasoline", "car_electric", "plane", "train"]),
      diet: z.enum(["meat_lover", "average", "vegetarian", "vegan"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // S'assurer que l'utilisateur existe dans la table users
      try {
        // Vérifier si l'utilisateur existe
        const existingUser = await ctx.db.query.users.findFirst({
          where: eq(users.id, ctx.userId),
        });

        // Si l'utilisateur n'existe pas, le créer
        if (!existingUser) {
          await ctx.db.insert(users).values({
            id: ctx.userId,
            email: ctx.userId + "@temp.com", // Email temporaire
            name: "Utilisateur Dev",
          });
        }

        // Maintenant sauvegarder l'empreinte carbone
        await ctx.db.insert(carbonFootprints).values({
          userId: ctx.userId,
          totalEmissions: input.totalEmissions,
          transportEmissions: input.transportEmissions,
          dietEmissions: input.dietEmissions,
          energyEmissions: input.energyEmissions,
        });
        
        // 👇 On vérifie les badges après la sauvegarde 👇
        const calculationContext = { 
          action: 'calculation' as const, 
          data: { diet: input.diet, transportMode: input.transportMode } 
        };
        const saveContext = { action: 'save' as const };
        
        await checkAndAwardBadges(ctx.userId, calculationContext);
        const newBadges = await checkAndAwardBadges(ctx.userId, saveContext);
        
        return { success: true, newBadges };
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        throw new Error("Impossible de sauvegarder le calcul");
      }
    }),
  
  // Procédure privée pour récupérer l'historique (premium uniquement)
  getHistory: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.carbonFootprints.findMany({
      where: eq(carbonFootprints.userId, ctx.userId),
      orderBy: [desc(carbonFootprints.createdAt)],
      limit: 10, // On limite aux 10 derniers pour commencer
    });
  }),
}); 