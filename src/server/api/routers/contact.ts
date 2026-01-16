// src/server/api/routers/contact.ts
import { z } from "zod";
import { Resend } from "resend";
import { router, publicProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";

// Lazy initialization to avoid build errors when API key is missing
let resendInstance: Resend | null = null;
const getResend = () => {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
};

export const contactRouter = router({
  send: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }: { input: { email: string; message: string } }) => {
      const { email, message } = input;
      try {
        // Si la clé API n'est pas définie, on journalise simplement.
        if (!process.env.RESEND_API_KEY) {
          console.warn("RESEND_API_KEY manquante – le message est enregistré mais aucun e-mail n'a été envoyé.");
          console.log('📧 Message de contact reçu (mode test):', { email, message });
          return { success: true };
        }

        const resend = getResend();
        if (!resend) {
          throw new Error("Resend non initialisé");
        }

        // Adresse expéditrice et destinataire issues des variables d'environnement
        const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
        const TO_EMAIL = process.env.RESEND_TO_EMAIL ?? 'admin@example.com';

        await resend.emails.send({
          from: `Contact Form <${FROM_EMAIL}>`,
          to: TO_EMAIL,
          subject: 'Nouveau message depuis EcoWarrior',
          replyTo: email,
          html: `<p>Nouveau message de : <strong>${email}</strong></p><p>${message}</p>`,
        });
        return { success: true };
      } catch (error) {
        console.error("Erreur d'envoi Resend:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Le message n'a pas pu être envoyé. Veuillez réessayer.",
        });
      }
    }),
});