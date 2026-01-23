/**
 * Route API Cron pour synchroniser les données climatiques
 *
 * Configuré pour être appelé par Vercel Cron Jobs toutes les heures
 * (Plan Hobby de Vercel = précision horaire uniquement)
 * Peut aussi être appelé manuellement pour un refresh immédiat
 *
 * Configuration dans vercel.json:
 * "crons": [{ "path": "/api/cron/sync-climate", "schedule": "0 * * * *" }]
 */

import { NextResponse } from 'next/server';
import { refreshClimateData, getCacheInfo } from '@/server/services/climateCache';

// Clé secrète pour protéger le endpoint (optionnel mais recommandé)
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  // Vérifier l'authentification si un secret est configuré
  if (CRON_SECRET) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    const startTime = Date.now();

    // Rafraîchir les données
    const data = await refreshClimateData();
    const cacheInfo = getCacheInfo();

    const duration = Date.now() - startTime;

    console.log(`🔄 Climate data sync completed in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: 'Climate data synchronized successfully',
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      dataSource: data.dataSource,
      cacheInfo: {
        isCached: cacheInfo.isCached,
        expiresInSeconds: cacheInfo.expiresIn,
      },
      // Résumé des données mises à jour
      summary: {
        co2: `${data.co2.value} ${data.co2.unit}`,
        tempAnomaly: `${data.tempAnomaly.value} ${data.tempAnomaly.unit}`,
        airQuality: `${data.airQuality.value} ${data.airQuality.unit}`,
        hasLiveWeather: !!data.currentWeather,
      },
    });
  } catch (error) {
    console.error('❌ Cron sync failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync climate data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Permettre aussi POST pour les tests manuels
export async function POST(request: Request) {
  return GET(request);
}
