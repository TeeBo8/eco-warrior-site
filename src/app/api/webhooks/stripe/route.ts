import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { checkAndAwardBadges } from "@/server/services/gamification";

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return new Response("Missing Stripe configuration", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err);
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      return new Response("User ID not found in Stripe session metadata", { status: 400 });
    }
    
    // On met à jour les métadonnées PUBLIQUES de l'utilisateur sur Clerk
    await (await clerkClient()).users.updateUserMetadata(userId, {
      publicMetadata: {
        stripe: {
          isSubscribed: true,
          customerId: session.customer as string,
        },
      },
    });

    // 👇 On attribue le badge de supporter 👇
    await checkAndAwardBadges(userId, { action: 'subscription' });
  }

  // Gérer l'événement customer.subscription.deleted (annulation)
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    
    // On devrait trouver l'utilisateur par son customer_id
    // Pour simplifier, on suppose qu'on a cette info dans les métadonnées
    // Dans un vrai projet, vous auriez une table de mapping customer_id -> user_id
    
    console.log(`Subscription canceled for customer: ${customerId}`);
    // Ici on mettrait à jour Clerk pour retirer le statut premium
  }

  return new Response(null, { status: 200 });
} 