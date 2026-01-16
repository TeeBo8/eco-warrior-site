'use client';

import { IndicatorCard } from "@/components/indicator-card";
import { trpc } from "@/app/_trpc/client";

export function DashboardContent() {
  const { data: climateData, isLoading, error } = trpc.getClimateIndicators.useQuery();

  return (
    <div>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tableau de Bord du Climat</h1>
        <p className="text-muted-foreground mb-6">Les indicateurs clés de notre planète en temps réel.</p>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500">Erreur : {error.message}</p>
        )}

        {climateData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <IndicatorCard
              title="Concentration CO₂"
              value={climateData.co2.value}
              unit={climateData.co2.unit}
              source={climateData.co2.source}
            />
            <IndicatorCard
              title="Anomalie Température"
              value={climateData.tempAnomaly.value}
              unit={climateData.tempAnomaly.unit}
              source={climateData.tempAnomaly.source}
            />
            <IndicatorCard
              title="Élévation Niveau Mer"
              value={climateData.seaLevel.value}
              unit={climateData.seaLevel.unit}
              source={climateData.seaLevel.source}
            />
            <IndicatorCard
              title="Glace Antarctique"
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