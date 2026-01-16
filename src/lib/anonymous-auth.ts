/**
 * Système d'authentification anonyme avec localStorage
 * Permet de tracker les actions utilisateur avant inscription
 */

// Types pour les actions trackées
export interface TrackedAction {
    type:
    | 'page_view'
    | 'carbon_calculation'
    | 'scan_performed'
    | 'article_read'
    | 'myth_viewed'
    | 'map_interaction';
    timestamp: number;
    data?: Record<string, unknown>;
}

export interface AnonymousSession {
    id: string;
    createdAt: number;
    lastSeenAt: number;
    actions: TrackedAction[];
    preferences: {
        theme?: 'light' | 'dark' | 'system';
        locale?: string;
    };
    stats: {
        pagesViewed: number;
        calculationsPerformed: number;
        scansPerformed: number;
        articlesRead: number;
    };
}

const STORAGE_KEY = 'eco_warrior_session';
const SESSION_VERSION = 1;

/**
 * Génère un UUID v4 simple
 */
function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Récupère ou crée une session anonyme
 */
export function getOrCreateSession(): AnonymousSession {
    if (typeof window === 'undefined') {
        // SSR - retourner une session vide
        return createEmptySession();
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const session = JSON.parse(stored) as AnonymousSession;
            // Mettre à jour lastSeenAt
            session.lastSeenAt = Date.now();
            saveSession(session);
            return session;
        }
    } catch (e) {
        console.warn('Failed to read session from localStorage:', e);
    }

    // Créer une nouvelle session
    const newSession = createEmptySession();
    saveSession(newSession);
    return newSession;
}

/**
 * Crée une session vide
 */
function createEmptySession(): AnonymousSession {
    return {
        id: generateId(),
        createdAt: Date.now(),
        lastSeenAt: Date.now(),
        actions: [],
        preferences: {},
        stats: {
            pagesViewed: 0,
            calculationsPerformed: 0,
            scansPerformed: 0,
            articlesRead: 0,
        },
    };
}

/**
 * Sauvegarde la session dans localStorage
 */
export function saveSession(session: AnonymousSession): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
        console.warn('Failed to save session to localStorage:', e);
    }
}

/**
 * Track une action utilisateur
 */
export function trackAction(
    actionType: TrackedAction['type'],
    data?: Record<string, unknown>
): void {
    const session = getOrCreateSession();

    const action: TrackedAction = {
        type: actionType,
        timestamp: Date.now(),
        data,
    };

    // Ajouter l'action (garder les 100 dernières)
    session.actions.push(action);
    if (session.actions.length > 100) {
        session.actions = session.actions.slice(-100);
    }

    // Mettre à jour les stats
    switch (actionType) {
        case 'page_view':
            session.stats.pagesViewed++;
            break;
        case 'carbon_calculation':
            session.stats.calculationsPerformed++;
            break;
        case 'scan_performed':
            session.stats.scansPerformed++;
            break;
        case 'article_read':
            session.stats.articlesRead++;
            break;
    }

    session.lastSeenAt = Date.now();
    saveSession(session);
}

/**
 * Récupère l'ID de session (pour lier à un compte plus tard)
 */
export function getSessionId(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const session = JSON.parse(stored) as AnonymousSession;
            return session.id;
        }
    } catch (e) {
        console.warn('Failed to read session ID:', e);
    }

    return null;
}

/**
 * Récupère les stats de session
 */
export function getSessionStats(): AnonymousSession['stats'] | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const session = JSON.parse(stored) as AnonymousSession;
            return session.stats;
        }
    } catch (e) {
        console.warn('Failed to read session stats:', e);
    }

    return null;
}

/**
 * Met à jour les préférences utilisateur
 */
export function updatePreferences(
    preferences: Partial<AnonymousSession['preferences']>
): void {
    const session = getOrCreateSession();
    session.preferences = { ...session.preferences, ...preferences };
    saveSession(session);
}

/**
 * Efface la session (pour les tests ou reset)
 */
export function clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Exporte les données de session pour les envoyer au serveur
 * (utile pour synchroniser avec un vrai compte utilisateur)
 */
export function exportSessionData(): AnonymousSession | null {
    if (typeof window === 'undefined') return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as AnonymousSession;
        }
    } catch (e) {
        console.warn('Failed to export session data:', e);
    }

    return null;
}
