'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types de réactions disponibles
export type ReactionType = 'alarming' | 'enlightening' | 'motivating';

interface Reaction {
  type: ReactionType;
  emoji: string;
  label: string;
  labelFr: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  activeGlow: string;
}

// Configuration des réactions
export const reactions: Record<ReactionType, Reaction> = {
  alarming: {
    type: 'alarming',
    emoji: '😱',
    label: 'Alarming',
    labelFr: 'Alarmant',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    hoverBg: 'hover:bg-red-100 dark:hover:bg-red-900/40',
    activeGlow: 'shadow-red-500/30',
  },
  enlightening: {
    type: 'enlightening',
    emoji: '💡',
    label: 'Enlightening',
    labelFr: 'Éclairant',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
    activeGlow: 'shadow-amber-500/30',
  },
  motivating: {
    type: 'motivating',
    emoji: '💪',
    label: 'Motivating',
    labelFr: 'Motivant',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/40',
    activeGlow: 'shadow-green-500/30',
  },
};

// Hook pour gérer les réactions avec localStorage
function useArticleReactions(articleSlug: string) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({
    alarming: 0,
    enlightening: 0,
    motivating: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les réactions depuis localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Récupérer la réaction de l'utilisateur pour cet article
    const savedReactions = localStorage.getItem('article-reactions');
    const userReactions: Record<string, ReactionType> = savedReactions
      ? JSON.parse(savedReactions)
      : {};

    if (userReactions[articleSlug]) {
      setUserReaction(userReactions[articleSlug]);
    }

    // Récupérer les compteurs globaux (simulés pour demo, normalement côté serveur)
    const savedCounts = localStorage.getItem('article-reaction-counts');
    const counts: Record<string, Record<ReactionType, number>> = savedCounts
      ? JSON.parse(savedCounts)
      : {};

    if (counts[articleSlug]) {
      setReactionCounts(counts[articleSlug]);
    } else {
      // Générer des compteurs aléatoires pour la démo
      setReactionCounts({
        alarming: Math.floor(Math.random() * 50) + 10,
        enlightening: Math.floor(Math.random() * 80) + 20,
        motivating: Math.floor(Math.random() * 60) + 15,
      });
    }

    setIsLoaded(true);
  }, [articleSlug]);

  // Sauvegarder la réaction
  const toggleReaction = useCallback((type: ReactionType) => {
    if (typeof window === 'undefined') return;

    // Récupérer l'état actuel
    const savedReactions = localStorage.getItem('article-reactions');
    const userReactions: Record<string, ReactionType> = savedReactions
      ? JSON.parse(savedReactions)
      : {};

    const savedCounts = localStorage.getItem('article-reaction-counts');
    const allCounts: Record<string, Record<ReactionType, number>> = savedCounts
      ? JSON.parse(savedCounts)
      : {};

    if (!allCounts[articleSlug]) {
      allCounts[articleSlug] = { ...reactionCounts };
    }

    const previousReaction = userReactions[articleSlug];

    if (previousReaction === type) {
      // Retirer la réaction
      delete userReactions[articleSlug];
      allCounts[articleSlug][type] = Math.max(0, allCounts[articleSlug][type] - 1);
      setUserReaction(null);
    } else {
      // Retirer l'ancienne réaction si elle existe
      if (previousReaction) {
        allCounts[articleSlug][previousReaction] = Math.max(0, allCounts[articleSlug][previousReaction] - 1);
      }
      // Ajouter la nouvelle réaction
      userReactions[articleSlug] = type;
      allCounts[articleSlug][type] = (allCounts[articleSlug][type] || 0) + 1;
      setUserReaction(type);
    }

    // Sauvegarder
    localStorage.setItem('article-reactions', JSON.stringify(userReactions));
    localStorage.setItem('article-reaction-counts', JSON.stringify(allCounts));
    setReactionCounts(allCounts[articleSlug]);
  }, [articleSlug, reactionCounts]);

  return { userReaction, reactionCounts, toggleReaction, isLoaded };
}

interface ArticleReactionsProps {
  articleSlug: string;
  variant?: 'default' | 'compact' | 'floating';
  className?: string;
}

