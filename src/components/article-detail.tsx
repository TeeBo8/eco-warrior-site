'use client';

import { trpc } from '@/app/_trpc/client';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserTracking } from '@/hooks/useUserTracking';

// Fonction pour calculer le temps de lecture
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Fonction pour le temps relatif
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { trackArticleRead, isLoaded } = useUserTracking();

  const articleQuery = trpc.article.getBySlug.useQuery({ slug }, { enabled: !!slug, retry: 1 });

  // Tracker la lecture de l'article
  useEffect(() => {
    if (isLoaded && articleQuery.data) {
      trackArticleRead(slug, articleQuery.data.titleFr);
    }
  }, [isLoaded, articleQuery.data, slug, trackArticleRead]);

  // Share functionality
  const handleShare = async () => {
    if (navigator.share && articleQuery.data) {
      try {
        await navigator.share({
          title: articleQuery.data.titleFr,
          text: articleQuery.data.summaryFr,
          url: window.location.href,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (articleQuery.isLoading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="h-80 bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const article = articleQuery.data;

  if (!article) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Article non trouvé</h2>
          <p className="text-muted-foreground mb-6">Cet article n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link href="/articles">Voir tous les articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  const title = article.titleFr;
  const content = article.contentFr;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Back button - sticky */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Partager
          </Button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Analyse climatique
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            {title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{getRelativeTime(new Date(article.publishedAt))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min de lecture</span>
            </div>
          </div>
        </header>

        {/* Hero image */}
        {article.imageUrl && (
          <div className="relative w-full aspect-video mb-10 rounded-2xl overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Summary/Lead paragraph */}
        <div className="mb-10 p-6 rounded-xl bg-muted/50 border border-border/50">
          <p className="text-lg text-foreground leading-relaxed font-medium">
            {article.summaryFr}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:text-foreground prose-headings:font-bold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
          prose-strong:text-primary prose-strong:font-semibold
          prose-ul:space-y-2 prose-ul:my-6
          prose-li:text-muted-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
        ">
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-bold text-foreground mt-12 mb-6 pb-2 border-b border-border/50" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-bold text-foreground mt-8 mb-4" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground" {...props} />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-primary" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="mb-6 space-y-3 ml-6" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="text-lg leading-relaxed text-muted-foreground list-disc" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-primary bg-muted/50 py-4 px-6 my-8 rounded-r-xl italic text-muted-foreground" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <Button asChild variant="outline">
              <Link href="/articles" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux articles
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}