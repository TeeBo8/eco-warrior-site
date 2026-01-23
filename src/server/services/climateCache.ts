/**
 * Système de cache serveur pour les données climatiques
 *
 * - Cache en mémoire avec TTL configurable
 * - Fallback automatique sur données statiques
 * - Timestamp de dernière mise à jour
 */

import { fetchAllExternalData, fetchOpenMeteoData, fetchAirQuality } from './externalApiService';

// Types
export interface CachedClimateData {
  co2: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  tempAnomaly: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  seaLevel: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  iceMelt: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  globalEmissions: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  biodiversity: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  airQuality: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  renewableEnergy: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  climateRefugees: {
    value: string;
    unit: string;
    source: string;
    isLive: boolean;
  };
  // Météo temps réel (nouveau)
  currentWeather?: {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    location: string;
  };
  // Métadonnées
  lastUpdated: string;
  nextUpdate: string;
  dataSource: 'live' | 'cached' | 'static';
}

// Données statiques de fallback (valeurs officielles Janvier 2026)
const STATIC_FALLBACK_DATA: Omit<CachedClimateData, 'lastUpdated' | 'nextUpdate' | 'dataSource' | 'currentWeather'> = {
  co2: {
    value: '423.1',
    unit: 'ppm',
    source: 'NOAA Mauna Loa',
    isLive: false,
  },
  tempAnomaly: {
    value: '1.31',
    unit: '°C',
    source: 'NASA GISS',
    isLive: false,
  },
  seaLevel: {
    value: '103',
    unit: 'mm',
    source: 'NASA Satellite',
    isLive: false,
  },
  iceMelt: {
    value: '-152',
    unit: 'Gt/an',
    source: 'NASA GRACE',
    isLive: false,
  },
  globalEmissions: {
    value: '37.8',
    unit: 'Gt/an',
    source: 'IEA',
    isLive: false,
  },
  biodiversity: {
    value: '-69',
    unit: '%',
    source: 'WWF Living Planet',
    isLive: false,
  },
  airQuality: {
    value: '56',
    unit: 'AQI',
    source: 'IQAir',
    isLive: false,
  },
  renewableEnergy: {
    value: '30.8',
    unit: '%',
    source: 'IEA',
    isLive: false,
  },
  climateRefugees: {
    value: '27.1',
    unit: 'M/an',
    source: 'IDMC',
    isLive: false,
  },
};

// Cache en mémoire
interface CacheEntry {
  data: CachedClimateData;
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Récupère les données depuis le cache ou les rafraîchit
 */
export async function getCachedClimateData(): Promise<CachedClimateData> {
  const now = Date.now();

  // Vérifier si le cache est valide
  if (cache && cache.expiresAt > now) {
    console.log('📦 Serving climate data from cache');
    return cache.data;
  }

  // Sinon, rafraîchir les données
  console.log('🔄 Refreshing climate data...');
  return await refreshClimateData();
}

/**
 * Force le rafraîchissement des données (appelé par le cron)
 */
export async function refreshClimateData(): Promise<CachedClimateData> {
  const now = new Date();
  let dataSource: 'live' | 'cached' | 'static' = 'static';

  try {
    // Tenter de récupérer les données en temps réel
    const [externalData, weather, airQuality] = await Promise.all([
      fetchAllExternalData(),
      fetchOpenMeteoData(),
      fetchAirQuality(),
    ]);

    // Construire les données avec les valeurs live si disponibles
    const data: CachedClimateData = {
      ...STATIC_FALLBACK_DATA,
      lastUpdated: now.toISOString(),
      nextUpdate: new Date(now.getTime() + CACHE_TTL_MS).toISOString(),
      dataSource: 'live',
    };

    // Mettre à jour CO2 si disponible
    if (externalData.co2?.value) {
      data.co2 = {
        value: externalData.co2.value.toFixed(1),
        unit: 'ppm',
        source: 'NOAA Mauna Loa (Live)',
        isLive: true,
      };
      dataSource = 'live';
    }

    // Mettre à jour la qualité de l'air si disponible
    if (airQuality?.aqi) {
      data.airQuality = {
        value: airQuality.aqi.toString(),
        unit: 'AQI',
        source: 'Open-Meteo (Live)',
        isLive: true,
      };
      dataSource = 'live';
    }

    // Ajouter les données météo temps réel
    if (weather) {
      data.currentWeather = {
        temperature: weather.temperature,
        humidity: weather.humidity,
        precipitation: weather.precipitation,
        windSpeed: weather.windSpeed,
        location: weather.location,
      };
      dataSource = 'live';
    }

    data.dataSource = dataSource;

    // Mettre en cache
    const expiresAt = Date.now() + CACHE_TTL_MS;
    cache = { data, expiresAt };

    console.log(`✅ Climate data refreshed (source: ${dataSource})`);
    return data;
  } catch (error) {
    console.error('❌ Failed to refresh climate data, using fallback:', error);

    // Retourner les données statiques en cas d'erreur
    const fallbackData: CachedClimateData = {
      ...STATIC_FALLBACK_DATA,
      lastUpdated: now.toISOString(),
      nextUpdate: new Date(now.getTime() + CACHE_TTL_MS).toISOString(),
      dataSource: 'static',
    };

    // Mettre en cache même les données statiques pour éviter les appels répétés
    cache = { data: fallbackData, expiresAt: Date.now() + CACHE_TTL_MS };

    return fallbackData;
  }
}

/**
 * Invalide le cache (utile pour les tests ou le refresh manuel)
 */
export function invalidateCache(): void {
  cache = null;
  console.log('🗑️ Climate cache invalidated');
}

/**
 * Retourne les informations sur le cache
 */
export function getCacheInfo(): { isCached: boolean; expiresIn: number | null } {
  if (!cache) {
    return { isCached: false, expiresIn: null };
  }

  const expiresIn = cache.expiresAt - Date.now();
  return {
    isCached: expiresIn > 0,
    expiresIn: expiresIn > 0 ? Math.round(expiresIn / 1000) : null,
  };
}
