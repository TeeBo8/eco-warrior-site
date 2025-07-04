import { privateProcedure, router } from "../../trpc/trpc";
import Stripe from "stripe";

export const stripeRouter = router({
  createCheckoutSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-05-28.basil",
    });
    
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId, // 👈 On ajoute l'ID de l'utilisateur ici
      },
    });
    
    return { url: checkoutSession.url };
  }),

  createBillingPortalSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-05-28.basil",
    });
    
    // Note: Dans un vrai projet, vous devriez récupérer le customer_id Stripe
    // depuis votre base de données ou les métadonnées de Clerk
    // Pour cet exemple, on utilise une méthode simplifiée
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userId, // En réalité, il faudrait le vrai customer_id Stripe
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });
    
    return { url: portalSession.url };
  }),
}); 