/**
 * Service d'événements climatiques en temps réel
 *
 * Sources:
 * - NASA EONET (Earth Observatory Natural Event Tracker): Événements naturels en cours
 * - GDACS (Global Disaster Alert and Coordination System): Alertes ONU catastrophes mondiales
 */

// Types pour les événements climatiques normalisés
export type ClimateEventType = 'wildfire' | 'flood' | 'hurricane' | 'volcano' | 'earthquake' | 'drought' | 'storm' | 'iceberg' | 'other';
export type ClimateEventSeverity = 'extreme' | 'severe' | 'moderate' | 'minor';

export interface ClimateEventCoordinates {
  lat: number;
  lng: number;
}

export interface ClimateEvent {
  id: string;
  type: ClimateEventType;
  severity: ClimateEventSeverity;
  title: string;
  location: string;
  description: string;
  date: string;
  coordinates?: ClimateEventCoordinates;
  source: string;
  sourceUrl: string;
  category?: string;
}

// Types pour l'API NASA EONET
interface EONETCategory {
  id: string;
  title: string;
}

interface EONETGeometry {
  date: string;
  type: string;
  coordinates: [number, number] | [number, number][];
}

interface EONETSource {
  id: string;
  url: string;
}

interface EONETEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EONETCategory[];
  sources: EONETSource[];
  geometry: EONETGeometry[];
}

interface EONETResponse {
  title: string;
  description: string;
  link: string;
  events: EONETEvent[];
}

// Types pour l'API GDACS (format GeoJSON)
interface GDACSFeatureProperties {
  eventid: number;
  eventtype: string;
  name: string;
  description: string;
  htmldescription: string;
  alertlevel: string;
  alertscore: number;
  episodeid: number;
  eventname: string;
  country: string;
  fromdate: string;
  todate: string;
  url: {
    report: string;
    details: string;
  };
}

interface GDACSFeature {
  type: string;
  bbox?: number[];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: GDACSFeatureProperties;
}

interface GDACSResponse {
  type: string;
  features: GDACSFeature[];
}

// Mapping des catégories EONET vers nos types
const eonetCategoryMap: Record<string, ClimateEventType> = {
  'wildfires': 'wildfire',
  'volcanoes': 'volcano',
  'severeStorms': 'storm',
  'floods': 'flood',
  'earthquakes': 'earthquake',
  'drought': 'drought',
  'dustHaze': 'other',
  'landslides': 'other',
  'manmade': 'other',
  'seaLakeIce': 'iceberg',
  'snow': 'storm',
  'tempExtremes': 'other',
  'waterColor': 'other',
};

// Mapping des types GDACS vers nos types
const gdacsTypeMap: Record<string, ClimateEventType> = {
  'EQ': 'earthquake',
  'TC': 'hurricane',
  'FL': 'flood',
  'VO': 'volcano',
  'DR': 'drought',
  'WF': 'wildfire',
};

// Mapping des niveaux d'alerte GDACS vers notre sévérité
const gdacsSeverityMap: Record<string, ClimateEventSeverity> = {
  'Red': 'extreme',
  'Orange': 'severe',
  'Green': 'moderate',
};

/**
 * Récupère les événements depuis NASA EONET
 * Documentation: https://eonet.gsfc.nasa.gov/docs/v3
 */
export async function fetchNASAEONETEvents(): Promise<ClimateEvent[]> {
  try {
    // Récupérer les événements des 30 derniers jours, limité à 20 événements
    const url = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=20';

    const response = await fetch(url, {
      next: { revalidate: 900 }, // Cache 15 minutes
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`NASA EONET API error: ${response.status}`);
      return [];
    }

    const data: EONETResponse = await response.json();

    return data.events.map((event): ClimateEvent => {
      const category = event.categories[0];
      const latestGeometry = event.geometry[event.geometry.length - 1];
      const source = event.sources[0];

      // Extraire les coordonnées (format peut varier)
      let coordinates: ClimateEventCoordinates | undefined;
      if (latestGeometry && latestGeometry.coordinates) {
        const coords = latestGeometry.coordinates;
        if (Array.isArray(coords[0])) {
          // C'est un tableau de coordonnées, prendre le premier
          const firstCoord = coords[0] as [number, number];
          coordinates = { lng: firstCoord[0], lat: firstCoord[1] };
        } else {
          // Coordonnées simples [lng, lat]
          coordinates = { lng: coords[0] as number, lat: coords[1] as number };
        }
      }

      // Déterminer la sévérité basée sur le nombre de géométries (indicateur d'ampleur)
      let severity: ClimateEventSeverity = 'moderate';
      if (event.geometry.length > 10) {
        severity = 'extreme';
      } else if (event.geometry.length > 5) {
        severity = 'severe';
      }

      const eventType = eonetCategoryMap[category?.id] || 'other';

      // Construire la description
      const description = event.description ||
        `Événement ${category?.title || 'climatique'} détecté par les satellites NASA.`;

      // Extraire la localisation depuis le titre si possible
      const location = extractLocationFromTitle(event.title) || 'Localisation en cours d\'analyse';

      return {
        id: `eonet-${event.id}`,
        type: eventType,
        severity,
        title: event.title,
        location,
        description,
        date: latestGeometry?.date || new Date().toISOString(),
        coordinates,
        source: 'NASA EONET',
        sourceUrl: source?.url || event.link,
        category: category?.title,
      };
    });
  } catch (error) {
    console.error('Failed to fetch NASA EONET events:', error);
    return [];
  }
}

