'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ComparisonData = {
  label: string;
  period1Value: number;
  period2Value: number;
};

type ClimateComparisonChartProps = {
  title: string;
  description: string;
  data: ComparisonData[];
  unit: string;
  period1Label: string;
  period2Label: string;
};

export function ClimateComparisonChart({
  title,
  description,
  data,
  unit,
  period1Label,
  period2Label,
}: ClimateComparisonChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value} ${unit}`, '']}
              />
              <Legend />
              <Bar
                dataKey="period1Value"
                name={period1Label}
                fill="hsl(210, 100%, 60%)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="period2Value"
                name={period2Label}
                fill="hsl(0, 84%, 60%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper pour créer les données de comparaison
export function createComparisonData(
  data: { year: number; value: number }[],
  year1: number,
  year2: number
): { value1: number | null; value2: number | null; change: number | null } {
  const point1 = data.find(d => d.year === year1);
  const point2 = data.find(d => d.year === year2);

  const value1 = point1?.value ?? null;
  const value2 = point2?.value ?? null;

  const change = value1 !== null && value2 !== null
    ? ((value2 - value1) / Math.abs(value1)) * 100
    : null;

  return { value1, value2, change };
}
