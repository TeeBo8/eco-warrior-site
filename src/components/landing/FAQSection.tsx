'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "C'est quoi EcoWarrior exactement ?",
        answer: "EcoWarrior est une plateforme web qui vous aide à comprendre et agir face au changement climatique. Nous combinons des données scientifiques en temps réel, un contenu éducatif de qualité et des outils pratiques comme le calculateur d'empreinte carbone."
    },
    {
        question: "Est-ce que c'est gratuit ?",
        answer: "Oui ! L'inscription est gratuite et vous donne accès au dashboard climatique, à la section Mythes & Réalités, à la chronologie et à 3 messages gratuits avec notre assistant IA. L'offre Premium débloque l'accès illimité et des fonctionnalités avancées."
    },
    {
        question: "D'où viennent vos données ?",
        answer: "Toutes nos données proviennent de sources scientifiques reconnues : NASA, NOAA, GIEC, CNRS. Nous mettons à jour régulièrement nos informations pour vous fournir les données les plus récentes et fiables."
    },
    {
        question: "Comment devenir membre Premium ?",
        answer: "Vous pouvez passer Premium en un clic depuis votre profil ou la page tarifs. Votre abonnement soutient directement notre mission : à 5000 membres, nous sanctuarisons des terrains naturels pour les protéger définitivement."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Questions fréquentes
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Tout ce que vous devez savoir sur EcoWarrior avant de commencer.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-semibold text-foreground pr-4">
                                        {faq.question}
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
                                            {faq.answer}
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
