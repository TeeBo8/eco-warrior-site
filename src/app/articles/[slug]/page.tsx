import ArticleDetail from '@/components/article-detail';
import { Metadata } from 'next';
import articlesData from '@/data/articles.json';

type Props = { params: Promise<{ slug: string }>; };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = articlesData.find(a => a.slug === resolvedParams.slug);

  if (!article) {
    return { title: 'Article non trouvé | EcoWarrior' };
  }

  const title = article.titleFr;
  const description = article.summaryFr.substring(0, 160);

  return {
    title: `${title} | EcoWarrior`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: article.imageUrl ? [article.imageUrl] : undefined
    }
  };
}

export default async function ArticlePage() {
  return <ArticleDetail />;
}