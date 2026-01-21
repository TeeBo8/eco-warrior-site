"use client";

import { useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ThumbsUp } from "lucide-react";
import { CommentSection } from "./comment-section";
import { trpc } from "@/app/_trpc/client";
import { getSessionId, getOrCreateSession } from "@/lib/anonymous-auth";
import { cn } from "@/lib/utils";

// Type pour le post
type Post = {
  id: number;
  mythFr: string;
  realityFr: string;
  mythEn: string;
  realityEn: string;
  source?: string | null;
  likes: number;
  isLiked?: boolean;
};

export function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const toggleLikeMutation = trpc.post.toggleLike.useMutation();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche l'ouverture du dialog
    if (isLiking) return;

    // S'assurer qu'on a une session
    getOrCreateSession();
    const sessionId = getSessionId();
    if (!sessionId) return;

    setIsLiking(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      await toggleLikeMutation.mutateAsync({
        postId: post.id,
        sessionId,
      });
    } catch {
      // Rollback en cas d'erreur
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">{post.mythFr}</CardTitle>
          </CardHeader>
          <CardFooter className="mt-auto flex justify-between items-center bg-muted/50 p-4">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={cn(
                "flex items-center gap-2 transition-colors rounded-md px-2 py-1 -ml-2",
                "hover:bg-green-100 dark:hover:bg-green-900/30",
                isLiked ? "text-green-600" : "text-muted-foreground"
              )}
            >
              <ThumbsUp className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span className="font-bold">{likeCount}</span>
            </button>
            <span className="text-sm text-muted-foreground">Cliquer pour lire</span>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-600">💭 Mythe</DialogTitle>
          <p className="text-lg font-medium">{post.mythFr}</p>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-green-600 font-semibold text-lg">✅ Réalité</h4>
            <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{post.realityFr}</p>
          </div>

          {post.source && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Source:</strong> {post.source}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
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
        </div>

        {/* Section de commentaires simplifiée */}
        <CommentSection />
      </DialogContent>
    </Dialog>
  );
}