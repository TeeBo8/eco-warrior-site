'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  href: string;
}

export function FeatureCard({ title, subtitle, icon, href }: FeatureCardProps) {
  const t = useTranslations('HomePage.features.showcase.cta');
  
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 sm:p-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 min-h-[150px]"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
      
      {/* Icon and badge */}
      <div className="relative flex items-center gap-3 text-primary mb-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-400">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="relative text-lg sm:text-xl font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors duration-400">
        {title}
      </h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
      
      {/* CTA arrow */}
      <div className="relative mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        {t('secondary')} <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
      
      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </Link>
  );
}

