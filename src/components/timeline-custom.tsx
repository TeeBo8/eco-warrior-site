"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// Type pour les événements de la timeline
interface TimelineEvent {
  id: number;
  year: number;
  titleFr: string;
  titleEn?: string;
  descriptionFr: string;
  descriptionEn?: string;
  icon?: string;
}

// Composant pour les icônes dynamiques
const DynamicIcon = ({ name }: { name: string | null | undefined }) => {
  if (!name || !(name in LucideIcons)) {
    return <LucideIcons.History className="h-5 w-5" />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  return <LucideIcon className="h-5 w-5" />;
};

// Composant pour un élément individuel de la timeline
interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
}

function TimelineItem({ event, index, isLeft }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex items-center w-full",
        isLeft ? "md:flex-row-reverse" : "md:flex-row",
        "flex-col md:gap-8"
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15, // Stagger animation
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Carte de contenu */}
      <motion.div
        className={cn(
          "w-full md:w-[calc(50%-2rem)] p-6 rounded-xl",
          "bg-card border border-border shadow-lg",
          "hover:shadow-xl hover:border-primary/30 transition-all duration-300",
          isLeft ? "md:text-right" : "md:text-left",
          "text-left"
        )}
        initial={{
          opacity: 0,
          x: isLeft ? 50 : -50,
          scale: 0.95
        }}
        animate={isInView ? {
          opacity: 1,
          x: 0,
          scale: 1
        } : {
          opacity: 0,
          x: isLeft ? 50 : -50,
          scale: 0.95
        }}
        transition={{
          duration: 0.5,
          delay: index * 0.15 + 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 }
        }}
      >
        {/* Badge année */}
        <motion.span
          className={cn(
            "inline-block px-3 py-1 text-sm font-bold rounded-full mb-3",
            "bg-primary/10 text-primary border border-primary/20"
          )}
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: index * 0.15 + 0.3,
          }}
        >
          {event.year}
        </motion.span>

        <h3 className="text-xl font-bold text-foreground mb-2">
          {event.titleFr}
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {event.descriptionFr}
        </p>
      </motion.div>

      {/* Spacer pour le centre (visible uniquement en desktop) */}
      <div className="hidden md:block w-16" />

      {/* Point de connexion central (visible sur mobile) */}
      <motion.div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          delay: index * 0.15,
        }}
      >
        {/* Cercle extérieur pulsant */}
        <motion.div
          className="absolute inset-0 -m-2 rounded-full bg-primary/20"
          animate={isInView ? {
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />

        {/* Cercle principal avec icône */}
        <div className={cn(
          "relative w-12 h-12 rounded-full",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center",
          "shadow-lg shadow-primary/25",
          "border-4 border-background"
        )}>
          <DynamicIcon name={event.icon} />
        </div>
      </motion.div>

      {/* Espace vide de l'autre côté (desktop uniquement) */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </motion.div>
  );
}

// Composant principal TimelineCustom
interface TimelineCustomProps {
  events: TimelineEvent[];
  className?: string;
}

export function TimelineCustom({ events, className }: TimelineCustomProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook pour le scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform pour la hauteur de la ligne de progression
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Transform pour le glow de la ligne
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);

  return (
    <div
      ref={containerRef}
      className={cn("relative py-8", className)}
    >
      {/* Ligne verticale de fond (statique) */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-muted/50 rounded-full" />

      {/* Ligne verticale de progression (animée) */}
      <motion.div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 w-1 rounded-full origin-top"
        style={{
          height: lineHeight,
          opacity: lineOpacity,
        }}
      >
        {/* Gradient animé */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-full" />

        {/* Effet glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-transparent blur-sm rounded-full" />

        {/* Point brillant au bout de la ligne */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
          animate={{
            boxShadow: [
              "0 0 10px 2px hsl(var(--primary) / 0.5)",
              "0 0 20px 4px hsl(var(--primary) / 0.8)",
              "0 0 10px 2px hsl(var(--primary) / 0.5)",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Éléments de la timeline */}
      <div className="relative space-y-12 md:space-y-16 pl-16 md:pl-0">
        {events.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            index={index}
            isLeft={index % 2 === 0}
          />
        ))}
      </div>

      {/* Indicateur de fin */}
      <motion.div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 -bottom-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/30" />
        <motion.div
          className="w-2 h-2 mt-1 rounded-full bg-primary/50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="w-1 h-1 mt-1 rounded-full bg-primary/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
      </motion.div>
    </div>
  );
}

// Export pour compatibilité
export default TimelineCustom;
