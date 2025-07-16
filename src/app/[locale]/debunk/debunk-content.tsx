'use client';

import { trpc } from "@/app/_trpc/client";
import { useTranslations } from "next-intl";
import { PostCard } from "@/components/post-card";

export function DebunkContent() {
  const t = useTranslations("DebunkPage");
  const postsQuery = trpc.post.getPosts.useQuery();

  return (
    <div className="w-full">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('subtitle')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('description')}</p>
        </div>

        {postsQuery.isLoading && (
          <div className="text-center py-8">
            <p className="text-lg">{t('loading')}</p>
          </div>
        )}
        
        {postsQuery.error && (
          <div className="text-center py-8">
            <p className="text-red-500">{t('error', { errorMessage: postsQuery.error.message })}</p>
          </div>
        )}

        {postsQuery.data && postsQuery.data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t('noPosts')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsQuery.data?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
} 