"use client";

import { Timeline } from "@/components/timeline";
import { useTranslations } from "next-intl";

export default function TimelinePage() {
  const t = useTranslations("TimelinePage");
  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Timeline />
      </main>
    </div>
  );
} 