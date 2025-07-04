"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { HistoryChart } from "./history-chart";
import Link from "next/link";
import { usePremiumStatus, useTestMode } from "@/lib/test-mode-context";

type CalculationResult = {
  totalEmissions: number;
  breakdown: { transport: number; diet: number; energy: number; };
};

export function CarbonCalculatorForm() {
  const t = useTranslations("CalculatorPage.form");
  const tPremium = useTranslations("CalculatorPage.premium");
  const { isSignedIn } = useUser();
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // 👇 NOUVEAU SYSTÈME DE TEST GLOBAL 👇
  const isPremium = usePremiumStatus();
  const { testMode } = useTestMode();
  
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

  const calculateMutation = trpc.carbon.calculateFootprint.useMutation({
    onSuccess: (data: CalculationResult) => setResult(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Error: ${message}`);
    },
  });

  // Nouvelle mutation pour sauvegarder
  const saveMutation = trpc.carbon.saveFootprint.useMutation({
    onSuccess: () => {
      // Invalider les données de l'historique pour forcer un re-fetch
      historyQuery.refetch(); 
    },
  });
  
  // Nouvelle requête pour l'historique
  const historyQuery = trpc.carbon.getHistory.useQuery(undefined, {
    enabled: isPremium, // On ne charge l'historique que pour les membres premium
  });

  function onSubmit(values: z.infer<typeof calculationSchema>) {
    calculateMutation.mutate(values);
  }

  // Données fictives pour la démonstration
  const demoHistoryData = [
    { createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), totalEmissions: 2.8 },
    { createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), totalEmissions: 2.5 },
    { createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), totalEmissions: 2.2 },
    { createdAt: new Date().toISOString(), totalEmissions: 2.0 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* 👑 Indicateur du mode actuel */}
      {isPremium && (testMode === 'dev' || testMode === 'premium') && (
        <Card className="mb-6 border-green-400 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-green-700">
              <span className="text-lg">{testMode === 'dev' ? '🔧' : '⭐'}</span>
              <span className="text-sm font-medium">
                {testMode === 'dev' ? 'Mode Développeur Actif' : 'Mode Premium Simulé'} - Fonctionnalités premium déverrouillées
              </span>
            </div>
          </CardContent>
        </Card>
      )}

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

          <Button type="submit" disabled={calculateMutation.isPending}>
            {calculateMutation.isPending ? t('calculating') : t('calculateButton')}
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
            
            {/* Bouton de sauvegarde pour les membres premium */}
            {isPremium ? (
              <Button
                onClick={() => saveMutation.mutate({
                  totalEmissions: result.totalEmissions,
                  transportEmissions: result.breakdown.transport,
                  dietEmissions: result.breakdown.diet,
                  energyEmissions: result.breakdown.energy,
                  // Ajout des données originales pour les badges
                  transportMode: form.getValues('transportMode'),
                  diet: form.getValues('diet'),
                })}
                disabled={saveMutation.isPending}
                className="mt-6 w-full"
              >
                {saveMutation.isPending ? t('result.saving') : t('result.saveButton')}
                {testMode !== 'normal' && <span className="ml-2 text-xs opacity-75">({testMode === 'dev' ? 'Mode Dev' : 'Mode Premium'})</span>}
              </Button>
            ) : (
              <div className="mt-6">
                <Button disabled className="w-full opacity-60">
                  🔒 {t('result.saveButton')}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  {isSignedIn 
                    ? tPremium('features.reservedForPremium') 
                    : tPremium('features.signInAndUpgrade')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section promotion premium pour les non-premium */}
      {!isPremium && result && (
        <Card className="mt-8 border-2 border-primary bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ {tPremium('title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {tPremium('description')}
              </p>
              
              {/* Aperçu du graphique avec overlay */}
              <div className="relative">
                <div className="opacity-40">
                  <HistoryChart data={demoHistoryData} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">🔒 {tPremium('featureTitle')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {tPremium('featureDescription')}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {!isSignedIn ? (
                        <Link href="/sign-in">
                          <Button>{tPremium('signInButton')}</Button>
                        </Link>
                      ) : null}
                      <Link href="/pricing">
                        <Button variant="outline">{tPremium('discoverButton')}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Avantages premium */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">📊</span>
                  <span className="text-sm">{tPremium('features.history')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🎯</span>
                  <span className="text-sm">{tPremium('features.goals')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">💡</span>
                  <span className="text-sm">{tPremium('features.tips')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">🏆</span>
                  <span className="text-sm">{tPremium('features.badges')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Affichage de l'historique pour les membres premium */}
      {isPremium && historyQuery.data && historyQuery.data.length > 0 ? (
        <div className="mt-8">
          <HistoryChart data={historyQuery.data} />
        </div>
      ) : null}
    </div>
  );
} 