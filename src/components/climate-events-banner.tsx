'use client';

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Flame,
  CloudRain,
  Wind,
  Thermometer,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Mountain,
  Filter,
  RefreshCw,
  Loader2,
  Satellite
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import type { ClimateEventType, ClimateEventSeverity } from "@/server/services/climateEventsService";

// Configuration des types d'événements
const eventConfig: Record<ClimateEventType, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  wildfire: {
    icon: <Flame className="h-5 w-5" />,
    color: 'text-orange-500',
    bgColor: 'bg-gradient-to-r from-orange-600 to-red-600',
    label: 'Feux',
  },
  flood: {
    icon: <CloudRain className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    label: 'Inondations',
  },
  hurricane: {
    icon: <Wind className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    label: 'Tempêtes',
  },
  volcano: {
    icon: <Mountain className="h-5 w-5" />,
    color: 'text-red-500',
    bgColor: 'bg-gradient-to-r from-red-700 to-orange-600',
    label: 'Volcans',
  },
  earthquake: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-gradient-to-r from-amber-600 to-yellow-500',
    label: 'Séismes',
  },
  drought: {
    icon: <Thermometer className="h-5 w-5" />,
    color: 'text-yellow-500',
    bgColor: 'bg-gradient-to-r from-yellow-600 to-amber-500',
    label: 'Sécheresse',
  },
  storm: {
    icon: <Wind className="h-5 w-5" />,
    color: 'text-slate-500',
    bgColor: 'bg-gradient-to-r from-slate-600 to-slate-500',
    label: 'Orages',
  },
  iceberg: {
    icon: <CloudRain className="h-5 w-5" />,
    color: 'text-cyan-500',
    bgColor: 'bg-gradient-to-r from-cyan-600 to-blue-500',
    label: 'Glace',
  },
  other: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-gray-500',
    bgColor: 'bg-gradient-to-r from-gray-600 to-gray-500',
    label: 'Autre',
  },
};

const severityConfig: Record<ClimateEventSeverity, { label: string; color: string }> = {
  extreme: { label: 'Extrême', color: 'bg-red-500' },
  severe: { label: 'Sévère', color: 'bg-orange-500' },
  moderate: { label: 'Modéré', color: 'bg-yellow-500' },
  minor: { label: 'Mineur', color: 'bg-green-500' },
};

// Types de filtres disponibles
const filterTypes: ClimateEventType[] = ['wildfire', 'flood', 'hurricane', 'volcano', 'earthquake', 'storm'];

