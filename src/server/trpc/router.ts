import { publicProcedure, router } from './trpc';
import timelineData from '@/data/timeline.json';

import { getLiveClimateData } from '../services/climateDataService';
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

  // Événements timeline
  getTimelineEvents: publicProcedure.query(async () => {
    return timelineData.sort((a, b) => a.year - b.year);
  }),

});

export type AppRouter = typeof appRouter;