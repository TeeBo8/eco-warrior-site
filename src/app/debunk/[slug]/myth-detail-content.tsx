'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookmarkCheck,
  Bookmark,
  Brain,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Facebook,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Twitter,
  Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CommentSection } from '@/components/comment-section';
import { NewsletterCTA } from '@/components/debunk/newsletter-cta';
import { cn } from '@/lib/utils';
import { trpc } from '@/app/_trpc/client';
import { getOrCreateSession, getSessionId } from '@/lib/anonymous-auth';

interface Post {
  id: number;
  slug: string | null;
  mythFr: string;
  realityFr: string;
  source?: string | null;
  likes: number;
  category?: string | null;
  difficulty?: string | null;
  shortExplanation?: string | null;
  keyFacts?: string | null;
  sources?: string | null;
}

interface MythDetailContentProps {
  post: Post;
  relatedPosts: Post[];
}

// Configuration des catégories
const CATEGORIES: Record<string, { label: string; icon: typeof FlaskConical; color: string; bgColor: string }> = {
  science: { label: 'Science', icon: FlaskConical, color: 'text-blue-600', bgColor: 'bg-blue-500' },
  energie: { label: 'Énergie', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
  solutions: { label: 'Solutions', icon: Lightbulb, color: 'text-green-600', bgColor: 'bg-green-500' },
  economie: { label: 'Économie', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-500' },
};

const DIFFICULTIES: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  debutant: { label: 'Débutant', icon: BookOpen, color: 'text-green-500' },
  intermediaire: { label: 'Intermédiaire', icon: GraduationCap, color: 'text-yellow-500' },
  avance: { label: 'Avancé', icon: Trophy, color: 'text-red-500' },
};

// Helpers pour parser JSON
const parseKeyFacts = (keyFacts: string | null | undefined): string[] => {
  if (!keyFacts) return [];
  try {
    return JSON.parse(keyFacts);
  } catch {
    return [];
  }
};

const parseSources = (sources: string | null | undefined): { name: string; url?: string }[] => {
  if (!sources) return [];
  try {
    return JSON.parse(sources);
  } catch {
    return [];
  }
};

export function MythDetailContent({ post, relatedPosts }: MythDetailContentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasLearned, setHasLearned] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleLikeMutation = trpc.post.toggleLike.useMutation();

  const category = post.category || 'solutions';
  const difficulty = post.difficulty || 'debutant';
  const categoryConfig = CATEGORIES[category] || CATEGORIES.solutions;
  const difficultyConfig = DIFFICULTIES[difficulty] || DIFFICULTIES.debutant;
  const keyFacts = parseKeyFacts(post.keyFacts);
  const sourcesList = parseSources(post.sources);

  const handleLike = async () => {
    if (isLiking) return;

    getOrCreateSession();
    const sessionId = getSessionId();
    if (!sessionId) return;

    setIsLiking(true);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      await toggleLikeMutation.mutateAsync({ postId: post.id, sessionId });
    } catch {
      setIsLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Stocker en localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('eco-debunk-progress');
      const data = stored ? JSON.parse(stored) : { favorites: [] };
      if (isFavorite) {
        data.favorites = data.favorites.filter((id: number) => id !== post.id);
      } else {
        data.favorites.push(post.id);
      }
      localStorage.setItem('eco-debunk-progress', JSON.stringify(data));
    }
  };

  const handleLearned = () => {
    setHasLearned(true);
    if (typeof window !== 'undefined') {
      const learnedMyths = JSON.parse(localStorage.getItem('eco-debunk-learned') || '[]');
      if (!learnedMyths.includes(post.id)) {
        learnedMyths.push(post.id);
        localStorage.setItem('eco-debunk-learned', JSON.stringify(learnedMyths));
      }
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.mythFr} ? C'est FAUX ! Découvrez la réalité scientifique sur EcoWarrior.`;

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Retour */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link href="/debunk">
          <Button variant="ghost" className="gap-2 hover:bg-green-50 dark:hover:bg-green-950/30">
            <ArrowLeft className="h-4 w-4" />
            Retour aux mythes
          </Button>
        </Link>
      </motion.div>

      {/* Header avec mythe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl p-6 md:p-8 mb-8 border border-red-200 dark:border-red-800"
      >
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className={cn('text-white', categoryConfig.bgColor)}>
            <categoryConfig.icon className="h-3 w-3 mr-1" />
            {categoryConfig.label}
          </Badge>
          <Badge variant="outline" className={difficultyConfig.color}>
            <difficultyConfig.icon className="h-3 w-3 mr-1" />
            {difficultyConfig.label}
          </Badge>
        </div>

        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <span className="text-xl">💭</span>
          </div>
          <span className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
            Le Mythe
          </span>
        </div>

        {/* Titre du mythe */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {post.mythFr}
        </h1>
      </motion.div>

      {/* Section Réalité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 md:p-8 mb-8 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <span className="text-xl">✅</span>
          </div>
          <h2 className="text-green-700 dark:text-green-400 font-semibold uppercase tracking-wide">
            La Réalité Scientifique
          </h2>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {post.realityFr}
        </p>
      </motion.div>

      {/* Points clés */}
      {keyFacts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="h-5 w-5" />
                Points clés à retenir
              </h3>
              <div className="space-y-4">
                {keyFacts.map((fact, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 pt-1">{fact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sources */}
      {(sourcesList.length > 0 || post.source) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-700 dark:text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wide">
                <BookOpen className="h-5 w-5" />
                Sources scientifiques
              </h3>
              {sourcesList.length > 0 ? (
                <div className="grid gap-3">
                  {sourcesList.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {src.name}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400">{src.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                post.source && (
                  <p className="text-slate-600 dark:text-slate-400">{post.source}</p>
                )
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant="outline"
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  'gap-2',
                  isLiked && 'bg-green-50 border-green-500 text-green-600'
                )}
              >
                <ThumbsUp className={cn('h-4 w-4', isLiked && 'fill-current')} />
                {likeCount} approbations
              </Button>

              <Button
                variant="outline"
                onClick={handleFavorite}
                className={cn(
                  'gap-2',
                  isFavorite && 'bg-yellow-50 border-yellow-500 text-yellow-600'
                )}
              >
                {isFavorite ? (
                  <BookmarkCheck className="h-4 w-4 fill-current" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
                {isFavorite ? 'Favori' : 'Ajouter aux favoris'}
              </Button>

              <Button
                variant="outline"
                onClick={handleLearned}
                disabled={hasLearned}
                className={cn(
                  'gap-2',
                  hasLearned && 'bg-purple-50 border-purple-500 text-purple-600'
                )}
              >
                <Brain className={cn('h-4 w-4', hasLearned && 'fill-current')} />
                {hasLearned ? 'Merci !' : "J'ai appris quelque chose"}
              </Button>
            </div>

            {/* Partage */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Partager ce debunk
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="gap-2 hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="gap-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className={cn('gap-2', copied && 'bg-green-50 border-green-500 text-green-600')}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copié !' : 'Copier'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mythes connexes */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Mythes connexes à explorer
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedPosts.map((related) => {
              const relatedCat = related.category || 'solutions';
              const relatedConfig = CATEGORIES[relatedCat] || CATEGORIES.solutions;
              return (
                <Link key={related.id} href={`/debunk/${related.slug}`}>
                  <Card className="h-full hover:shadow-md hover:border-green-500 transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <Badge
                        variant="secondary"
                        className={cn('text-white text-xs mb-2', relatedConfig.bgColor)}
                      >
                        <relatedConfig.icon className="h-3 w-3 mr-1" />
                        {relatedConfig.label}
                      </Badge>
                      <p className="font-medium text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                        {related.mythFr}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground group-hover:text-green-600 transition-colors">
                        <span>Découvrir</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <NewsletterCTA />
      </motion.div>

      {/* Commentaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <CommentSection />
      </motion.div>
    </div>
  );
}
