'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { trpc } from "@/app/_trpc/client";
import { getSessionId, getOrCreateSession } from "@/lib/anonymous-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FlaskConical,
  Zap,
  Lightbulb,
  TrendingUp,
  BookOpen,
  GraduationCap,
  Trophy,
  ThumbsUp,
  Bookmark,
  BookmarkCheck,
  Eye,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  Link2,
  Share2,
  Twitter,
  Facebook,
  Copy,
  Check,
  ArrowRight,
  Brain,
  GitCompare,
  CheckCircle2,
  Circle,
  HelpCircle,
  RotateCcw,
  Award
} from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/comment-section";
import { cn } from "@/lib/utils";
import { MythStatsCharts } from "@/components/debunk/myth-stats-charts";
import { SourcesMethodology } from "@/components/debunk/sources-methodology";
import { ProposeMythForm } from "@/components/debunk/propose-myth-form";
import { NewsletterCTA } from "@/components/debunk/newsletter-cta";

// Types
interface SourceItem {
  name: string;
  url?: string;
}

type Post = {
  id: number;
  mythFr: string;
  realityFr: string;
  mythEn: string;
  realityEn: string;
  source?: string | null;
  likes: number;
  isLiked?: boolean;
  // Nouveaux champs Phase M2
  category?: string | null;
  difficulty?: string | null;
  shortExplanation?: string | null;
  keyFacts?: string | null; // JSON stringifié
  sources?: string | null; // JSON stringifié
  relatedMyths?: string | null; // JSON stringifié
};

type Category = 'all' | 'science' | 'energie' | 'solutions' | 'economie';
type Difficulty = 'all' | 'debutant' | 'intermediaire' | 'avance';

// Configuration des catégories
const CATEGORIES: { id: Category; label: string; icon: typeof FlaskConical; color: string }[] = [
  { id: 'all', label: 'Tous', icon: Filter, color: 'bg-gray-500' },
  { id: 'science', label: 'Science', icon: FlaskConical, color: 'bg-blue-500' },
  { id: 'energie', label: 'Énergie', icon: Zap, color: 'bg-yellow-500' },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb, color: 'bg-green-500' },
  { id: 'economie', label: 'Économie', icon: TrendingUp, color: 'bg-purple-500' },
];

const DIFFICULTIES: { id: Difficulty; label: string; icon: typeof BookOpen; color: string }[] = [
  { id: 'all', label: 'Tous niveaux', icon: Filter, color: 'text-gray-500' },
  { id: 'debutant', label: 'Débutant', icon: BookOpen, color: 'text-green-500' },
  { id: 'intermediaire', label: 'Intermédiaire', icon: GraduationCap, color: 'text-yellow-500' },
  { id: 'avance', label: 'Avancé', icon: Trophy, color: 'text-red-500' },
];

// Helpers pour parser les données JSON de la BDD
const parseKeyFacts = (keyFacts: string | null | undefined): string[] => {
  if (!keyFacts) return [];
  try {
    return JSON.parse(keyFacts);
  } catch {
    return [];
  }
};

const parseSources = (sources: string | null | undefined): SourceItem[] => {
  if (!sources) return [];
  try {
    return JSON.parse(sources);
  } catch {
    return [];
  }
};

// Parse les IDs de mythes connexes
const parseRelatedMyths = (relatedMyths: string | null | undefined): number[] => {
  if (!relatedMyths) return [];
  try {
    return JSON.parse(relatedMyths);
  } catch {
    return [];
  }
};

// Récupère la catégorie depuis la BDD ou fallback intelligent
const getCategoryForPost = (post: Post): Category => {
  if (post.category && ['science', 'energie', 'solutions', 'economie'].includes(post.category)) {
    return post.category as Category;
  }
  // Fallback si pas de catégorie en BDD
  const myth = post.mythFr.toLowerCase();
  if (myth.includes('soleil') || myth.includes('scientifique') || myth.includes('consensus') || myth.includes('température') || myth.includes('modèle') || myth.includes('climatolog')) return 'science';
  if (myth.includes('nucléaire') || myth.includes('énergie') || myth.includes('éolien') || myth.includes('solaire') || myth.includes('renouvelable')) return 'energie';
  if (myth.includes('économi') || myth.includes('coût') || myth.includes('emploi') || myth.includes('prix') || myth.includes('PIB')) return 'economie';
  return 'solutions';
};

