'use client';

import { cn } from '@/lib/utils';
import { ExternalLink, BookOpen, FileText, GraduationCap, Building2, Globe } from 'lucide-react';
import { useState } from 'react';

type SourceType = 'scientific' | 'report' | 'institution' | 'media' | 'book';

interface Source {
  id?: string | number;
  title: string;
  authors?: string;
  organization?: string;
  year?: number | string;
  url?: string;
  doi?: string;
  type?: SourceType;
  accessDate?: string;
}

interface SourceCitationProps {
  source: Source;
  variant?: 'inline' | 'footnote' | 'card' | 'compact';
  number?: number;
  className?: string;
}

// Icônes par type de source
const sourceIcons: Record<SourceType, typeof BookOpen> = {
  scientific: GraduationCap,
  report: FileText,
  institution: Building2,
  media: Globe,
  book: BookOpen,
};

// Couleurs par type
const sourceColors: Record<SourceType, string> = {
  scientific: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50',
  report: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50',
  institution: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50',
  media: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50',
  book: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50',
};

export function SourceCitation({
  source,
  variant = 'inline',
  number,
  className,
}: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const type = source.type || 'scientific';
  const Icon = sourceIcons[type];
  const colorClass = sourceColors[type];

  // Formater la citation
  const formatCitation = () => {
    const parts: string[] = [];
    if (source.authors) parts.push(source.authors);
    if (source.year) parts.push(`(${source.year})`);
    if (source.title) parts.push(`"${source.title}"`);
    if (source.organization) parts.push(source.organization);
    return parts.join('. ');
  };

  // Variant: inline (lien dans le texte)
  if (variant === 'inline') {
    return (
      <span className="relative inline-flex items-center group">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium',
              'border transition-all duration-200',
              'hover:shadow-sm',
              colorClass,
              className
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="underline underline-offset-2 decoration-dotted">
              {source.organization || source.title}
            </span>
            {source.year && (
              <span className="text-xs opacity-70">({source.year})</span>
            )}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ) : (
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium border',
              colorClass,
              className
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{source.organization || source.title}</span>
            {source.year && (
              <span className="text-xs opacity-70">({source.year})</span>
            )}
          </span>
        )}
      </span>
    );
  }

  // Variant: footnote (numéro cliquable avec tooltip)
  if (variant === 'footnote') {
    return (
      <span className="relative inline-flex">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'inline-flex items-center justify-center',
            'w-5 h-5 rounded-full text-xs font-bold',
            'border transition-all duration-200',
            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50',
            colorClass,
            className
          )}
          title={formatCitation()}
        >
          {number || source.id || '?'}
        </button>

        {/* Tooltip expandable */}
        {isExpanded && (
          <div
            className={cn(
              'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50',
              'w-64 p-3 rounded-lg shadow-lg border',
              'bg-popover text-popover-foreground',
              'animate-in fade-in-0 zoom-in-95'
            )}
          >
            <div className="flex items-start gap-2">
              <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', colorClass.split(' ')[0])} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{source.title}</p>
                {source.authors && (
                  <p className="text-xs text-muted-foreground mt-1">{source.authors}</p>
                )}
                {source.organization && (
                  <p className="text-xs text-muted-foreground">{source.organization}</p>
                )}
                {source.year && (
                  <p className="text-xs text-muted-foreground">{source.year}</p>
                )}
                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Voir la source
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45 bg-popover border-r border-b" />
          </div>
        )}
      </span>
    );
  }

  // Variant: compact (petite carte)
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-lg border',
          'transition-all duration-200 hover:shadow-sm',
          colorClass,
          className
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{source.title}</p>
          <p className="text-xs opacity-70 truncate">
            {[source.organization, source.year].filter(Boolean).join(' • ')}
          </p>
        </div>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  // Variant: card (carte complète)
  return (
    <div
      className={cn(
        'p-4 rounded-xl border',
        'bg-card transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg border', colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground leading-tight">
            {source.title}
          </h4>
          {source.authors && (
            <p className="text-sm text-muted-foreground mt-1">{source.authors}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            {source.organization && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {source.organization}
              </span>
            )}
            {source.year && <span>• {source.year}</span>}
          </div>
          {source.doi && (
            <p className="text-xs text-muted-foreground mt-1">
              DOI: <span className="font-mono">{source.doi}</span>
            </p>
          )}
          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
            >
              Consulter la source
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant pour une liste de sources (bibliographie)
interface SourcesListProps {
  sources: Source[];
  title?: string;
  className?: string;
}

export function SourcesList({ sources, title = 'Sources', className }: SourcesListProps) {
  if (sources.length === 0) return null;

  return (
    <div className={cn('mt-8 pt-6 border-t border-border', className)}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        {title}
      </h3>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <SourceCitation
            key={source.id || index}
            source={source}
            variant="compact"
            number={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
