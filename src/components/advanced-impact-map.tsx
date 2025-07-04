"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Droplets, Flame, Waves, TreePine, Wind, Zap, Thermometer, Leaf } from 'lucide-react';
import { trpc } from "@/app/_trpc/client";
import { useParams } from "next/navigation";
import { usePremiumStatus } from "@/lib/test-mode-context";
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

const AdvancedImpactMap: React.FC<AdvancedImpactMapProps> = ({ points }) => {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  
  // 👇 NOUVEAU SYSTÈME DE TEST GLOBAL 👇
  const isPremium = usePremiumStatus();
  const pointsQuery = trpc.map.getPoints.useQuery();
  
  const [selectedPoint, setSelectedPoint] = useState<ImpactPoint | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Appliquer la limitation côté client selon le mode de test
  const allPoints = points || pointsQuery.data || [];
  const mapPoints = isPremium ? allPoints : allPoints.slice(0, 5);

  const handleMarkerClick = (point: ImpactPoint) => {
    setSelectedPoint(point);
    setIsDialogOpen(true);
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
          
          {/* Indicateur nombre de points */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {mapPoints.length} {locale === 'fr' ? 'points d\'impact' : 'impact points'}
              {!isPremium && (
                <span className="text-orange-600 ml-1">
                  ({locale === 'fr' ? 'aperçu limité' : 'limited preview'})
                </span>
              )}
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
    </div>
  );
};

export default AdvancedImpactMap; 