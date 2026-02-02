"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Utensils, Zap, BookOpen, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
    id: "transport",
    icon: Car,
    title: "Transport",
    description: "Inclut la combustion et la production du carburant/véhicule.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40",
    expandedContent: {
      factors: [
        { label: "Voiture essence", value: "0.21 kg CO₂/km" },
        { label: "Voiture électrique", value: "0.05 kg CO₂/km" },
        { label: "Train", value: "0.04 kg CO₂/km" },
        { label: "Avion", value: "0.255 kg CO₂/km" },
      ],
      source: "Base Carbone ADEME",
      details: "Ces facteurs incluent les émissions directes (combustion) et indirectes (production du carburant, fabrication du véhicule amortie sur sa durée de vie).",
    },
  },
  {
    id: "alimentation",
    icon: Utensils,
    title: "Alimentation",
    description: "Inclut la production agricole, la transformation et le transport.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    hoverBorder: "hover:border-green-500/40",
    expandedContent: {
      factors: [
        { label: "Riche en viande", value: "3.3 kg CO₂/jour" },
        { label: "Régime moyen", value: "2.5 kg CO₂/jour" },
        { label: "Végétarien", value: "1.7 kg CO₂/jour" },
        { label: "Végétalien", value: "1.5 kg CO₂/jour" },
      ],
      source: "GIEC & ADEME",
      details: "Basé sur l'analyse du cycle de vie complet : agriculture, élevage, transformation, emballage, distribution et déchets alimentaires.",
    },
  },
  {
    id: "energie",
    icon: Zap,
    title: "Énergie",
    description: "Basé sur l'intensité carbone moyenne du réseau électrique.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
    expandedContent: {
      factors: [
        { label: "Mix électrique FR", value: "0.05 kg CO₂/kWh" },
        { label: "Gaz naturel", value: "0.23 kg CO₂/kWh" },
        { label: "Moyenne utilisée", value: "0.0005 t CO₂/kWh" },
      ],
      source: "RTE & ADEME",
      details: "Le mix électrique français est l'un des plus décarbonés d'Europe grâce au nucléaire. Les valeurs varient selon la source d'énergie.",
    },
  },
];

// Glass card styles
const glassCardStyles = cn(
  "bg-white/60 dark:bg-black/40",
  "backdrop-blur-xl",
  "shadow-lg shadow-black/5 dark:shadow-black/20"
);

function ExpandableMethodologyCard({
  card,
}: {
  card: (typeof methodologyCards)[0];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "p-5 rounded-xl border transition-all duration-300 cursor-pointer group",
        glassCardStyles,
        card.borderColor,
        card.hoverBorder,
        isExpanded && "ring-2 ring-primary/20"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: isExpanded ? 1 : 1.02, y: isExpanded ? 0 : -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2.5 rounded-xl transition-transform duration-300",
              card.bgColor,
              "group-hover:scale-110",
              `border ${card.borderColor}`
            )}
          >
            <card.icon className={cn("w-5 h-5", card.color)} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-1"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-border/50">
              {/* Factors table */}
              <div className="space-y-2 mb-4">
                {card.expandedContent.factors.map((factor) => (
                  <div
                    key={factor.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{factor.label}</span>
                    <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded">
                      {factor.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Details */}
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {card.expandedContent.details}
              </p>

              {/* Source */}
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <ExternalLink className="w-3 h-3" />
                <span>Source : {card.expandedContent.source}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function CalculatorMethodology() {
  return (
    <motion.div
      className={cn(
        "p-8 rounded-2xl border border-border/50",
        glassCardStyles
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Méthodologie Scientifique</h2>
      </div>

      <p className="text-muted-foreground mb-6">
        Ce calculateur s&apos;appuie sur la Base Carbone de l&apos;ADEME et les
        rapports du GIEC. Nous prenons en compte l&apos;analyse du cycle de vie
        complet. <span className="text-primary font-medium">Cliquez sur une carte</span> pour voir les détails.
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {methodologyCards.map((card) => (
          <ExpandableMethodologyCard key={card.id} card={card} />
        ))}
      </motion.div>
    </motion.div>
  );
}
