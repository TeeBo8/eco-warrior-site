"use client";

import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

export function FeaturedPostWidget() {
  const { data: posts, isLoading } = trpc.post.getPosts.useQuery();
  const featuredPost = posts?.[0]; // Le premier post est le plus populaire (trié par likes)

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardDescription>💭 Mythe de la Semaine</CardDescription>
          <CardTitle>Chargement...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!featuredPost) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardDescription>💭 Mythe de la Semaine</CardDescription>
          <CardTitle>Aucun mythe disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Les mythes climatiques seront bientôt disponibles !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 border-l-4 border-l-primary">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          💭 <span>Mythe le plus discuté</span>
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
            {featuredPost.likes} 👍
          </span>
        </CardDescription>
        <CardTitle className="text-lg font-bold leading-tight">
          {featuredPost.mythFr}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          <span className="font-medium text-foreground">Réalité :</span> {featuredPost.realityFr}
        </p>
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="font-medium">
            <Link href="/debunk">
              Lire la suite et participer →
            </Link>
          </Button>
          {featuredPost.source && (
            <span className="text-xs text-muted-foreground">
              Source disponible
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 