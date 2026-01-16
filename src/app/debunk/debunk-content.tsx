'use client';

import { trpc } from "@/app/_trpc/client";
import { PostCard } from "@/components/post-card";

export function DebunkContent() {
  const postsQuery = trpc.post.getPosts.useQuery();

  return (
    <div className="w-full">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Mythes & Réalités du Climat</h1>
          <p className="text-lg text-muted-foreground mt-2">Des faits scientifiques solides pour démonter les idées reçues sur le changement climatique.</p>
          <p className="text-sm text-muted-foreground mt-1">Contenu éditorial de qualité basé sur des sources fiables comme Jean-Marc Jancovici, le GIEC et les organismes scientifiques reconnus.</p>
        </div>

        {postsQuery.isLoading && (
          <div className="text-center py-8">
            <p className="text-lg">Chargement des mythes...</p>
          </div>
        )}

        {postsQuery.error && (
          <div className="text-center py-8">
            <p className="text-red-500">Erreur: {postsQuery.error.message}</p>
          </div>
        )}

        {postsQuery.data && postsQuery.data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun contenu disponible pour le moment.</p>
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