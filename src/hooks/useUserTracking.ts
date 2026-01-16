'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    getOrCreateSession,
    trackAction,
    updatePreferences,
    type AnonymousSession,
} from '@/lib/anonymous-auth';

/**
 * Hook React pour utiliser le système de tracking utilisateur
 */
export function useUserTracking() {
    const [session, setSession] = useState<AnonymousSession | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialiser la session au montage
    useEffect(() => {
        const currentSession = getOrCreateSession();
        setSession(currentSession);
        setIsLoaded(true);
    }, []);

    // Tracker une page vue
    const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
        trackAction('page_view', { path: pagePath, title: pageTitle });
        // Mettre à jour le state local
        setSession(getOrCreateSession());
    }, []);

    // Tracker un calcul d'empreinte carbone
    const trackCarbonCalculation = useCallback((totalEmissions: number, breakdown?: Record<string, number>) => {
        trackAction('carbon_calculation', { totalEmissions, breakdown });
        setSession(getOrCreateSession());
    }, []);

    // Tracker un scan visuel
    const trackScan = useCallback((imageType?: string, resultSummary?: string) => {
        trackAction('scan_performed', { imageType, resultSummary });
        setSession(getOrCreateSession());
    }, []);

    // Tracker une lecture d'article
    const trackArticleRead = useCallback((articleSlug: string, articleTitle?: string) => {
        trackAction('article_read', { slug: articleSlug, title: articleTitle });
        setSession(getOrCreateSession());
    }, []);

    // Tracker une vue de mythe
    const trackMythViewed = useCallback((mythId: number, mythTitle?: string) => {
        trackAction('myth_viewed', { id: mythId, title: mythTitle });
        setSession(getOrCreateSession());
    }, []);

    // Tracker une interaction carte
    const trackMapInteraction = useCallback((action: string, location?: { lat: number; lng: number }) => {
        trackAction('map_interaction', { action, location });
        setSession(getOrCreateSession());
    }, []);

    // Mettre à jour les préférences
    const setUserPreferences = useCallback((prefs: Partial<AnonymousSession['preferences']>) => {
        updatePreferences(prefs);
        setSession(getOrCreateSession());
    }, []);

    return {
        // État
        session,
        sessionId: session?.id || null,
        stats: session?.stats || null,
        isLoaded,

        // Actions de tracking
        trackPageView,
        trackCarbonCalculation,
        trackScan,
        trackArticleRead,
        trackMythViewed,
        trackMapInteraction,

        // Préférences
        setUserPreferences,
    };
}

/**
 * Hook pour tracker automatiquement les pages vues
 */
export function usePageTracking(pagePath: string, pageTitle?: string) {
    const { trackPageView, isLoaded } = useUserTracking();

    useEffect(() => {
        if (isLoaded) {
            trackPageView(pagePath, pageTitle);
        }
    }, [isLoaded, pagePath, pageTitle, trackPageView]);
}
