"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Flame, Waves, TreePine, Wind, Zap, Thermometer, Leaf, Satellite, Loader2 } from 'lucide-react';
import { trpc } from "@/app/_trpc/client";
import { useParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import type { ClimateEvent } from "@/server/services/climateEventsService";

import Image from 'next/image';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CSS personnalisé pour s'assurer que les Dialogs sont au-dessus de Leaflet
const dialogStyles = `
  [data-radix-popper-content-wrapper] {
    z-index: 10000 !important;
  }
  .dialog-overlay {
    z-index: 9999 !important;
  }
`;

// Fix pour l'icône par défaut de Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ImpactPoint {
  id: number;
  lat: number;
  lng: number;
  name_en: string;
  name_fr: string;
  impact_en: string;
  impact_fr: string;
  category: string | null;
  image_url: string | null;
}

interface AdvancedImpactMapProps {
  points?: ImpactPoint[];
}

const createCustomIcon = (category: string | null) => {
  const iconMap = {
    drought: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/></svg>',
    fire: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#ef4444" stroke="#ffffff" stroke-width="2"/></svg>',
    'sea-level': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2H2v2z" fill="#06b6d4" stroke="#ffffff" stroke-width="2"/><path d="M7 8a4.5 4.5 0 0 1 4.5-4.5c1.076 0 1.924.49 2.75 1.5A4.5 4.5 0 0 1 16.5 8a2.5 2.5 0 0 1 0 5H7a2.5 2.5 0 0 1 0-5z" fill="#06b6d4" stroke="#ffffff" stroke-width="2"/></svg>',
    erosion: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22v-8m0 0L8 10l4-8 4 8-4 4z" fill="#22c55e" stroke="#ffffff" stroke-width="2"/><path d="M12 22v-3" stroke="#8b5cf6" stroke-width="3"/></svg>',
    heatwave: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" fill="#f59e0b" stroke="#ffffff" stroke-width="2"/><path d="m12 2v2" stroke="#f59e0b" stroke-width="2"/><path d="m12 20v2" stroke="#f59e0b" stroke-width="2"/><path d="M4.93 4.93l1.41 1.41" stroke="#f59e0b" stroke-width="2"/><path d="M17.66 17.66l1.41 1.41" stroke="#f59e0b" stroke-width="2"/><path d="M2 12h2" stroke="#f59e0b" stroke-width="2"/><path d="M20 12h2" stroke="#f59e0b" stroke-width="2"/><path d="M6.34 17.66l-1.41 1.41" stroke="#f59e0b" stroke-width="2"/><path d="M19.07 4.93l-1.41 1.41" stroke="#f59e0b" stroke-width="2"/></svg>',
    biodiversity: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="#8b5cf6" stroke="#ffffff" stroke-width="2"/></svg>',
    storm: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="#8b5cf6" stroke="#ffffff" stroke-width="2"/></svg>',
    other: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#6b7280" stroke="#ffffff" stroke-width="2"/></svg>'
  };

  const categoryKey = (category || 'other') as keyof typeof iconMap;
  const svgString = iconMap[categoryKey] || iconMap.other;
  const iconUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Icônes pour les événements climatiques en temps réel
const createClimateEventIcon = (eventType: string, severity: string) => {
  const colorMap: Record<string, string> = {
    wildfire: '#ef4444',
    flood: '#3b82f6',
    hurricane: '#8b5cf6',
    volcano: '#dc2626',
    earthquake: '#f59e0b',
    drought: '#eab308',
    storm: '#6366f1',
    iceberg: '#06b6d4',
    other: '#6b7280',
  };

  const severityRing: Record<string, string> = {
    extreme: '#dc2626',
    severe: '#f97316',
    moderate: '#eab308',
    minor: '#22c55e',
  };

  const fillColor = colorMap[eventType] || colorMap.other;
  const ringColor = severityRing[severity] || severityRing.moderate;

  // SVG avec anneau de sévérité pulsant
  const svgString = `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="16" fill="${ringColor}" opacity="0.3">
      <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="18" cy="18" r="12" fill="${fillColor}" stroke="#ffffff" stroke-width="2"/>
    <circle cx="18" cy="18" r="4" fill="#ffffff" opacity="0.6"/>
  </svg>`;

  const iconUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  return L.icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const CategoryIcon: React.FC<{ category: string | null }> = ({ category }) => {
  const iconProps = { className: "h-4 w-4" };

  switch (category) {
    case 'drought':
      return <Droplets {...iconProps} />;
    case 'fire':
      return <Flame {...iconProps} />;
    case 'sea-level':
      return <Waves {...iconProps} />;
    case 'erosion':
      return <TreePine {...iconProps} />;
    case 'heatwave':
      return <Thermometer {...iconProps} />;
    case 'biodiversity':
      return <Leaf {...iconProps} />;
    case 'storm':
      return <Wind {...iconProps} />;
    default:
      return <Zap {...iconProps} />;
  }
};

const SimpleBadge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

const MapEvents: React.FC<{ onMarkerClick: (point: ImpactPoint) => void; points: ImpactPoint[] }> = ({
  onMarkerClick,
  points
}) => {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createCustomIcon(point.category)
      }).addTo(map);

      marker.on('click', () => {
        onMarkerClick(point);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, points, onMarkerClick]);

  return null;
};

