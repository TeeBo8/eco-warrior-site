"use client";

import { motion } from "framer-motion";
import { Calculator, Leaf, Sparkles, TrendingDown, Globe } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function CalculatorHero() {
  return (
    <motion.div
      className="text-center mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
          <div className="relative bg-white/60 dark:bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl">
            <Calculator className="w-12 h-12 text-primary" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-green-500/20 backdrop-blur-sm p-1.5 rounded-full border border-green-500/30">
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl lg:text-6xl font-bold font-display"
      >
        <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
          Calculez votre{" "}
        </span>
        <span className="bg-gradient-to-r from-primary via-primary to-green-400 bg-clip-text text-transparent">
          Empreinte Carbone
        </span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto"
      >
        Estimez votre impact annuel sur la planète en quelques clics.
        <span className="block mt-2 text-sm text-muted-foreground/70">
          Basé sur les données de l&apos;ADEME et du GIEC
        </span>
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8"
      >
        {[
          { icon: Sparkles, label: "Calcul instantané", color: "text-green-500", bg: "bg-green-500/10" },
          { icon: Globe, label: "Sources scientifiques", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: TrendingDown, label: "Réduisez votre impact", color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/5"
          >
            <div className={`p-1 rounded-full ${item.bg}`}>
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
