'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  icon: ReactNode;
  href: string;
}

export function FeatureCard({ title, icon, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-3 transition-all duration-400 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 min-h-[100px] flex flex-col"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

      {/* Icon */}
      <div className="relative flex items-center text-primary mb-2">
        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform duration-400">
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className="relative text-base sm:text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-400 flex-1">
        {title}
      </h3>

      {/* CTA arrow */}
      <div className="relative mt-2 text-xs font-semibold text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        En savoir plus <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>

      {/* Accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </Link>
  );
}