// Composant pour afficher les événements climatiques en temps réel sur la carte
const ClimateEventsLayer: React.FC<{
  events: ClimateEvent[];
  onEventClick: (event: ClimateEvent) => void;
}> = ({ events, onEventClick }) => {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    events.forEach((event) => {
      if (!event.coordinates) return;

      const marker = L.marker([event.coordinates.lat, event.coordinates.lng], {
        icon: createClimateEventIcon(event.type, event.severity)
      }).addTo(map);

      marker.on('click', () => {
        onEventClick(event);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => map.removeLayer(marker));
    };
  }, [map, events, onEventClick]);

  return null;
};

const AdvancedImpactMap: React.FC<AdvancedImpactMapProps> = ({ points }) => {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';

  const pointsQuery = trpc.map.getPoints.useQuery();
  const climateEventsQuery = trpc.getClimateEvents.useQuery(undefined, {
    refetchInterval: 15 * 60 * 1000, // Refresh toutes les 15 minutes
  });

  const [selectedPoint, setSelectedPoint] = useState<ImpactPoint | null>(null);
  const [selectedClimateEvent, setSelectedClimateEvent] = useState<ClimateEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClimateEventDialogOpen, setIsClimateEventDialogOpen] = useState(false);
  const [showLiveEvents, setShowLiveEvents] = useState(true);

  // Tous les points sont disponibles
  const mapPoints = points || pointsQuery.data || [];
  const climateEvents = climateEventsQuery.data?.events.filter(e => e.coordinates) || [];

  const handleMarkerClick = (point: ImpactPoint) => {
    setSelectedPoint(point);
    setIsDialogOpen(true);
  };

  const handleClimateEventClick = (event: ClimateEvent) => {
    setSelectedClimateEvent(event);
    setIsClimateEventDialogOpen(true);
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wildfire: locale === 'fr' ? 'Feu de forêt' : 'Wildfire',
      flood: locale === 'fr' ? 'Inondation' : 'Flood',
      hurricane: locale === 'fr' ? 'Ouragan/Cyclone' : 'Hurricane',
      volcano: locale === 'fr' ? 'Volcan' : 'Volcano',
      earthquake: locale === 'fr' ? 'Séisme' : 'Earthquake',
      drought: locale === 'fr' ? 'Sécheresse' : 'Drought',
      storm: locale === 'fr' ? 'Tempête' : 'Storm',
      iceberg: locale === 'fr' ? 'Glace/Iceberg' : 'Ice/Iceberg',
      other: locale === 'fr' ? 'Autre' : 'Other',
    };
    return labels[type] || labels.other;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      extreme: 'bg-red-500 text-white',
      severe: 'bg-orange-500 text-white',
      moderate: 'bg-yellow-500 text-white',
      minor: 'bg-green-500 text-white',
    };
    return colors[severity] || colors.moderate;
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      extreme: locale === 'fr' ? 'Extrême' : 'Extreme',
      severe: locale === 'fr' ? 'Sévère' : 'Severe',
      moderate: locale === 'fr' ? 'Modéré' : 'Moderate',
      minor: locale === 'fr' ? 'Mineur' : 'Minor',
    };
    return labels[severity] || labels.moderate;
  };

  const getCategoryColor = (category: string | null) => {
    const colorMap = {
      drought: 'bg-blue-500 text-white',
      fire: 'bg-red-500 text-white',
      'sea-level': 'bg-cyan-500 text-white',
      erosion: 'bg-cyan-500 text-white',
      heatwave: 'bg-orange-500 text-white',
      biodiversity: 'bg-purple-500 text-white',
      storm: 'bg-indigo-500 text-white',
      montagne: 'bg-slate-500 text-white',
      eau: 'bg-blue-600 text-white',
      extreme: 'bg-red-600 text-white',
      other: 'bg-gray-500 text-white'
    };
    const categoryKey = (category || 'other') as keyof typeof colorMap;
    return colorMap[categoryKey] || colorMap.other;
  };

  const getCategoryLabel = (category: string | null) => {
    const labelMap = {
      drought: locale === 'fr' ? 'Sécheresse' : 'Drought',
      fire: locale === 'fr' ? 'Incendie' : 'Wildfire',
      'sea-level': locale === 'fr' ? 'Montée des eaux' : 'Sea Level Rise',
      erosion: locale === 'fr' ? 'Montée des eaux' : 'Sea Level Rise',
      heatwave: locale === 'fr' ? 'Canicule' : 'Heatwave',
      biodiversity: locale === 'fr' ? 'Biodiversité' : 'Biodiversity',
      storm: locale === 'fr' ? 'Tempête' : 'Storm',
      montagne: locale === 'fr' ? 'Montagne' : 'Mountain',
      eau: locale === 'fr' ? 'Ressources en eau' : 'Water Resources',
      extreme: locale === 'fr' ? 'Événement extrême' : 'Extreme Event',
      other: locale === 'fr' ? 'Autre' : 'Other'
    };
    const categoryKey = (category || 'other') as keyof typeof labelMap;
    return labelMap[categoryKey] || labelMap.other;
  };

  if (pointsQuery.isLoading) {
    return <p className="p-4">{locale === 'fr' ? 'Chargement de la carte...' : 'Loading map...'}</p>;
  }

  return (
    <div className="w-full space-y-4">
      {/* CSS personnalisé pour les z-index */}
      <style dangerouslySetInnerHTML={{ __html: dialogStyles }} />

      {/* Légende déplacée au-dessus de la carte */}
      <Card className="p-4 bg-background border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {locale === 'fr' ? 'Carte des Impacts Climatiques' : 'Climate Impact Map'}
          </h3>

          {/* Toggle événements en direct + Indicateur nombre de points */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Switch
                checked={showLiveEvents}
                onCheckedChange={setShowLiveEvents}
                id="live-events"
              />
              <label htmlFor="live-events" className="flex items-center gap-1 cursor-pointer">
                <Satellite className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {locale === 'fr' ? 'Événements en direct' : 'Live events'}
                </span>
                {climateEventsQuery.isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {showLiveEvents && climateEvents.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                    {climateEvents.length}
                  </span>
                )}
              </label>
            </div>
            <span>
              {mapPoints.length} {locale === 'fr' ? 'points d\'impact' : 'impact points'}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {locale === 'fr' ? 'Sécheresse' : 'Drought'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {locale === 'fr' ? 'Canicule' : 'Heatwave'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {locale === 'fr' ? 'Montée des eaux' : 'Sea Level Rise'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {locale === 'fr' ? 'Biodiversité' : 'Biodiversity'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {locale === 'fr' ? 'Tempêtes' : 'Storms'}
            </span>
          </div>
        </div>

        {/* Légende événements en direct */}
        {showLiveEvents && climateEvents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <Satellite className="h-4 w-4 text-red-500" />
              <span className="font-medium text-sm text-foreground">
                {locale === 'fr' ? 'Événements en temps réel' : 'Real-time events'}
              </span>
              <span className="text-xs text-muted-foreground">
                (NASA EONET & GDACS)
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">
                  {locale === 'fr' ? 'Extrême' : 'Extreme'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-muted-foreground">
                  {locale === 'fr' ? 'Sévère' : 'Severe'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-muted-foreground">
                  {locale === 'fr' ? 'Modéré' : 'Moderate'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Carte avec hauteur ajustée */}
      <div className="w-full h-[70vh] relative">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={2}
          className="w-full h-full rounded-lg"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <MapEvents onMarkerClick={handleMarkerClick} points={mapPoints} />
          {showLiveEvents && (
            <ClimateEventsLayer
              events={climateEvents}
              onEventClick={handleClimateEventClick}
            />
          )}
        </MapContainer>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[400px] sm:w-[540px] max-h-[80vh] overflow-y-auto" style={{ zIndex: 10000 }}>
          {selectedPoint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CategoryIcon category={selectedPoint.category} />
                  {locale === 'fr' ? selectedPoint.name_fr : selectedPoint.name_en}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <SimpleBadge className={getCategoryColor(selectedPoint.category)}>
                  {getCategoryLabel(selectedPoint.category)}
                </SimpleBadge>

                {selectedPoint.image_url ? (
                  <div className="w-full h-48 rounded-lg overflow-hidden relative">
                    <Image
                      src={selectedPoint.image_url}
                      alt={locale === 'fr' ? selectedPoint.name_fr : selectedPoint.name_en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 540px) 100vw, 540px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      {locale === 'fr' ? 'Image non disponible' : 'No image available'}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'fr' ? 'Description de l\'impact' : 'Impact Description'}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {locale === 'fr' ? selectedPoint.impact_fr : selectedPoint.impact_en}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'fr' ? 'Localisation' : 'Location'}
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour les événements climatiques en temps réel */}
      <Dialog open={isClimateEventDialogOpen} onOpenChange={setIsClimateEventDialogOpen}>
        <DialogContent className="w-[400px] sm:w-[540px] max-h-[80vh] overflow-y-auto" style={{ zIndex: 10000 }}>
          {selectedClimateEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-red-500" />
                  {selectedClimateEvent.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-2">
                  <SimpleBadge className={getSeverityColor(selectedClimateEvent.severity)}>
                    {getSeverityLabel(selectedClimateEvent.severity)}
                  </SimpleBadge>
                  <SimpleBadge className="bg-slate-500 text-white">
                    {getEventTypeLabel(selectedClimateEvent.type)}
                  </SimpleBadge>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'fr' ? 'Description' : 'Description'}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedClimateEvent.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'fr' ? 'Localisation' : 'Location'}
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedClimateEvent.location}
                    </p>
                    {selectedClimateEvent.coordinates && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedClimateEvent.coordinates.lat.toFixed(4)}°, {selectedClimateEvent.coordinates.lng.toFixed(4)}°
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {locale === 'fr' ? 'Date' : 'Date'}
                    </h4>
                    <p className="text-muted-foreground">
                      {new Date(selectedClimateEvent.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <a
                      href={selectedClimateEvent.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <span>{locale === 'fr' ? 'Source:' : 'Source:'} {selectedClimateEvent.source}</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedImpactMap; 