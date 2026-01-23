'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ExternalLink, CheckCircle2, Clock, Wifi, WifiOff, RefreshCw, Database } from "lucide-react";
import { trpc } from "@/app/_trpc/client";

// Sources officielles des données
const officialSources = [
  {
    name: "NASA",
    fullName: "National Aeronautics and Space Administration",
    url: "https://climate.nasa.gov/",
    description: "Température, niveau mer, glace",
  },
  {
    name: "NOAA",
    fullName: "National Oceanic and Atmospheric Administration",
    url: "https://www.noaa.gov/climate",
    description: "CO₂ atmosphérique, océans",
  },
  {
    name: "GIEC",
    fullName: "Groupe d'experts intergouvernemental sur l'évolution du climat",
    url: "https://www.ipcc.ch/",
    description: "Rapports, projections",
  },
  {
    name: "IEA",
    fullName: "International Energy Agency",
    url: "https://www.iea.org/",
    description: "Émissions, énergie",
  },
  {
    name: "WWF",
    fullName: "World Wildlife Fund",
    url: "https://livingplanet.panda.org/",
    description: "Biodiversité",
  },
];

export function DashboardFooter() {
  const { data: climateData, isLoading, isError } = trpc.getClimateIndicators.useQuery();

  // Formater la date de dernière mise à jour (depuis les métadonnées serveur)
  const formatLastSync = () => {
    if (!climateData?.lastUpdated) return "...";
    const date = new Date(climateData.lastUpdated);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status de l'API basé sur dataSource
  const getApiStatus = () => {
    if (isLoading) return { status: 'loading', label: 'Chargement...', color: 'text-yellow-500', icon: RefreshCw };
    if (isError) return { status: 'error', label: 'Erreur API', color: 'text-red-500', icon: WifiOff };
    if (climateData) {
      switch (climateData.dataSource) {
        case 'live':
          return { status: 'live', label: 'Temps réel', color: 'text-green-500', icon: Wifi };
        case 'cached':
          return { status: 'cached', label: 'Cache', color: 'text-blue-500', icon: Database };
        case 'static':
          return { status: 'static', label: 'Statique', color: 'text-orange-500', icon: Database };
        default:
          return { status: 'ok', label: 'Connecté', color: 'text-green-500', icon: Wifi };
      }
    }
    return { status: 'unknown', label: 'Inconnu', color: 'text-gray-500', icon: WifiOff };
  };

  const apiStatus = getApiStatus();
  const StatusIcon = apiStatus.icon;

  return (
    <div className="mt-12 space-y-6">
      {/* Badge Données Vérifiées + Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 rounded-lg border border-green-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-full">
            <ShieldCheck className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Données vérifiées scientifiquement
            </p>
            <p className="text-sm text-muted-foreground">
              Sources officielles : NASA, NOAA, GIEC, IEA, WWF
            </p>
          </div>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Sync :</span>
            <span className="font-medium">{formatLastSync()}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${apiStatus.color}`}>
            {apiStatus.status === 'loading' ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <StatusIcon className="h-4 w-4" />
            )}
            <span className="font-medium">{apiStatus.label}</span>
          </div>
        </div>
      </div>

      {/* Sources Officielles */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            Sources Officielles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {officialSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-primary">{source.name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1" title={source.fullName}>
                  {source.fullName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {source.description}
                </p>
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Toutes les données affichées proviennent de sources scientifiques reconnues et vérifiables.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