/**
 * Récupère les alertes depuis GDACS (Nations Unies)
 * Documentation: https://www.gdacs.org/gdacsapi/
 */
export async function fetchGDACSAlerts(): Promise<ClimateEvent[]> {
  try {
    // API GDACS en format GeoJSON pour les événements des 7 derniers jours
    const url = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?fromdate=2024-01-01&alertlevel=Orange;Red';

    const response = await fetch(url, {
      next: { revalidate: 900 }, // Cache 15 minutes
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GDACS API error: ${response.status}`);
      return [];
    }

    const data: GDACSResponse = await response.json();

    if (!data.features) {
      return [];
    }

    return data.features.slice(0, 10).map((feature): ClimateEvent => {
      const props = feature.properties;
      const geometry = feature.geometry;

      const eventType = gdacsTypeMap[props.eventtype] || 'other';
      const severity = gdacsSeverityMap[props.alertlevel] || 'moderate';

      let coordinates: ClimateEventCoordinates | undefined;
      if (geometry && geometry.coordinates) {
        coordinates = {
          lng: geometry.coordinates[0],
          lat: geometry.coordinates[1],
        };
      }

      // Construire une description informative
      const description = props.description ||
        `Alerte ${props.alertlevel} - ${props.eventname || props.name}. ${props.country ? `Pays affecté: ${props.country}` : ''}`;

      return {
        id: `gdacs-${props.eventid}-${props.episodeid}`,
        type: eventType,
        severity,
        title: props.eventname || props.name,
        location: props.country || 'Région non spécifiée',
        description: cleanHtmlDescription(description),
        date: props.fromdate,
        coordinates,
        source: 'GDACS (ONU)',
        // Page d'accueil GDACS plus fiable que les rapports individuels
        sourceUrl: 'https://www.gdacs.org/default.aspx',
        category: props.eventtype,
      };
    });
  } catch (error) {
    console.error('Failed to fetch GDACS alerts:', error);
    return [];
  }
}

/**
 * Récupère tous les événements climatiques depuis toutes les sources
 * Fusionne et trie par date
 */
export async function fetchAllClimateEvents(): Promise<ClimateEvent[]> {
  const [eonetEvents, gdacsAlerts] = await Promise.all([
    fetchNASAEONETEvents(),
    fetchGDACSAlerts(),
  ]);

  // Fusionner les événements
  const allEvents = [...eonetEvents, ...gdacsAlerts];

  // Trier par sévérité puis par date (plus récent en premier)
  const severityOrder: Record<ClimateEventSeverity, number> = {
    extreme: 0,
    severe: 1,
    moderate: 2,
    minor: 3,
  };

  allEvents.sort((a, b) => {
    // D'abord par sévérité
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;

    // Puis par date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return allEvents;
}

/**
 * Filtre les événements par type
 */
export function filterEventsByType(events: ClimateEvent[], types: ClimateEventType[]): ClimateEvent[] {
  if (types.length === 0) return events;
  return events.filter(event => types.includes(event.type));
}

/**
 * Extraire la localisation depuis le titre de l'événement
 */
function extractLocationFromTitle(title: string): string | null {
  // Patterns courants dans les titres NASA EONET
  const patterns = [
    /(?:in|near|at)\s+(.+?)(?:,|$)/i,
    /(.+?)\s+(?:wildfire|fire|volcano|storm|flood)/i,
    /(?:wildfire|fire|volcano|storm|flood)\s+(?:in|near|at)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Si pas de pattern trouvé, essayer de nettoyer le titre
  const cleanTitle = title
    .replace(/\s*\(.*?\)\s*/g, '') // Enlever les parenthèses
    .replace(/\s*-\s*\d+.*$/g, '') // Enlever les numéros à la fin
    .trim();

  return cleanTitle.length > 3 && cleanTitle.length < 100 ? cleanTitle : null;
}

/**
 * Nettoyer le HTML des descriptions GDACS
 */
function cleanHtmlDescription(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ') // Enlever les balises HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();
}

/**
 * Données de fallback si les APIs sont indisponibles
 */
export function getFallbackEvents(): ClimateEvent[] {
  const now = new Date();

  return [
    {
      id: 'fallback-1',
      type: 'wildfire',
      severity: 'severe',
      title: 'Feux de forêt actifs',
      location: 'Californie, États-Unis',
      description: 'Plusieurs incendies de forêt sont actuellement surveillés par les satellites NASA.',
      date: now.toISOString(),
      source: 'NASA EONET',
      sourceUrl: 'https://eonet.gsfc.nasa.gov/',
    },
    {
      id: 'fallback-2',
      type: 'hurricane',
      severity: 'moderate',
      title: 'Activité cyclonique',
      location: 'Océan Atlantique',
      description: 'Surveillance des systèmes tropicaux en développement.',
      date: now.toISOString(),
      source: 'NOAA NHC',
      sourceUrl: 'https://www.nhc.noaa.gov/',
    },
    {
      id: 'fallback-3',
      type: 'flood',
      severity: 'moderate',
      title: 'Risques d\'inondation',
      location: 'Asie du Sud-Est',
      description: 'Surveillance des niveaux d\'eau suite aux précipitations saisonnières.',
      date: now.toISOString(),
      source: 'GDACS',
      sourceUrl: 'https://www.gdacs.org/',
    },
  ];
}
