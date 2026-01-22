'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { HistoryDataPoint } from "@/data/climate-history";

type ClimateChartProps = {
  title: string;
  description: string;
  data: HistoryDataPoint[];
  unit: string;
  color: string;
  dangerThreshold?: number;
  dangerLabel?: string;
};

export function ClimateChart({
  title,
  description,
  data,
  unit,
  color,
  dangerThreshold,
  dangerLabel,
}: ClimateChartProps) {
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = (maxValue - minValue) * 0.1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                domain={[minValue - padding, maxValue + padding]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}${unit}`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`${value} ${unit}`, title]}
                labelFormatter={(label) => `Année ${label}`}
              />
              {dangerThreshold && (
                <ReferenceLine
                  y={dangerThreshold}
                  stroke="hsl(0, 84%, 60%)"
                  strokeDasharray="5 5"
                  label={{
                    value: dangerLabel || 'Seuil critique',
                    position: 'right',
                    fill: 'hsl(0, 84%, 60%)',
                    fontSize: 11,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
