import ArticleDetail from '@/components/article-detail';
import { Metadata } from 'next';
import { db } from '@/server/db';
import { articles } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

type Props = { params: Promise<{ slug: string; locale: string }>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await db.query.articles.findFirst({ where: eq(articles.slug, resolvedParams.slug) });
  if (!article) return { title: 'Article non trouvé' };
  const title = resolvedParams.locale === 'fr' ? article.titleFr : article.titleEn;
  const description = (resolvedParams.locale === 'fr' ? article.summaryFr : article.summaryEn).substring(0, 160);
  return { title: `${title} | EcoWarrior`, description, openGraph: { title, description, type: 'article' } };
}

export default async function ArticlePage() {
  return <ArticleDetail />;
} 