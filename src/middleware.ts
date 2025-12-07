import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

// Simple middleware pour la gestion des locales uniquement
const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Skip l'internationalisation pour les routes API, fichiers statiques et Next.js internals
  const url = request.nextUrl;

  if (url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/trpc') ||
    url.pathname.startsWith('/_next') ||
    url.pathname === '/sitemap.xml' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/favicon.ico') {
    return;
  }

  // Appliquer l'internationalisation pour toutes les autres routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};