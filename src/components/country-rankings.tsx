'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Factory,
  AlertTriangle,
  Leaf,
  TrendingUp,
  TrendingDown,
  Download,
  ChevronUp,
  ChevronDown,
  User,
  Zap,
  Target,
  ArrowUpDown
} from "lucide-react";
import {
  getTopEmitters,
  getTopEmittersPerCapita,
  getMostVulnerableCountries,
  countriesClimateData,
  exportToCSV
} from "@/data/countries-climate";

type SortField = 'emissions' | 'perCapita' | 'risk' | 'action' | 'renewable';
type SortDirection = 'asc' | 'desc';

// Composant pour le Top 10 des émetteurs
export function TopEmittersTable() {
  const [sortBy, setSortBy] = useState<'total' | 'perCapita'>('total');
  const data = sortBy === 'total' ? getTopEmitters(10) : getTopEmittersPerCapita(10);

  const handleExport = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `top-10-emetteurs-${sortBy}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-red-500" />
              Top 10 - Plus Grands Emetteurs
            </CardTitle>
            <CardDescription>
              Pays responsables de la majorité des émissions mondiales de CO2
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as 'total' | 'perCapita')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="total" className="text-xs">
                  <Factory className="h-3 w-3 mr-1" />
                  Total
                </TabsTrigger>
                <TabsTrigger value="perCapita" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  /Habitant
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead className="text-right">
                {sortBy === 'total' ? 'Emissions (Mt)' : 't/habitant'}
              </TableHead>
              <TableHead className="text-right">Part mondiale</TableHead>
              <TableHead className="text-right">Tendance</TableHead>
              <TableHead className="text-center">Net Zero</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((country, index) => (
              <TableRow key={country.countryCode}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="font-medium">{country.country}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {sortBy === 'total'
                    ? country.co2Emissions2024.toLocaleString('fr-FR')
                    : country.co2EmissionsPerCapita.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">
                    {country.shareGlobalEmissions.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 ${
                    country.emissionsTrend > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {country.emissionsTrend > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-mono text-sm">
                      {country.emissionsTrend > 0 ? '+' : ''}{country.emissionsTrend.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {country.netZeroTarget ? (
                    <Badge variant={country.parisAligned ? "default" : "outline"}>
                      {country.netZeroTarget}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Aucun</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-4">
          Sources: Global Carbon Project 2024, Climate Action Tracker
        </p>
      </CardContent>
    </Card>
  );
}

// Composant pour les pays les plus vulnérables
export function MostVulnerableTable() {
  const data = getMostVulnerableCountries(10);

  const handleExport = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'top-10-pays-vulnerables.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 90) return { label: 'Critique', color: 'bg-red-500 text-white' };
    if (risk >= 75) return { label: 'Tres eleve', color: 'bg-orange-500 text-white' };
    if (risk >= 60) return { label: 'Eleve', color: 'bg-yellow-500 text-black' };
    return { label: 'Modere', color: 'bg-blue-500 text-white' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Top 10 - Pays les Plus Vulnerables
            </CardTitle>
            <CardDescription>
              Pays les plus exposes aux impacts du changement climatique
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead className="text-right">Indice Risque</TableHead>
              <TableHead className="text-center">Niveau</TableHead>
              <TableHead className="text-right">Vulnerabilite</TableHead>
              <TableHead className="text-right">Preparation</TableHead>
              <TableHead className="text-right">Emissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((country, index) => {
              const risk = getRiskLevel(country.climateRiskIndex);
              return (
                <TableRow key={country.countryCode}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={country.climateRiskIndex} className="w-16 h-2" />
                      <span className="font-mono text-sm w-8">{country.climateRiskIndex}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={risk.color}>{risk.label}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {(country.vulnerabilityScore * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${
                      country.readinessScore < 0.3 ? 'text-red-500' :
                      country.readinessScore < 0.5 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {(country.readinessScore * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {country.shareGlobalEmissions.toFixed(2)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Les pays les plus vulnerables sont souvent ceux qui emettent le moins de CO2.
            Ces 10 pays representent seulement <strong>{data.reduce((acc, c) => acc + c.shareGlobalEmissions, 0).toFixed(2)}%</strong> des emissions mondiales.
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Sources: Global Climate Risk Index (Germanwatch), ND-GAIN Index
        </p>
      </CardContent>
    </Card>
  );
}

// Composant pour le classement du progres climatique
export function ClimateProgressRanking() {
  const [sortField, setSortField] = useState<'action' | 'renewable' | 'trend'>('action');

  const getSortedData = () => {
    const allData = [...countriesClimateData];
    switch (sortField) {
      case 'action':
        return allData.sort((a, b) => b.climateActionScore - a.climateActionScore).slice(0, 15);
      case 'renewable':
        return allData.sort((a, b) => b.renewableShare - a.renewableShare).slice(0, 15);
      case 'trend':
        return allData.sort((a, b) => a.emissionsTrend - b.emissionsTrend).slice(0, 15);
      default:
        return allData.slice(0, 15);
    }
  };

  const data = getSortedData();

  const handleExport = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `classement-progres-climatique-${sortField}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActionLevel = (score: number) => {
    if (score >= 70) return { label: 'Leader', color: 'bg-green-500 text-white' };
    if (score >= 50) return { label: 'Progres', color: 'bg-blue-500 text-white' };
    if (score >= 35) return { label: 'Insuffisant', color: 'bg-orange-500 text-white' };
    return { label: 'Critique', color: 'bg-red-500 text-white' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-500" />
              Classement Progres Climatique
            </CardTitle>
            <CardDescription>
              Performance des pays en matiere de transition ecologique
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs value={sortField} onValueChange={(v) => setSortField(v as 'action' | 'renewable' | 'trend')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="action" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  Action
                </TabsTrigger>
                <TabsTrigger value="renewable" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  EnR
                </TabsTrigger>
                <TabsTrigger value="trend" className="text-xs">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Baisse
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead className="text-center">Score Action</TableHead>
              <TableHead className="text-right">EnR (%)</TableHead>
              <TableHead className="text-right">Croissance EnR</TableHead>
              <TableHead className="text-right">Tendance CO2</TableHead>
              <TableHead className="text-center">Paris</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((country, index) => {
              const action = getActionLevel(country.climateActionScore);
              return (
                <TableRow key={country.countryCode}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {index < 3 && (
                        <span className={`text-lg ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' : 'text-orange-400'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      {index >= 3 && <span className="font-medium">{index + 1}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium">{country.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={country.climateActionScore} className="w-12 h-2" />
                      <Badge className={action.color}>{country.climateActionScore}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {country.renewableShare.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${
                      country.renewableGrowth > 100 ? 'text-green-500' :
                      country.renewableGrowth > 50 ? 'text-blue-500' : 'text-muted-foreground'
                    }`}>
                      +{country.renewableGrowth}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      country.emissionsTrend < 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {country.emissionsTrend < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                      <span className="font-mono text-sm">
                        {country.emissionsTrend > 0 ? '+' : ''}{country.emissionsTrend.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {country.parisAligned ? (
                      <Badge variant="default" className="bg-green-500">Oui</Badge>
                    ) : (
                      <Badge variant="outline">Non</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <p className="text-xs text-muted-foreground mt-4">
          Sources: Climate Action Tracker, Our World in Data, IEA
        </p>
      </CardContent>
    </Card>
  );
}

// Tableau detaille complet avec tri et export
export function DetailedCountryTable() {
  const [sortField, setSortField] = useState<SortField>('emissions');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedData = () => {
    const data = [...countriesClimateData];
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    return data.sort((a, b) => {
      switch (sortField) {
        case 'emissions':
          return (a.co2Emissions2024 - b.co2Emissions2024) * multiplier;
        case 'perCapita':
          return (a.co2EmissionsPerCapita - b.co2EmissionsPerCapita) * multiplier;
        case 'risk':
          return (a.climateRiskIndex - b.climateRiskIndex) * multiplier;
        case 'action':
          return (a.climateActionScore - b.climateActionScore) * multiplier;
        case 'renewable':
          return (a.renewableShare - b.renewableShare) * multiplier;
        default:
          return 0;
      }
    });
  };

  const data = getSortedData();

  const handleExport = () => {
    const csv = exportToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'donnees-climatiques-pays-complet.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="text-right cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end gap-1">
        {children}
        {sortField === field ? (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Tableau Detaille - Donnees Climatiques par Pays
            </CardTitle>
            <CardDescription>
              {data.length} pays - Cliquez sur les en-tetes pour trier
            </CardDescription>
          </div>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Pays</TableHead>
                <SortHeader field="emissions">CO2 (Mt)</SortHeader>
                <SortHeader field="perCapita">t/hab</SortHeader>
                <TableHead className="text-right">Part (%)</TableHead>
                <SortHeader field="risk">Risque</SortHeader>
                <SortHeader field="action">Action</SortHeader>
                <SortHeader field="renewable">EnR (%)</SortHeader>
                <TableHead className="text-center">Net Zero</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((country, index) => (
                <TableRow key={country.countryCode}>
                  <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span className="font-medium">{country.country}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {country.co2Emissions2024.toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {country.co2EmissionsPerCapita.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {country.shareGlobalEmissions.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={country.climateRiskIndex} className="w-12 h-2" />
                      <span className="font-mono text-sm w-6">{country.climateRiskIndex}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={
                      country.climateActionScore >= 60 ? "default" :
                      country.climateActionScore >= 40 ? "secondary" : "destructive"
                    }>
                      {country.climateActionScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {country.renewableShare.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    {country.netZeroTarget ? (
                      <Badge variant={country.parisAligned ? "default" : "outline"}>
                        {country.netZeroTarget}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Sources: Global Carbon Project, Climate Action Tracker, ND-GAIN Index, Our World in Data
        </p>
      </CardContent>
    </Card>
  );
}

// Composant principal qui regroupe tout
export function CountryRankings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Donnees par Pays</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopEmittersTable />
        <MostVulnerableTable />
      </div>

      <ClimateProgressRanking />

      <DetailedCountryTable />
    </div>
  );
}