// Récupère la difficulté depuis la BDD ou fallback
const getDifficultyForPost = (post: Post): Difficulty => {
  if (post.difficulty && ['debutant', 'intermediaire', 'avance'].includes(post.difficulty)) {
    return post.difficulty as Difficulty;
  }
  // Fallback si pas de difficulté en BDD
  const length = post.realityFr.length;
  if (length < 300) return 'debutant';
  if (length < 600) return 'intermediaire';
  return 'avance';
};

// Hook pour la progression utilisateur (localStorage)
function useUserProgress() {
  const [readMyths, setReadMyths] = useState<Set<number>>(new Set());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('eco-debunk-progress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReadMyths(new Set(data.readMyths || []));
        setFavorites(new Set(data.favorites || []));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const saveProgress = useCallback((newRead: Set<number>, newFavorites: Set<number>) => {
    localStorage.setItem('eco-debunk-progress', JSON.stringify({
      readMyths: Array.from(newRead),
      favorites: Array.from(newFavorites),
    }));
  }, []);

  const markAsRead = useCallback((id: number) => {
    setReadMyths(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      saveProgress(newSet, favorites);
      return newSet;
    });
  }, [favorites, saveProgress]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      saveProgress(readMyths, newSet);
      return newSet;
    });
  }, [readMyths, saveProgress]);

  return { readMyths, favorites, markAsRead, toggleFavorite };
}

// Composant Hero Section
function HeroSection({ totalMyths, totalSources, readCount }: { totalMyths: number; totalSources: number; readCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 mb-8 text-white"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-4"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium text-green-100">La science contre les idées reçues</span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Mythes & Réalités
        </h1>
        <p className="text-lg text-green-100 max-w-2xl mb-8">
          Des faits scientifiques solides pour démonter les idées reçues sur le changement climatique.
          Basé sur le GIEC, Jean-Marc Jancovici et les organismes scientifiques reconnus.
        </p>

        {/* Stats dynamiques */}
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold">{totalMyths}</div>
            <div className="text-sm text-green-100">Mythes démontés</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold">{totalSources}</div>
            <div className="text-sm text-green-100">Sources fiables</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
          >
            <div className="text-3xl font-bold">{readCount}</div>
            <div className="text-sm text-green-100">Mythes lus</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Composant Search Bar
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative mb-6"
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher un mythe..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-10 h-12 text-lg rounded-xl border-2 focus:border-green-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </motion.div>
  );
}

