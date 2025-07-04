import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { type WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/server/db'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Récupérer les headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Créer une nouvelle instance de Svix avec votre secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Vérifier le payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  const eventType = evt.type;

  // Gérer l'événement USER CREATED
  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    try {
      await db.insert(users).values({
        id: id,
        email: email_addresses[0]?.email_address ?? '',
        name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
      });
      console.log(`Utilisateur créé en BDD: ${id}`);
    } catch (error) {
      console.error('Erreur lors de la création utilisateur:', error);
      return new Response('Erreur lors de la création utilisateur', { status: 500 })
    }
  }

  // Gérer l'événement USER UPDATED
  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    try {
      await db.update(users).set({
          email: email_addresses[0]?.email_address ?? '',
          name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
        }).where(eq(users.id, id));
      console.log(`Utilisateur mis à jour en BDD: ${id}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour utilisateur:', error);
      return new Response('Erreur lors de la mise à jour utilisateur', { status: 500 })
    }
  }

  return new Response('Webhook traité avec succès', { status: 200 })
} 