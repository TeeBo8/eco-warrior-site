'use client';

import { useState } from "react";
import { IndicatorCard } from "@/components/indicator-card";
import { ClimateChart } from "@/components/climate-chart";
import { ClimateGauge } from "@/components/climate-gauge";
import { ClimateComparisonChart } from "@/components/climate-comparison-chart";
import { DashboardFilters, filterDataByPeriod, type PeriodFilter } from "@/components/dashboard-filters";
import { AdvancedStats } from "@/components/advanced-stats";
import { HumanImpactSection } from "@/components/climate-info";
import { CountryRankings } from "@/components/country-rankings";
import { trpc } from "@/app/_trpc/client";
import { climateHistoryData } from "@/data/climate-history";

export function DashboardContent() {
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [comparisonMode, setComparisonMode] = useState(false);
  const { data: climateData, isLoading, error } = trpc.getClimateIndicators.useQuery();

  // Données filtrées par période
  const filteredCo2 = filterDataByPeriod(climateHistoryData.co2, period);
  const filteredTemp = filterDataByPeriod(climateHistoryData.tempAnomaly, period);
  const filteredSea = filterDataByPeriod(climateHistoryData.seaLevel, period);
  const filteredIce = filterDataByPeriod(climateHistoryData.iceMelt, period);

  // Texte de la période pour les descriptions
  const periodText = period === 'all' ? 'depuis 2000' : `sur ${period} ans`;

  // Données pour le mode comparaison (2000 vs 2025)
  const comparisonData = [
    {
      label: 'CO₂ (ppm)',
      period1Value: climateHistoryData.co2[0]?.value || 0,
      period2Value: climateHistoryData.co2[climateHistoryData.co2.length - 1]?.value || 0,
    },
    {
      label: 'Temp (°C)',
      period1Value: climateHistoryData.tempAnomaly[0]?.value || 0,
      period2Value: climateHistoryData.tempAnomaly[climateHistoryData.tempAnomaly.length - 1]?.value || 0,
    },
    {
      label: 'Mer (mm)',
      period1Value: climateHistoryData.seaLevel[0]?.value || 0,
      period2Value: climateHistoryData.seaLevel[climateHistoryData.seaLevel.length - 1]?.value || 0,
    },
    {
      label: 'Glace (Gt/an)',
      period1Value: Math.abs(climateHistoryData.iceMelt[0]?.value || 0),
      period2Value: Math.abs(climateHistoryData.iceMelt[climateHistoryData.iceMelt.length - 1]?.value || 0),
    },
  ];

  // Calcul des variations en pourcentage
  const variations = {
    co2: ((climateHistoryData.co2[climateHistoryData.co2.length - 1].value - climateHistoryData.co2[0].value) / climateHistoryData.co2[0].value * 100).toFixed(1),
    temp: ((climateHistoryData.tempAnomaly[climateHistoryData.tempAnomaly.length - 1].value - climateHistoryData.tempAnomaly[0].value) / climateHistoryData.tempAnomaly[0].value * 100).toFixed(0),
    sea: climateHistoryData.seaLevel[climateHistoryData.seaLevel.length - 1].value - climateHistoryData.seaLevel[0].value,
    ice: ((Math.abs(climateHistoryData.iceMelt[climateHistoryData.iceMelt.length - 1].value) - Math.abs(climateHistoryData.iceMelt[0].value)) / Math.abs(climateHistoryData.iceMelt[0].value) * 100).toFixed(0),
  };

  return (
    <div>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Tableau de Bord du Climat</h1>
        <p className="text-muted-foreground mb-6">Les indicateurs clés de notre planète en temps réel.</p>

        {/* Filtres */}
        <DashboardFilters
          period={period}
          onPeriodChange={setPeriod}
          comparisonMode={comparisonMode}
          onComparisonModeChange={setComparisonMode}
        />

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
                history={filteredCo2}
                trend="up"
                trendIsGood={false}
                metricKey="co2"
              />
              <IndicatorCard
                title="Anomalie Température"
                value={climateData.tempAnomaly.value}
                unit={climateData.tempAnomaly.unit}
                source={climateData.tempAnomaly.source}
                history={filteredTemp}
                trend="up"
                trendIsGood={false}
                metricKey="tempAnomaly"
              />
              <IndicatorCard
                title="Élévation Niveau Mer"
                value={climateData.seaLevel.value}
                unit={climateData.seaLevel.unit}
                source={climateData.seaLevel.source}
                history={filteredSea}
                trend="up"
                trendIsGood={false}
                metricKey="seaLevel"
              />
              <IndicatorCard
                title="Glace Antarctique"
                value={climateData.iceMelt.value}
                unit={climateData.iceMelt.unit}
                source={climateData.iceMelt.source}
                history={filteredIce}
                trend="down"
                trendIsGood={false}
                metricKey="iceMelt"
              />
            </div>

            {/* Mode Comparaison */}
            {comparisonMode && (
              <>
                <h2 className="text-2xl font-bold mt-12 mb-6">Comparaison 2000 vs 2025</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ClimateComparisonChart
                    title="Évolution des indicateurs climatiques"
                    description="Comparaison des valeurs entre 2000 et 2025"
                    data={comparisonData}
                    unit=""
                    period1Label="2000"
                    period2Label="2025"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">CO₂</p>
                      <p className="text-2xl font-bold text-red-500">+{variations.co2}%</p>
                      <p className="text-xs text-muted-foreground">depuis 2000</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Température</p>
                      <p className="text-2xl font-bold text-red-500">+{variations.temp}%</p>
                      <p className="text-xs text-muted-foreground">depuis 2000</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Niveau mer</p>
                      <p className="text-2xl font-bold text-red-500">+{variations.sea} mm</p>
                      <p className="text-xs text-muted-foreground">depuis 2000</p>
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Fonte glace</p>
                      <p className="text-2xl font-bold text-red-500">+{variations.ice}%</p>
                      <p className="text-xs text-muted-foreground">depuis 2000</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Graphiques historiques détaillés */}
            {!comparisonMode && (
              <>
                <h2 className="text-2xl font-bold mt-12 mb-6">Évolution Historique</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ClimateChart
                    title="Concentration CO₂ atmosphérique"
                    description={`Évolution ${periodText} - Source: NOAA Mauna Loa`}
                    data={filteredCo2}
                    unit=" ppm"
                    color="hsl(25, 95%, 53%)"
                    dangerThreshold={450}
                    dangerLabel="Seuil 2°C (450 ppm)"
                  />
                  <ClimateChart
                    title="Anomalie de température globale"
                    description={`Écart par rapport à la moyenne 1951-1980 ${periodText} - Source: NASA GISS`}
                    data={filteredTemp}
                    unit="°C"
                    color="hsl(0, 84%, 60%)"
                    dangerThreshold={1.5}
                    dangerLabel="Accord de Paris (1.5°C)"
                  />
                  <ClimateChart
                    title="Élévation du niveau de la mer"
                    description={`Hausse ${periodText} - Source: NASA Satellite`}
                    data={filteredSea}
                    unit=" mm"
                    color="hsl(210, 100%, 50%)"
                  />
                  <ClimateChart
                    title="Perte de glace Antarctique"
                    description={`Bilan massique annuel ${periodText} - Source: NASA GRACE`}
                    data={filteredIce}
                    unit=" Gt/an"
                    color="hsl(200, 80%, 60%)"
                  />
                </div>
              </>
            )}

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

            {/* Impact Humain Concret - Phase 4 */}
            <div className="mt-12">
              <HumanImpactSection />
            </div>

            {/* Statistiques Avancées - Phase 3 */}
            <div className="mt-12">
              <AdvancedStats climateData={climateHistoryData} />
            </div>

            {/* Données par Pays - Phase 5 */}
            <div className="mt-12">
              <CountryRankings />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
