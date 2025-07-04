"use client";

import { trpc } from "@/app/_trpc/client";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CommentSection } from "./comment-section";

// Type mis à jour pour le nouveau schéma
type Post = {
  id: number;
  mythFr: string;
  realityFr: string;
  mythEn: string;
  realityEn: string;
  source?: string | null;
  likes: number;
  isLiked: boolean;
};

export function PostCard({ post }: { post: Post }) {
  const { isSignedIn } = useUser();
  const t = useTranslations("DebunkPage.card");
  const utils = trpc.useContext();
  
  const likeMutation = trpc.post.toggleLike.useMutation({
    onSuccess: () => {
      // On rafraîchit la liste des posts
      void utils.post.getPosts.invalidate();
    },
  });

  const handleLike = () => {
    if (!isSignedIn) {
      alert(t('loginToVote'));
      return;
    }
    likeMutation.mutate({ postId: post.id });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">{post.mythFr}</CardTitle>
          </CardHeader>
          <CardFooter className="mt-auto flex justify-between items-center bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className={cn("h-5 w-5", post.isLiked && "fill-red-500 text-red-500")} />
              <span className="font-bold">{post.likes}</span>
            </div>
            <span className="text-sm text-muted-foreground">{t('clickToRead')}</span>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-red-600">{t('mythLabel')}</DialogTitle>
          <p className="text-lg font-medium">{post.mythFr}</p>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-green-600 font-semibold text-lg">{t('realityLabel')}</h4>
            <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">{post.realityFr}</p>
          </div>
          
          {post.source && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Source:</strong> {post.source}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex items-center gap-4">
          <Button 
            onClick={handleLike} 
            disabled={likeMutation.isPending || !isSignedIn}
            variant={post.isLiked ? "default" : "outline"}
            className={cn(
              "flex items-center gap-2",
              post.isLiked && "bg-red-500 hover:bg-red-600"
            )}
          >
            <Heart className={cn("h-4 w-4", post.isLiked && "fill-white")} />
            {post.isLiked ? t('unlike') : t('like')} ({post.likes})
          </Button>
          
          {!isSignedIn && (
            <p className="text-sm text-muted-foreground">
              {t('loginToLike')}
            </p>
          )}
        </div>
        
        {/* 👇 ON AJOUTE LA SECTION DE COMMENTAIRES ICI 👇 */}
        <CommentSection postId={post.id} />
      </DialogContent>
    </Dialog>
  );
} 