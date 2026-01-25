'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ArticlePageCardProps {
    id: number;
    slug: string;
    title: string;
    summary: string;
    imageUrl?: string | null;
    publishedAt: Date;
    author?: string;
    className?: string;
    index?: number; // Pour les animations staggerées
}

// Placeholder blur data URL (petit gradient vert flou)
const blurDataURL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iNDAiIHkyPSIzMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIHN0b3AtY29sb3I9IiMxNjY1MzQiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIwLjUiIHN0b3AtY29sb3I9IiMxMGI5ODEiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMTRiOGE2IiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==";

// Fonction pour calculer le temps relatif
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return "À l'instant";
    } else if (diffInMinutes < 60) {
        return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
        return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `Il y a ${months} mois`;
    } else {
        const years = Math.floor(diffInDays / 365);
        return `Il y a ${years} an${years > 1 ? 's' : ''}`;
    }
}

export function ArticlePageCard({
    slug,
    title,
    summary,
    imageUrl,
    publishedAt,
    className,
    // index prop available for future stagger delay customization
}: ArticlePageCardProps) {
    const relativeTime = getRelativeTime(new Date(publishedAt));
    const [imageError, setImageError] = useState(false);
    const showFallback = !imageUrl || imageError;

    return (
        <Link href={`/articles/${slug}`} className={cn("group block", className)}>
            <div className={cn(
                "relative aspect-[4/3] rounded-xl overflow-hidden bg-muted",
                // Hover: elevation + glow effect
                "transition-all duration-500 ease-out",
                "group-hover:shadow-2xl group-hover:shadow-primary/20",
                "group-hover:-translate-y-2"
            )}>
                {/* Image de fond avec blur placeholder */}
                {showFallback ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 via-emerald-500/30 to-teal-500/40">
                        {/* Animated gradient overlay for visual interest */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent animate-pulse" />
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        onError={() => setImageError(true)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/70" />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none" />

                {/* Timestamp en haut à gauche */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white/90 backdrop-blur-sm border border-white/10 group-hover:bg-primary/80 group-hover:text-white transition-colors duration-300">
                        {relativeTime}
                    </span>
                </div>

                {/* Contenu en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-green-300 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2 hidden sm:block transition-colors duration-300 group-hover:text-white/90">
                        {summary}
                    </p>
                </div>

                {/* Hover effect ring with glow */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-primary/60 transition-all duration-300" />

                {/* Corner accent on hover */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/30 to-transparent rounded-tr-xl" />
                </div>
            </div>
        </Link>
    );
}

// Version plus petite pour les listes secondaires
export function ArticlePageCardSmall({
    slug,
    title,
    imageUrl,
    publishedAt,
    className
}: Omit<ArticlePageCardProps, 'summary' | 'author' | 'index'>) {
    const relativeTime = getRelativeTime(new Date(publishedAt));
    const [imageError, setImageError] = useState(false);
    const showFallback = !imageUrl || imageError;

    return (
        <Link href={`/articles/${slug}`} className={cn("group flex gap-3 items-center", className)}>
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                {showFallback ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/40 to-teal-500/40" />
                ) : (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        onError={() => setImageError(true)}
                        sizes="64px"
                    />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h4>
                <span className="text-xs text-muted-foreground mt-1 block">
                    {relativeTime}
                </span>
            </div>
        </Link>
    );
}
