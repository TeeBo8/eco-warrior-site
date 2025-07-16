import { Timeline } from "@/components/timeline";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

interface TimelinePageProps {
  params: Promise<{ locale: string }>;
}

// Ajout de generateMetadata
export async function generateMetadata({ params }: TimelinePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "TimelinePage" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

// Conversion en composant serveur asynchrone
export default async function TimelinePage({ params }: TimelinePageProps) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: "TimelinePage" });
  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Timeline locale={resolvedParams.locale} />
      </main>
    </div>
  );
} 