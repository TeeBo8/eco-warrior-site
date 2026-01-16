'use client';

import { BookOpen, Calculator, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: BookOpen,
        step: '01',
        title: "Comprenez l'Urgence",
        description: "Accédez immédiatement aux données scientifiques réelles (CO2, Température) sans barrière. Pas de compte requis.",
    },
    {
        icon: Calculator,
        step: '02',
        title: "Mesurez votre Impact",
        description: "Utilisez notre calculateur carbone transparent pour évaluer votre empreinte personnelle.",
    },
    {
        icon: ShieldCheck,
        step: '03',
        title: "Rejoignez le Sanctuaire",
        description: "Participez à notre mission collective : acquérir et protéger définitivement des terres sauvages.",
    },
];

export function HowItWorksSection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Votre parcours en 3 étapes
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Commencez votre transition écologique en quelques minutes seulement.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connection Line (desktop only) */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.step}
                                    className="flex flex-col items-center text-center group"
                                >
                                    {/* Step Number & Icon Container */}
                                    <div className="relative mb-6">
                                        {/* Background circle */}
                                        <div className="w-24 h-24 rounded-full bg-background border-2 border-primary/20 group-hover:border-primary flex items-center justify-center transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:scale-105">
                                            <Icon className="w-10 h-10 text-primary" />
                                        </div>

                                        {/* Step number badge */}
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                                            {step.step}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-foreground mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed max-w-xs">
                                        {step.description}
                                    </p>

                                    {/* Arrow (mobile only, except last) */}
                                    {index < steps.length - 1 && (
                                        <div className="md:hidden mt-6 text-primary">
                                            <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
