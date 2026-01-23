import { publicProcedure, router } from './trpc';
import timelineData from '@/data/timeline.json';

import { getLiveClimateData } from '../services/climateDataService';
import { fetchAllClimateEvents, getFallbackEvents } from '../services/climateEventsService';
import { postRouter } from '../api/routers/post';
import { contactRouter } from '../api/routers/contact';
import { mapRouter } from '../api/routers/map';
import { articleRouter } from '../api/routers/article';

export const appRouter = router({
  post: postRouter,
  contact: contactRouter,
  map: mapRouter,
  article: articleRouter,

  // Données climatiques - maintenant public
  getClimateIndicators: publicProcedure.query(async () => {
    return await getLiveClimateData();
  }),

  // Événements climatiques en temps réel - Phase 13
  getClimateEvents: publicProcedure.query(async () => {
    try {
      const events = await fetchAllClimateEvents();
      // Si aucun événement n'est récupéré, utiliser les données de fallback
      if (events.length === 0) {
        return {
          events: getFallbackEvents(),
          source: 'fallback',
          lastUpdated: new Date().toISOString(),
        };
      }
      return {
        events,
        source: 'live',
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching climate events:', error);
      return {
        events: getFallbackEvents(),
        source: 'fallback',
        lastUpdated: new Date().toISOString(),
      };
    }
  }),

  // Événements timeline
  getTimelineEvents: publicProcedure.query(async () => {
    return timelineData.sort((a, b) => a.year - b.year);
  }),

});

export type AppRouter = typeof appRouter;