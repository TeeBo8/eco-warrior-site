import * as cheerio from 'cheerio';

// Les URLs des pages "signes vitaux" de la NASA.
const VITAL_SIGNS_BASE_URL = 'https://climate.nasa.gov/vital-signs';

// Une fonction pour récupérer le contenu d'une URL avec un cache d'une heure.
async function fetchHtml(url: string): Promise<cheerio.CheerioAPI> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    const html = await response.text();
    return cheerio.load(html);
  } catch (error) {
    console.error(`Error fetching HTML from ${url}:`, error);
    return cheerio.load(''); // Retourne un objet cheerio vide en cas d'erreur
  }
}

// Fonction pour nettoyer et extraire les valeurs numériques
function cleanValue(rawText: string): string {
  if (!rawText) return 'N/A';
  
  // Nettoyer le texte : supprimer les espaces multiples et retours à la ligne
  const cleaned = rawText.replace(/\s+/g, ' ').trim();
  
  // Extraire le nombre (avec décimales et signes possibles)
  const numberMatch = cleaned.match(/([+-]?\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return numberMatch[1];
  }
  
  return 'N/A';
}

// Fonction principale qui va scraper et retourner toutes les données
export async function getLiveClimateData() {
  // On lance toutes les requêtes en parallèle pour plus de rapidité
  const [co2Page, tempPage, seaLevelPage, icePage] = await Promise.all([
    fetchHtml(`${VITAL_SIGNS_BASE_URL}/carbon-dioxide/`),
    fetchHtml(`${VITAL_SIGNS_BASE_URL}/global-temperature/`),
    fetchHtml(`${VITAL_SIGNS_BASE_URL}/sea-level/`),
    fetchHtml(`${VITAL_SIGNS_BASE_URL}/ice-sheets/`),
  ]);

  // --- Scraping de la concentration de CO2 ---
  const co2Raw = co2Page('.value').first().text();
  const co2Value = cleanValue(co2Raw);

  // --- Scraping de l'anomalie de température ---
  const tempRaw = tempPage('.value').first().text();
  const tempValue = cleanValue(tempRaw);
  
  // --- Scraping du niveau de la mer ---
  const seaLevelRaw = seaLevelPage('.value').first().text();
  const seaLevelValue = cleanValue(seaLevelRaw);
  
  // --- Scraping de la fonte des glaces (structure différente) ---
  let iceRaw = icePage('.value').first().text();
  
  // Si .value est vide, essayer .change_number (structure spécifique à la page glaces)
  if (!iceRaw || iceRaw.trim() === '') {
    iceRaw = icePage('.change_number').first().text();
  }
  
  const iceMeltValue = cleanValue(iceRaw);

  // Log de confirmation (optionnel, pour le monitoring)
  console.log(`🌍 Climate data updated: CO₂=${co2Value}ppm, Temp=${tempValue}°C, Sea=${seaLevelValue}mm, Ice=${iceMeltValue}Gt/an`);

  return {
    co2: { value: co2Value, unit: 'ppm', source: 'NASA Climate' },
    tempAnomaly: { value: tempValue, unit: '°C', source: 'NASA Climate' },
    seaLevel: { value: seaLevelValue, unit: 'mm', source: 'NASA Climate' },
    iceMelt: { value: iceMeltValue, unit: 'Gt/an', source: 'NASA Climate' },
  };
} 