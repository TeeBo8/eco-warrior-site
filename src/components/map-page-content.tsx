'use client';

import { useTranslations } from "next-intl";
import MapWrapper from '@/components/map-wrapper';

export default function MapPageContent() {
  const t = useTranslations("MapPage");

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <MapWrapper />
        </div>
      </main>
    </div>
  );
}