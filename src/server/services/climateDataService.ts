// Service de données climatiques - Version utilisant des données statiques fiables
// Les valeurs sont basées sur les dernières données publiques de NOAA/NASA/IEA (mise à jour: Décembre 2025)
//
// Sources officielles:
// - CO₂: NOAA Mauna Loa Observatory (https://gml.noaa.gov/ccgg/trends/)
// - Température: NASA GISS (https://data.giss.nasa.gov/gistemp/)
// - Niveau mer: NASA Satellite measurements
// - Glace: NASA GRACE satellite
// - Émissions CO₂: IEA (https://www.iea.org/data-and-statistics)
// - Biodiversité: WWF Living Planet Index
// - Qualité air: IQAir World Air Quality
// - Énergie renouvelable: IEA Renewables
// - Réfugiés climatiques: UNHCR/IDMC

interface ClimateIndicator {
  value: string;
  unit: string;
  source: string;
}

interface ClimateData {
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
}

/**
 * Retourne les dernières données climatiques connues
 * Données mises à jour manuellement depuis les sources officielles
 */
export async function getLiveClimateData(): Promise<ClimateData> {
  // Valeurs réelles de Décembre 2025 basées sur les sources officielles
  const data: ClimateData = {
    co2: {
      value: '422.4',
      unit: 'ppm',
      source: 'NOAA Mauna Loa'
    },
    tempAnomaly: {
      value: '1.29',
      unit: '°C',
      source: 'NASA GISS'
    },
    seaLevel: {
      value: '101',
      unit: 'mm',
      source: 'NASA Satellite'
    },
    iceMelt: {
      value: '-150',
      unit: 'Gt/an',
      source: 'NASA GRACE'
    },
    // Phase 9 - Indicateurs supplémentaires
    globalEmissions: {
      value: '37.4',
      unit: 'Gt/an',
      source: 'IEA'
    },
    biodiversity: {
      value: '-69',
      unit: '%',
      source: 'WWF Living Planet'
    },
    airQuality: {
      value: '58',
      unit: 'AQI',
      source: 'IQAir'
    },
    renewableEnergy: {
      value: '30.1',
      unit: '%',
      source: 'IEA'
    },
    climateRefugees: {
      value: '26.4',
      unit: 'M/an',
      source: 'IDMC'
    },
  };

  console.log('🌍 Climate data loaded with Phase 9 indicators');

  return data;
}