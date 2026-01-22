'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Filter, GitCompare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export type PeriodFilter = '5' | '10' | '20' | 'all';

type DashboardFiltersProps = {
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  comparisonMode: boolean;
  onComparisonModeChange: (enabled: boolean) => void;
};

export function DashboardFilters({
  period,
  onPeriodChange,
  comparisonMode,
  onComparisonModeChange,
}: DashboardFiltersProps) {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardContent className="py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtres</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={period} onValueChange={(value) => onPeriodChange(value as PeriodFilter)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 dernières années</SelectItem>
                <SelectItem value="10">10 dernières années</SelectItem>
                <SelectItem value="20">20 dernières années</SelectItem>
                <SelectItem value="all">Toutes les données</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-muted-foreground" />
            <Switch
              id="comparison-mode"
              checked={comparisonMode}
              onCheckedChange={onComparisonModeChange}
            />
            <Label htmlFor="comparison-mode" className="text-xs sm:text-sm cursor-pointer">
              Mode comparaison
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function pour filtrer les données par période
export function filterDataByPeriod<T extends { year: number }>(
  data: T[],
  period: PeriodFilter
): T[] {
  if (period === 'all') return data;

  const currentYear = new Date().getFullYear();
  const yearsBack = parseInt(period);
  const startYear = currentYear - yearsBack;

  return data.filter(d => d.year >= startYear);
}
