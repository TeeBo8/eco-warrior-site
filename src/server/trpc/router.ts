import { privateProcedure, publicProcedure, router } from './trpc';
import { getLiveClimateData } from '../services/climateDataService';
import { db } from '../db';
import { stripeRouter } from '../api/routers/stripe';
import { chatRouter } from '../api/routers/chat';
import { carbonRouter } from '../api/routers/carbon';
import { gamificationRouter } from '../api/routers/gamification';
import { postRouter } from '../api/routers/post';
import { commentRouter } from '../api/routers/comment';
import { mapRouter } from '../api/routers/map';
import { articleRouter } from '../api/routers/article';

export const appRouter = router({
  stripe: stripeRouter,
  chat: chatRouter,
  carbon: carbonRouter,
  gamification: gamificationRouter,
  post: postRouter,
  comment: commentRouter,
  map: mapRouter,
  article: articleRouter,
  
  getClimateIndicators: privateProcedure.query(async () => {
    // On appelle notre service qui fait maintenant tout le travail !
    return await getLiveClimateData();
  }),

  // 👇 NOUVELLE PROCÉDURE POUR LA TIMELINE 👇
  getTimelineEvents: publicProcedure.query(async () => {
    return await db.query.timelineEvents.findMany({
      orderBy: (events, { asc }) => [asc(events.year)],
    });
  }),

});

export type AppRouter = typeof appRouter; 