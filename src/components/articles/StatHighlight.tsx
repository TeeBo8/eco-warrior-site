'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

type TrendType = 'up' | 'down' | 'neutral' | 'warning';
type ColorScheme = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

interface StatHighlightProps {
  value: string | number;
  unit?: string;
  label?: string;
  description?: string;
  trend?: TrendType;
  colorScheme?: ColorScheme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'inline' | 'card' | 'pill';
  className?: string;
  animated?: boolean;
}

// Couleurs par schéma
const colorSchemes: Record<ColorScheme, {
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/50',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    icon: 'text-amber-500',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    icon: 'text-emerald-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    icon: 'text-blue-500',
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-800/30',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700/50',
    icon: 'text-gray-500',
  },
};

// Tailles
const sizes = {
  sm: {
    value: 'text-lg font-bold',
    unit: 'text-sm',
    label: 'text-xs',
    icon: 'w-3 h-3',
    padding: 'px-2 py-1',
  },
  md: {
    value: 'text-2xl font-bold',
    unit: 'text-base',
    label: 'text-sm',
    icon: 'w-4 h-4',
    padding: 'px-3 py-2',
  },
  lg: {
    value: 'text-3xl font-extrabold',
    unit: 'text-lg',
    label: 'text-base',
    icon: 'w-5 h-5',
    padding: 'px-4 py-3',
  },
  xl: {
    value: 'text-4xl font-extrabold',
    unit: 'text-xl',
    label: 'text-lg',
    icon: 'w-6 h-6',
    padding: 'px-5 py-4',
  },
};

// Icône de tendance
function TrendIcon({ trend, className }: { trend: TrendType; className?: string }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className={className} />;
    case 'down':
      return <TrendingDown className={className} />;
    case 'warning':
      return <AlertTriangle className={className} />;
    default:
      return <Minus className={className} />;
  }
}

export function StatHighlight({
  value,
  unit,
  label,
  description,
  trend,
  colorScheme = 'danger',
  size = 'md',
  variant = 'inline',
  className,
  animated = true,
}: StatHighlightProps) {
  const colors = colorSchemes[colorScheme];
  const sizeConfig = sizes[size];

  // Variant: inline (pour le texte)
  if (variant === 'inline') {
    return (
      <span
        className={cn(
          'inline-flex items-baseline gap-1',
          colors.text,
          'font-semibold',
          animated && 'transition-colors duration-200 hover:opacity-80',
          className
        )}
      >
        <span className={sizeConfig.value}>{value}</span>
        {unit && <span className={cn(sizeConfig.unit, 'opacity-80')}>{unit}</span>}
        {trend && (
          <TrendIcon
            trend={trend}
            className={cn(sizeConfig.icon, colors.icon, 'ml-0.5 self-center')}
          />
        )}
      </span>
    );
  }

  // Variant: pill (badge compact)
  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border',
          colors.bg,
          colors.border,
          sizeConfig.padding,
          animated && 'transition-all duration-200 hover:shadow-md',
          className
        )}
      >
        {trend && (
          <TrendIcon
            trend={trend}
            className={cn(sizeConfig.icon, colors.icon)}
          />
        )}
        <span className={cn(sizeConfig.value, colors.text)}>{value}</span>
        {unit && (
          <span className={cn(sizeConfig.unit, colors.text, 'opacity-70')}>
            {unit}
          </span>
        )}
      </span>
    );
  }

  // Variant: card (bloc complet)
  return (
    <div
      className={cn(
        'rounded-xl border',
        colors.bg,
        colors.border,
        sizeConfig.padding,
        animated && 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {label && (
            <p className={cn(sizeConfig.label, 'text-muted-foreground mb-1')}>
              {label}
            </p>
          )}
          <div className="flex items-baseline gap-1">
            <span className={cn(sizeConfig.value, colors.text)}>{value}</span>
            {unit && (
              <span className={cn(sizeConfig.unit, colors.text, 'opacity-70')}>
                {unit}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {trend && (
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            <TrendIcon
              trend={trend}
              className={cn(sizeConfig.icon, colors.icon)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Composant utilitaire pour afficher une stat dans le markdown
export function InlineStat({
  children,
  type = 'danger',
}: {
  children: React.ReactNode;
  type?: ColorScheme;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded font-bold',
        colorSchemes[type].bg,
        colorSchemes[type].text,
        colorSchemes[type].border,
        'border'
      )}
    >
      {children}
    </span>
  );
}
