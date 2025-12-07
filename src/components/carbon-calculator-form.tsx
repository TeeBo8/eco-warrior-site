"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

// Facteurs d'émission simplifiés (kg CO2 par unité)
const EMISSION_FACTORS = {
  transport: {
    car_gasoline: 0.21, // kg CO2 per km
    car_electric: 0.05,
    train: 0.04,
    plane: 0.255,
  },
  diet: {
    meat_lover: 3.3, // kg CO2 per day
    average: 2.5,
    vegetarian: 1.7,
    vegan: 1.5,
  },
  energy: 0.0005, // kg CO2 per kWh (France)
};

type CalculationResult = {
  totalEmissions: number;
  breakdown: { transport: number; diet: number; energy: number; };
};

export function CarbonCalculatorForm() {
  const t = useTranslations("CalculatorPage.form");
  const [result, setResult] = useState<CalculationResult | null>(null);

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

  function calculateEmissions(values: z.infer<typeof calculationSchema>) {
    // Calcul annuel
    const transportEmissions = values.distanceKm * EMISSION_FACTORS.transport[values.transportMode] * 365 / 1000;
    const dietEmissions = EMISSION_FACTORS.diet[values.diet] * 365 / 1000;
    const energyEmissions = values.energyKwh * EMISSION_FACTORS.energy * 12;

    const total = transportEmissions + dietEmissions + energyEmissions;

    setResult({
      totalEmissions: total,
      breakdown: {
        transport: transportEmissions,
        diet: dietEmissions,
        energy: energyEmissions,
      }
    });
  }

  function onSubmit(values: z.infer<typeof calculationSchema>) {
    calculateEmissions(values);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Transport */}
          <FormField
            control={form.control}
            name="distanceKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.distanceLabel')} ({field.value} km/jour)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={200}
                    step={5}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
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
                <FormLabel>{t('transport.modeLabel')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('transport.modePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="car_gasoline">{t('transport.modes.car_gasoline')}</SelectItem>
                    <SelectItem value="car_electric">{t('transport.modes.car_electric')}</SelectItem>
                    <SelectItem value="train">{t('transport.modes.train')}</SelectItem>
                    <SelectItem value="plane">{t('transport.modes.plane')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Diet */}
          <FormField
            control={form.control}
            name="diet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('diet.label')}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('diet.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="meat_lover">{t('diet.types.meat_lover')}</SelectItem>
                    <SelectItem value="average">{t('diet.types.average')}</SelectItem>
                    <SelectItem value="vegetarian">{t('diet.types.vegetarian')}</SelectItem>
                    <SelectItem value="vegan">{t('diet.types.vegan')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Energy */}
          <FormField
            control={form.control}
            name="energyKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('energy.label')} ({field.value} kWh/mois)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={1000}
                    step={50}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {t('calculateButton')}
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t('result.title')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">{result.totalEmissions.toFixed(2)}</p>
            <p className="text-lg text-muted-foreground">{t('result.unit')}</p>
            <div className="text-left mt-6 space-y-2">
              <p>🚗 Transport: {result.breakdown.transport.toFixed(2)} {t('result.unit')}</p>
              <p>🍽️ Alimentation: {result.breakdown.diet.toFixed(2)} {t('result.unit')}</p>
              <p>⚡ Énergie: {result.breakdown.energy.toFixed(2)} {t('result.unit')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}