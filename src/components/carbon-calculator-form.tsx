"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Train, Plane, Zap, Utensils, Loader2, Sparkles, Gauge, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Facteurs d'émission simplifiés (kg CO2 par unité)
const EMISSION_FACTORS = {
  transport: {
    car_gasoline: 0.21,
    car_electric: 0.05,
    train: 0.04,
    plane: 0.255,
  },
  diet: {
    meat_lover: 3.3,
    average: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  },
  energy: 0.0005,
};

// Moyenne française pour comparaison
const FRENCH_AVERAGE = 9.0; // tonnes CO2e/an

type CalculationResult = {
  totalEmissions: number;
  breakdown: { transport: number; diet: number; energy: number };
};

// Hook pour l'animation du compteur
function useCountUp(target: number, duration: number = 1500, enabled: boolean = true) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || target === 0) {
      setCount(target);
      return;
    }

    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, enabled]);

  return count;
}

// Variants pour les animations
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const resultCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const breakdownItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.3 },
  }),
};

// Glass card styles
const glassCardStyles = cn(
  "border-white/10 dark:border-white/5",
  "bg-white/60 dark:bg-black/40",
  "backdrop-blur-xl",
  "shadow-xl shadow-black/5 dark:shadow-black/20",
  "hover:shadow-2xl hover:shadow-primary/5",
  "hover:border-primary/20 dark:hover:border-primary/30",
  "transition-all duration-300"
);

