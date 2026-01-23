/**
 * Service d'API externes pour les données climatiques en temps réel
 *
 * Sources:
 * - Open-Meteo: API météo gratuite (température, précipitations)
 * - Simulation NASA/NOAA: Données CO2, niveau mer, glace (avec fallback statique)
 */

// Types pour les réponses API
interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  location: string;
  fetchedAt: string;
}

interface CO2ApiResponse {
  cycle: string;
  trend: string;
}

/**
 * Récupère les données météo en temps réel via Open-Meteo
 * Coordonnées par défaut: Paris (48.8566, 2.3522)
 */
export async function fetchOpenMeteoData(
  latitude = 48.8566,
  longitude = 2.3522
): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache 5 minutes
    });

    if (!response.ok) {
      console.error(`Open-Meteo API error: ${response.status}`);
      return null;
    }

    const data: OpenMeteoResponse = await response.json();

    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      location: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch Open-Meteo data:', error);
    return null;
  }
}

/**
 * Récupère les dernières données CO2 de NOAA (Global Monitoring Laboratory)
 * Note: NOAA a une API limitée, on utilise un proxy/fallback si nécessaire
 */
export async function fetchNOAACO2Data(): Promise<{ value: number; date: string } | null> {
  try {
    // L'API NOAA n'est pas directement accessible sans clé, on utilise une source alternative
    // esrl.noaa.gov/gmd/webdata/ccgg/trends/co2/co2_weekly_mlo.txt
    const url = 'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_weekly_mlo.json';

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache 1 heure
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Si l'API NOAA échoue, on retourne null et on utilisera le fallback
      console.log('NOAA API not available, using fallback data');
      return null;
    }

    const data: CO2ApiResponse = await response.json();

    // Extraire la dernière valeur CO2
    const latestValue = parseFloat(data.trend);

    return {
      value: latestValue,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.log('NOAA fetch error (using fallback):', error);
    return null;
  }
}

/**
 * Récupère les données de température globale moyenne
 * Via Open-Meteo Climate API
 */
export async function fetchGlobalTemperatureAnomaly(): Promise<{ value: number; date: string } | null> {
  try {
    // On utilise plusieurs points représentatifs pour une moyenne approximative
    const locations = [
      { lat: 0, lon: 0 },      // Équateur Atlantique
      { lat: 45, lon: -90 },   // Amérique du Nord
      { lat: 45, lon: 90 },    // Asie
      { lat: -30, lon: 30 },   // Afrique du Sud
      { lat: -45, lon: 170 },  // Océanie
    ];

    const temperatures: number[] = [];

    for (const loc of locations) {
      const data = await fetchOpenMeteoData(loc.lat, loc.lon);
      if (data) {
        temperatures.push(data.temperature);
      }
    }

    if (temperatures.length === 0) return null;

    // Moyenne des températures (approximation)
    const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

    // L'anomalie est calculée par rapport à la moyenne 1951-1980 (~14°C)
    // C'est une approximation - les vraies données viennent de NASA GISS
    const baselineTemp = 14.0;
    const anomaly = avgTemp - baselineTemp;

    return {
      value: Math.round(anomaly * 100) / 100,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch temperature anomaly:', error);
    return null;
  }
}

/**
 * Récupère l'indice de qualité de l'air (AQI)
 * Via Open-Meteo Air Quality API
 */
export async function fetchAirQuality(
  latitude = 48.8566,
  longitude = 2.3522
): Promise<{ aqi: number; pm25: number; pm10: number; date: string } | null> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,pm10,pm2_5`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache 10 minutes
    });

    if (!response.ok) {
      console.error(`Air Quality API error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      aqi: data.current.european_aqi || 0,
      pm25: data.current.pm2_5 || 0,
      pm10: data.current.pm10 || 0,
      date: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch air quality data:', error);
    return null;
  }
}

/**
 * Agrège toutes les données des APIs externes
 */
export async function fetchAllExternalData() {
  const [weather, co2, tempAnomaly, airQuality] = await Promise.all([
    fetchOpenMeteoData(),
    fetchNOAACO2Data(),
    fetchGlobalTemperatureAnomaly(),
    fetchAirQuality(),
  ]);

  return {
    weather,
    co2,
    tempAnomaly,
    airQuality,
    fetchedAt: new Date().toISOString(),
  };
}
