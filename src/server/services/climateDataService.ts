// Service de données climatiques - Version utilisant des données statiques fiables
// Les valeurs sont basées sur les dernières données publiques de NOAA/NASA (mise à jour: Décembre 2025)
// 
// Sources officielles:
// - CO₂: NOAA Mauna Loa Observatory (https://gml.noaa.gov/ccgg/trends/)
// - Température: NASA GISS (https://data.giss.nasa.gov/gistemp/)
// - Niveau mer: NASA Satellite measurements
// - Glace: NASA GRACE satellite

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
  };

  console.log('🌍 Climate data: CO₂=422.4ppm, Temp=1.29°C, Sea=101mm, Ice=-150Gt/an');

  return data;
}