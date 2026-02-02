"use client";

import { motion } from "framer-motion";
import { Calculator, Leaf } from "lucide-react";

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
      className="text-center mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative bg-primary/10 p-4 rounded-2xl border border-primary/20">
            <Calculator className="w-10 h-10 text-primary" />
          </div>
          <Leaf className="absolute -top-2 -right-2 w-5 h-5 text-primary animate-pulse" />
        </div>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
      >
        Calculez votre Empreinte Carbone
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto"
      >
        Estimez votre impact annuel sur la planète en quelques clics.
        <span className="block mt-1 text-sm text-muted-foreground/70">
          Basé sur les données de l&apos;ADEME et du GIEC
        </span>
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span>Calcul instantané</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Sources scientifiques</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>100% gratuit</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
