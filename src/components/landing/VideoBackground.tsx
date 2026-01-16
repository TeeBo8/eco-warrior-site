'use client';

import React from 'react';

interface VideoBackgroundProps {
    videoSource?: string;
    poster?: string;
    overlayOpacity?: number;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
    videoSource = '/hero-background.mp4',
    poster,
    overlayOpacity = 0.5
}) => {
    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
            {/* Gradient de fond (toujours visible) */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-800/10 to-teal-900/20" />

            {/* Vidéo */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={poster}
            >
                <source src={videoSource} type="video/mp4" />
            </video>

            {/* Overlay pour lisibilité */}
            <div
                className="absolute inset-0 bg-background/70 dark:bg-background/80"
                style={{ opacity: overlayOpacity }}
            />
        </div>
    );
};
