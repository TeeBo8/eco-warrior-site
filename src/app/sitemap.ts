import { type MetadataRoute } from 'next';
import { db } from '@/server/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eco-warrior-site.vercel.app';
  const locales = ['en', 'fr'];
  const staticPaths = [
    '',
    '/dashboard',
    '/debunk',
    '/timeline',
    '/map',
    '/calculator',
    '/profile',
    '/articles',
    '/pricing',
  ];
  const staticRoutes = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  );
  const allPosts = await db.query.posts.findMany({
    columns: {
      slug: true,
      updatedAt: true,
    },
  });
  const postRoutes = locales.flatMap((locale) =>
    allPosts.map((post) => ({
      url: `${baseUrl}/${locale}/debunk/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );
  const allArticles = await db.query.articles.findMany({
    columns: {
      slug: true,
      publishedAt: true,
    },
  });
  const articleRoutes = locales.flatMap((locale) =>
    allArticles.map((art) => ({
      url: `${baseUrl}/${locale}/articles/${art.slug}`,
      lastModified: art.publishedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );
  return [...staticRoutes, ...postRoutes, ...articleRoutes];
} 