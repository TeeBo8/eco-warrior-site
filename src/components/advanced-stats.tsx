'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Skull, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type HistoryDataPoint = { year: number; value: number };

// Configuration des métriques climatiques
const metricsConfig = {
  co2: {
    name: 'CO₂',
    unit: 'ppm',
    // Seuils critiques basés sur la science climatique
    thresholds: {
      safe: 350,        // Niveau pré-industriel sûr
      warning: 400,     // Début de danger
      danger: 450,      // +2°C quasi certain
      catastrophic: 500 // Point de non-retour
    },
    pointOfNoReturn: 450, // Au-delà, +2°C est verrouillé
    projectionRate: 2.5,  // ppm/an (taux actuel d'augmentation)
  },
  tempAnomaly: {
    name: 'Température',
    unit: '°C',
    thresholds: {
      safe: 1.0,
      warning: 1.5,
      danger: 2.0,
      catastrophic: 3.0
    },
    pointOfNoReturn: 1.5,
    projectionRate: 0.03, // °C/an
  },
  seaLevel: {
    name: 'Niveau mer',
    unit: 'mm',
    thresholds: {
      safe: 50,
      warning: 100,
      danger: 200,
      catastrophic: 500
    },
    pointOfNoReturn: 200, // Nombreuses îles submergées
    projectionRate: 4,    // mm/an (accélération)
  },
  iceMelt: {
    name: 'Fonte glace',
    unit: 'Gt/an',
    thresholds: {
      safe: 50,
      warning: 100,
      danger: 150,
      catastrophic: 200
    },
    pointOfNoReturn: 200,
    projectionRate: 5, // Gt/an (aggravation)
    inverted: true // Plus haut = pire
  }
};

type MetricKey = keyof typeof metricsConfig;

// Calcul du taux de variation entre deux périodes
function calculateVariation(data: HistoryDataPoint[], startYear: number, endYear: number): number | null {
  const start = data.find(d => d.year === startYear);
  const end = data.find(d => d.year === endYear);
  if (!start || !end || start.value === 0) return null;
  return ((end.value - start.value) / Math.abs(start.value)) * 100;
}

