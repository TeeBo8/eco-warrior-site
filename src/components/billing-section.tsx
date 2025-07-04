"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "./ui/button";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export function BillingSection() {
  const t = useTranslations("BillingSection");
  const locale = useLocale();
  const { user } = useUser();

  // On récupère le statut "premium" via les métadonnées de Clerk
  // C'est beaucoup plus rapide que d'interroger notre BDD ici.
  const isSubscribed = (user?.publicMetadata as { stripe?: { isSubscribed?: boolean } })?.stripe?.isSubscribed === true;

  const portalMutation = trpc.stripe.createBillingPortalSession.useMutation({
    onSuccess: (data: { url: string | null }) => {
      if (data.url) window.location.href = data.url;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('title')}</h2>
      {isSubscribed ? (
        <div>
          <p className="text-muted-foreground">{t('subscribed.message')}</p>
          <Button
            onClick={() => portalMutation.mutate()}
            disabled={portalMutation.isPending}
            className="mt-4"
          >
            {t('subscribed.button')}
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-muted-foreground">{t('notSubscribed.message')}</p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/pricing`}>{t('notSubscribed.button')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 