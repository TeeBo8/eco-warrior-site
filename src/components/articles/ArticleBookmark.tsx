'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Types
interface BookmarkedArticle {
  slug: string;
  title: string;
  imageUrl?: string;
  savedAt: string;
}

interface BookmarksContextType {
  bookmarks: BookmarkedArticle[];
  isBookmarked: (slug: string) => boolean;
  toggleBookmark: (article: { slug: string; title: string; imageUrl?: string }) => void;
  removeBookmark: (slug: string) => void;
  clearAll: () => void;
  isLoaded: boolean;
}

// Context
const BookmarksContext = createContext<BookmarksContextType | null>(null);

// Provider
export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les bookmarks depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('article-bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {
        setBookmarks([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder les bookmarks
  const saveBookmarks = useCallback((newBookmarks: BookmarkedArticle[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem('article-bookmarks', JSON.stringify(newBookmarks));
  }, []);

  const isBookmarked = useCallback((slug: string) => {
    return bookmarks.some(b => b.slug === slug);
  }, [bookmarks]);

  const toggleBookmark = useCallback((article: { slug: string; title: string; imageUrl?: string }) => {
    const exists = bookmarks.find(b => b.slug === article.slug);

    if (exists) {
      saveBookmarks(bookmarks.filter(b => b.slug !== article.slug));
    } else {
      saveBookmarks([
        ...bookmarks,
        {
          slug: article.slug,
          title: article.title,
          imageUrl: article.imageUrl,
          savedAt: new Date().toISOString(),
        }
      ]);
    }
  }, [bookmarks, saveBookmarks]);

  const removeBookmark = useCallback((slug: string) => {
    saveBookmarks(bookmarks.filter(b => b.slug !== slug));
  }, [bookmarks, saveBookmarks]);

  const clearAll = useCallback(() => {
    saveBookmarks([]);
  }, [saveBookmarks]);

  return (
    <BookmarksContext.Provider value={{
      bookmarks,
      isBookmarked,
      toggleBookmark,
      removeBookmark,
      clearAll,
      isLoaded,
    }}>
      {children}
    </BookmarksContext.Provider>
  );
}

// Hook
export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) {
    // Fallback pour les composants qui ne sont pas wrappés dans le provider
    // On retourne un état vide mais fonctionnel
    return {
      bookmarks: [],
      isBookmarked: () => false,
      toggleBookmark: () => {},
      removeBookmark: () => {},
      clearAll: () => {},
      isLoaded: false,
    };
  }
  return context;
}

// Composant bouton bookmark
interface BookmarkButtonProps {
  article: {
    slug: string;
    title: string;
    imageUrl?: string;
  };
  variant?: 'default' | 'ghost' | 'card';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function BookmarkButton({
  article,
  variant = 'default',
  size = 'md',
  showLabel = false,
  className
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, isLoaded } = useBookmarks();
  const [isAnimating, setIsAnimating] = useState(false);
  const bookmarked = isBookmarked(article.slug);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleBookmark(article);
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isLoaded) {
    return (
      <div className={cn(
        "animate-pulse bg-muted rounded-full",
        size === 'sm' && "w-7 h-7",
        size === 'md' && "w-9 h-9",
        size === 'lg' && "w-11 h-11",
        className
      )} />
    );
  }

  const sizes = {
    sm: { button: "w-7 h-7", icon: "w-3.5 h-3.5", text: "text-xs" },
    md: { button: "w-9 h-9", icon: "w-4 h-4", text: "text-sm" },
    lg: { button: "w-11 h-11", icon: "w-5 h-5", text: "text-base" },
  };

  const variants = {
    default: cn(
      "rounded-full transition-all duration-200",
      bookmarked
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
    ),
    ghost: cn(
      "rounded-full transition-all duration-200 bg-transparent",
      bookmarked
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    ),
    card: cn(
      "rounded-full transition-all duration-200",
      bookmarked
        ? "bg-primary/90 text-white shadow-lg"
        : "bg-black/50 backdrop-blur-sm text-white/80 hover:bg-black/70 border border-white/10"
    ),
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5",
        sizes[size].button,
        variants[variant],
        showLabel && "w-auto px-3",
        className
      )}
      title={bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-label={bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <AnimatePresence mode="wait">
        {bookmarked ? (
          <motion.div
            key="bookmarked"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <BookmarkCheck className={sizes[size].icon} />
          </motion.div>
        ) : (
          <motion.div
            key="not-bookmarked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Bookmark className={sizes[size].icon} />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className={sizes[size].text}>
          {bookmarked ? "Sauvegardé" : "Sauvegarder"}
        </span>
      )}

      {/* Animation de particules quand on bookmark */}
      <AnimatePresence>
        {isAnimating && bookmarked && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [1, 0],
                  opacity: [1, 0],
                  x: [0, (Math.random() - 0.5) * 40],
                  y: [0, (Math.random() - 0.5) * 40],
                }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className="absolute w-1 h-1 rounded-full bg-primary"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Liste des bookmarks (sidebar ou page)
interface BookmarksListProps {
  variant?: 'sidebar' | 'page' | 'dropdown';
  maxItems?: number;
  className?: string;
}

export function BookmarksList({
  variant = 'sidebar',
  maxItems,
  className
}: BookmarksListProps) {
  const { bookmarks, removeBookmark, clearAll, isLoaded } = useBookmarks();

  if (!isLoaded) {
    return (
      <div className={cn("space-y-3 animate-pulse", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  const displayedBookmarks = maxItems ? bookmarks.slice(0, maxItems) : bookmarks;

  if (bookmarks.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-8 text-center",
        className
      )}>
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Bookmark className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Aucun article sauvegardé
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Cliquez sur le bouton favori pour sauvegarder des articles
        </p>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn("space-y-1", className)}>
        {displayedBookmarks.map((bookmark) => (
          <div
            key={bookmark.slug}
            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Link
              href={`/articles/${bookmark.slug}`}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {bookmark.title}
              </p>
            </Link>
            <button
              onClick={() => removeBookmark(bookmark.slug)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded transition-all"
              title="Retirer"
            >
              <X className="w-3.5 h-3.5 text-destructive" />
            </button>
          </div>
        ))}

        {bookmarks.length > (maxItems || 0) && maxItems && (
          <Link
            href="/articles/bookmarks"
            className="block text-center text-xs text-primary hover:underline py-2"
          >
            Voir tous ({bookmarks.length})
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">
            Mes favoris ({bookmarks.length})
          </h3>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2">
        {displayedBookmarks.map((bookmark, index) => (
          <motion.div
            key={bookmark.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-card rounded-lg border border-border p-3 hover:border-primary/30 transition-colors"
          >
            <Link
              href={`/articles/${bookmark.slug}`}
              className="block"
            >
              <p className="text-sm font-medium text-foreground line-clamp-2 pr-6 group-hover:text-primary transition-colors">
                {bookmark.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sauvegardé {new Date(bookmark.savedAt).toLocaleDateString('fr-FR')}
              </p>
            </Link>

            {/* Remove button */}
            <button
              onClick={() => removeBookmark(bookmark.slug)}
              className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded-full transition-all"
              title="Retirer des favoris"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* See more */}
      {bookmarks.length > (maxItems || 0) && maxItems && variant === 'sidebar' && (
        <Link
          href="/articles?tab=bookmarks"
          className="block text-center text-sm text-primary hover:underline py-2"
        >
          Voir tous les favoris
        </Link>
      )}
    </div>
  );
}
