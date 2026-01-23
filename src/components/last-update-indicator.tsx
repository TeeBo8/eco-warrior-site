'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LastUpdateIndicatorProps {
  lastUpdated: string;
  nextUpdate: string;
  dataSource: 'live' | 'cached' | 'static';
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LastUpdateIndicator({
  lastUpdated,
  nextUpdate,
  dataSource,
  onRefresh,
  isRefreshing = false,
}: LastUpdateIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>('');
  const [nextIn, setNextIn] = useState<string>('');

  useEffect(() => {
    const updateTimes = () => {
      // Calculer le temps écoulé
      const lastDate = new Date(lastUpdated);
      const now = new Date();
      const diffMs = now.getTime() - lastDate.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const diffSeconds = Math.floor((diffMs % 60000) / 1000);

      if (diffMinutes < 1) {
        setTimeAgo(`il y a ${diffSeconds}s`);
      } else if (diffMinutes < 60) {
        setTimeAgo(`il y a ${diffMinutes}min`);
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        setTimeAgo(`il y a ${diffHours}h ${diffMinutes % 60}min`);
      }

      // Calculer le temps jusqu'à la prochaine MAJ
      const nextDate = new Date(nextUpdate);
      const nextDiffMs = nextDate.getTime() - now.getTime();
      const nextDiffMinutes = Math.floor(nextDiffMs / 60000);

      if (nextDiffMinutes <= 0) {
        setNextIn('imminent');
      } else if (nextDiffMinutes < 60) {
        setNextIn(`dans ${nextDiffMinutes}min`);
      } else {
        const nextDiffHours = Math.floor(nextDiffMinutes / 60);
        setNextIn(`dans ${nextDiffHours}h`);
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, [lastUpdated, nextUpdate]);

  const getSourceInfo = () => {
    switch (dataSource) {
      case 'live':
        return {
          icon: Wifi,
          label: 'Temps réel',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
        };
      case 'cached':
        return {
          icon: Clock,
          label: 'Cache',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
        };
      case 'static':
        return {
          icon: WifiOff,
          label: 'Statique',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          borderColor: 'border-muted',
        };
    }
  };

  const sourceInfo = getSourceInfo();
  const SourceIcon = sourceInfo.icon;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg border text-xs sm:text-sm',
        sourceInfo.bgColor,
        sourceInfo.borderColor
      )}
    >
      {/* Indicateur de source */}
      <div className={cn('flex items-center gap-1.5', sourceInfo.color)}>
        <SourceIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="font-medium">{sourceInfo.label}</span>
      </div>

      {/* Séparateur */}
      <div className="hidden sm:block h-4 w-px bg-border" />

      {/* Dernière mise à jour */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
        <span>MAJ: {timeAgo}</span>
      </div>

      {/* Prochaine mise à jour */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span>Prochaine: {nextIn}</span>
      </div>

      {/* Bouton de refresh (optionnel) */}
      {onRefresh && (
        <>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded transition-colors',
              'hover:bg-background/50 disabled:opacity-50 disabled:cursor-not-allowed',
              sourceInfo.color
            )}
            title="Rafraîchir les données"
          >
            <RefreshCw
              className={cn(
                'h-3.5 w-3.5 sm:h-4 sm:w-4',
                isRefreshing && 'animate-spin'
              )}
            />
            <span className="hidden md:inline">
              {isRefreshing ? 'Chargement...' : 'Actualiser'}
            </span>
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Version compacte pour l'en-tête du dashboard
 */
export function LastUpdateBadge({
  lastUpdated,
  dataSource,
}: {
  lastUpdated: string;
  dataSource: 'live' | 'cached' | 'static';
}) {
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const lastDate = new Date(lastUpdated);
      const now = new Date();
      const diffMs = now.getTime() - lastDate.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);

      if (diffMinutes < 1) {
        setTimeAgo('< 1min');
      } else if (diffMinutes < 60) {
        setTimeAgo(`${diffMinutes}min`);
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        setTimeAgo(`${diffHours}h`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const isLive = dataSource === 'live';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        isLive
          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          isLive ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
        )}
      />
      <span>{isLive ? 'Live' : 'Statique'}</span>
      <span className="text-muted-foreground">• {timeAgo}</span>
    </div>
  );
}
