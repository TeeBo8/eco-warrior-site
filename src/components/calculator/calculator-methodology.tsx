"use client";

import { motion } from "framer-motion";
import { Car, Utensils, Zap, BookOpen } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const methodologyCards = [
  {
    icon: Car,
    title: "Transport",
    description: "Inclut la combustion et la production du carburant/véhicule.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: Utensils,
    title: "Alimentation",
    description: "Inclut la production agricole, la transformation et le transport.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Zap,
    title: "Énergie",
    description: "Basé sur l'intensité carbone moyenne du réseau électrique.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
];

export function CalculatorMethodology() {
  return (
    <motion.div
      className="mt-16 bg-muted/30 p-8 rounded-2xl border border-border backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Méthodologie Scientifique</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        Ce calculateur s&apos;appuie sur la Base Carbone de l&apos;ADEME et les rapports du GIEC.
        Nous prenons en compte l&apos;analyse du cycle de vie complet.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {methodologyCards.map((card) => (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`p-5 bg-card rounded-xl shadow-sm border ${card.borderColor} transition-shadow hover:shadow-md cursor-default group`}
          >
            <div className={`inline-flex p-2.5 rounded-lg ${card.bgColor} mb-3 group-hover:scale-110 transition-transform`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
