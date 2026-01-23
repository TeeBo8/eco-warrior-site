'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { climateHistoryData } from "@/data/climate-history";
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

// Calcul du score de durabilité globale (0-100)
// Basé sur plusieurs indicateurs pondérés
function calculateSustainabilityScore(): number {
  const data = climateHistoryData;

  // Valeurs actuelles (dernière année)
  const currentCo2 = data.co2[data.co2.length - 1].value;
  const currentTemp = data.tempAnomaly[data.tempAnomaly.length - 1].value;
  const currentRenewable = data.renewableEnergy[data.renewableEnergy.length - 1].value;
  const currentBiodiversity = Math.abs(data.biodiversity[data.biodiversity.length - 1].value);
  const currentAirQuality = data.airQuality[data.airQuality.length - 1].value;

  // Scores individuels (0-100, plus haut = meilleur)
  // CO2: 350 ppm = 100, 500 ppm = 0
  const co2Score = Math.max(0, Math.min(100, ((500 - currentCo2) / 150) * 100));

  // Température: 0°C = 100, 2°C = 0
  const tempScore = Math.max(0, Math.min(100, ((2 - currentTemp) / 2) * 100));

  // Énergie renouvelable: 0% = 0, 100% = 100
  const renewableScore = currentRenewable;

  // Biodiversité: 0% déclin = 100, 100% déclin = 0
  const biodiversityScore = Math.max(0, 100 - currentBiodiversity);

  // Qualité air: AQI 0 = 100, AQI 150 = 0
  const airScore = Math.max(0, Math.min(100, ((150 - currentAirQuality) / 150) * 100));

  // Score global pondéré
  const weightedScore = (
    co2Score * 0.25 +
    tempScore * 0.25 +
    renewableScore * 0.20 +
    biodiversityScore * 0.15 +
    airScore * 0.15
  );

  return Math.round(weightedScore);
}

