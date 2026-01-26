'use client';

import { cn } from '@/lib/utils';

// Types de catégories disponibles
export type ArticleCategory = 'Climat' | 'Océans' | 'Énergie' | 'Biodiversité' | 'Solutions';

// Configuration des couleurs et icônes par catégorie
const categoryConfig: Record<ArticleCategory, {
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  hoverBg: string;
  darkBgColor: string;
  darkTextColor: string;
  darkBorderColor: string;
}> = {
  'Climat': {
    icon: '🌡️',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    hoverBg: 'hover:bg-red-100',
    darkBgColor: 'dark:bg-red-950/50',
    darkTextColor: 'dark:text-red-300',
    darkBorderColor: 'dark:border-red-800/50',
  },
  'Océans': {
    icon: '🌊',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    hoverBg: 'hover:bg-blue-100',
    darkBgColor: 'dark:bg-blue-950/50',
    darkTextColor: 'dark:text-blue-300',
    darkBorderColor: 'dark:border-blue-800/50',
  },
  'Énergie': {
    icon: '⚡',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    hoverBg: 'hover:bg-amber-100',
    darkBgColor: 'dark:bg-amber-950/50',
    darkTextColor: 'dark:text-amber-300',
    darkBorderColor: 'dark:border-amber-800/50',
  },
  'Biodiversité': {
    icon: '🦋',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    hoverBg: 'hover:bg-emerald-100',
    darkBgColor: 'dark:bg-emerald-950/50',
    darkTextColor: 'dark:text-emerald-300',
    darkBorderColor: 'dark:border-emerald-800/50',
  },
  'Solutions': {
    icon: '💡',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    hoverBg: 'hover:bg-purple-100',
    darkBgColor: 'dark:bg-purple-950/50',
    darkTextColor: 'dark:text-purple-300',
    darkBorderColor: 'dark:border-purple-800/50',
  },
};

interface CategoryBadgeProps {
  category: string;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'glass';
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function CategoryBadge({
  category,
  showIcon = true,
  showLabel = true,
  size = 'md',
  variant = 'default',
  className,
  onClick,
  interactive = false,
}: CategoryBadgeProps) {
  const config = categoryConfig[category as ArticleCategory] || {
    icon: '📄',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
    hoverBg: 'hover:bg-gray-100',
    darkBgColor: 'dark:bg-gray-800/50',
    darkTextColor: 'dark:text-gray-300',
    darkBorderColor: 'dark:border-gray-700/50',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  const variantClasses = {
    default: cn(
      config.bgColor,
      config.textColor,
      config.borderColor,
      config.darkBgColor,
      config.darkTextColor,
      config.darkBorderColor,
      'border'
    ),
    outline: cn(
      'bg-transparent',
      config.textColor,
      config.borderColor,
      config.darkTextColor,
      config.darkBorderColor,
      'border'
    ),
    glass: cn(
      'bg-black/50 backdrop-blur-sm',
      'text-white',
      'border-white/10',
      'border'
    ),
  };

  const Component = onClick || interactive ? 'button' : 'span';

  return (
    <Component
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-200',
        sizeClasses[size],
        variantClasses[variant],
        (onClick || interactive) && cn(config.hoverBg, 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50'),
        className
      )}
    >
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      {showLabel && <span>{category}</span>}
    </Component>
  );
}

// Export de la configuration pour réutilisation
export { categoryConfig };
