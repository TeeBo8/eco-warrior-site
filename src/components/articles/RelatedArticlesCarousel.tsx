'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CategoryBadge } from './CategoryBadge';

interface RelatedArticle {
  id?: number;
  slug: string;
  title: string;
  titleFr?: string;
  summary?: string;
  summaryFr?: string;
  imageUrl?: string | null;
  category: string;
  views?: number;
  publishedAt?: Date | string;
  author?: string;
}

interface RelatedArticlesCarouselProps {
  articles: RelatedArticle[];
  title?: string;
  className?: string;
  showViews?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

// Placeholder blur pour les images
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAiIHkyPSIzMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxNjY1MzQiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMxMGI5ODEiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTRiOGE2IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==";

// Constante pour le nombre d'items par vue
const ITEMS_PER_VIEW_DESKTOP = 3;

export function RelatedArticlesCarousel({
  articles,
  title = 'Articles similaires',
  className,
  showViews = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: RelatedArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const maxIndex = Math.max(0, articles.length - ITEMS_PER_VIEW_DESKTOP);

  // Auto-play
  useEffect(() => {
    if (autoPlay && articles.length > ITEMS_PER_VIEW_DESKTOP) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      };
    }
  }, [autoPlay, autoPlayInterval, maxIndex, articles.length]);

  // Navigation
  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Touch/Mouse drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX);
    setScrollLeft(currentIndex);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const diff = startX - pageX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex < maxIndex) {
        setCurrentIndex(scrollLeft + 1);
        setIsDragging(false);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(scrollLeft - 1);
        setIsDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (articles.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Sparkles className="w-5 h-5 text-primary" />
          {title}
        </h3>

        {/* Navigation buttons */}
        {articles.length > ITEMS_PER_VIEW_DESKTOP && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                'border border-border bg-card hover:bg-muted',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              aria-label="Article précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                'border border-border bg-card hover:bg-muted',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              aria-label="Article suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel container */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / ITEMS_PER_VIEW_DESKTOP)}%)`,
          }}
        >
          {articles.map((article) => (
            <div
              key={article.slug}
              className={cn(
                'flex-shrink-0 px-2',
                'w-full sm:w-1/2 lg:w-1/3'
              )}
            >
              <ArticleCard
                article={article}
                showViews={showViews}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      {articles.length > ITEMS_PER_VIEW_DESKTOP && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                idx === currentIndex
                  ? 'w-6 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Aller à la slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Carte d'article individuelle
function ArticleCard({
  article,
  showViews,
}: {
  article: RelatedArticle;
  showViews: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !article.imageUrl || imageError;
  const displayTitle = article.titleFr || article.title;
  const displaySummary = article.summaryFr || article.summary;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block h-full"
    >
      <div className="h-full rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          {showFallback ? (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 via-emerald-500/30 to-teal-500/40">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent" />
            </div>
          ) : (
            <Image
              src={article.imageUrl!}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              placeholder="blur"
              blurDataURL={blurDataURL}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <CategoryBadge
              category={article.category}
              size="sm"
              variant="glass"
              showLabel={false}
            />
          </div>

          {/* Views badge */}
          {showViews && article.views !== undefined && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {displayTitle}
          </h4>
          {displaySummary && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {displaySummary}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <CategoryBadge
              category={article.category}
              size="sm"
              variant="outline"
            />
            {article.author && (
              <span className="text-xs text-muted-foreground">
                {article.author}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Version simple sans carousel (grille)
export function RelatedArticlesGrid({
  articles,
  title = 'Articles similaires',
  className,
  showViews = true,
  columns = 3,
}: RelatedArticlesCarouselProps & { columns?: 2 | 3 | 4 }) {
  if (articles.length === 0) return null;

  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={className}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        {title}
      </h3>

      <div className={cn('grid grid-cols-1 gap-4', gridCols[columns])}>
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            showViews={showViews}
          />
        ))}
      </div>
    </div>
  );
}