// Calcul du taux annuel moyen
function calculateAnnualRate(data: HistoryDataPoint[]): number {
  if (data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  const years = last.year - first.year;
  if (years === 0) return 0;
  return (last.value - first.value) / years;
}

// Projection linéaire basique
function projectValue(currentValue: number, annualRate: number, yearsAhead: number): number {
  return currentValue + (annualRate * yearsAhead);
}

type AdvancedStatsProps = {
  climateData: {
    co2: HistoryDataPoint[];
    tempAnomaly: HistoryDataPoint[];
    seaLevel: HistoryDataPoint[];
    iceMelt: HistoryDataPoint[];
  };
};

// Composant pour les taux de variation multi-périodes
function VariationRatesCard({ data, config, metricKey }: {
  data: HistoryDataPoint[];
  config: typeof metricsConfig.co2;
  metricKey: MetricKey;
}) {
  const periods = [
    { label: '5 ans', start: 2020, end: 2025 },
    { label: '10 ans', start: 2015, end: 2025 },
    { label: '25 ans', start: 2000, end: 2025 },
  ];

  const variations = periods.map(p => ({
    ...p,
    value: calculateVariation(data, p.start, p.end)
  }));

  const annualRate = calculateAnnualRate(data);
  const isNegativeMetric = metricKey === 'iceMelt';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {config.name} - Taux de variation
        </CardTitle>
        <CardDescription>Évolution sur différentes périodes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {variations.map((v, i) => {
            const isPositive = v.value !== null && v.value > 0;
            const isWorse = isNegativeMetric ? !isPositive : isPositive;

            return (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{v.label}</span>
                <div className={`flex items-center gap-1 font-semibold ${isWorse ? 'text-red-500' : 'text-green-500'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{v.value !== null ? `${isPositive ? '+' : ''}${v.value.toFixed(1)}%` : 'N/A'}</span>
                </div>
              </div>
            );
          })}
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taux annuel moyen</span>
              <Badge variant={annualRate > 0 && !isNegativeMetric ? "destructive" : "secondary"}>
                {annualRate > 0 ? '+' : ''}{annualRate.toFixed(2)} {config.unit}/an
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les seuils d'alerte
function AlertThresholdsCard({ currentValue, config, metricKey }: {
  currentValue: number;
  config: typeof metricsConfig.co2;
  metricKey: MetricKey;
}) {
  const { thresholds } = config;
  const isInverted = metricKey === 'iceMelt';
  const absValue = Math.abs(currentValue);

  // Déterminer le niveau actuel
  let level: 'safe' | 'warning' | 'danger' | 'catastrophic';
  if (isInverted) {
    if (absValue >= thresholds.catastrophic) level = 'catastrophic';
    else if (absValue >= thresholds.danger) level = 'danger';
    else if (absValue >= thresholds.warning) level = 'warning';
    else level = 'safe';
  } else {
    if (currentValue >= thresholds.catastrophic) level = 'catastrophic';
    else if (currentValue >= thresholds.danger) level = 'danger';
    else if (currentValue >= thresholds.warning) level = 'warning';
    else level = 'safe';
  }

  const levelConfig = {
    safe: { color: 'bg-green-500', text: 'text-green-600', label: 'Sûr', bgLight: 'bg-green-50 dark:bg-green-950' },
    warning: { color: 'bg-yellow-500', text: 'text-yellow-600', label: 'Alerte', bgLight: 'bg-yellow-50 dark:bg-yellow-950' },
    danger: { color: 'bg-orange-500', text: 'text-orange-600', label: 'Danger', bgLight: 'bg-orange-50 dark:bg-orange-950' },
    catastrophic: { color: 'bg-red-500', text: 'text-red-600', label: 'Critique', bgLight: 'bg-red-50 dark:bg-red-950' },
  };

  const current = levelConfig[level];
  const displayValue = isInverted ? absValue : currentValue;

  // Calcul de la progression vers le prochain seuil
  const thresholdLevels = ['safe', 'warning', 'danger', 'catastrophic'] as const;
  const currentIndex = thresholdLevels.indexOf(level);
  const nextLevel = currentIndex < 3 ? thresholdLevels[currentIndex + 1] : null;
  const nextThreshold = nextLevel ? thresholds[nextLevel] : null;
  const currentThreshold = thresholds[level];

  let progressToNext = 0;
  if (nextThreshold && currentThreshold) {
    const range = nextThreshold - currentThreshold;
    const progress = displayValue - currentThreshold;
    progressToNext = Math.min(100, Math.max(0, (progress / range) * 100));
  }

  return (
    <Card className={current.bgLight}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${current.text}`} />
          {config.name} - Niveau d&apos;alerte
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{displayValue.toFixed(1)} {config.unit}</span>
            <Badge className={`${current.color} text-white`}>{current.label}</Badge>
          </div>

          {/* Barre de seuils */}
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: '25%' }} />
              <div className="h-full bg-yellow-500" style={{ width: '25%' }} />
              <div className="h-full bg-orange-500" style={{ width: '25%' }} />
              <div className="h-full bg-red-500" style={{ width: '25%' }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{thresholds.safe}</span>
              <span>{thresholds.warning}</span>
              <span>{thresholds.danger}</span>
              <span>{thresholds.catastrophic}</span>
            </div>
          </div>

          {nextThreshold && (
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Progression vers seuil suivant</span>
                <span className={levelConfig[nextLevel!].text}>{progressToNext.toFixed(0)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Encore {(nextThreshold - displayValue).toFixed(1)} {config.unit} avant le seuil {levelConfig[nextLevel!].label.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant pour les projections futures
function ProjectionsCard({ data, config }: {
  data: HistoryDataPoint[];
  config: typeof metricsConfig.co2;
}) {
  const currentValue = Math.abs(data[data.length - 1]?.value || 0);
  const annualRate = Math.abs(calculateAnnualRate(data));

  // Utiliser le taux configuré ou calculé
  const projectionRate = config.projectionRate || annualRate;

  const projections = [
    { year: 2030, yearsAhead: 5 },
    { year: 2050, yearsAhead: 25 },
    { year: 2100, yearsAhead: 75 },
  ].map(p => ({
    ...p,
    value: projectValue(currentValue, projectionRate, p.yearsAhead),
    // Niveau de danger pour cette projection
    level: getProjectedLevel(projectValue(currentValue, projectionRate, p.yearsAhead), config.thresholds)
  }));

  function getProjectedLevel(value: number, thresholds: typeof config.thresholds): 'safe' | 'warning' | 'danger' | 'catastrophic' {
    if (value >= thresholds.catastrophic) return 'catastrophic';
    if (value >= thresholds.danger) return 'danger';
    if (value >= thresholds.warning) return 'warning';
    return 'safe';
  }

  const levelColors = {
    safe: 'text-green-600 bg-green-100 dark:bg-green-900',
    warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900',
    danger: 'text-orange-600 bg-orange-100 dark:bg-orange-900',
    catastrophic: 'text-red-600 bg-red-100 dark:bg-red-900',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {config.name} - Projections
        </CardTitle>
        <CardDescription>Si la tendance actuelle se poursuit ({projectionRate > 0 ? '+' : ''}{projectionRate.toFixed(2)} {config.unit}/an)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projections.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{p.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{p.value.toFixed(1)} {config.unit}</span>
                <Badge className={levelColors[p.level]} variant="secondary">
                  {p.level === 'catastrophic' ? '💀' : p.level === 'danger' ? '⚠️' : p.level === 'warning' ? '⚡' : '✓'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          * Projections basées sur le taux actuel. Les politiques climatiques peuvent modifier cette trajectoire.
        </p>
      </CardContent>
    </Card>
  );
}

// Composant pour les points de non-retour
function TippingPointsCard({ climateData }: AdvancedStatsProps) {
  const tippingPoints = [
    {
      name: 'Calotte glaciaire Groenland',
      threshold: 1.5,
      unit: '°C',
      current: Math.abs(climateData.tempAnomaly[climateData.tempAnomaly.length - 1]?.value || 0),
      consequence: 'Élévation du niveau de la mer de 7 mètres sur plusieurs siècles',
      timeframe: 'Irréversible sur 1000+ ans',
      icon: '🧊'
    },
    {
      name: 'Forêt amazonienne',
      threshold: 2.0,
      unit: '°C',
      current: Math.abs(climateData.tempAnomaly[climateData.tempAnomaly.length - 1]?.value || 0),
      consequence: 'Transformation en savane, libération massive de CO₂',
      timeframe: '50-100 ans',
      icon: '🌳'
    },
    {
      name: 'Permafrost',
      threshold: 1.5,
      unit: '°C',
      current: Math.abs(climateData.tempAnomaly[climateData.tempAnomaly.length - 1]?.value || 0),
      consequence: 'Libération de méthane et CO₂ stockés, accélération du réchauffement',
      timeframe: 'Décennies à siècles',
      icon: '❄️'
    },
    {
      name: 'Récifs coralliens',
      threshold: 1.5,
      unit: '°C',
      current: Math.abs(climateData.tempAnomaly[climateData.tempAnomaly.length - 1]?.value || 0),
      consequence: 'Disparition de 70-90% des récifs, effondrement écosystèmes marins',
      timeframe: '10-30 ans',
      icon: '🐠'
    },
    {
      name: 'Circulation atlantique (AMOC)',
      threshold: 450,
      unit: 'ppm CO₂',
      current: climateData.co2[climateData.co2.length - 1]?.value || 0,
      consequence: 'Bouleversement climatique Europe, moussons perturbées',
      timeframe: 'Siècles',
      icon: '🌊'
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skull className="h-5 w-5 text-red-500" />
          Points de Non-Retour Climatiques
        </CardTitle>
        <CardDescription>
          Seuils critiques au-delà desquels les changements deviennent irréversibles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tippingPoints.map((point, i) => {
            const progress = (point.current / point.threshold) * 100;
            const isExceeded = point.current >= point.threshold;
            const isClose = progress >= 80;

            return (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  isExceeded
                    ? 'border-red-500 bg-red-50 dark:bg-red-950'
                    : isClose
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                      : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{point.icon}</span>
                    <h4 className="font-semibold">{point.name}</h4>
                  </div>
                  {isExceeded && (
                    <Badge variant="destructive">DÉPASSÉ</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seuil critique</span>
                    <span className="font-medium">{point.threshold} {point.unit}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valeur actuelle</span>
                    <span className={`font-bold ${isExceeded ? 'text-red-600' : isClose ? 'text-orange-600' : 'text-foreground'}`}>
                      {point.current.toFixed(2)} {point.unit}
                    </span>
                  </div>

                  <Progress
                    value={Math.min(100, progress)}
                    className="h-2"
                    indicatorClassName={isExceeded ? 'bg-red-500' : isClose ? 'bg-orange-500' : 'bg-blue-500'}
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Conséquence:</strong> {point.consequence}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Échéance:</strong> {point.timeframe}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal
export function AdvancedStats({ climateData }: AdvancedStatsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistiques Avancées</h2>

      {/* Taux de variation */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Taux de Variation par Période
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VariationRatesCard data={climateData.co2} config={metricsConfig.co2} metricKey="co2" />
          <VariationRatesCard data={climateData.tempAnomaly} config={metricsConfig.tempAnomaly} metricKey="tempAnomaly" />
          <VariationRatesCard data={climateData.seaLevel} config={metricsConfig.seaLevel} metricKey="seaLevel" />
          <VariationRatesCard data={climateData.iceMelt} config={metricsConfig.iceMelt} metricKey="iceMelt" />
        </div>
      </div>

      {/* Seuils d'alerte */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Niveaux d&apos;Alerte Actuels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AlertThresholdsCard
            currentValue={climateData.co2[climateData.co2.length - 1]?.value || 0}
            config={metricsConfig.co2}
            metricKey="co2"
          />
          <AlertThresholdsCard
            currentValue={climateData.tempAnomaly[climateData.tempAnomaly.length - 1]?.value || 0}
            config={metricsConfig.tempAnomaly}
            metricKey="tempAnomaly"
          />
          <AlertThresholdsCard
            currentValue={climateData.seaLevel[climateData.seaLevel.length - 1]?.value || 0}
            config={metricsConfig.seaLevel}
            metricKey="seaLevel"
          />
          <AlertThresholdsCard
            currentValue={climateData.iceMelt[climateData.iceMelt.length - 1]?.value || 0}
            config={metricsConfig.iceMelt}
            metricKey="iceMelt"
          />
        </div>
      </div>

      {/* Projections futures */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Projections Futures (2030, 2050, 2100)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProjectionsCard data={climateData.co2} config={metricsConfig.co2} />
          <ProjectionsCard data={climateData.tempAnomaly} config={metricsConfig.tempAnomaly} />
          <ProjectionsCard data={climateData.seaLevel} config={metricsConfig.seaLevel} />
          <ProjectionsCard data={climateData.iceMelt} config={metricsConfig.iceMelt} />
        </div>
      </div>

      {/* Points de non-retour */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Skull className="h-5 w-5 text-red-500" />
          Points de Non-Retour
        </h3>
        <TippingPointsCard climateData={climateData} />
      </div>
    </div>
  );
}
