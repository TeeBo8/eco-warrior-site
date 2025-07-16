import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'PricingPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PricingPage" });

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="border-green-500 border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('plan.title')}</CardTitle>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                  {t('plan.promotion')}
                </div>
                <div className="text-2xl text-gray-500 line-through">€9.99<span className="text-sm">/mois</span></div>
                <div className="text-4xl font-bold text-green-600">€5.00<span className="text-lg font-normal">/mois</span></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {t('plan.features.0')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {t('plan.features.1')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {t('plan.features.2')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {t('plan.features.3')}
                </li>
              </ul>
              <Button className="w-full mt-6" asChild>
                <a href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" target="_blank" rel="noopener noreferrer">
                  {t('plan.button')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 