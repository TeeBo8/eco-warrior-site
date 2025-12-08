'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp, BookOpen, Calculator } from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    key: 'inform',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary/10 via-primary/5 to-transparent',
  },
  {
    icon: BookOpen,
    key: 'understand',
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/20',
    gradient: 'from-accent/10 via-accent/5 to-transparent',
  },
  {
    icon: Calculator,
    key: 'act',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    gradient: 'from-chart-3/10 via-chart-3/5 to-transparent',
  },
];

export function BenefitsSection() {
  const t = useTranslations('BenefitsSection');

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-background via-background to-muted/10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.key}
                className="group relative p-8 lg:p-10 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                  <Icon className={`w-8 h-8 ${benefit.color} transition-transform duration-500 group-hover:rotate-6`} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                  {t(`benefits.${benefit.key}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {t(`benefits.${benefit.key}.description`)}
                </p>

                {/* Decorative accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
