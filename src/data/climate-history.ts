// Données historiques climatiques pour les graphiques
// Sources: NOAA, NASA GISS, NASA Satellite, NASA GRACE

export const co2History = [
  { year: 2000, value: 369.7 },
  { year: 2005, value: 379.8 },
  { year: 2010, value: 389.9 },
  { year: 2015, value: 400.8 },
  { year: 2018, value: 408.5 },
  { year: 2019, value: 411.4 },
  { year: 2020, value: 414.2 },
  { year: 2021, value: 416.4 },
  { year: 2022, value: 418.6 },
  { year: 2023, value: 420.0 },
  { year: 2024, value: 421.5 },
  { year: 2025, value: 422.4 },
];

export const tempAnomalyHistory = [
  { year: 2000, value: 0.42 },
  { year: 2005, value: 0.68 },
  { year: 2010, value: 0.72 },
  { year: 2015, value: 0.90 },
  { year: 2016, value: 1.02 },
  { year: 2017, value: 0.93 },
  { year: 2018, value: 0.85 },
  { year: 2019, value: 0.98 },
  { year: 2020, value: 1.02 },
  { year: 2021, value: 0.85 },
  { year: 2022, value: 0.89 },
  { year: 2023, value: 1.17 },
  { year: 2024, value: 1.25 },
  { year: 2025, value: 1.29 },
];

export const seaLevelHistory = [
  { year: 2000, value: 0 },
  { year: 2005, value: 15 },
  { year: 2010, value: 32 },
  { year: 2015, value: 52 },
  { year: 2018, value: 65 },
  { year: 2019, value: 70 },
  { year: 2020, value: 76 },
  { year: 2021, value: 82 },
  { year: 2022, value: 88 },
  { year: 2023, value: 93 },
  { year: 2024, value: 97 },
  { year: 2025, value: 101 },
];

export const iceMeltHistory = [
  { year: 2000, value: -50 },
  { year: 2005, value: -80 },
  { year: 2010, value: -100 },
  { year: 2015, value: -120 },
  { year: 2018, value: -130 },
  { year: 2019, value: -135 },
  { year: 2020, value: -140 },
  { year: 2021, value: -142 },
  { year: 2022, value: -145 },
  { year: 2023, value: -147 },
  { year: 2024, value: -148 },
  { year: 2025, value: -150 },
];

// Phase 9 - Données historiques des indicateurs supplémentaires

// Émissions mondiales de CO₂ (Gt/an) - Source: IEA
export const globalEmissionsHistory = [
  { year: 2000, value: 24.7 },
  { year: 2005, value: 28.7 },
  { year: 2010, value: 31.0 },
  { year: 2015, value: 33.1 },
  { year: 2018, value: 34.4 },
  { year: 2019, value: 34.8 },
  { year: 2020, value: 32.3 }, // Baisse COVID
  { year: 2021, value: 34.9 },
  { year: 2022, value: 36.1 },
  { year: 2023, value: 36.8 },
  { year: 2024, value: 37.1 },
  { year: 2025, value: 37.4 },
];

// Déclin biodiversité (% de déclin depuis 1970) - Source: WWF Living Planet Index
export const biodiversityHistory = [
  { year: 2000, value: -30 },
  { year: 2005, value: -35 },
  { year: 2010, value: -42 },
  { year: 2015, value: -50 },
  { year: 2018, value: -56 },
  { year: 2019, value: -58 },
  { year: 2020, value: -60 },
  { year: 2021, value: -63 },
  { year: 2022, value: -65 },
  { year: 2023, value: -67 },
  { year: 2024, value: -68 },
  { year: 2025, value: -69 },
];

// Qualité de l'air mondiale (Index AQI moyen) - Source: IQAir
export const airQualityHistory = [
  { year: 2000, value: 72 },
  { year: 2005, value: 70 },
  { year: 2010, value: 68 },
  { year: 2015, value: 65 },
  { year: 2018, value: 63 },
  { year: 2019, value: 62 },
  { year: 2020, value: 55 }, // Amélioration COVID
  { year: 2021, value: 58 },
  { year: 2022, value: 59 },
  { year: 2023, value: 58 },
  { year: 2024, value: 58 },
  { year: 2025, value: 58 },
];

// Part d'énergie renouvelable mondiale (%) - Source: IEA
export const renewableEnergyHistory = [
  { year: 2000, value: 18.5 },
  { year: 2005, value: 18.8 },
  { year: 2010, value: 20.3 },
  { year: 2015, value: 23.1 },
  { year: 2018, value: 25.3 },
  { year: 2019, value: 26.2 },
  { year: 2020, value: 27.0 },
  { year: 2021, value: 27.8 },
  { year: 2022, value: 28.5 },
  { year: 2023, value: 29.2 },
  { year: 2024, value: 29.7 },
  { year: 2025, value: 30.1 },
];

// Déplacés climatiques (millions/an) - Source: IDMC/UNHCR
export const climateRefugeesHistory = [
  { year: 2000, value: 14.2 },
  { year: 2005, value: 15.8 },
  { year: 2010, value: 17.5 },
  { year: 2015, value: 19.2 },
  { year: 2018, value: 21.5 },
  { year: 2019, value: 22.3 },
  { year: 2020, value: 23.0 },
  { year: 2021, value: 23.7 },
  { year: 2022, value: 24.8 },
  { year: 2023, value: 25.5 },
  { year: 2024, value: 26.0 },
  { year: 2025, value: 26.4 },
];

export type HistoryDataPoint = { year: number; value: number };

export const climateHistoryData = {
  co2: co2History,
  tempAnomaly: tempAnomalyHistory,
  seaLevel: seaLevelHistory,
  iceMelt: iceMeltHistory,
  // Phase 9
  globalEmissions: globalEmissionsHistory,
  biodiversity: biodiversityHistory,
  airQuality: airQualityHistory,
  renewableEnergy: renewableEnergyHistory,
  climateRefugees: climateRefugeesHistory,
};
