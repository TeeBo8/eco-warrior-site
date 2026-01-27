'use client';

import { trpc } from '@/app/_trpc/client';
import { ArticlePageCard } from '@/components/articles/ArticlePageCard';
import { FileText, TrendingUp, Leaf, Eye, ChevronLeft, ChevronRight, Flame, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Icônes par catégorie
const categoryIcons: Record<string, string> = {
  "Climat": "🌡️",
  "Océans": "🌊",
  "Énergie": "⚡",
  "Biodiversité": "🦋",
  "Solutions": "💡",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

// Featured Article Card Component
function FeaturedArticleCard({ article }: {
  article: {
    slug: string;
    titleFr: string;
    summaryFr: string;
    imageUrl: string;
    publishedAt: Date | string;
    author: string;
    category: string;
    views: number;
  }
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
    >
      <Link href={`/articles/${article.slug}`} className="group block">
        <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[21/9] md:aspect-[21/8]">
          {/* Image */}
          {!imageError && article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.titleFr}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              onError={() => setImageError(true)}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 via-emerald-500/30 to-teal-500/40" />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

          {/* Badge À la une */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
              <Flame className="w-3.5 h-3.5" />
              À la une
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/10">
              {categoryIcons[article.category]} {article.category}
            </span>
          </div>

          {/* Stats */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/10">
              <Eye className="w-3.5 h-3.5" />
              {article.views.toLocaleString('fr-FR')} lectures
            </span>
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h2 className="article-title text-2xl md:text-3xl lg:text-4xl text-white mb-3 group-hover:text-green-300 transition-colors duration-300">
              {article.titleFr}
            </h2>
            <p className="text-white/80 text-base md:text-lg max-w-3xl line-clamp-2 mb-4">
              {article.summaryFr}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>{article.author}</span>
              <span>•</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300" />
        </div>
      </Link>
    </motion.div>
  );
}

// Category Filter Component
function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange
}: {
  categories: { name: string; count: number }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex flex-wrap items-center gap-2 mb-8"
    >
      <div className="flex items-center gap-2 mr-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">Filtrer :</span>
      </div>

      {/* All button */}
      <button
        onClick={() => onCategoryChange("all")}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
          activeCategory === "all"
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
        )}
      >
        Tous
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          activeCategory === "all" ? "bg-primary-foreground/20" : "bg-background"
        )}>
          {totalCount}
        </span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onCategoryChange(cat.name)}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            activeCategory === cat.name
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{categoryIcons[cat.name]}</span>
          <span className="hidden sm:inline">{cat.name}</span>
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded-full",
            activeCategory === cat.name ? "bg-primary-foreground/20" : "bg-background"
          )}>
            {cat.count}
          </span>
        </button>
      ))}
    </motion.div>
  );
}

// Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex items-center justify-center gap-2 mt-10"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
          currentPage === 1
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-muted hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200",
            page === currentPage
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
          currentPage === totalPages
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-muted hover:bg-primary hover:text-primary-foreground"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// Popular Articles Sidebar
function PopularArticlesSidebar({ articles }: {
  articles: Array<{
    slug: string;
    titleFr: string;
    imageUrl: string;
    publishedAt: Date | string;
    views: number;
    category: string;
  }>;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="lg:sticky lg:top-24"
    >
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="font-bold text-foreground">Articles populaires</h3>
        </div>

        <div className="space-y-4">
          {articles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link href={`/articles/${article.slug}`} className="group flex gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.titleFr}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{categoryIcons[article.category]}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.views.toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

// Main ArticlesList Component
export default function ArticlesList() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Queries
  const categoriesQuery = trpc.article.getCategories.useQuery();
  const featuredQuery = trpc.article.getFeatured.useQuery();
  const popularQuery = trpc.article.getPopular.useQuery({ limit: 5 });
  const articlesQuery = trpc.article.getAll.useQuery({
    category: activeCategory,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    excludeFeatured: true,
  });

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Skeleton loaders
  const FeaturedSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[21/9] md:aspect-[21/8] animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
        <div className="h-8 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-5 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </div>
  );

  const ArticleCardSkeleton = () => (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-5 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </div>
  );

  const SidebarSkeleton = () => (
    <div className="bg-card rounded-xl border border-border p-5 animate-pulse">
      <div className="h-6 bg-muted rounded w-1/2 mb-5" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background article-noise">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <TrendingUp className="w-4 h-4" />
            Analyses d&apos;experts
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="article-title text-3xl md:text-4xl lg:text-5xl mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400">
              Nos Analyses
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
          >
            Décryptage des enjeux climatiques actuels, basé sur les dernières données scientifiques et les recommandations du GIEC.
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground mb-8"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>{articlesQuery.data?.pagination.total || '...'} articles publiés</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-green-500" />
            <span>100% vérifiés scientifiquement</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Featured Article */}
        {featuredQuery.isLoading ? (
          <FeaturedSkeleton />
        ) : featuredQuery.data && activeCategory === "all" && currentPage === 1 ? (
          <FeaturedArticleCard article={featuredQuery.data} />
        ) : null}

        {/* Category Filters */}
        {categoriesQuery.data && (
          <div className="mt-10">
            <CategoryFilter
              categories={categoriesQuery.data}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {articlesQuery.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            ) : articlesQuery.data && articlesQuery.data.articles.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCategory}-${currentPage}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={containerVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                  >
                    {articlesQuery.data.articles.map((article, index) => (
                      <motion.div key={article.id} variants={itemVariants}>
                        <div className="relative">
                          {/* Category badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm border border-white/10">
                              {categoryIcons[article.category]}
                            </span>
                          </div>
                          <ArticlePageCard
                            id={article.id}
                            slug={article.slug}
                            title={article.titleFr}
                            summary={article.summaryFr}
                            imageUrl={article.imageUrl}
                            publishedAt={new Date(article.publishedAt)}
                            author={article.author}
                            views={article.views}
                            index={index}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <Pagination
                  currentPage={articlesQuery.data.pagination.page}
                  totalPages={articlesQuery.data.pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucun article dans cette catégorie
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Essayez une autre catégorie ou revenez bientôt pour découvrir nos nouvelles publications.
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {popularQuery.isLoading ? (
              <SidebarSkeleton />
            ) : popularQuery.data && (
              <PopularArticlesSidebar articles={popularQuery.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
