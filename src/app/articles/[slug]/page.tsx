import ArticleDetail from '@/components/article-detail';
import { Metadata } from 'next';
import articlesData from '@/data/articles.json';

type Props = { params: Promise<{ slug: string }>; };

// Fonction pour calculer le temps de lecture
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

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
      publishedTime: article.publishedAt,
      authors: [article.author],
      section: article.category,
      // Les images sont générées automatiquement par opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // Les images sont générées automatiquement par twitter-image.tsx
    },
  };
}

// Générer les JSON-LD Schema.org pour l'article
function generateArticleSchema(article: typeof articlesData[0], slug: string) {
  const readingTime = calculateReadingTime(article.contentFr);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.titleFr,
    description: article.summaryFr,
    image: article.imageUrl || undefined,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EcoWarrior',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ecowarrior.fr/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ecowarrior.fr/articles/${slug}`,
    },
    articleSection: article.category,
    wordCount: article.contentFr.trim().split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    keywords: [article.category, 'environnement', 'climat', 'écologie'].join(', '),
  };
}

export default async function ArticlePage({ params }: Props) {
  const resolvedParams = await params;
  const article = articlesData.find(a => a.slug === resolvedParams.slug);

  // Générer le schema JSON-LD si l'article existe
  const jsonLd = article ? generateArticleSchema(article, resolvedParams.slug) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ArticleDetail />
    </>
  );
}