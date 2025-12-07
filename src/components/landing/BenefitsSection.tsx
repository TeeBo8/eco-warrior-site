'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, BookOpen, Calculator } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    key: 'inform',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: BookOpen,
    key: 'understand',
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/30',
  },
  {
    icon: Calculator,
    key: 'act',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
];

export function BenefitsSection() {
  const t = useTranslations('BenefitsSection');

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.key}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${benefit.color}`} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {t(`benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`benefits.${benefit.key}.description`)}
                </p>

                {/* Decorative gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