export function ArticleReactions({
  articleSlug,
  variant = 'default',
  className
}: ArticleReactionsProps) {
  const { userReaction, reactionCounts, toggleReaction, isLoaded } = useArticleReactions(articleSlug);
  const [animatingReaction, setAnimatingReaction] = useState<ReactionType | null>(null);

  const handleClick = (type: ReactionType) => {
    setAnimatingReaction(type);
    toggleReaction(type);
    setTimeout(() => setAnimatingReaction(null), 300);
  };

  if (!isLoaded) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {Object.values(reactions).map((reaction) => (
          <div
            key={reaction.type}
            className="h-10 w-20 rounded-full bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {Object.values(reactions).map((reaction) => {
          const isActive = userReaction === reaction.type;
          const count = reactionCounts[reaction.type];

          return (
            <motion.button
              key={reaction.type}
              onClick={() => handleClick(reaction.type)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200",
                "border",
                isActive
                  ? `${reaction.bgColor} ${reaction.color} border-current shadow-md ${reaction.activeGlow}`
                  : "bg-muted/50 text-muted-foreground border-transparent hover:border-muted-foreground/20"
              )}
              title={reaction.labelFr}
            >
              <span className="text-sm">{reaction.emoji}</span>
              <span className="font-medium">{count}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-background/80 backdrop-blur-md border border-border shadow-xl",
        className
      )}>
        <span className="text-xs text-muted-foreground mr-1">Réagir :</span>
        {Object.values(reactions).map((reaction) => {
          const isActive = userReaction === reaction.type;
          const count = reactionCounts[reaction.type];

          return (
            <motion.button
              key={reaction.type}
              onClick={() => handleClick(reaction.type)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                isActive
                  ? `${reaction.bgColor} ${reaction.color} shadow-md ${reaction.activeGlow}`
                  : `${reaction.hoverBg} text-muted-foreground`
              )}
              title={reaction.labelFr}
            >
              <AnimatePresence>
                {animatingReaction === reaction.type && (
                  <motion.span
                    initial={{ scale: 1, opacity: 1, y: 0 }}
                    animate={{ scale: 2, opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-lg"
                  >
                    {reaction.emoji}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-base">{reaction.emoji}</span>
              <span className="font-medium">{count}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "flex flex-col items-center gap-4 p-6 rounded-2xl",
      "bg-muted/30 border border-border/50",
      className
    )}>
      <h3 className="text-sm font-medium text-muted-foreground">
        Qu&apos;avez-vous ressenti en lisant cet article ?
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {Object.values(reactions).map((reaction) => {
          const isActive = userReaction === reaction.type;
          const count = reactionCounts[reaction.type];

          return (
            <motion.button
              key={reaction.type}
              onClick={() => handleClick(reaction.type)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative flex flex-col items-center gap-1.5 px-6 py-4 rounded-xl",
                "border-2 transition-all duration-300",
                isActive
                  ? `${reaction.bgColor} ${reaction.color} border-current shadow-lg ${reaction.activeGlow}`
                  : `bg-background border-border/50 ${reaction.hoverBg} hover:border-muted-foreground/30`
              )}
            >
              <AnimatePresence>
                {animatingReaction === reaction.type && (
                  <motion.span
                    initial={{ scale: 1, opacity: 1, y: 0 }}
                    animate={{ scale: 3, opacity: 0, y: -30 }}
                    exit={{ opacity: 0 }}
                    className="absolute text-2xl"
                  >
                    {reaction.emoji}
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="text-3xl">{reaction.emoji}</span>
              <span className={cn(
                "text-sm font-medium",
                isActive ? reaction.color : "text-foreground"
              )}>
                {reaction.labelFr}
              </span>
              <span className={cn(
                "text-xs",
                isActive ? "opacity-80" : "text-muted-foreground"
              )}>
                {count} réactions
              </span>
            </motion.button>
          );
        })}
      </div>

      {userReaction && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground"
        >
          Merci pour votre réaction !
        </motion.p>
      )}
    </div>
  );
}

// Export du hook pour utilisation externe si nécessaire
export { useArticleReactions };
