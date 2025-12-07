"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { CommentSection } from "./comment-section";

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
  const t = useTranslations("DebunkPage.card");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg">{post.mythFr}</CardTitle>
          </CardHeader>
          <CardFooter className="mt-auto flex justify-between items-center bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ThumbsUp className="h-5 w-5" />
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
          <div className="flex items-center gap-2 text-muted-foreground">
            <ThumbsUp className="h-5 w-5" />
            <span className="font-bold">{post.likes} approbations</span>
          </div>
        </div>

        {/* Section de commentaires simplifiée */}
        <CommentSection />
      </DialogContent>
    </Dialog>
  );
}