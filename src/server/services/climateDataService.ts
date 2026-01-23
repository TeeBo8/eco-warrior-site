// Service de données climatiques - Phase 12: Données Temps Réel (API)
//
// Architecture:
// - Cache serveur avec TTL de 15 minutes
// - Fallback automatique sur données statiques
// - Indicateur de dernière mise à jour
//
// Sources officielles:
// - CO₂: NOAA Mauna Loa Observatory (https://gml.noaa.gov/ccgg/trends/)
// - Température: NASA GISS (https://data.giss.nasa.gov/gistemp/)
// - Niveau mer: NASA Satellite measurements
// - Glace: NASA GRACE satellite
// - Émissions CO₂: IEA (https://www.iea.org/data-and-statistics)
// - Biodiversité: WWF Living Planet Index
// - Qualité air: Open-Meteo Air Quality API (temps réel)
// - Énergie renouvelable: IEA Renewables
// - Réfugiés climatiques: UNHCR/IDMC
// - Météo: Open-Meteo (temps réel)

import { getCachedClimateData, type CachedClimateData } from './climateCache';

export interface ClimateIndicator {
  value: string;
  unit: string;
  source: string;
  isLive?: boolean;
}

export interface ClimateData {
  co2: ClimateIndicator;
  tempAnomaly: ClimateIndicator;
  seaLevel: ClimateIndicator;
  iceMelt: ClimateIndicator;
  // Phase 9 - Indicateurs supplémentaires
  globalEmissions: ClimateIndicator;
  biodiversity: ClimateIndicator;
  airQuality: ClimateIndicator;
  renewableEnergy: ClimateIndicator;
  climateRefugees: ClimateIndicator;
  // Phase 12 - Météo temps réel
  currentWeather?: {
    temperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    location: string;
  };
  // Phase 12 - Métadonnées
  lastUpdated: string;
  nextUpdate: string;
  dataSource: 'live' | 'cached' | 'static';
}

/**
 * Retourne les dernières données climatiques avec cache et temps réel
 * Phase 12: Intégration API Open-Meteo + cache serveur
 */
export async function getLiveClimateData(): Promise<ClimateData> {
  // Récupérer les données depuis le cache (ou les rafraîchir si expiré)
  const cachedData: CachedClimateData = await getCachedClimateData();

  // Transformer en format ClimateData
  const data: ClimateData = {
    co2: cachedData.co2,
    tempAnomaly: cachedData.tempAnomaly,
    seaLevel: cachedData.seaLevel,
    iceMelt: cachedData.iceMelt,
    globalEmissions: cachedData.globalEmissions,
    biodiversity: cachedData.biodiversity,
    airQuality: cachedData.airQuality,
    renewableEnergy: cachedData.renewableEnergy,
    climateRefugees: cachedData.climateRefugees,
    currentWeather: cachedData.currentWeather,
    lastUpdated: cachedData.lastUpdated,
    nextUpdate: cachedData.nextUpdate,
    dataSource: cachedData.dataSource,
  };

  const liveIndicators = [
    data.co2.isLive,
    data.airQuality.isLive,
    !!data.currentWeather,
  ].filter(Boolean).length;

  console.log(`🌍 Climate data loaded (source: ${data.dataSource}, live indicators: ${liveIndicators}/3)`);

  return data;
}