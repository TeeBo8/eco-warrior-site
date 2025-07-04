import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from 'next-intl/middleware';

// Routes publiques pour Clerk (connexion, etc.)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',        // Page d'accueil (sera redirigée vers une locale)
  '/fr',      // Page d'accueil en français
  '/en',      // Page d'accueil en anglais
  '/fr/sign-in(.*)',  // Routes de connexion avec locales
  '/en/sign-in(.*)',
  '/fr/sign-up(.*)',  // Routes d'inscription avec locales
  '/en/sign-up(.*)',
  '/fr/pricing',      // Page pricing accessible sans connexion
  '/en/pricing',
  '/api/trpc/getDebunkingPoints',  // Route API publique pour les points de débunking
  '/api/trpc/getTimelineEvents',   // Route API publique pour la timeline
  '/api/webhooks/(.*)'  // Webhooks publics
]);

// Middleware de next-intl pour la gestion des locales
const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

// On combine les deux middlewares
export default clerkMiddleware(async (auth, request) => {
  // Skip l'internationalisation pour les routes API
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/trpc')) {
    // Vérifier l'authentification pour les routes API non publiques
    if (!isPublicRoute(request)) {
      const authData = await auth();
      if (!authData.userId) {
        return new Response('Unauthorized', { status: 401 });
      }
    }
    return;
  }
  
  // Pour toutes les autres routes, appliquer l'internationalisation d'abord
  const intlResponse = intlMiddleware(request);
  
  // Vérifier l'authentification pour les routes non publiques
  if (!isPublicRoute(request)) {
    const authData = await auth();
    if (!authData.userId) {
      // Pour les routes non-API, rediriger vers la page de connexion
      const locale = request.nextUrl.pathname.startsWith('/fr') ? 'fr' : 'en';
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return Response.redirect(signInUrl);
    }
  }
  
  return intlResponse;
});

export const config = {
  // On applique le middleware à toutes les routes incluant /api/trpc
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 