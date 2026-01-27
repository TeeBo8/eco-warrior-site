"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// Types pour les événements de la timeline
type Period = "discovery" | "warning" | "urgency";
type Importance = "normal" | "high" | "critical";

interface TimelineSource {
  label: string;
  url: string;
}

interface CO2DataPoint {
  year: number;
  ppm: number;
}

interface TemperatureData {
  threshold: number;
  current: number;
  parisTarget: number;
  preIndustrial: number;
}

interface TimelineEvent {
  id: number;
  year: number;
  titleFr: string;
  titleEn?: string;
  descriptionFr: string;
  descriptionEn?: string;
  detailsFr?: string;
  detailsEn?: string;
  icon?: string;
  period?: Period;
  importance?: Importance;
  sources?: TimelineSource[];
  funFacts?: string[];
  co2Data?: CO2DataPoint[];
  temperatureData?: TemperatureData;
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

// Mini graphique CO2 pour la Courbe de Keeling
function CO2MiniChart({ data }: { data: CO2DataPoint[] }) {
  const maxPpm = Math.max(...data.map(d => d.ppm));
  const minPpm = Math.min(...data.map(d => d.ppm));
  const range = maxPpm - minPpm;

  return (
    <div className="mt-4 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
      <div className="flex items-center gap-2 mb-3">
        <LucideIcons.BarChart3 className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-semibold text-amber-500">Évolution du CO2 (ppm)</span>
      </div>
      <div className="flex items-end gap-1 h-20">
        {data.map((point, index) => {
          const height = ((point.ppm - minPpm) / range) * 100;
          return (
            <motion.div
              key={point.year}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                style={{ minHeight: "4px" }}
              />
              <span className="text-[8px] text-muted-foreground">{point.year}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{minPpm} ppm</span>
        <span className="font-bold text-amber-500">{maxPpm} ppm</span>
      </div>
    </div>
  );
}

// Compteur animé pour le seuil de température
function TemperatureGauge({ data }: { data: TemperatureData }) {
  const [displayValue, setDisplayValue] = useState(0);
  const currentTemp = data.current;
  const percentage = (currentTemp / data.parisTarget) * 100;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = currentTemp / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= currentTemp) {
        setDisplayValue(currentTemp);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentTemp]);

  return (
    <div className="mt-4 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
      <div className="flex items-center gap-2 mb-3">
        <LucideIcons.Thermometer className="h-4 w-4 text-red-500" />
        <span className="text-sm font-semibold text-red-500">Réchauffement global</span>
      </div>

      {/* Jauge circulaire */}
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Cercle de fond */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            {/* Seuil 1.5°C */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(1.5 / data.parisTarget) * 251.2} 251.2`}
              className="text-orange-500/30"
            />
            {/* Progression actuelle */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#tempGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{ strokeDasharray: `${(percentage / 100) * 251.2} 251.2` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(249, 115, 22)" />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" />
              </linearGradient>
            </defs>
          </svg>
          {/* Valeur centrale */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-bold text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              +{displayValue.toFixed(2)}°C
            </motion.span>
            <span className="text-xs text-muted-foreground">depuis 1850</span>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="flex justify-between mt-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500/30" />
          <span className="text-muted-foreground">Seuil 1.5°C</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Objectif Paris: 2°C</span>
        </div>
      </div>
    </div>
  );
}

// Composant Modal pour les détails d'un événement
interface TimelineModalProps {
  event: TimelineEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

function TimelineModal({ event, isOpen, onClose }: TimelineModalProps) {
  if (!event) return null;

  const period = event.period || "discovery";
  const colors = periodColors[period];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-card border-2 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ borderColor: colors.primary + "40" }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div
              className={cn(
                "relative p-6 border-b",
                colors.bg,
                colors.border
              )}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at top, ${colors.primary}30, transparent 70%)`,
                }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        `bg-gradient-to-br ${colors.gradient}`,
                        "text-white shadow-lg"
                      )}
                    >
                      <DynamicIcon name={event.icon} className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "px-3 py-1 text-sm font-bold rounded-full",
                        colors.bg,
                        colors.text,
                        "border",
                        colors.border
                      )}
                    >
                      {event.year}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {event.titleFr}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <LucideIcons.X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description détaillée */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {event.detailsFr || event.descriptionFr}
                </p>
              </div>

              {/* Graphique CO2 si disponible */}
              {event.co2Data && <CO2MiniChart data={event.co2Data} />}

              {/* Jauge température si disponible */}
              {event.temperatureData && <TemperatureGauge data={event.temperatureData} />}

              {/* Fun Facts */}
              {event.funFacts && event.funFacts.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <LucideIcons.Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold">Le saviez-vous ?</span>
                  </div>
                  <ul className="space-y-2">
                    {event.funFacts.map((fact, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-yellow-500 mt-1">•</span>
                        {fact}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {event.sources && event.sources.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <LucideIcons.ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Sources</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all",
                          "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
                          "border border-transparent hover:border-border"
                        )}
                      >
                        <LucideIcons.Link className="h-3 w-3" />
                        {source.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Période : {period === "discovery" ? "Découvertes" : period === "warning" ? "Alertes" : "Urgence"}</span>
                <button
                  onClick={onClose}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all",
                    `bg-gradient-to-r ${colors.gradient}`,
                    "text-white hover:opacity-90"
                  )}
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Composant Mini-Timeline Sidebar
interface TimelineSidebarProps {
  events: TimelineEvent[];
  activeYear: number | null;
  scrollProgress: number;
  onYearClick: (year: number, eventId: number) => void;
}

function TimelineSidebar({ events, activeYear, scrollProgress, onYearClick }: TimelineSidebarProps) {
  // Extraire les années uniques et les trier
  const uniqueYears = [...new Map(events.map(e => [e.year, e])).values()];

  return (
    <motion.div
      className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Barre de progression scroll */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-muted-foreground/20 rounded-full">
        <motion.div
          className="absolute top-0 left-0 right-0 rounded-full origin-top"
          style={{
            height: `${scrollProgress * 100}%`,
            background: "linear-gradient(180deg, rgb(245 158 11), rgb(249 115 22), rgb(239 68 68))",
          }}
        />
      </div>

      {/* Conteneur des années */}
      <div className="relative flex flex-col items-center gap-3 py-4 px-2">
        {uniqueYears.map((event, index) => {
          const isActive = activeYear === event.year;
          const period = event.period || "discovery";
          const colors = periodColors[period];

          return (
            <motion.button
              key={event.year}
              onClick={() => onYearClick(event.year, event.id)}
              className={cn(
                "relative group flex items-center gap-2 transition-all duration-300",
                isActive ? "scale-110" : "scale-100"
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Point indicateur */}
              <motion.div
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-all duration-300",
                  isActive
                    ? `bg-gradient-to-br ${colors.gradient} border-white shadow-lg`
                    : "bg-background border-muted-foreground/40 hover:border-muted-foreground"
                )}
                animate={isActive ? {
                  boxShadow: [
                    `0 0 0 0 ${colors.primary}40`,
                    `0 0 0 8px ${colors.primary}00`,
                  ],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isActive ? Infinity : 0,
                }}
              />

              {/* Label année (visible au hover ou si actif) */}
              <AnimatePresence>
                {(isActive || false) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.8 }}
                    className={cn(
                      "absolute right-full mr-3 px-2 py-1 text-xs font-bold rounded-md whitespace-nowrap",
                      isActive
                        ? `${colors.bg} ${colors.text} border ${colors.border}`
                        : "bg-background/80 text-muted-foreground border border-border"
                    )}
                  >
                    {event.year}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip au hover */}
              <div className="absolute right-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className={cn(
                  "px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap",
                  "bg-popover text-popover-foreground border border-border shadow-md"
                )}>
                  {event.year}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Indicateur "Aujourd'hui" en bas */}
      <motion.div
        className="mt-2 flex flex-col items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] text-red-500 font-medium">Now</span>
      </motion.div>
    </motion.div>
  );
}

