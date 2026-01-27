'use client';

import { trpc } from '@/app/_trpc/client';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Home, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserTracking } from '@/hooks/useUserTracking';
import { motion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArticleReactions, BookmarkButton } from '@/components/articles';
import { NewsletterCTA } from '@/components/debunk/newsletter-cta';

// Icônes par catégorie
const categoryIcons: Record<string, string> = {
  "Climat": "🌡️",
  "Océans": "🌊",
  "Énergie": "⚡",
  "Biodiversité": "🦋",
  "Solutions": "💡",
};

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

// Hook personnalisé pour la progression de lecture
function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  const calculateProgress = useCallback(() => {
    if (!articleRef.current) return;

    const article = articleRef.current;
    const articleTop = article.offsetTop;
    const articleHeight = article.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const scrolledPast = scrollY - articleTop + windowHeight * 0.3;
    const scrollableHeight = articleHeight - windowHeight * 0.3;

    if (scrolledPast <= 0) {
      setProgress(0);
    } else if (scrolledPast >= scrollableHeight) {
      setProgress(100);
    } else {
      setProgress((scrolledPast / scrollableHeight) * 100);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress);
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  return { progress, articleRef };
}

// Breadcrumb Component
function Breadcrumb({ category, title }: { category: string; title: string }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Fil d'Ariane"
      className="mb-6"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Accueil</span>
          </Link>
        </li>
        <li className="flex items-center text-muted-foreground/50">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li className="flex items-center">
          <Link
            href="/articles"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Analyses
          </Link>
        </li>
        <li className="flex items-center text-muted-foreground/50">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li className="flex items-center">
          <Link
            href={`/articles?category=${encodeURIComponent(category)}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <span>{categoryIcons[category]}</span>
            <span>{category}</span>
          </Link>
        </li>
        <li className="flex items-center text-muted-foreground/50">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li className="flex items-center max-w-[200px] sm:max-w-xs">
          <span className="text-foreground font-medium truncate" title={title}>
            {title}
          </span>
        </li>
      </ol>
    </motion.nav>
  );
}

// Related Articles Component
function RelatedArticles({ slug }: { slug: string }) {
  const relatedQuery = trpc.article.getRelated.useQuery({ slug, limit: 3 });

  if (relatedQuery.isLoading) {
    return (
      <div className="mt-16 pt-8 border-t border-border">
        <h3 className="text-lg font-bold text-foreground mb-6">Articles similaires</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-3" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!relatedQuery.data || relatedQuery.data.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16 pt-8 border-t border-border"
    >
      <h3 className="text-lg font-bold text-foreground mb-6">
        Articles similaires
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relatedQuery.data.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group block"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mb-3">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.titleFr}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 to-teal-500/40" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-2 left-2">
                <span className="text-xs px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  {categoryIcons[article.category]}
                </span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {article.titleFr}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString('fr-FR')} lectures
            </p>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { trackArticleRead, isLoaded } = useUserTracking();
  const { progress, articleRef } = useReadingProgress();

  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });
  const articleQuery = trpc.article.getBySlug.useQuery({ slug }, { enabled: !!slug, retry: 1 });

  useEffect(() => {
    smoothProgress.set(progress);
  }, [progress, smoothProgress]);

  useEffect(() => {
    if (isLoaded && articleQuery.data) {
      trackArticleRead(slug, articleQuery.data.titleFr);
    }
  }, [isLoaded, articleQuery.data, slug, trackArticleRead]);

  const handleShare = async () => {
    if (navigator.share && articleQuery.data) {
      try {
        await navigator.share({
          title: articleQuery.data.titleFr,
          text: articleQuery.data.summaryFr,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (articleQuery.isLoading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-muted rounded w-1/3" />
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
          <p className="text-muted-foreground mb-6">Cet article n&apos;existe pas ou a été supprimé.</p>
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
  const category = article.category || "Climat";

  return (
    <div className="w-full min-h-screen bg-background article-noise">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
          style={{ width: `${progress}%` }}
        />
        <motion.div
          className="absolute top-0 h-1 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm"
          style={{ left: `calc(${progress}% - 40px)` }}
        />
      </motion.div>

      {/* Sticky header */}
      <div className="sticky top-1 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
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

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="flex items-center gap-2">
            <BookmarkButton
              article={{
                slug,
                title,
                imageUrl: article.imageUrl,
              }}
              variant="ghost"
              size="md"
            />
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
      </div>

      <article ref={articleRef} className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb category={category} title={title} />

        {/* Header */}
        <header className="mb-8">
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
              "bg-primary/10 text-primary border border-primary/20"
            )}>
              <span>{categoryIcons[category]}</span>
              <span>{category}</span>
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="article-title text-3xl md:text-4xl lg:text-5xl text-foreground mb-6"
          >
            {title}
          </motion.h1>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground"
          >
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
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views?.toLocaleString('fr-FR') || 0} lectures</span>
            </div>
          </motion.div>
        </header>

        {/* Hero image */}
        {article.imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative w-full aspect-video mb-10 rounded-2xl overflow-hidden"
          >
            <Image
              src={article.imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAiIHkyPSIzMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxNjY1MzQiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMxMGI5ODEiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTRiOGE2IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg=="
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        )}

        {/* Summary/Lead paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10 p-6 rounded-xl bg-muted/50 border border-border/50"
        >
          <p className="text-lg text-foreground leading-relaxed font-medium">
            {article.summaryFr}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose prose-lg dark:prose-invert max-w-none
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
        </motion.div>

        {/* Reactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <ArticleReactions articleSlug={slug} />
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <NewsletterCTA />
        </motion.div>

        {/* Related Articles */}
        <RelatedArticles slug={slug} />

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
