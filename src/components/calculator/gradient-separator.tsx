"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientSeparatorProps {
  className?: string;
  variant?: "default" | "glow";
}

export function GradientSeparator({
  className,
  variant = "default",
}: GradientSeparatorProps) {
  return (
    <motion.div
      className={cn("relative w-full h-px", className)}
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Base gradient line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Glow effect for glow variant */}
      {variant === "glow" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm" />
      )}

      {/* Center accent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Optional decorative dots */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      </div>
    </motion.div>
  );
}