// Composant Filtres
function Filters({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  showFilters,
  setShowFilters
}: {
  category: Category;
  setCategory: (c: Category) => void;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  showFilters: boolean;
  setShowFilters: (s: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      {/* Toggle filtres sur mobile */}
      <Button
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
      </Button>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden md:!h-auto md:!opacity-100"
          >
            {/* Filtres par catégorie */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Catégorie</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = category === cat.id;
                  return (
                    <Button
                      key={cat.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "transition-all",
                        isActive && cat.id !== 'all' && cat.color.replace('bg-', 'bg-')
                      )}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Filtres par difficulté */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Niveau</p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((diff) => {
                  const Icon = diff.icon;
                  const isActive = difficulty === diff.id;
                  return (
                    <Button
                      key={diff.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDifficulty(diff.id)}
                    >
                      <Icon className={cn("h-4 w-4 mr-1", !isActive && diff.color)} />
                      {diff.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Highlight du texte recherché
function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>;

  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Card améliorée
function MythCard({
  post,
  search,
  isRead,
  isFavorite,
  onRead,
  onToggleFavorite,
  index,
  allPosts,
  onOpenMyth,
  forceOpen,
  onForceOpenHandled,
  compareMode,
  isSelectedForCompare,
  onToggleCompare
}: {
  post: Post;
  search: string;
  isRead: boolean;
  isFavorite: boolean;
  onRead: () => void;
  onToggleFavorite: () => void;
  index: number;
  allPosts: Post[];
  onOpenMyth: (id: number) => void;
  forceOpen?: boolean;
  onForceOpenHandled?: () => void;
  compareMode?: boolean;
  isSelectedForCompare?: boolean;
  onToggleCompare?: () => void;
}) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Ouvrir automatiquement si forceOpen est true
  useEffect(() => {
    if (forceOpen && !isOpen) {
      setIsOpen(true);
      onRead();
      onForceOpenHandled?.();
    }
  }, [forceOpen, isOpen, onRead, onForceOpenHandled]);
  const [hasLearned, setHasLearned] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLikeMutation = trpc.post.toggleLike.useMutation();

  // Mythes connexes
  const relatedMythIds = parseRelatedMyths(post.relatedMyths);
  const relatedMyths = allPosts.filter(p => relatedMythIds.includes(p.id));

  const category = getCategoryForPost(post);
  const difficulty = getDifficultyForPost(post);
  const categoryConfig = CATEGORIES.find(c => c.id === category)!;
  const difficultyConfig = DIFFICULTIES.find(d => d.id === difficulty)!;

  // Preview du texte - utilise shortExplanation si disponible, sinon fallback
  const preview = post.shortExplanation || (post.realityFr.slice(0, 120) + (post.realityFr.length > 120 ? '...' : ''));

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    getOrCreateSession();
    const sessionId = getSessionId();
    if (!sessionId) return;

    setIsLiking(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikeMutation.mutateAsync({ postId: post.id, sessionId });
    } catch {
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      onRead();
    }
  };

  // Partage social
  const shareText = `${post.mythFr} ? C'est FAUX ! Découvrez la réalité scientifique sur Eco Warrior.`;
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/debunk` : '';

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  // Bouton "J'ai appris quelque chose" - analytics
  const handleLearned = () => {
    setHasLearned(true);
    // Track l'événement (peut être étendu avec analytics)
    if (typeof window !== 'undefined') {
      const learnedMyths = JSON.parse(localStorage.getItem('eco-debunk-learned') || '[]');
      if (!learnedMyths.includes(post.id)) {
        learnedMyths.push(post.id);
        localStorage.setItem('eco-debunk-learned', JSON.stringify(learnedMyths));
      }
    }
  };

  // Ouvrir un mythe connexe
  const handleOpenRelated = (mythId: number) => {
    setIsOpen(false);
    setTimeout(() => onOpenMyth(mythId), 100);
  };

  // En mode comparaison, cliquer sur la carte sélectionne/désélectionne
  const handleCardClick = () => {
    if (compareMode) {
      onToggleCompare?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={compareMode}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={compareMode ? handleCardClick : undefined}
        >
          <Card className={cn(
            "flex flex-col h-full transition-all border-2 relative",
            compareMode
              ? isSelectedForCompare
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30"
                : "hover:border-blue-300 cursor-pointer"
              : "hover:border-green-500 hover:shadow-lg cursor-pointer",
            isRead && !compareMode && "bg-muted/30"
          )}>
            {/* Bouton de sélection en mode comparaison */}
            {compareMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare?.();
                }}
                className={cn(
                  "absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all",
                  isSelectedForCompare
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 border-2 border-gray-300 hover:border-blue-500"
                )}
              >
                {isSelectedForCompare ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
            <CardHeader className="pb-2">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className={cn("text-white", categoryConfig.color)}>
                  <categoryConfig.icon className="h-3 w-3 mr-1" />
                  {categoryConfig.label}
                </Badge>
                <Badge variant="outline" className={difficultyConfig.color}>
                  <difficultyConfig.icon className="h-3 w-3 mr-1" />
                  {difficultyConfig.label}
                </Badge>
                {isRead && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Eye className="h-3 w-3 mr-1" />
                    Lu
                  </Badge>
                )}
              </div>

              <CardTitle className="text-lg leading-tight">
                <HighlightText text={post.mythFr} search={search} />
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">
                <HighlightText text={preview} search={search} />
              </p>
            </CardContent>

            <CardFooter className="mt-auto flex justify-between items-center bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors rounded-md px-2 py-1",
                    "hover:bg-green-100 dark:hover:bg-green-900/30",
                    isLiked ? "text-green-600" : "text-muted-foreground"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
                  <span className="font-medium text-sm">{likeCount}</span>
                </button>

                <button
                  onClick={handleFavorite}
                  className={cn(
                    "flex items-center gap-1 transition-colors rounded-md p-1.5",
                    "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
                    isFavorite ? "text-yellow-600" : "text-muted-foreground"
                  )}
                >
                  {isFavorite ? (
                    <BookmarkCheck className="h-4 w-4 fill-current" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>

              <span className="text-xs text-muted-foreground">Cliquer pour lire</span>
            </CardFooter>
          </Card>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-6 border-b">
          <DialogHeader>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className={cn("text-white", categoryConfig.color)}>
                <categoryConfig.icon className="h-3 w-3 mr-1" />
                {categoryConfig.label}
              </Badge>
              <Badge variant="outline" className={difficultyConfig.color}>
                <difficultyConfig.icon className="h-3 w-3 mr-1" />
                {difficultyConfig.label}
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <span className="text-xl">💭</span>
              </div>
              <div>
                <DialogTitle className="text-red-600 dark:text-red-400 text-sm font-medium uppercase tracking-wide">
                  Le Mythe
                </DialogTitle>
                <p className="text-lg font-semibold mt-1 text-foreground">{post.mythFr}</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Corps de la modal */}
        <div className="p-6 space-y-6">
          {/* Section Réalité */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-5 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div className="flex-1">
                <h4 className="text-green-700 dark:text-green-400 text-sm font-medium uppercase tracking-wide mb-2">
                  La Réalité Scientifique
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {post.realityFr}
                </p>
              </div>
            </div>
          </div>

          {/* Key Facts - Points clés avec numéros */}
          {parseKeyFacts(post.keyFacts).length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 p-5 rounded-xl border border-purple-200 dark:border-purple-800">
              <h5 className="font-semibold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Sparkles className="h-4 w-4" />
                Points clés à retenir
              </h5>
              <div className="space-y-3">
                {parseKeyFacts(post.keyFacts).map((fact, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{i + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources multiples avec icônes */}
          {parseSources(post.sources).length > 0 ? (
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
              <h5 className="font-semibold text-slate-700 dark:text-slate-400 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Sources scientifiques
              </h5>
              <div className="grid gap-2">
                {parseSources(post.sources).map((src, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:underline transition-colors"
                      >
                        {src.name} ↗
                      </a>
                    ) : (
                      <span className="text-sm text-slate-600 dark:text-slate-400">{src.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : post.source && (
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <strong>Source:</strong> {post.source}
            </div>
          )}

          {/* Actions principales */}
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={cn(
              "flex items-center gap-2 transition-colors rounded-md px-3 py-2",
              "hover:bg-green-100 dark:hover:bg-green-900/30 border",
              isLiked ? "text-green-600 border-green-600" : "text-muted-foreground border-muted"
            )}
          >
            <ThumbsUp className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="font-bold">{likeCount} approbations</span>
          </button>

          <button
            onClick={handleFavorite}
            className={cn(
              "flex items-center gap-2 transition-colors rounded-md px-3 py-2 border",
              "hover:bg-yellow-100 dark:hover:bg-yellow-900/30",
              isFavorite ? "text-yellow-600 border-yellow-600" : "text-muted-foreground border-muted"
            )}
          >
            {isFavorite ? (
              <BookmarkCheck className="h-5 w-5 fill-current" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
            <span className="font-medium">{isFavorite ? 'Favori' : 'Ajouter aux favoris'}</span>
          </button>

          {/* Bouton J'ai appris quelque chose */}
          <button
            onClick={handleLearned}
            disabled={hasLearned}
            className={cn(
              "flex items-center gap-2 transition-all rounded-md px-3 py-2 border",
              hasLearned
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 border-purple-600"
                : "hover:bg-purple-100 dark:hover:bg-purple-900/30 text-muted-foreground border-muted"
            )}
          >
            <Brain className={cn("h-5 w-5", hasLearned && "fill-current")} />
            <span className="font-medium">
              {hasLearned ? 'Merci !' : "J'ai appris quelque chose"}
            </span>
          </button>
        </div>

        {/* Partage social */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Partager ce debunk
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600 dark:hover:bg-sky-900/30"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 dark:hover:bg-blue-900/30"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('copy')}
              className={cn(
                "flex items-center gap-2",
                copied && "bg-green-50 border-green-500 text-green-600"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié !' : 'Copier'}
            </Button>
          </div>
        </div>

        {/* Mythes connexes */}
        {relatedMyths.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Mythes connexes à explorer
            </p>
            <div className="grid gap-2">
              {relatedMyths.slice(0, 3).map((related) => {
                const relatedCategory = getCategoryForPost(related);
                const relatedCategoryConfig = CATEGORIES.find(c => c.id === relatedCategory)!;
                return (
                  <button
                    key={related.id}
                    onClick={() => handleOpenRelated(related.id)}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={cn("text-white text-xs", relatedCategoryConfig.color)}>
                        <relatedCategoryConfig.icon className="h-3 w-3" />
                      </Badge>
                      <span className="text-sm font-medium line-clamp-1">{related.mythFr}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <CommentSection />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant de comparaison
function CompareModal({
  selectedMyths,
  onClose
}: {
  selectedMyths: Post[];
  onClose: () => void;
}) {
  return (
    <Dialog open={selectedMyths.length >= 2} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            Comparaison de {selectedMyths.length} mythes
          </DialogTitle>
        </DialogHeader>

        <div className={cn(
          "grid gap-4 mt-4",
          selectedMyths.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
        )}>
          {selectedMyths.map((myth) => {
            const cat = getCategoryForPost(myth);
            const catConfig = CATEGORIES.find(c => c.id === cat)!;
            const diff = getDifficultyForPost(myth);
            const diffConfig = DIFFICULTIES.find(d => d.id === diff)!;

            return (
              <div key={myth.id} className="border rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-4 border-b">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary" className={cn("text-white text-xs", catConfig.color)}>
                      <catConfig.icon className="h-3 w-3 mr-1" />
                      {catConfig.label}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", diffConfig.color)}>
                      {diffConfig.label}
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm">{myth.mythFr}</p>
                </div>

                {/* Réalité */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <h5 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
                    Réalité
                  </h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-6">
                    {myth.realityFr}
                  </p>
                </div>

                {/* Points clés */}
                {parseKeyFacts(myth.keyFacts).length > 0 && (
                  <div className="p-4 border-t">
                    <h5 className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-2">
                      Points clés
                    </h5>
                    <ul className="space-y-1">
                      {parseKeyFacts(myth.keyFacts).slice(0, 2).map((fact, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                          <span className="text-purple-500">•</span>
                          <span className="line-clamp-2">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer la comparaison
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant Quiz Mode
function QuizMode({
  posts,
  onClose
}: {
  posts: Post[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizMyths] = useState(() => {
    // Sélectionner 10 mythes aléatoires
    const shuffled = [...posts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, posts.length));
  });

  const currentMyth = quizMyths[currentIndex];
  const totalQuestions = quizMyths.length;

  const handleAnswer = (answer: boolean) => {
    // La bonne réponse est toujours FAUX (c'est un mythe donc c'est faux)
    const isCorrect = answer === false;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setAnswered(isCorrect);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setShowResult(true);
    } else {
      setCurrentIndex(i => i + 1);
      setAnswered(null);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(null);
    setShowResult(false);
  };

  if (!currentMyth) {
    return null;
  }

  const category = getCategoryForPost(currentMyth);
  const categoryConfig = CATEGORIES.find(c => c.id === category)!;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        {showResult ? (
          // Écran de résultat
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl mb-2">Quiz terminé !</DialogTitle>
            <p className="text-lg text-muted-foreground mb-4">
              Vous avez obtenu <span className="font-bold text-green-600">{score}</span> sur <span className="font-bold">{totalQuestions}</span>
            </p>
            <div className="w-full bg-muted rounded-full h-4 mb-6">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all"
                style={{ width: `${(score / totalQuestions) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {score === totalQuestions ? "🎉 Parfait ! Vous êtes un expert !" :
               score >= totalQuestions * 0.7 ? "👏 Excellent ! Vous maîtrisez bien le sujet." :
               score >= totalQuestions * 0.5 ? "👍 Pas mal ! Continuez à apprendre." :
               "📚 Continuez à explorer nos mythes pour progresser !"}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>
                Quitter
              </Button>
              <Button onClick={restartQuiz} className="bg-green-600 hover:bg-green-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Rejouer
              </Button>
            </div>
          </div>
        ) : (
          // Question
          <>
            <DialogHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className={cn("text-white", categoryConfig.color)}>
                  <categoryConfig.icon className="h-3 w-3 mr-1" />
                  {categoryConfig.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentIndex + 1}/{totalQuestions}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Cette affirmation est-elle vraie ou fausse ?
              </DialogTitle>
            </DialogHeader>

            <div className="my-6 p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 rounded-xl border">
              <p className="text-lg font-medium text-center">
                &quot;{currentMyth.mythFr}&quot;
              </p>
            </div>

            {answered === null ? (
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 h-14 text-lg hover:bg-green-50 hover:border-green-500 hover:text-green-700"
                  onClick={() => handleAnswer(true)}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Vrai
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 h-14 text-lg hover:bg-red-50 hover:border-red-500 hover:text-red-700"
                  onClick={() => handleAnswer(false)}
                >
                  <X className="h-5 w-5 mr-2" />
                  Faux
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-xl border-2",
                  answered
                    ? "bg-green-50 border-green-500 dark:bg-green-950/30"
                    : "bg-red-50 border-red-500 dark:bg-red-950/30"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {answered ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-400">Correct !</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-600" />
                        <span className="font-semibold text-red-700 dark:text-red-400">Incorrect</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    C&apos;est bien un <strong>mythe</strong> ! La réalité : {currentMyth.realityFr.slice(0, 150)}...
                  </p>
                </div>

                <Button onClick={nextQuestion} className="w-full bg-green-600 hover:bg-green-700">
                  {currentIndex + 1 >= totalQuestions ? 'Voir le résultat' : 'Question suivante'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-muted-foreground">
              <span>Score actuel : {score}/{currentIndex + (answered !== null ? 1 : 0)}</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Quitter le quiz
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Composant principal
export function DebunkContent() {
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Afficher les filtres par défaut sur desktop (après mount pour éviter erreur d'hydratation)
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setShowFilters(true);
    }
  }, []);

  const [openMythId, setOpenMythId] = useState<number | null>(null);

  // Mode comparaison
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Mode Quiz
  const [showQuiz, setShowQuiz] = useState(false);

  const { readMyths, favorites, markAsRead, toggleFavorite } = useUserProgress();

  // Fonction pour ouvrir un mythe par son ID (utilisé par les mythes connexes)
  const handleOpenMyth = useCallback((mythId: number) => {
    setOpenMythId(mythId);
  }, []);

  // Toggle sélection pour comparaison
  const toggleCompareSelection = useCallback((mythId: number) => {
    setSelectedForCompare(prev => {
      if (prev.includes(mythId)) {
        return prev.filter(id => id !== mythId);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 mythes
      }
      return [...prev, mythId];
    });
  }, []);

  // Quitter le mode comparaison
  const exitCompareMode = useCallback(() => {
    setCompareMode(false);
    setSelectedForCompare([]);
    setShowCompareModal(false);
  }, []);

  useEffect(() => {
    getOrCreateSession();
    setSessionId(getSessionId() ?? undefined);
  }, []);

  const postsQuery = trpc.post.getPosts.useQuery({ sessionId });

  // Filtrage des posts
  const filteredPosts = useMemo(() => {
    if (!postsQuery.data) return [];

    return postsQuery.data.filter(post => {
      // Recherche
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          post.mythFr.toLowerCase().includes(searchLower) ||
          post.realityFr.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Catégorie
      if (category !== 'all') {
        if (getCategoryForPost(post) !== category) return false;
      }

      // Difficulté
      if (difficulty !== 'all') {
        if (getDifficultyForPost(post) !== difficulty) return false;
      }

      return true;
    });
  }, [postsQuery.data, search, category, difficulty]);

  // Stats
  const totalMyths = postsQuery.data?.length || 0;
  const totalSources = postsQuery.data?.filter(p => p.source).length || 0;
  const readCount = readMyths.size;

  return (
    <div className="w-full">
      <main className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <HeroSection
          totalMyths={totalMyths}
          totalSources={totalSources}
          readCount={readCount}
        />

        {/* Boutons de mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <Button
            variant={compareMode ? "default" : "outline"}
            onClick={() => {
              if (compareMode) {
                exitCompareMode();
              } else {
                setCompareMode(true);
              }
            }}
            className={cn(
              compareMode && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            {compareMode ? 'Annuler comparaison' : 'Comparer des mythes'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowQuiz(true)}
            className="hover:bg-purple-50 hover:border-purple-500 hover:text-purple-700 dark:hover:bg-purple-900/30"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Quiz Vrai ou Faux
          </Button>
        </motion.div>

        {/* Barre d'action mode comparaison */}
        <AnimatePresence>
          {compareMode && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitCompare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">
                    {selectedForCompare.length === 0
                      ? 'Sélectionnez 2 à 3 mythes à comparer'
                      : `${selectedForCompare.length}/3 mythe${selectedForCompare.length > 1 ? 's' : ''} sélectionné${selectedForCompare.length > 1 ? 's' : ''}`
                    }
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedForCompare.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedForCompare([])}
                    >
                      Tout désélectionner
                    </Button>
                  )}
                  <Button
                    size="sm"
                    disabled={selectedForCompare.length < 2}
                    onClick={() => setShowCompareModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Comparer
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filtres */}
        <Filters
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Résultats */}
        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-4"
          >
            {filteredPosts.length} résultat{filteredPosts.length !== 1 ? 's' : ''} pour &quot;{search}&quot;
          </motion.p>
        )}

        {/* États de chargement */}
        {postsQuery.isLoading && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <FlaskConical className="h-8 w-8 text-green-600" />
            </motion.div>
            <p className="text-lg mt-4">Chargement des mythes...</p>
          </div>
        )}

        {postsQuery.error && (
          <div className="text-center py-12">
            <p className="text-red-500">Erreur: {postsQuery.error.message}</p>
          </div>
        )}

        {postsQuery.data && filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {search ? `Aucun résultat pour "${search}"` : 'Aucun mythe ne correspond aux filtres sélectionnés.'}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setCategory('all');
                setDifficulty('all');
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <MythCard
                key={post.id}
                post={post}
                search={search}
                isRead={readMyths.has(post.id)}
                isFavorite={favorites.has(post.id)}
                onRead={() => markAsRead(post.id)}
                onToggleFavorite={() => toggleFavorite(post.id)}
                index={index}
                allPosts={postsQuery.data || []}
                onOpenMyth={handleOpenMyth}
                forceOpen={openMythId === post.id}
                onForceOpenHandled={() => setOpenMythId(null)}
                compareMode={compareMode}
                isSelectedForCompare={selectedForCompare.includes(post.id)}
                onToggleCompare={() => toggleCompareSelection(post.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal de comparaison */}
      {showCompareModal && postsQuery.data && (
        <CompareModal
          selectedMyths={postsQuery.data.filter(p => selectedForCompare.includes(p.id))}
          onClose={exitCompareMode}
        />
      )}

      {/* Quiz Mode */}
      {showQuiz && postsQuery.data && (
        <QuizMode
          posts={postsQuery.data}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Sections Phase M4 */}
      {postsQuery.data && postsQuery.data.length > 0 && (
        <main className="container mx-auto px-4 space-y-12 pb-12">
          {/* Statistiques */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <MythStatsCharts
              posts={postsQuery.data}
              readCount={readMyths.size}
              totalLearned={typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('eco-debunk-learned') || '[]').length : 0}
            />
          </motion.section>

          {/* Proposer un mythe + Newsletter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <ProposeMythForm />
            <NewsletterCTA />
          </motion.section>

          {/* Sources & Méthodologie */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SourcesMethodology />
          </motion.section>
        </main>
      )}
    </div>
  );
}
