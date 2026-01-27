"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour les événements de la timeline
type Period = "discovery" | "warning" | "urgency";
type Importance = "normal" | "high" | "critical";

interface TimelineEvent {
  id: number;
  year: number;
  titleFr: string;
  titleEn?: string;
  descriptionFr: string;
  descriptionEn?: string;
  icon?: string;
  period?: Period;
  importance?: Importance;
}

// Configuration des couleurs par période
const periodColors: Record<Period, {
  primary: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
  text: string;
}> = {
  discovery: {
    primary: "rgb(245, 158, 11)", // amber-500
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/30",
    gradient: "from-amber-500 to-amber-600",
    text: "text-amber-500",
  },
  warning: {
    primary: "rgb(249, 115, 22)", // orange-500
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "shadow-orange-500/30",
    gradient: "from-orange-500 to-orange-600",
    text: "text-orange-500",
  },
  urgency: {
    primary: "rgb(239, 68, 68)", // red-500
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "shadow-red-500/30",
    gradient: "from-red-500 to-red-600",
    text: "text-red-500",
  },
};

// Configuration des tailles par importance
const importanceConfig: Record<Importance, {
  scale: string;
  iconSize: string;
  padding: string;
  titleSize: string;
}> = {
  normal: {
    scale: "md:w-[calc(50%-2rem)]",
    iconSize: "w-12 h-12",
    padding: "p-5",
    titleSize: "text-lg",
  },
  high: {
    scale: "md:w-[calc(55%-2rem)]",
    iconSize: "w-14 h-14",
    padding: "p-6",
    titleSize: "text-xl",
  },
  critical: {
    scale: "md:w-[calc(60%-2rem)]",
    iconSize: "w-16 h-16",
    padding: "p-7",
    titleSize: "text-2xl",
  },
};

// Composant pour les icônes dynamiques
const DynamicIcon = ({ name, className }: { name: string | null | undefined; className?: string }) => {
  if (!name || !(name in LucideIcons)) {
    return <LucideIcons.History className={cn("h-5 w-5", className)} />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  return <LucideIcon className={cn("h-5 w-5", className)} />;
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

  const period = event.period || "discovery";
  const importance = event.importance || "normal";
  const colors = periodColors[period];
  const sizes = importanceConfig[importance];

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
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Carte de contenu */}
      <motion.div
        className={cn(
          "w-full",
          sizes.scale,
          sizes.padding,
          "rounded-xl",
          "bg-card/80 backdrop-blur-sm",
          "border-2",
          colors.border,
          "shadow-lg",
          isLeft ? "md:text-right" : "md:text-left",
          "text-left",
          "group cursor-pointer"
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
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        style={{
          boxShadow: `0 4px 20px -5px ${colors.primary}20`,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10",
            "blur-xl"
          )}
          style={{
            background: `radial-gradient(circle at center, ${colors.primary}30, transparent 70%)`,
          }}
        />

        {/* Badge année avec couleur de période */}
        <motion.span
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-full mb-3",
            colors.bg,
            colors.text,
            "border",
            colors.border
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
          <DynamicIcon name={event.icon} className="h-4 w-4" />
          {event.year}
        </motion.span>

        <h3 className={cn(
          "font-bold text-foreground mb-2",
          sizes.titleSize,
          importance === "critical" && "bg-gradient-to-r bg-clip-text text-transparent",
          importance === "critical" && colors.gradient
        )}>
          {event.titleFr}
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {event.descriptionFr}
        </p>

        {/* Indicateur d'importance pour les événements critiques */}
        {importance === "critical" && (
          <motion.div
            className={cn(
              "mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold",
              colors.bg,
              colors.text
            )}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <LucideIcons.AlertCircle className="h-3 w-3" />
            Événement majeur
          </motion.div>
        )}
      </motion.div>

      {/* Spacer pour le centre (visible uniquement en desktop) */}
      <div className="hidden md:block w-16" />

      {/* Point de connexion central */}
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
        {/* Cercle extérieur pulsant avec couleur de période */}
        <motion.div
          className="absolute inset-0 -m-3 rounded-full"
          style={{ backgroundColor: `${colors.primary}30` }}
          animate={isInView ? {
            scale: [1, 1.8, 1],
            opacity: [0.5, 0, 0.5],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />

        {/* Cercle principal avec icône et couleur de période */}
        <div
          className={cn(
            "relative rounded-full",
            sizes.iconSize,
            "flex items-center justify-center",
            "border-4 border-background",
            `bg-gradient-to-br ${colors.gradient}`,
            "text-white",
            "shadow-lg",
            colors.glow
          )}
        >
          <DynamicIcon
            name={event.icon}
            className={cn(
              importance === "normal" && "h-5 w-5",
              importance === "high" && "h-6 w-6",
              importance === "critical" && "h-7 w-7"
            )}
          />
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
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient background subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-orange-500/5 to-red-500/5 pointer-events-none rounded-3xl" />

      {/* Ligne verticale de fond (statique) avec gradient */}
      <div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1.5 rounded-full"
        style={{
          background: "linear-gradient(180deg, rgb(245 158 11 / 0.2), rgb(249 115 22 / 0.2), rgb(239 68 68 / 0.2))",
        }}
      />

      {/* Ligne verticale de progression (animée) avec gradient multicolore */}
      <motion.div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 w-1.5 rounded-full origin-top overflow-hidden"
        style={{
          height: lineHeight,
          opacity: lineOpacity,
        }}
      >
        {/* Gradient animé discovery → warning → urgency */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(180deg, rgb(245 158 11), rgb(249 115 22), rgb(239 68 68))",
          }}
        />

        {/* Effet glow */}
        <div
          className="absolute inset-0 blur-sm rounded-full"
          style={{
            background: "linear-gradient(180deg, rgb(245 158 11), rgb(249 115 22), rgb(239 68 68))",
          }}
        />

        {/* Point brillant au bout de la ligne */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgb(249 115 22), rgb(239 68 68))",
          }}
          animate={{
            boxShadow: [
              "0 0 10px 2px rgba(249, 115, 22, 0.5)",
              "0 0 25px 6px rgba(239, 68, 68, 0.8)",
              "0 0 10px 2px rgba(249, 115, 22, 0.5)",
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

      {/* Indicateur de fin avec effet dramatic */}
      <motion.div
        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 -bottom-4 flex flex-col items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/40"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-3 h-3 mt-2 rounded-full bg-red-500/60"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="w-2 h-2 mt-1 rounded-full bg-red-500/40"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />

        {/* Label "Aujourd'hui" */}
        <motion.span
          className="mt-4 text-xs font-semibold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Aujourd&apos;hui
        </motion.span>
      </motion.div>
    </div>
  );
}

// Export pour compatibilité
export default TimelineCustom;