export function ClimateEventsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ClimateEventType[]>([]);

  // Récupération des événements via tRPC
  const { data, isLoading, error, refetch, isFetching } = trpc.getClimateEvents.useQuery(undefined, {
    refetchInterval: 15 * 60 * 1000, // Refresh toutes les 15 minutes
    staleTime: 10 * 60 * 1000, // Données considérées fraîches pendant 10 minutes
  });

  // Filtrer les événements selon les filtres actifs
  const events = data?.events.filter(event =>
    activeFilters.length === 0 || activeFilters.includes(event.type)
  ) || [];

  const currentEvent = events[currentIndex];
  const config = currentEvent ? eventConfig[currentEvent.type] || eventConfig.other : eventConfig.other;

  // Navigation
  const goToNext = useCallback(() => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }
  }, [events.length]);

  const goToPrev = useCallback(() => {
    if (events.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  }, [events.length]);

  // Reset index quand les événements changent
  useEffect(() => {
    if (currentIndex >= events.length) {
      setCurrentIndex(0);
    }
  }, [events.length, currentIndex]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || !isVisible || events.length === 0) return;

    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [isPaused, isVisible, goToNext, events.length]);

  // Toggle un filtre
  const toggleFilter = (type: ClimateEventType) => {
    setActiveFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentIndex(0);
  };

  // Fermer la bannière
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // État de chargement
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6">
        <div className="relative px-4 py-4 sm:px-6 flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Chargement des événements climatiques en temps réel...</span>
        </div>
      </div>
    );
  }

  // État d'erreur ou aucun événement
  if (error || events.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6">
        <div className="relative px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="h-5 w-5" />
              <span className="text-sm">
                {activeFilters.length > 0
                  ? "Aucun événement ne correspond aux filtres sélectionnés."
                  : "Surveillance satellite en cours - aucune alerte majeure."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-white hover:bg-white/20"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtres
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex flex-wrap gap-2">
                {filterTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                      activeFilters.includes(type)
                        ? "bg-white text-slate-800"
                        : "bg-white/20 text-white hover:bg-white/30"
                    )}
                  >
                    {eventConfig[type].icon}
                    {eventConfig[type].label}
                  </button>
                ))}
                {activeFilters.length > 0 && (
                  <button
                    onClick={() => setActiveFilters([])}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-white hover:bg-red-500/30 transition-all"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg text-white mb-6",
        config.bgColor
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Indicateur source */}
      <div className="absolute top-2 right-2 z-10">
        <Badge
          variant="outline"
          className="text-[10px] bg-black/20 border-white/30 text-white/80"
        >
          {data?.source === 'live' ? (
            <><Satellite className="h-3 w-3 mr-1" /> EN DIRECT</>
          ) : (
            'Données simulées'
          )}
        </Badge>
      </div>

      {/* Contenu principal */}
      <div className="relative px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-start sm:items-center justify-between gap-4">
          {/* Info événement */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            {/* Icône */}
            <div className="shrink-0 bg-white/20 rounded-full p-2">
              {config.icon}
            </div>

            {/* Texte */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("text-xs text-white border-0", severityConfig[currentEvent.severity].color)}>
                  {severityConfig[currentEvent.severity].label}
                </Badge>
                <span className="text-xs opacity-80 hidden sm:inline">
                  {new Date(currentEvent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <Badge variant="outline" className="text-[10px] border-white/30 text-white/80 hidden md:inline-flex">
                  {currentEvent.source}
                </Badge>
              </div>

              <h4 className="font-bold text-sm sm:text-base mt-1 truncate">
                {currentEvent.title}
              </h4>

              <div className="flex items-center gap-1 text-xs opacity-90 mt-0.5">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{currentEvent.location}</span>
                {currentEvent.coordinates && (
                  <span className="hidden sm:inline text-[10px] opacity-70">
                    ({currentEvent.coordinates.lat.toFixed(2)}°, {currentEvent.coordinates.lng.toFixed(2)}°)
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-1 sm:line-clamp-2">
                {currentEvent.description}
              </p>

              {currentEvent.sourceUrl && (
                <a
                  href={currentEvent.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-2 opacity-80 hover:opacity-100 transition-opacity underline"
                >
                  Source: {currentEvent.source}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Filtres */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtres</span>
            </Button>

            {/* Refresh */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 hidden sm:flex"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              <span className="sr-only">Actualiser</span>
            </Button>

            {/* Navigation */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Événement précédent</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Événement suivant</span>
              </Button>
            </div>

            {/* Fermer */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
        </div>

        {/* Filtres */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex flex-wrap gap-2">
              {filterTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                    activeFilters.includes(type)
                      ? "bg-white text-slate-800"
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  {eventConfig[type].icon}
                  {eventConfig[type].label}
                </button>
              ))}
              {activeFilters.length > 0 && (
                <button
                  onClick={() => setActiveFilters([])}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-white hover:bg-red-500/30 transition-all"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}

        {/* Indicateurs de pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {events.slice(0, 10).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              )}
            >
              <span className="sr-only">Événement {index + 1}</span>
            </button>
          ))}
          {events.length > 10 && (
            <span className="text-xs text-white/70 ml-2">
              +{events.length - 10}
            </span>
          )}
        </div>

        {/* Barre de progression */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className={cn(
              "h-full bg-white/50 transition-all",
              !isPaused && "animate-progress-bar"
            )}
            style={{
              animationDuration: '8s',
              animationIterationCount: 'infinite',
            }}
          />
        </div>
      </div>

      {/* Animation CSS pour la barre de progression */}
      <style jsx>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress-bar {
          animation-name: progress-bar;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
