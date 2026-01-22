'use client';

import { useState, useEffect } from "react";
import { X, AlertTriangle, TrendingUp, Thermometer, Waves, Snowflake, Bell, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { climateHistoryData } from "@/data/climate-history";

// Types d'alertes
type AlertType = 'record' | 'threshold' | 'acceleration' | 'milestone';
type AlertSeverity = 'critical' | 'warning' | 'info';
type MetricType = 'co2' | 'temp' | 'sea' | 'ice';

interface ClimateAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  metric: MetricType;
  title: string;
  message: string;
  value?: string;
  icon: React.ReactNode;
  timestamp: Date;
  isNew?: boolean;
}

// Seuils critiques
const THRESHOLDS = {
  co2: { warning: 420, critical: 450 },
  temp: { warning: 1.5, critical: 2.0 },
  sea: { warning: 100, critical: 150 },
  ice: { warning: 150, critical: 200 },
};

// Génération des alertes basée sur les données actuelles
function generateAlerts(): ClimateAlert[] {
  const alerts: ClimateAlert[] = [];
  const now = new Date();

  // Données actuelles (dernières valeurs)
  const currentCo2 = climateHistoryData.co2[climateHistoryData.co2.length - 1];
  const currentTemp = climateHistoryData.tempAnomaly[climateHistoryData.tempAnomaly.length - 1];
  const currentSea = climateHistoryData.seaLevel[climateHistoryData.seaLevel.length - 1];
  const currentIce = climateHistoryData.iceMelt[climateHistoryData.iceMelt.length - 1];

  // Données précédentes pour comparaison
  const prevCo2 = climateHistoryData.co2[climateHistoryData.co2.length - 2];

  // Alerte Record CO₂
  if (currentCo2.value > prevCo2.value) {
    alerts.push({
      id: 'co2-record',
      type: 'record',
      severity: currentCo2.value >= THRESHOLDS.co2.warning ? 'critical' : 'warning',
      metric: 'co2',
      title: '⚠️ Nouveau record CO₂ atteint',
      message: `La concentration de CO₂ a atteint ${currentCo2.value} ppm, un niveau jamais observé dans l'histoire humaine.`,
      value: `${currentCo2.value} ppm`,
      icon: <TrendingUp className="h-5 w-5" />,
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // il y a 2h
      isNew: true,
    });
  }

  // Alerte seuil température Paris
  if (currentTemp.value >= 1.2) {
    alerts.push({
      id: 'temp-threshold',
      type: 'threshold',
      severity: currentTemp.value >= 1.5 ? 'critical' : 'warning',
      metric: 'temp',
      title: 'Seuil de Paris approché',
      message: `L'anomalie de température globale est de +${currentTemp.value}°C. L'objectif de l'Accord de Paris (1.5°C) est presque atteint.`,
      value: `+${currentTemp.value}°C`,
      icon: <Thermometer className="h-5 w-5" />,
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // il y a 5h
    });
  }

  // Alerte niveau de la mer
  if (currentSea.value >= 100) {
    alerts.push({
      id: 'sea-milestone',
      type: 'milestone',
      severity: 'warning',
      metric: 'sea',
      title: 'Cap des 100mm dépassé',
      message: `Le niveau de la mer a dépassé +${currentSea.value}mm depuis 2000. Des millions de personnes sont menacées.`,
      value: `+${currentSea.value} mm`,
      icon: <Waves className="h-5 w-5" />,
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // il y a 1 jour
    });
  }

  // Alerte accélération fonte des glaces
  const iceAcceleration = Math.abs(currentIce.value) - Math.abs(climateHistoryData.iceMelt[0].value);
  if (iceAcceleration > 50) {
    alerts.push({
      id: 'ice-acceleration',
      type: 'acceleration',
      severity: 'warning',
      metric: 'ice',
      title: 'Fonte des glaces accélérée',
      message: `La perte de glace antarctique a triplé depuis 2000, atteignant ${Math.abs(currentIce.value)} Gt/an.`,
      value: `${Math.abs(currentIce.value)} Gt/an`,
      icon: <Snowflake className="h-5 w-5" />,
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // il y a 3 jours
    });
  }

  return alerts;
}

// Couleurs par sévérité
const severityStyles: Record<AlertSeverity, { bg: string; border: string; text: string; icon: string }> = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-500',
    text: 'text-orange-700 dark:text-orange-400',
    icon: 'text-orange-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-500',
  },
};

// Formatage du temps relatif
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "À l'instant";
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} jours`;
}

// Composant pour une seule alerte
function AlertItem({
  alert,
  onDismiss,
  isExpanded,
  onToggle
}: {
  alert: ClimateAlert;
  onDismiss: (id: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const styles = severityStyles[alert.severity];

  return (
    <div
      className={cn(
        "relative rounded-lg border-l-4 p-4 transition-all duration-200",
        styles.bg,
        styles.border,
        isExpanded && "shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={cn("mt-0.5", styles.icon)}>
            {alert.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={cn("font-semibold text-sm", styles.text)}>
                {alert.title}
              </h4>
              {alert.isNew && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  Nouveau
                </Badge>
              )}
              {alert.value && (
                <Badge variant="outline" className="text-xs">
                  {alert.value}
                </Badge>
              )}
            </div>

            <button
              onClick={onToggle}
              className="w-full text-left"
            >
              <p className={cn(
                "text-sm mt-1 text-muted-foreground",
                !isExpanded && "line-clamp-1"
              )}>
                {alert.message}
              </p>
            </button>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(alert.timestamp)}
              </span>
              <button
                onClick={onToggle}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {isExpanded ? "Réduire" : "Voir plus"}
                <ChevronRight className={cn(
                  "h-3 w-3 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </button>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={() => onDismiss(alert.id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer l&apos;alerte</span>
        </Button>
      </div>
    </div>
  );
}

// Composant principal des alertes
export function ClimateAlerts() {
  const [alerts, setAlerts] = useState<ClimateAlert[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Charger les alertes
    const generatedAlerts = generateAlerts();
    setAlerts(generatedAlerts);

    // Auto-expand la première alerte "new"
    const newAlert = generatedAlerts.find(a => a.isNew);
    if (newAlert) {
      setExpandedId(newAlert.id);
    }
  }, []);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const visibleAlerts = alerts.filter(a => !dismissedIds.has(a.id));
  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter(a => a.severity === 'warning').length;

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Header des alertes */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Alertes Climatiques</h3>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalCount} critique{criticalCount > 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                {warningCount} avertissement{warningCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "Afficher" : "Masquer"}
        </Button>
      </div>

      {/* Liste des alertes */}
      {!isCollapsed && (
        <div className="space-y-3">
          {visibleAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDismiss={handleDismiss}
              isExpanded={expandedId === alert.id}
              onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            />
          ))}
        </div>
      )}

      {/* Message si tout masqué */}
      {isCollapsed && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">
            {visibleAlerts.length} alerte{visibleAlerts.length > 1 ? 's' : ''} climatique{visibleAlerts.length > 1 ? 's' : ''} en attente
          </span>
        </div>
      )}
    </div>
  );
}
