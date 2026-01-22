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

export type HistoryDataPoint = { year: number; value: number };

export const climateHistoryData = {
  co2: co2History,
  tempAnomaly: tempAnomalyHistory,
  seaLevel: seaLevelHistory,
  iceMelt: iceMeltHistory,
};
