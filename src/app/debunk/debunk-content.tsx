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
  Sparkles
} from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/comment-section";
import { cn } from "@/lib/utils";

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

      <AnimatePresence>
        {(showFilters || typeof window !== 'undefined' && window.innerWidth >= 768) && (
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
  index
}: {
  post: Post;
  search: string;
  isRead: boolean;
  isFavorite: boolean;
  onRead: () => void;
  onToggleFavorite: () => void;
  index: number;
}) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleLikeMutation = trpc.post.toggleLike.useMutation();

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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className={cn(
            "flex flex-col cursor-pointer h-full transition-all border-2",
            "hover:border-green-500 hover:shadow-lg",
            isRead && "bg-muted/30"
          )}>
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

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary" className={cn("text-white", categoryConfig.color)}>
              <categoryConfig.icon className="h-3 w-3 mr-1" />
              {categoryConfig.label}
            </Badge>
            <Badge variant="outline" className={difficultyConfig.color}>
              <difficultyConfig.icon className="h-3 w-3 mr-1" />
              {difficultyConfig.label}
            </Badge>
          </div>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <span>💭</span> Mythe
          </DialogTitle>
          <p className="text-lg font-medium mt-2">{post.mythFr}</p>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-green-600 font-semibold text-lg flex items-center gap-2">
              <span>✅</span> Réalité
            </h4>
            <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed whitespace-pre-line">
              {post.realityFr}
            </p>
          </div>

          {/* Key Facts - Points clés */}
          {parseKeyFacts(post.keyFacts).length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Points clés
              </h5>
              <ul className="space-y-1.5">
                {parseKeyFacts(post.keyFacts).map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 mt-0.5">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources multiples */}
          {parseSources(post.sources).length > 0 ? (
            <div className="text-sm bg-muted p-4 rounded-lg">
              <strong className="text-foreground">Sources :</strong>
              <ul className="mt-2 space-y-1">
                {parseSources(post.sources).map((src, i) => (
                  <li key={i} className="text-muted-foreground">
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-600 hover:underline transition-colors"
                      >
                        {src.name} ↗
                      </a>
                    ) : (
                      src.name
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : post.source && (
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <strong>Source:</strong> {post.source}
            </div>
          )}
        </div>

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
        </div>

        <CommentSection />
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

  const { readMyths, favorites, markAsRead, toggleFavorite } = useUserProgress();

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
              />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
