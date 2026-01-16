'use client';

import React from 'react';
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
}

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
    className
}: ArticlePageCardProps) {
    const relativeTime = getRelativeTime(new Date(publishedAt));

    return (
        <Link href={`/articles/${slug}`} className={cn("group block", className)}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                {/* Image de fond */}
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-emerald-500/20 to-teal-500/30" />
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Timestamp en haut à gauche */}
                <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/50 text-white/90 backdrop-blur-sm">
                        {relativeTime}
                    </span>
                </div>

                {/* Contenu en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-green-300 transition-colors">
                        {title}
                    </h3>
                    <p className="mt-2 text-sm text-white/70 line-clamp-2 hidden sm:block">
                        {summary}
                    </p>
                </div>

                {/* Hover effect ring */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300" />
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
}: Omit<ArticlePageCardProps, 'summary' | 'author'>) {
    const relativeTime = getRelativeTime(new Date(publishedAt));

    return (
        <Link href={`/articles/${slug}`} className={cn("group flex gap-3 items-center", className)}>
            {/* Thumbnail */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-teal-500/30" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h4>
                <span className="text-xs text-muted-foreground mt-1 block">
                    {relativeTime}
                </span>
            </div>
        </Link>
    );
}
