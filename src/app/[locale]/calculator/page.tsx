import { CarbonCalculatorForm } from "@/components/carbon-calculator-form";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'CalculatorPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CalculatorPage" });

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <CarbonCalculatorForm />

        <div className="mt-16 bg-muted/30 p-8 rounded-2xl border border-border">
          <h2 className="text-2xl font-bold mb-4">{t('methodology.title')}</h2>
          <p className="text-muted-foreground mb-6">{t('methodology.description')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">{t('methodology.factors.transport')}</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">{t('methodology.factors.diet')}</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">{t('methodology.factors.energy')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 