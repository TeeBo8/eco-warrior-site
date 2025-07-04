"use client";

import { trpc } from "@/app/_trpc/client";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePremiumStatus } from "@/lib/test-mode-context";

const commentSchema = z.object({ content: z.string().min(1, "Commentaire vide.") });

export function CommentSection({ postId }: { postId: number }) {
  const { user } = useUser();
  const t = useTranslations("DebunkPage.comments");
  const utils = trpc.useContext();
  
  // 👇 LOGIQUE MISE À JOUR AVEC MODE DE TEST 👇
  // L'utilisateur est premium selon le mode de test global
  const isPremium = usePremiumStatus();
  
  const commentsQuery = trpc.comment.getForPost.useQuery(
    { postId },
    { enabled: !!user } // On ne charge les commentaires que si l'utilisateur est connecté
  );

  const addCommentMutation = trpc.comment.add.useMutation({
    onSuccess: () => {
      utils.comment.getForPost.invalidate({ postId });
      form.reset();
    },
  });
  
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  function onSubmit(values: z.infer<typeof commentSchema>) {
    addCommentMutation.mutate({ postId, ...values });
  }

  if (!user) {
    return (
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-lg font-semibold mb-4">{t('title')}</h4>
        <div className="text-center p-4 bg-muted rounded-md">
          {t('loginRequired')}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h4 className="text-lg font-semibold mb-4">{t('title')}</h4>
      
      {/* 👑 Indicateur Admin Premium */}
      {user?.publicMetadata?.role === 'admin' && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
          <div className="flex items-center gap-2 text-purple-700">
            <span className="text-sm">👑</span>
            <span className="text-xs font-medium">
              Accès Premium Administrateur
            </span>
          </div>
        </div>
      )}
      
      {isPremium ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 mb-6">
          <Textarea 
            {...form.register("content")} 
            placeholder={t('placeholder')} 
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={addCommentMutation.isPending}
            className="self-end"
          >
            {addCommentMutation.isPending ? t('submitting') : t('submitButton')}
          </Button>
        </form>
      ) : (
        <div className="text-center p-4 bg-muted rounded-md mb-6">
          {t('premiumOnly')}
        </div>
      )}

      <div className="space-y-4">
        {commentsQuery.isLoading && (
          <div className="text-center p-4 text-muted-foreground">
            {t('loading')}
          </div>
        )}
        
        {commentsQuery.data?.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <Avatar>
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author.name}`} />
              <AvatarFallback>{comment.author.name?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{comment.author.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {commentsQuery.data?.length === 0 && (
          <div className="text-center p-4 text-muted-foreground">
            {t('noComments')}
          </div>
        )}
      </div>
    </div>
  );
} 