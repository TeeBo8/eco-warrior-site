'use client';

import { cn } from '@/lib/utils';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
  title?: string;
  sticky?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showProgress?: boolean;
  minHeadings?: number;
}

// Extraire les titres du contenu Markdown
function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({
  content,
  className,
  title = 'Sommaire',
  sticky = true,
  collapsible = true,
  defaultCollapsed = false,
  showProgress = true,
  minHeadings = 2,
}: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  const headings = useMemo(() => extractHeadings(content), [content]);

  // Observer pour suivre la section active
  const handleScroll = useCallback(() => {
    if (headings.length === 0) return;

    // Calculer la progression de lecture
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min((scrollTop / docHeight) * 100, 100);
    setReadingProgress(progress);

    // Trouver la section active
    const headingElements = headings
      .map(h => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    // Trouver le dernier heading qui est passé au-dessus du viewport
    let currentId = headings[0]?.id || null;
    const offset = 100; // Offset du sticky header

    for (const element of headingElements) {
      const rect = element.getBoundingClientRect();
      if (rect.top <= offset) {
        currentId = element.id;
      } else {
        break;
      }
    }

    setActiveId(currentId);
  }, [headings]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Ne pas afficher si pas assez de headings
  if (headings.length < minHeadings) {
    return null;
  }

  // Scroll smooth vers la section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset pour le sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      aria-label="Table des matières"
      className={cn(
        'rounded-xl border border-border bg-card/50 backdrop-blur-sm',
        sticky && 'lg:sticky lg:top-24',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b border-border/50',
          collapsible && 'cursor-pointer hover:bg-muted/50 transition-colors'
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">{title}</span>
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted">
            {headings.length}
          </span>
        </div>
        {collapsible && (
          <button
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label={isCollapsed ? 'Développer' : 'Réduire'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && !isCollapsed && (
        <div className="h-1 bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Table of contents */}
      {!isCollapsed && (
        <ul className="p-3 space-y-0.5 max-h-[60vh] overflow-y-auto">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id;
            const isH3 = heading.level === 3;

            return (
              <li key={`${heading.id}-${index}`}>
                <button
                  onClick={() => scrollToSection(heading.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                    'hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/50',
                    isH3 && 'pl-6',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="line-clamp-2">{heading.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Footer avec indication de position */}
      {!isCollapsed && showProgress && (
        <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground text-center">
          {Math.round(readingProgress)}% lu
        </div>
      )}
    </nav>
  );
}

// Version mobile (drawer/sheet)
interface MobileTableOfContentsProps extends TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileTableOfContents({
  content,
  isOpen,
  onClose,
  title = 'Sommaire',
}: MobileTableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  if (!isOpen || headings.length < 2) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-2xl lg:hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        <ul className="p-4 space-y-1 max-h-[50vh] overflow-y-auto">
          {headings.map((heading, index) => {
            const isH3 = heading.level === 3;

            return (
              <li key={`${heading.id}-${index}`}>
                <button
                  onClick={() => scrollToSection(heading.id)}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg text-base transition-all',
                    'hover:bg-muted/80 active:bg-muted',
                    isH3 && 'pl-8 text-sm text-muted-foreground'
                  )}
                >
                  {heading.text}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
