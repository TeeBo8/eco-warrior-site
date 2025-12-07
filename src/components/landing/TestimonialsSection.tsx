'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

const testimonials = [
    {
        key: 'testimonial1',
        avatar: '👩‍💼',
    },
    {
        key: 'testimonial2',
        avatar: '👨‍🔬',
    },
    {
        key: 'testimonial3',
        avatar: '👩‍🎓',
    },
];

export function TestimonialsSection() {
    const t = useTranslations('TestimonialsSection');

    return (
        <section className="py-20 bg-muted/30">
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

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.key}
                            className="relative p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            {/* Quote decoration */}
                            <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif leading-none">
                                &ldquo;
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-foreground leading-relaxed mb-6 relative z-10">
                                &ldquo;{t(`testimonials.${testimonial.key}.quote`)}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {t(`testimonials.${testimonial.key}.name`)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {t(`testimonials.${testimonial.key}.role`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
