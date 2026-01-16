'use client';

import { trpc } from '@/app/_trpc/client';
import { ArticlePageCard } from '@/components/articles/ArticlePageCard';
import { FileText, TrendingUp, Leaf } from 'lucide-react';

export default function ArticlesList() {
  const articlesQuery = trpc.article.getAll.useQuery();

  // Skeleton loader pour les cartes
  const ArticleCardSkeleton = () => (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            Analyses d&apos;experts
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400">
              Nos Analyses
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Décryptage des enjeux climatiques actuels, basé sur les dernières données scientifiques et les recommandations du GIEC.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-10">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>{articlesQuery.data?.length || '...'} articles publiés</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <span>100% vérifiés scientifiquement</span>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        {articlesQuery.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : articlesQuery.data && articlesQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articlesQuery.data.map((article) => (
              <ArticlePageCard
                key={article.id}
                id={article.id}
                slug={article.slug}
                title={article.titleFr}
                summary={article.summaryFr}
                imageUrl={article.imageUrl}
                publishedAt={new Date(article.publishedAt)}
                author={article.author}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun article pour le moment
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Nos experts travaillent sur de nouvelles analyses. Revenez bientôt pour découvrir nos dernières publications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}