"use client";

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// CSS pour animations performantes (will-change + CSS animations)
const performanceStyles = `
  .timeline-card {
    will-change: transform, opacity;
  }
  .timeline-line {
    will-change: height, opacity;
  }
  .timeline-dot {
    will-change: transform;
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(1); opacity: 0.5; }
  }
  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  .animate-pulse-ring {
    animation: pulse-ring 2s ease-in-out infinite;
  }
  .animate-pulse-dot {
    animation: pulse-dot 2s ease-in-out infinite;
  }
`;

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

// Configuration des tailles par importance avec breakpoints responsive
const importanceConfig: Record<Importance, {
  scale: string;
  iconSize: string;
  padding: string;
  titleSize: string;
}> = {
  normal: {
    scale: "w-full sm:w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] lg:w-[calc(50%-3rem)]",
    iconSize: "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12",
    padding: "p-4 sm:p-5",
    titleSize: "text-base sm:text-lg",
  },
  high: {
    scale: "w-full sm:w-[calc(100%-3rem)] md:w-[calc(55%-2rem)] lg:w-[calc(55%-3rem)]",
    iconSize: "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14",
    padding: "p-4 sm:p-5 md:p-6",
    titleSize: "text-lg sm:text-xl",
  },
  critical: {
    scale: "w-full sm:w-[calc(100%-3rem)] md:w-[calc(60%-2rem)] lg:w-[calc(60%-3rem)]",
    iconSize: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    padding: "p-4 sm:p-6 md:p-7",
    titleSize: "text-lg sm:text-xl md:text-2xl",
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

          {/* Modal - responsive avec will-change */}
          <motion.div
            className="timeline-card fixed inset-2 sm:inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-card border-2 rounded-xl sm:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ borderColor: colors.primary + "40" }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header - responsive padding */}
            <div
              className={cn(
                "relative p-4 sm:p-6 border-b",
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

              <div className="relative flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        `bg-gradient-to-br ${colors.gradient}`,
                        "text-white shadow-lg"
                      )}
                    >
                      <DynamicIcon name={event.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span
                      className={cn(
                        "px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold rounded-full",
                        colors.bg,
                        colors.text,
                        "border",
                        colors.border
                      )}
                    >
                      {event.year}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground line-clamp-2">
                    {event.titleFr}
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                >
                  <LucideIcons.X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Content - responsive padding */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Description détaillée */}
              <div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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

            {/* Footer - responsive */}
            <div className="p-3 sm:p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                <span className="hidden sm:inline">Période : {period === "discovery" ? "Découvertes" : period === "warning" ? "Alertes" : "Urgence"}</span>
                <span className="sm:hidden">{period === "discovery" ? "Découvertes" : period === "warning" ? "Alertes" : "Urgence"}</span>
                <button
                  onClick={onClose}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all",
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

// Composant pour un élément individuel de la timeline avec lazy loading
interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isLeft: boolean;
  onClick: (event: TimelineEvent) => void;
}

const TimelineItem = memo(function TimelineItem({ event, index, isLeft, onClick }: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy loading: déclenche le rendu quand l'élément est à 200px du viewport
  const isInView = useInView(ref, { once: true, margin: "200px 0px" });
  const [shouldRender, setShouldRender] = useState(false);

  // Lazy loading: ne rendre le contenu que quand visible
  useEffect(() => {
    if (isInView && !shouldRender) {
      setShouldRender(true);
    }
  }, [isInView, shouldRender]);

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
        "timeline-card relative flex items-center w-full",
        isLeft ? "md:flex-row-reverse" : "md:flex-row",
        // Mobile: centré avec flex-col
        "flex-col gap-4 sm:gap-6 md:gap-8"
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={shouldRender ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.1, 0.3), // Cap delay for better UX
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Carte de contenu - rendu uniquement si visible (lazy loading) */}
      {shouldRender ? (
        <motion.div
          onClick={() => onClick(event)}
          className={cn(
            sizes.scale,
            sizes.padding,
            "rounded-xl",
            "bg-card/80 backdrop-blur-sm",
            "border-2",
            colors.border,
            "shadow-lg",
            // Mobile: texte aligné à gauche, Desktop: alternance
            "text-left",
            isLeft ? "md:text-right" : "md:text-left",
            "group cursor-pointer",
            // Mobile: centré avec marges auto
            "mx-auto sm:mx-0"
          )}
          initial={{
            opacity: 0,
            x: isLeft ? 30 : -30,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }}
          transition={{
            duration: 0.5,
            delay: Math.min(index * 0.1, 0.2) + 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          whileHover={{
            y: -6,
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

        {/* Badge année avec couleur de période - responsive */}
        <motion.span
          className={cn(
            "inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold rounded-full mb-2 sm:mb-3",
            colors.bg,
            colors.text,
            "border",
            colors.border
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: Math.min(index * 0.1, 0.2) + 0.2,
          }}
        >
          <DynamicIcon name={event.icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {event.descriptionFr}
        </p>

        {/* Indicateur d'importance pour les événements critiques - CSS animation */}
        {importance === "critical" && (
          <div
            className={cn(
              "mt-3 sm:mt-4 inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold animate-pulse-dot",
              colors.bg,
              colors.text
            )}
          >
            <LucideIcons.AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="hidden sm:inline">Événement majeur</span>
            <span className="sm:hidden">Majeur</span>
          </div>
        )}

        {/* Indicateur "En savoir plus" */}
        <div
          className={cn(
            "mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition-all",
            "opacity-60 group-hover:opacity-100",
            colors.text
          )}
        >
          <LucideIcons.Info className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cliquez pour en savoir plus</span>
          <span className="sm:hidden">Voir plus</span>
          <LucideIcons.ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
      ) : (
        // Placeholder skeleton pour lazy loading
        <div
          className={cn(
            sizes.scale,
            sizes.padding,
            "rounded-xl bg-muted/30 animate-pulse mx-auto sm:mx-0",
            "min-h-[150px] sm:min-h-[180px]"
          )}
        />
      )}

      {/* Spacer pour le centre (visible uniquement en tablet+) */}
      <div className="hidden md:block w-12 lg:w-16" />

      {/* Point de connexion central - mobile: centré en haut, desktop: milieu */}
      <motion.div
        className={cn(
          "timeline-dot absolute z-10",
          // Mobile: centré horizontalement, en haut de la carte
          "left-1/2 -translate-x-1/2 -top-5",
          // Tablet+: sur la ligne centrale
          "sm:left-6 sm:translate-x-0 sm:top-auto",
          "md:left-1/2 md:-translate-x-1/2"
        )}
        initial={{ scale: 0 }}
        animate={shouldRender ? { scale: 1 } : { scale: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          delay: Math.min(index * 0.1, 0.2),
        }}
      >
        {/* Cercle extérieur pulsant - CSS animation pour performance */}
        <div
          className="absolute inset-0 -m-2 sm:-m-3 rounded-full animate-pulse-ring"
          style={{ backgroundColor: `${colors.primary}30` }}
        />

        {/* Cercle principal avec icône et couleur de période */}
        <div
          className={cn(
            "relative rounded-full",
            sizes.iconSize,
            "flex items-center justify-center",
            "border-3 sm:border-4 border-background",
            `bg-gradient-to-br ${colors.gradient}`,
            "text-white",
            "shadow-lg",
            colors.glow
          )}
        >
          <DynamicIcon
            name={event.icon}
            className={cn(
              importance === "normal" && "h-4 w-4 sm:h-5 sm:w-5",
              importance === "high" && "h-5 w-5 sm:h-6 sm:w-6",
              importance === "critical" && "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            )}
          />
        </div>
      </motion.div>

      {/* Espace vide de l'autre côté (tablet+ uniquement) */}
      <div className="hidden md:block w-[calc(50%-2rem)] lg:w-[calc(50%-3rem)]" />
    </motion.div>
  );
});

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
      className={cn("relative py-6 sm:py-8", className)}
    >
      {/* Styles CSS pour animations performantes */}
      <style dangerouslySetInnerHTML={{ __html: performanceStyles }} />

      {/* Mini-timeline Sidebar - masquée sur mobile/tablet petit */}
      <TimelineSidebar
        events={events}
        activeYear={activeYear}
        scrollProgress={scrollProgress}
        onYearClick={handleYearClick}
      />

      {/* Noise texture overlay - réduit sur mobile pour performance */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none hidden sm:block"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient background subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-orange-500/5 to-red-500/5 pointer-events-none rounded-2xl sm:rounded-3xl" />

      {/* Ligne verticale de fond (statique) - centrée sur mobile aussi */}
      <div
        className={cn(
          "absolute top-0 bottom-0 rounded-full",
          // Mobile: centrée, largeur réduite
          "left-1/2 -translate-x-1/2 w-1",
          // Tablet: légèrement à gauche
          "sm:left-6 sm:translate-x-0 sm:w-1",
          // Desktop: centrée avec largeur normale
          "md:left-1/2 md:-translate-x-1/2 md:w-1.5"
        )}
        style={{
          background: "linear-gradient(180deg, rgb(245 158 11 / 0.2), rgb(249 115 22 / 0.2), rgb(239 68 68 / 0.2))",
        }}
      />

      {/* Ligne verticale de progression (animée) avec gradient multicolore */}
      <motion.div
        className={cn(
          "timeline-line absolute top-0 rounded-full origin-top overflow-hidden",
          "left-1/2 -translate-x-1/2 w-1",
          "sm:left-6 sm:translate-x-0 sm:w-1",
          "md:left-1/2 md:-translate-x-1/2 md:w-1.5"
        )}
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

        {/* Effet glow - désactivé sur mobile pour performance */}
        <div
          className="absolute inset-0 blur-sm rounded-full hidden sm:block"
          style={{
            background: "linear-gradient(180deg, rgb(245 158 11), rgb(249 115 22), rgb(239 68 68))",
          }}
        />

        {/* Point brillant au bout de la ligne - CSS animation */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full animate-pulse-dot"
          style={{
            background: "linear-gradient(135deg, rgb(249 115 22), rgb(239 68 68))",
            boxShadow: "0 0 15px 4px rgba(249, 115, 22, 0.6)",
          }}
        />
      </motion.div>

      {/* Éléments de la timeline - responsive spacing */}
      <div className={cn(
        "relative",
        // Mobile: espacement vertical réduit, pas de padding gauche (timeline centrée)
        "space-y-16 pt-8",
        // Tablet: padding gauche pour la ligne
        "sm:space-y-14 sm:pl-16",
        // Desktop: espacement normal, centré
        "md:space-y-16 md:pl-0"
      )}>
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

      {/* Indicateur de fin avec effet dramatic - CSS animations pour performance */}
      <motion.div
        className={cn(
          "absolute -bottom-4 flex flex-col items-center",
          "left-1/2 -translate-x-1/2",
          "sm:left-6 sm:translate-x-0",
          "md:left-1/2 md:-translate-x-1/2"
        )}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Point principal avec CSS animation */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/40 animate-pulse-dot" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 mt-2 rounded-full bg-red-500/60 animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-2 mt-1 rounded-full bg-red-500/40 animate-pulse-dot" style={{ animationDelay: "0.4s" }} />

        {/* Label "Aujourd'hui" */}
        <span className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-semibold text-red-500 bg-red-500/10 px-2 sm:px-3 py-1 rounded-full border border-red-500/30 animate-pulse-dot">
          Aujourd&apos;hui
        </span>
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
