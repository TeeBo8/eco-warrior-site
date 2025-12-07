'use client';

import { IndicatorCard } from "@/components/indicator-card";
import { trpc } from "@/app/_trpc/client";
import { useTranslations } from 'next-intl';

export function DashboardContent() {
  const t = useTranslations('DashboardPage');
  const { data: climateData, isLoading, error } = trpc.getClimateIndicators.useQuery();

  return (
    <div>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground mb-6">{t('description')}</p>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500">{t('error', { errorMessage: error.message })}</p>
        )}

        {climateData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IndicatorCard
              title={t('co2CardTitle')}
              value={climateData.co2.value}
              unit={climateData.co2.unit}
              source={climateData.co2.source}
            />
            <IndicatorCard
              title={t('tempCardTitle')}
              value={climateData.tempAnomaly.value}
              unit={climateData.tempAnomaly.unit}
              source={climateData.tempAnomaly.source}
            />
            <IndicatorCard
              title={t('seaLevelCardTitle')}
              value={climateData.seaLevel.value}
              unit={climateData.seaLevel.unit}
              source={climateData.seaLevel.source}
            />
            <IndicatorCard
              title={t('iceMeltCardTitle')}
              value={climateData.iceMelt.value}
              unit={climateData.iceMelt.unit}
              source={climateData.iceMelt.source}
            />
          </div>
        )}
      </main>
    </div>
  );
}