'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqKeys = ['q1', 'q2', 'q3', 'q4'];

export function FAQSection() {
    const t = useTranslations('FAQSection');
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqKeys.map((key, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={key}
                                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-foreground pr-4">
                                        {t(`faq.${key}.question`)}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            'w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0',
                                            isOpen && 'rotate-180 text-primary'
                                        )}
                                    />
                                </button>

                                <div
                                    className={cn(
                                        'grid transition-all duration-300 ease-in-out',
                                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {t(`faq.${key}.answer`)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
