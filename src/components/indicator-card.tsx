'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MetricInfoButton, type MetricKey } from "@/components/climate-info";

type HistoryDataPoint = { year: number; value: number };

type IndicatorCardProps = {
  title: string;
  value: string;
  unit: string;
  source: string;
  history?: HistoryDataPoint[];
  trend?: 'up' | 'down';
  trendIsGood?: boolean; // true si la tendance actuelle est bonne (ex: baisse des émissions)
  metricKey?: MetricKey; // Pour le bouton info contextuel
};

export function IndicatorCard({
  title,
  value,
  unit,
  source,
  history,
  trend,
  trendIsGood = false,
  metricKey
}: IndicatorCardProps) {
  // Calcul du taux de variation si on a l'historique
  const changePercent = history && history.length >= 2
    ? (((history[history.length - 1].value - history[0].value) / Math.abs(history[0].value)) * 100).toFixed(1)
    : null;

  // Couleur du sparkline selon si la tendance est bonne ou mauvaise
  const sparklineColor = trendIsGood
    ? "hsl(142, 76%, 36%)" // vert
    : "hsl(0, 84%, 60%)";   // rouge

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="p-3 sm:p-6 pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{title}</CardTitle>
          {metricKey && <MetricInfoButton metricKey={metricKey} />}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
        <div className="flex items-baseline gap-1 sm:gap-2">
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          <span className="text-sm sm:text-lg text-muted-foreground">{unit}</span>
        </div>

        {changePercent && (
          <div className={`flex items-center gap-1 mt-1 text-xs sm:text-sm ${trendIsGood ? 'text-green-600' : 'text-red-500'}`}>
            <TrendIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{changePercent}% depuis 2000</span>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="h-12 sm:h-16 mt-2 sm:mt-3 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={sparklineColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2 truncate">Source: {source}</p>
      </CardContent>
    </Card>
  );
}
