'use client';

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Flame,
  CloudRain,
  Wind,
  Thermometer,
  Waves,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types d'événements climatiques
type EventType = 'wildfire' | 'flood' | 'hurricane' | 'heatwave' | 'drought' | 'storm';
type EventSeverity = 'extreme' | 'severe' | 'moderate';

interface ClimateEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  title: string;
  location: string;
  description: string;
  impactedPeople?: string;
  date: Date;
  source?: string;
  sourceUrl?: string;
}

// Configuration des types d'événements
const eventConfig: Record<EventType, { icon: React.ReactNode; color: string; bgColor: string }> = {
  wildfire: {
    icon: <Flame className="h-5 w-5" />,
    color: 'text-orange-500',
    bgColor: 'bg-gradient-to-r from-orange-600 to-red-600',
  },
  flood: {
    icon: <CloudRain className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  hurricane: {
    icon: <Wind className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-r from-purple-600 to-indigo-600',
  },
  heatwave: {
    icon: <Thermometer className="h-5 w-5" />,
    color: 'text-red-500',
    bgColor: 'bg-gradient-to-r from-red-600 to-orange-500',
  },
  drought: {
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-amber-500',
    bgColor: 'bg-gradient-to-r from-amber-600 to-yellow-500',
  },
  storm: {
    icon: <Waves className="h-5 w-5" />,
    color: 'text-slate-500',
    bgColor: 'bg-gradient-to-r from-slate-600 to-slate-500',
  },
};

// Événements climatiques majeurs récents (données simulées mais réalistes)
const recentClimateEvents: ClimateEvent[] = [
  {
    id: 'event-1',
    type: 'wildfire',
    severity: 'extreme',
    title: 'Méga-feux en Australie',
    location: 'Nouvelle-Galles du Sud, Australie',
    description: 'Incendies de forêt massifs aggravés par la sécheresse record et les températures extrêmes.',
    impactedPeople: '3 millions de personnes affectées',
    date: new Date(2025, 0, 15),
    source: 'Bureau of Meteorology',
    sourceUrl: 'http://www.bom.gov.au/',
  },
  {
    id: 'event-2',
    type: 'heatwave',
    severity: 'extreme',
    title: 'Vague de chaleur record',
    location: 'Sud de l\'Europe',
    description: 'Températures dépassant 45°C dans plusieurs pays méditerranéens, nouveau record historique.',
    impactedPeople: '100+ millions de personnes exposées',
    date: new Date(2025, 0, 18),
    source: 'Copernicus Climate',
    sourceUrl: 'https://climate.copernicus.eu/',
  },
  {
    id: 'event-3',
    type: 'flood',
    severity: 'severe',
    title: 'Inondations catastrophiques',
    location: 'Bangladesh & Inde',
    description: 'Mousson exceptionnelle causant des inondations majeures dans le delta du Gange.',
    impactedPeople: '20 millions de déplacés',
    date: new Date(2025, 0, 20),
    source: 'OCHA',
    sourceUrl: 'https://www.unocha.org/',
  },
  {
    id: 'event-4',
    type: 'hurricane',
    severity: 'extreme',
    title: 'Ouragan Catégorie 5',
    location: 'Caraïbes & Floride',
    description: 'Un des ouragans les plus puissants jamais enregistrés en janvier, signe du réchauffement océanique.',
    impactedPeople: '5 millions en évacuation',
    date: new Date(2025, 0, 21),
    source: 'NOAA NHC',
    sourceUrl: 'https://www.nhc.noaa.gov/',
  },
];

// Composant principal
export function ClimateEventsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const events = recentClimateEvents;
  const currentEvent = events[currentIndex];
  const config = eventConfig[currentEvent.type];

  // Navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  // Auto-rotation
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const interval = setInterval(goToNext, 8000); // 8 secondes par événement
    return () => clearInterval(interval);
  }, [isPaused, isVisible, goToNext]);

  // Fermer la bannière
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const severityLabel = {
    extreme: 'Extrême',
    severe: 'Sévère',
    moderate: 'Modéré',
  };

  const severityColor = {
    extreme: 'bg-red-500',
    severe: 'bg-orange-500',
    moderate: 'bg-yellow-500',
  };

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
                <Badge className={cn("text-xs text-white border-0", severityColor[currentEvent.severity])}>
                  {severityLabel[currentEvent.severity]}
                </Badge>
                <span className="text-xs opacity-80 hidden sm:inline">
                  {currentEvent.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </div>

              <h4 className="font-bold text-sm sm:text-base mt-1 truncate">
                {currentEvent.title}
              </h4>

              <div className="flex items-center gap-1 text-xs opacity-90 mt-0.5">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{currentEvent.location}</span>
              </div>

              <p className="text-xs sm:text-sm opacity-90 mt-1 line-clamp-1 sm:line-clamp-2">
                {currentEvent.description}
              </p>

              {currentEvent.impactedPeople && (
                <p className="text-xs font-medium mt-1 opacity-95">
                  👥 {currentEvent.impactedPeople}
                </p>
              )}

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

        {/* Indicateurs de pagination */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {events.map((_, index) => (
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
