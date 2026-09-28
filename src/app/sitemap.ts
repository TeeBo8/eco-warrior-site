import { type MetadataRoute } from 'next';

// Force dynamic generation at runtime instead of build time
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eco-warrior-site.vercel.app';

  const staticPaths = [
    '',
    '/dashboard',
    '/debunk',
    '/timeline',
    '/map',
    '/calculator',
    '/articles',
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  // Dynamic routes will be fetched at runtime when the sitemap is accessed
  let postRoutes: MetadataRoute.Sitemap = [];
  let articleRoutes: MetadataRoute.Sitemap = [];

  try {
    // Only fetch from DB at runtime, not during build
    const { db } = await import('@/server/db');

    const allPosts = await db.query.posts.findMany({
      columns: {
        slug: true,
        updatedAt: true,
      },
    });

    postRoutes = allPosts.map((post) => ({
      url: `${baseUrl}/debunk/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const allArticles = await db.query.articles.findMany({
      columns: {
        slug: true,
        publishedAt: true,
      },
    });

    articleRoutes = allArticles.map((art) => ({
      url: `${baseUrl}/articles/${art.slug}`,
      lastModified: art.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching dynamic sitemap routes:', error);
    // Continue with static routes only
  }

  return [...staticRoutes, ...postRoutes, ...articleRoutes];
}