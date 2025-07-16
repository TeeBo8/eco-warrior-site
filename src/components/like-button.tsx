'use client';
import { trpc } from '@/app/_trpc/client';
import { useUser } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function LikeButton({ postId, initialLikes, initialIsLiked }: { postId: number; initialLikes: number; initialIsLiked: boolean }) {
  const t = useTranslations('DebunkPage.card');
  const { isSignedIn } = useUser();
  const [optimisticLikes, setOptimisticLikes] = useState(initialLikes);
  const [optimisticIsLiked, setOptimisticIsLiked] = useState(initialIsLiked);
  const likeStatus = trpc.post.getLikeStatus.useQuery({ postId }, { enabled: !!isSignedIn });
  const likeMutation = trpc.post.toggleLike.useMutation({
    onMutate: () => {
      setOptimisticIsLiked(!optimisticIsLiked);
      setOptimisticLikes(optimisticIsLiked ? optimisticLikes - 1 : optimisticLikes + 1);
    },
    onSuccess: () => {
      void likeStatus.refetch();
    },
    onError: () => {
      setOptimisticIsLiked(!optimisticIsLiked);
      setOptimisticLikes(optimisticIsLiked ? optimisticLikes - 1 : optimisticLikes + 1);
    },
  });
  const isLiked = likeStatus.data ? likeStatus.data.isLiked : optimisticIsLiked;
  const likes = likeStatus.data ? likeStatus.data.likes : optimisticLikes;
  const handleLike = () => {
    if (!isSignedIn) {
      alert(t('loginToLike'));
      return;
    }
    likeMutation.mutate({ postId });
  };
  return (
    <div className="mt-6 flex items-center gap-4">
      <Button onClick={handleLike} disabled={likeMutation.isPending} variant={isLiked ? 'default' : 'outline'} className={cn('flex items-center gap-2', isLiked && 'bg-red-500 hover:bg-red-600')}>
        <Heart className={cn('h-4 w-4', isLiked && 'fill-white')} />
        {isLiked ? "Unlike" : "Like"} ({likes as number})
      </Button>
    </div>
  );
} 