export function CarbonCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const animatedTotal = useCountUp(
    result?.totalEmissions ?? 0,
    1500,
    showResult
  );

  const calculationSchema = z.object({
    distanceKm: z.number().min(0),
    transportMode: z.enum(["car_gasoline", "car_electric", "plane", "train"]),
    diet: z.enum(["meat_lover", "average", "vegetarian", "vegan"]),
    energyKwh: z.number().min(0),
  });

  const form = useForm<z.infer<typeof calculationSchema>>({
    resolver: zodResolver(calculationSchema),
    defaultValues: {
      distanceKm: 20,
      transportMode: "car_gasoline",
      diet: "average",
      energyKwh: 250,
    },
  });

  // Watch all values for live preview
  const distanceValue = form.watch("distanceKm");
  const energyValue = form.watch("energyKwh");
  const transportMode = form.watch("transportMode");
  const diet = form.watch("diet");

  // Calculate live preview
  const livePreview = useMemo(() => {
    const transportEmissions =
      (distanceValue * EMISSION_FACTORS.transport[transportMode] * 365) / 1000;
    const dietEmissions = (EMISSION_FACTORS.diet[diet] * 365) / 1000;
    const energyEmissions = energyValue * EMISSION_FACTORS.energy * 12;
    const total = transportEmissions + dietEmissions + energyEmissions;

    return {
      total,
      breakdown: {
        transport: transportEmissions,
        diet: dietEmissions,
        energy: energyEmissions,
      },
    };
  }, [distanceValue, energyValue, transportMode, diet]);

  function calculateEmissions(values: z.infer<typeof calculationSchema>) {
    const transportEmissions =
      (values.distanceKm * EMISSION_FACTORS.transport[values.transportMode] * 365) / 1000;
    const dietEmissions = (EMISSION_FACTORS.diet[values.diet] * 365) / 1000;
    const energyEmissions = values.energyKwh * EMISSION_FACTORS.energy * 12;

    const total = transportEmissions + dietEmissions + energyEmissions;

    return {
      totalEmissions: total,
      breakdown: {
        transport: transportEmissions,
        diet: dietEmissions,
        energy: energyEmissions,
      },
    };
  }

  async function onSubmit(values: z.infer<typeof calculationSchema>) {
    setIsCalculating(true);
    setShowResult(false);

    // Petit délai pour l'effet de loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const calculatedResult = calculateEmissions(values);
    setResult(calculatedResult);
    setIsCalculating(false);
    setShowResult(true);
  }

  const transportIcons = {
    car_gasoline: Car,
    car_electric: Car,
    train: Train,
    plane: Plane,
  };

  const TransportIcon = transportIcons[transportMode];

  // Calcul du pourcentage pour le gradient du slider
  const distancePercent = (distanceValue / 200) * 100;
  const energyPercent = (energyValue / 1000) * 100;

  // Comparison to French average
  const comparisonPercent = ((livePreview.total - FRENCH_AVERAGE) / FRENCH_AVERAGE) * 100;
  const ComparisonIcon = comparisonPercent > 5 ? TrendingUp : comparisonPercent < -5 ? TrendingDown : Minus;

  return (
    <div className="w-full">
      {/* Layout asymétrique : 7 cols form + 5 cols preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne gauche : Formulaire (7 cols) */}
        <motion.div
          className="lg:col-span-7"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Transport Section */}
              <motion.div variants={formItemVariants}>
                <Card className={glassCardStyles}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <TransportIcon className="w-5 h-5 text-blue-500" />
                      </div>
                      Transport
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="distanceKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <span>Distance quotidienne moyenne</span>
                            <span className="text-primary font-semibold tabular-nums px-2 py-0.5 rounded-md bg-primary/10">
                              {field.value} km/jour
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative pt-2">
                              <Slider
                                min={0}
                                max={200}
                                step={5}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                className="cursor-pointer"
                                style={{
                                  // @ts-expect-error CSS custom property
                                  "--slider-progress": `${distancePercent}%`,
                                }}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>0 km</span>
                                <span>200 km</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transportMode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode de transport principal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="hover:border-primary/50 transition-colors bg-background/50">
                                <SelectValue placeholder="Sélectionnez un mode..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="car_gasoline">
                                <span className="flex items-center gap-2">
                                  <Car className="w-4 h-4" /> Voiture (essence)
                                </span>
                              </SelectItem>
                              <SelectItem value="car_electric">
                                <span className="flex items-center gap-2">
                                  <Car className="w-4 h-4 text-green-500" /> Voiture (électrique)
                                </span>
                              </SelectItem>
                              <SelectItem value="train">
                                <span className="flex items-center gap-2">
                                  <Train className="w-4 h-4 text-blue-500" /> Train
                                </span>
                              </SelectItem>
                              <SelectItem value="plane">
                                <span className="flex items-center gap-2">
                                  <Plane className="w-4 h-4 text-amber-500" /> Avion
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Diet Section */}
              <motion.div variants={formItemVariants}>
                <Card className={glassCardStyles}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                        <Utensils className="w-5 h-5 text-green-500" />
                      </div>
                      Alimentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="diet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Régime alimentaire</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="hover:border-primary/50 transition-colors bg-background/50">
                                <SelectValue placeholder="Sélectionnez un régime..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="meat_lover">Riche en viande</SelectItem>
                              <SelectItem value="average">Moyen</SelectItem>
                              <SelectItem value="vegetarian">Végétarien</SelectItem>
                              <SelectItem value="vegan">Végétalien</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Energy Section */}
              <motion.div variants={formItemVariants}>
                <Card className={glassCardStyles}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Zap className="w-5 h-5 text-amber-500" />
                      </div>
                      Énergie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="energyKwh"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center justify-between">
                            <span>Consommation d&apos;énergie du foyer</span>
                            <span className="text-primary font-semibold tabular-nums px-2 py-0.5 rounded-md bg-primary/10">
                              {field.value} kWh/mois
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative pt-2">
                              <Slider
                                min={0}
                                max={1000}
                                step={50}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                className="cursor-pointer"
                                style={{
                                  // @ts-expect-error CSS custom property
                                  "--slider-progress": `${energyPercent}%`,
                                }}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>0 kWh</span>
                                <span>1000 kWh</span>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={formItemVariants}>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isCalculating}
                  className={cn(
                    "w-full h-14 text-lg font-semibold relative overflow-hidden group",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
                    "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isCalculating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Calcul en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Calculer mon empreinte
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>

        {/* Colonne droite : Preview live sticky (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className={cn(glassCardStyles, "overflow-hidden")}>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="w-4 h-4 text-primary" />
                  Aperçu en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Main total display */}
                <div className="text-center mb-6">
                  <motion.div
                    className="relative inline-block"
                    key={livePreview.total.toFixed(2)}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent blur-2xl rounded-full" />
                    <p className="relative text-5xl font-bold tabular-nums bg-gradient-to-r from-primary via-primary to-green-400 bg-clip-text text-transparent">
                      {livePreview.total.toFixed(2)}
                    </p>
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">tonnes CO₂e/an</p>

                  {/* Comparison badge */}
                  <div className={cn(
                    "inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium",
                    comparisonPercent > 5 ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                    comparisonPercent < -5 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                    "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  )}>
                    <ComparisonIcon className="w-3.5 h-3.5" />
                    <span>
                      {Math.abs(comparisonPercent).toFixed(0)}%
                      {comparisonPercent > 5 ? " au-dessus" : comparisonPercent < -5 ? " en-dessous" : " proche"}
                      {" "}de la moyenne FR
                    </span>
                  </div>
                </div>

                {/* Breakdown bars */}
                <div className="space-y-4">
                  {[
                    {
                      icon: Car,
                      label: "Transport",
                      value: livePreview.breakdown.transport,
                      color: "bg-blue-500",
                      bgColor: "bg-blue-500/10",
                      textColor: "text-blue-500",
                    },
                    {
                      icon: Utensils,
                      label: "Alimentation",
                      value: livePreview.breakdown.diet,
                      color: "bg-green-500",
                      bgColor: "bg-green-500/10",
                      textColor: "text-green-500",
                    },
                    {
                      icon: Zap,
                      label: "Énergie",
                      value: livePreview.breakdown.energy,
                      color: "bg-amber-500",
                      bgColor: "bg-amber-500/10",
                      textColor: "text-amber-500",
                    },
                  ].map((item, i) => {
                    const percentage = livePreview.total > 0 ? (item.value / livePreview.total) * 100 : 0;
                    return (
                      <motion.div
                        key={item.label}
                        custom={i}
                        variants={breakdownItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded-lg", item.bgColor)}>
                              <item.icon className={cn("w-3.5 h-3.5", item.textColor)} />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">
                            {item.value.toFixed(2)}t
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", item.color)}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Reference scale */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Moyenne française : <span className="font-semibold">{FRENCH_AVERAGE} t/an</span>
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Objectif 2050 : <span className="font-semibold text-green-500">2 t/an</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final Results Card (appears after calculation) */}
          <AnimatePresence mode="wait">
            {showResult && result && (
              <motion.div
                key="result"
                variants={resultCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-6"
              >
                <Card className={cn(
                  glassCardStyles,
                  "border-primary/30 bg-gradient-to-br from-white/80 via-white/60 to-primary/5 dark:from-black/60 dark:via-black/40 dark:to-primary/10"
                )}>
                  <CardHeader className="text-center pb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="mx-auto mb-2"
                    >
                      <div className="relative inline-flex">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <div className="relative bg-primary/10 p-3 rounded-full border border-primary/20">
                          <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </motion.div>
                    <CardTitle className="text-lg">
                      Résultat Final
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-2">
                    <motion.p
                      className="text-4xl font-bold tabular-nums bg-gradient-to-r from-primary via-primary to-green-400 bg-clip-text text-transparent"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
                    >
                      {animatedTotal.toFixed(2)}
                    </motion.p>
                    <motion.p
                      className="text-sm text-muted-foreground mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      tonnes de CO₂e par an
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