// Composant pour un élément individuel de la timeline
interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
  onClick: (event: TimelineEvent) => void;
}

function TimelineItem({ event, index, isLeft, onClick }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const period = event.period || "discovery";
  const importance = event.importance || "normal";
  const colors = periodColors[period];
  const sizes = importanceConfig[importance];

  return (
    <motion.div
      ref={ref}
      id={`timeline-event-${event.id}`}
      data-year={event.year}
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
        onClick={() => onClick(event)}
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

        {/* Indicateur "En savoir plus" */}
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-all",
            "opacity-60 group-hover:opacity-100",
            colors.text
          )}
        >
          <LucideIcons.Info className="h-3.5 w-3.5" />
          <span>Cliquez pour en savoir plus</span>
          <LucideIcons.ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
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
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler pour ouvrir le modal
  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  // Handler pour fermer le modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Hook pour le scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Transform pour la hauteur de la ligne de progression
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Transform pour le glow de la ligne
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);

  // Update scroll progress pour la sidebar
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Observer pour détecter l'élément actif
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trouver l'élément le plus visible
        let maxRatio = 0;
        let activeYear: string | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const year = entry.target.getAttribute("data-year");
            if (year) {
              activeYear = year;
            }
          }
        });

        if (activeYear) {
          setActiveYear(parseInt(activeYear, 10));
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observer tous les éléments de la timeline
    const timelineItems = container.querySelectorAll("[data-year]");
    timelineItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [events]);

  // Fonction scroll-to smooth
  const handleYearClick = useCallback((year: number, eventId: number) => {
    const element = document.getElementById(`timeline-event-${eventId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative py-8", className)}
    >
      {/* Mini-timeline Sidebar */}
      <TimelineSidebar
        events={events}
        activeYear={activeYear}
        scrollProgress={scrollProgress}
        onYearClick={handleYearClick}
      />

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
            onClick={handleEventClick}
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

      {/* Modal détails */}
      <TimelineModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

// Export pour compatibilité
export default TimelineCustom;
