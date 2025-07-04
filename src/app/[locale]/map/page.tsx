"use client";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePremiumStatus } from "@/lib/test-mode-context";
import { useUser } from "@clerk/nextjs";

export default function MapPage() {
  const t = useTranslations("MapPage");
  const tPremium = useTranslations("MapPage.premium");
  const locale = useLocale();
  const { isSignedIn } = useUser();
  
  // 👇 NOUVEAU SYSTÈME DE TEST GLOBAL 👇
  const isPremium = usePremiumStatus();
  
  // Importation dynamique pour s'assurer que Leaflet ne s'exécute que côté client
  const AdvancedImpactMap = useMemo(() => dynamic(
    () => import('@/components/advanced-impact-map'),
    { ssr: false, loading: () => <p>{t('loading')}</p> }
  ), [t]);

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <AdvancedImpactMap />
        </div>

        {isSignedIn && !isPremium && (
          <div className="text-center mt-8 p-6 bg-muted rounded-lg">
            <h3 className="font-semibold">{tPremium('authenticatedTitle')}</h3>
            <p className="text-muted-foreground mt-2">
              {tPremium('authenticatedDescription')}
            </p>
            <Button asChild className="mt-4">
              <Link href={`/${locale}/pricing`}>{tPremium('authenticatedButton')}</Link>
            </Button>
          </div>
        )}

        {!isSignedIn && (
          <div className="text-center mt-8 p-6 bg-muted rounded-lg">
            <h3 className="font-semibold">{tPremium('unauthenticatedTitle')}</h3>
            <p className="text-muted-foreground mt-2">
              {tPremium('unauthenticatedDescription')}
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button variant="outline" asChild>
                <Link href={`/${locale}/sign-in`}>{tPremium('signInButton')}</Link>
              </Button>
              <Button asChild>
                <Link href={`/${locale}/pricing`}>{tPremium('becomePremiumButton')}</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 