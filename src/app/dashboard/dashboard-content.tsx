'use client';

import { IndicatorCard } from "@/components/indicator-card";
import { ClimateChart } from "@/components/climate-chart";
import { ClimateGauge } from "@/components/climate-gauge";
import { trpc } from "@/app/_trpc/client";
import { climateHistoryData } from "@/data/climate-history";

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
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <p className="text-red-500">Erreur : {error.message}</p>
        )}

        {climateData && (
          <>
            {/* Cartes KPI avec sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <IndicatorCard
                title="Concentration CO₂"
                value={climateData.co2.value}
                unit={climateData.co2.unit}
                source={climateData.co2.source}
                history={climateHistoryData.co2}
                trend="up"
                trendIsGood={false}
              />
              <IndicatorCard
                title="Anomalie Température"
                value={climateData.tempAnomaly.value}
                unit={climateData.tempAnomaly.unit}
                source={climateData.tempAnomaly.source}
                history={climateHistoryData.tempAnomaly}
                trend="up"
                trendIsGood={false}
              />
              <IndicatorCard
                title="Élévation Niveau Mer"
                value={climateData.seaLevel.value}
                unit={climateData.seaLevel.unit}
                source={climateData.seaLevel.source}
                history={climateHistoryData.seaLevel}
                trend="up"
                trendIsGood={false}
              />
              <IndicatorCard
                title="Glace Antarctique"
                value={climateData.iceMelt.value}
                unit={climateData.iceMelt.unit}
                source={climateData.iceMelt.source}
                history={climateHistoryData.iceMelt}
                trend="down"
                trendIsGood={false}
              />
            </div>

            {/* Graphiques historiques détaillés */}
            <h2 className="text-2xl font-bold mt-12 mb-6">Évolution Historique</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClimateChart
                title="Concentration CO₂ atmosphérique"
                description="Évolution depuis 2000 - Source: NOAA Mauna Loa"
                data={climateHistoryData.co2}
                unit=" ppm"
                color="hsl(25, 95%, 53%)"
                dangerThreshold={450}
                dangerLabel="Seuil 2°C (450 ppm)"
              />
              <ClimateChart
                title="Anomalie de température globale"
                description="Écart par rapport à la moyenne 1951-1980 - Source: NASA GISS"
                data={climateHistoryData.tempAnomaly}
                unit="°C"
                color="hsl(0, 84%, 60%)"
                dangerThreshold={1.5}
                dangerLabel="Accord de Paris (1.5°C)"
              />
              <ClimateChart
                title="Élévation du niveau de la mer"
                description="Hausse depuis 2000 - Source: NASA Satellite"
                data={climateHistoryData.seaLevel}
                unit=" mm"
                color="hsl(210, 100%, 50%)"
              />
              <ClimateChart
                title="Perte de glace Antarctique"
                description="Bilan massique annuel - Source: NASA GRACE"
                data={climateHistoryData.iceMelt}
                unit=" Gt/an"
                color="hsl(200, 80%, 60%)"
              />
            </div>

            {/* Jauges de seuils critiques */}
            <h2 className="text-2xl font-bold mt-12 mb-6">Seuils Critiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ClimateGauge
                title="CO₂ atmosphérique"
                currentValue={parseFloat(climateData.co2.value)}
                unit=" ppm"
                minValue={350}
                maxValue={500}
                thresholds={{ safe: 400, warning: 450 }}
                description="Seuil de 450 ppm = réchauffement de 2°C quasi certain"
              />
              <ClimateGauge
                title="Température globale"
                currentValue={parseFloat(climateData.tempAnomaly.value)}
                unit="°C"
                minValue={0}
                maxValue={2.5}
                thresholds={{ safe: 1.0, warning: 1.5 }}
                description="Accord de Paris : limiter à 1.5°C max"
              />
              <ClimateGauge
                title="Niveau de la mer"
                currentValue={parseFloat(climateData.seaLevel.value)}
                unit=" mm"
                minValue={0}
                maxValue={200}
                thresholds={{ safe: 50, warning: 100 }}
                description="Menace directe pour les zones côtières"
              />
              <ClimateGauge
                title="Perte de glace"
                currentValue={Math.abs(parseFloat(climateData.iceMelt.value))}
                unit=" Gt/an"
                minValue={0}
                maxValue={250}
                thresholds={{ safe: 100, warning: 150 }}
                description="Accélération de la fonte des glaciers"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