// Calcul de la tendance générale
function calculateTrend(): { isImproving: boolean; details: string[] } {
  const data = climateHistoryData;
  const improvements: string[] = [];
  const degradations: string[] = [];

  // Comparer les 3 dernières années avec les 3 années précédentes
  const recentYears = 3;

  // CO2 - tendance à la hausse = mauvais
  const co2Recent = data.co2.slice(-recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const co2Previous = data.co2.slice(-recentYears * 2, -recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const co2Growth = ((co2Recent - co2Previous) / co2Previous) * 100;
  if (co2Growth > 1) {
    degradations.push(`CO₂ +${co2Growth.toFixed(1)}%`);
  } else if (co2Growth < 0) {
    improvements.push(`CO₂ ${co2Growth.toFixed(1)}%`);
  }

  // Température - tendance à la hausse = mauvais
  const tempRecent = data.tempAnomaly.slice(-recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const tempPrevious = data.tempAnomaly.slice(-recentYears * 2, -recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  if (tempRecent > tempPrevious + 0.05) {
    degradations.push(`Temp. +${(tempRecent - tempPrevious).toFixed(2)}°C`);
  } else if (tempRecent < tempPrevious - 0.05) {
    improvements.push(`Temp. ${(tempRecent - tempPrevious).toFixed(2)}°C`);
  }

  // Énergie renouvelable - tendance à la hausse = bon
  const renewableRecent = data.renewableEnergy.slice(-recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const renewablePrevious = data.renewableEnergy.slice(-recentYears * 2, -recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const renewableGrowth = ((renewableRecent - renewablePrevious) / renewablePrevious) * 100;
  if (renewableGrowth > 1) {
    improvements.push(`Renouvelable +${renewableGrowth.toFixed(1)}%`);
  }

  // Qualité de l'air - tendance à la baisse = bon
  const airRecent = data.airQuality.slice(-recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  const airPrevious = data.airQuality.slice(-recentYears * 2, -recentYears).reduce((a, b) => a + b.value, 0) / recentYears;
  if (airRecent < airPrevious) {
    improvements.push(`Qualité air améliorée`);
  } else if (airRecent > airPrevious + 2) {
    degradations.push(`Qualité air dégradée`);
  }

  // Résultat global
  return {
    isImproving: improvements.length > degradations.length,
    details: improvements.length > degradations.length ? improvements : degradations,
  };
}

// Objectifs climatiques 2030 et 2050
interface ClimateGoal {
  name: string;
  target2030: number;
  target2050: number;
  current: number;
  unit: string;
  reverseProgress?: boolean; // Pour les indicateurs où plus bas = mieux
}

function getClimateGoals(): ClimateGoal[] {
  const data = climateHistoryData;

  return [
    {
      name: "Émissions CO₂",
      current: data.globalEmissions[data.globalEmissions.length - 1].value,
      target2030: 25, // Réduction de 45% vs 2010 = ~25 Gt
      target2050: 0, // Net zéro
      unit: "Gt/an",
      reverseProgress: true,
    },
    {
      name: "Énergie renouvelable",
      current: data.renewableEnergy[data.renewableEnergy.length - 1].value,
      target2030: 45, // 45% d'ici 2030
      target2050: 90, // 90% d'ici 2050
      unit: "%",
    },
    {
      name: "Réchauffement",
      current: data.tempAnomaly[data.tempAnomaly.length - 1].value,
      target2030: 1.5, // Limiter à 1.5°C
      target2050: 1.5, // Maintenir sous 1.5°C
      unit: "°C",
      reverseProgress: true,
    },
  ];
}

function calculateGoalProgress(goal: ClimateGoal, targetYear: 2030 | 2050): number {
  const target = targetYear === 2030 ? goal.target2030 : goal.target2050;
  const baseline2010 = targetYear === 2030
    ? (goal.reverseProgress ? goal.current * 1.2 : goal.current * 0.6)
    : (goal.reverseProgress ? goal.current * 1.3 : goal.current * 0.4);

  if (goal.reverseProgress) {
    // Pour émissions/réchauffement: on veut que current soit <= target
    if (goal.current <= target) return 100;
    const totalReduction = baseline2010 - target;
    const currentReduction = baseline2010 - goal.current;
    return Math.max(0, Math.min(100, (currentReduction / totalReduction) * 100));
  } else {
    // Pour renouvelables: on veut que current soit >= target
    if (goal.current >= target) return 100;
    return Math.max(0, Math.min(100, (goal.current / target) * 100));
  }
}

export function GlobalPerformanceStats() {
  const sustainabilityScore = calculateSustainabilityScore();
  const trend = calculateTrend();
  const goals = getClimateGoals();

  // Couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Bon";
    if (score >= 50) return "Moyen";
    if (score >= 30) return "Préoccupant";
    return "Critique";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Performance Globale</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score de durabilité globale */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Score Durabilité Globale
            </CardTitle>
            <CardDescription>État général du climat mondial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${sustainabilityScore * 3.52} 352`}
                    className={getScoreColor(sustainabilityScore)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(sustainabilityScore)}`}>
                    {sustainabilityScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <span className={`text-sm font-medium ${getScoreColor(sustainabilityScore)}`}>
                {getScoreLabel(sustainabilityScore)}
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Basé sur CO₂, température, énergie, biodiversité et air
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tendance générale */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {trend.isImproving ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              Tendance Générale
            </CardTitle>
            <CardDescription>Évolution sur les 3 dernières années</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className={`flex items-center gap-2 text-2xl font-bold ${
                trend.isImproving ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend.isImproving ? (
                  <>
                    <CheckCircle2 className="h-8 w-8" />
                    S&apos;améliore
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8" />
                    Empire
                  </>
                )}
              </div>
              <div className="mt-4 space-y-1">
                {trend.details.slice(0, 3).map((detail, i) => (
                  <div
                    key={i}
                    className={`text-sm px-2 py-1 rounded ${
                      trend.isImproving
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {detail}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progression objectifs 2030/2050 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Objectifs Climat
            </CardTitle>
            <CardDescription>Progression vers 2030 et 2050</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-2">
              {goals.map((goal) => {
                const progress2030 = calculateGoalProgress(goal, 2030);
                const progress2050 = calculateGoalProgress(goal, 2050);

                return (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.name}</span>
                      <span className="text-muted-foreground">
                        {goal.current} {goal.unit}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-10">2030</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(progress2030)} transition-all`}
                            style={{ width: `${progress2030}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10">{Math.round(progress2030)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-10">2050</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(progress2050)} transition-all`}
                            style={{ width: `${progress2050}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-10">{Math.round(progress2050)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Basé sur les accords de Paris et objectifs ONU
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
