'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type ClimateGaugeProps = {
  title: string;
  currentValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  thresholds: {
    safe: number;      // En dessous = vert
    warning: number;   // Entre safe et warning = orange
    // Au dessus de warning = rouge
  };
  description: string;
  inverted?: boolean; // Pour les métriques où plus bas = pire (ex: glace)
};

export function ClimateGauge({
  title,
  currentValue,
  unit,
  minValue,
  maxValue,
  thresholds,
  description,
  inverted = false,
}: ClimateGaugeProps) {
  // Calcul du pourcentage pour la barre
  const range = maxValue - minValue;
  const percentage = ((currentValue - minValue) / range) * 100;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // Déterminer le niveau de danger
  let status: 'safe' | 'warning' | 'danger';
  if (inverted) {
    if (currentValue <= thresholds.warning) status = 'danger';
    else if (currentValue <= thresholds.safe) status = 'warning';
    else status = 'safe';
  } else {
    if (currentValue >= thresholds.warning) status = 'danger';
    else if (currentValue >= thresholds.safe) status = 'warning';
    else status = 'safe';
  }

  const statusConfig = {
    safe: {
      color: 'bg-green-500',
      textColor: 'text-green-600',
      Icon: CheckCircle,
      label: 'Acceptable',
    },
    warning: {
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      Icon: AlertTriangle,
      label: 'Préoccupant',
    },
    danger: {
      color: 'bg-red-500',
      textColor: 'text-red-600',
      Icon: XCircle,
      label: 'Critique',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.Icon;

  // Position des seuils sur la barre
  const safePosition = ((thresholds.safe - minValue) / range) * 100;
  const warningPosition = ((thresholds.warning - minValue) / range) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className={`flex items-center gap-1 ${config.textColor}`}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Valeur actuelle */}
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${config.textColor}`}>
              {currentValue}
            </span>
            <span className="text-muted-foreground">{unit}</span>
          </div>

          {/* Barre de progression avec marqueurs de seuil */}
          <div className="relative">
            <Progress
              value={clampedPercentage}
              className="h-3"
              indicatorClassName={config.color}
            />

            {/* Marqueurs de seuil */}
            <div
              className="absolute top-0 h-3 w-0.5 bg-orange-400"
              style={{ left: `${safePosition}%` }}
              title={`Seuil d'alerte: ${thresholds.safe}${unit}`}
            />
            <div
              className="absolute top-0 h-3 w-0.5 bg-red-400"
              style={{ left: `${warningPosition}%` }}
              title={`Seuil critique: ${thresholds.warning}${unit}`}
            />
          </div>

          {/* Légende */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minValue}{unit}</span>
            <span>{maxValue}{unit}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
