"use server";

import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export type ResultatContact = { ok: true } | { ok: false; erreur: string };

export async function envoyerContact(donnees: unknown): Promise<ResultatContact> {
  const saisie = schema.safeParse(donnees);
  if (!saisie.success) {
    return { ok: false, erreur: "Adresse e-mail ou message invalide." };
  }
  const { email, message } = saisie.data;

  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    // En local sans clé : on ne bloque pas le formulaire.
    console.warn("RESEND_API_KEY manquante : message non envoyé.", { email });
    return { ok: true };
  }

  try {
    const resend = new Resend(cle);
    const { error } = await resend.emails.send({
      from: `EcoWarrior <${process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
      to: process.env.RESEND_TO_EMAIL ?? "delivered@resend.dev",
      replyTo: email,
      subject: "Nouveau message depuis EcoWarrior",
      // Texte brut : le message du visiteur n'est jamais interprété comme du HTML.
      text: `Message de : ${email}\n\n${message}`,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (e) {
    console.error("Erreur d'envoi Resend :", e);
    return { ok: false, erreur: "Le message n'a pas pu être envoyé. Réessaie plus tard." };
  }
}
