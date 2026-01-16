'use client';

import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "Marie Dupont",
        role: "Responsable RSE",
        quote: "EcoWarrior m'a permis de mieux comprendre mon impact et de le réduire concrètement. Les données sont claires et les conseils vraiment utiles.",
        avatar: '👩‍💼',
    },
    {
        name: "Thomas Bernard",
        role: "Enseignant en SVT",
        quote: "J'utilise EcoWarrior avec mes élèves. La section Mythes & Réalités est parfaite pour enseigner l'esprit critique face à la désinformation.",
        avatar: '👨‍🔬',
    },
    {
        name: "Sophie Martin",
        role: "Étudiante en environnement",
        quote: "Le calculateur d'empreinte carbone est super précis. J'ai pu identifier exactement où agir pour diminuer mon impact de 30%.",
        avatar: '👩‍🎓',
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Ce que nos utilisateurs en pensent
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Rejoignez des milliers de personnes qui agissent pour le climat avec EcoWarrior.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
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
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
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
