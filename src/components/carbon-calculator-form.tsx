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
                <FormLabel>Distance quotidienne moyenne ({field.value} km/jour)</FormLabel>
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
                <FormLabel>Mode de transport principal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un mode..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="car_gasoline">Voiture (essence)</SelectItem>
                    <SelectItem value="car_electric">Voiture (électrique)</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="plane">Avion</SelectItem>
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
                <FormLabel>Régime alimentaire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
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

          {/* Energy */}
          <FormField
            control={form.control}
            name="energyKwh"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consommation d&apos;énergie du foyer ({field.value} kWh/mois)</FormLabel>
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
            Calculer mon empreinte
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Votre Empreinte Carbone Annuelle Estimée</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-5xl font-bold text-primary">{result.totalEmissions.toFixed(2)}</p>
            <p className="text-lg text-muted-foreground">tonnes de CO₂e</p>
            <div className="text-left mt-6 space-y-2">
              <p>🚗 Transport: {result.breakdown.transport.toFixed(2)} tonnes de CO₂e</p>
              <p>🍽️ Alimentation: {result.breakdown.diet.toFixed(2)} tonnes de CO₂e</p>
              <p>⚡ Énergie: {result.breakdown.energy.toFixed(2)} tonnes de CO₂e</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}