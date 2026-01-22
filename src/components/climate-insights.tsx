'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Zap,
  Scale,
  Clock,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { climateHistoryData } from "@/data/climate-history";

// Types
interface Insight {
  id: string;
  category: 'fact' | 'comparison' | 'milestone' | 'projection';
  title: string;
  content: string;
  source?: string;
  icon: React.ReactNode;
  highlight?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface Comparison {
  id: string;
  title: string;
  description: string;
  before: { label: string; value: string };
  after: { label: string; value: string };
  change: string;
  changeType: 'increase' | 'decrease';
  context: string;
}

interface RecommendedArticle {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  relevance: string;
}

// Données des insights quotidiens
const dailyInsights: Insight[] = [
  {
    id: 'insight-1',
    category: 'fact',
    title: "Le saviez-vous ?",
    content: "Chaque seconde, l'humanité émet 1 360 tonnes de CO₂ dans l'atmosphère. C'est l'équivalent de 136 camions-citernes remplis de gaz toutes les secondes.",
    source: "Global Carbon Project 2024",
    icon: <Lightbulb className="h-5 w-5" />,
    highlight: "1 360 tonnes/seconde",
  },
  {
    id: 'insight-2',
    category: 'milestone',
    title: "Record historique",
    content: "Le niveau de CO₂ actuel (422 ppm) n'a jamais été aussi élevé depuis au moins 4 millions d'années, bien avant l'apparition de l'Homo sapiens.",
    source: "NOAA Paleoclimatology",
    icon: <Zap className="h-5 w-5" />,
    highlight: "4 millions d'années",
    trend: 'up',
  },
  {
    id: 'insight-3',
    category: 'comparison',
    title: "Perspective temporelle",
    content: "La température a augmenté de +1.29°C en 150 ans. Pour comparaison, la sortie de l'ère glaciaire a pris 10 000 ans pour un réchauffement similaire.",
    source: "IPCC AR6",
    icon: <Clock className="h-5 w-5" />,
    highlight: "100x plus rapide",
    trend: 'up',
  },
  {
    id: 'insight-4',
    category: 'projection',
    title: "Si rien ne change",
    content: "À ce rythme, nous atteindrons +2°C d'ici 2050. Cela signifie des canicules mortelles, des migrations massives et la disparition de 90% des récifs coralliens.",
    source: "Climate Analytics",
    icon: <TrendingUp className="h-5 w-5" />,
    highlight: "2050",
    trend: 'up',
  },
  {
    id: 'insight-5',
    category: 'fact',
    title: "La mer monte",
    content: "Avec +101mm depuis 2000, le niveau de la mer a déjà submergé des territoires. Les Îles Salomon ont perdu 5 îles habitées depuis 1993.",
    source: "NASA Sea Level Portal",
    icon: <Lightbulb className="h-5 w-5" />,
    highlight: "5 îles disparues",
    trend: 'up',
  },
  {
    id: 'insight-6',
    category: 'milestone',
    title: "Point de bascule",
    content: "L'Antarctique perd 150 milliards de tonnes de glace par an. Au-delà de certains seuils, la fonte devient irréversible sur des millénaires.",
    source: "NASA GRACE",
    icon: <Zap className="h-5 w-5" />,
    highlight: "150 Gt/an",
    trend: 'down',
  },
  {
    id: 'insight-7',
    category: 'comparison',
    title: "Équivalence parlante",
    content: "Les émissions mondiales de CO₂ représentent 40 milliards de tonnes par an. C'est comme si chaque humain remplissait 1 000 ballons de baudruche de CO₂ par jour.",
    source: "Global Carbon Budget",
    icon: <Scale className="h-5 w-5" />,
    highlight: "1000 ballons/jour/personne",
  },
];

// Comparaisons intéressantes basées sur les données réelles
function generateComparisons(): Comparison[] {
  const co2Start = climateHistoryData.co2[0];
  const co2End = climateHistoryData.co2[climateHistoryData.co2.length - 1];
  const tempStart = climateHistoryData.tempAnomaly[0];
  const tempEnd = climateHistoryData.tempAnomaly[climateHistoryData.tempAnomaly.length - 1];
  const seaStart = climateHistoryData.seaLevel[0];
  const seaEnd = climateHistoryData.seaLevel[climateHistoryData.seaLevel.length - 1];
  const iceStart = climateHistoryData.iceMelt[0];
  const iceEnd = climateHistoryData.iceMelt[climateHistoryData.iceMelt.length - 1];

  return [
    {
      id: 'comp-co2',
      title: "CO₂ atmosphérique",
      description: "Évolution de la concentration de dioxyde de carbone",
      before: { label: "2000", value: `${co2Start.value} ppm` },
      after: { label: "2025", value: `${co2End.value} ppm` },
      change: `+${(co2End.value - co2Start.value).toFixed(1)} ppm`,
      changeType: 'increase',
      context: "Augmentation de 14% en 25 ans",
    },
    {
      id: 'comp-temp',
      title: "Température globale",
      description: "Anomalie par rapport à la moyenne 1951-1980",
      before: { label: "2000", value: `+${tempStart.value}°C` },
      after: { label: "2025", value: `+${tempEnd.value}°C` },
      change: `+${(tempEnd.value - tempStart.value).toFixed(2)}°C`,
      changeType: 'increase',
      context: "Réchauffement 3x plus rapide qu'au siècle dernier",
    },
    {
      id: 'comp-sea',
      title: "Niveau de la mer",
      description: "Élévation par rapport à l'an 2000",
      before: { label: "2000", value: `${seaStart.value} mm` },
      after: { label: "2025", value: `+${seaEnd.value} mm` },
      change: `+${seaEnd.value} mm`,
      changeType: 'increase',
      context: "Rythme de +4mm/an (accélération)",
    },
    {
      id: 'comp-ice',
      title: "Fonte des glaces",
      description: "Perte de masse de l'Antarctique",
      before: { label: "2000", value: `${Math.abs(iceStart.value)} Gt/an` },
      after: { label: "2025", value: `${Math.abs(iceEnd.value)} Gt/an` },
      change: `+${Math.abs(iceEnd.value) - Math.abs(iceStart.value)} Gt/an`,
      changeType: 'increase',
      context: "La fonte a triplé en 25 ans",
    },
  ];
}

// Articles recommandés avec pertinence contextuelle
const recommendedArticles: RecommendedArticle[] = [
  {
    slug: "2024-annee-tous-les-records",
    title: "2024 : L'année qui a tout changé",
    summary: "Retour sur une année climatique hors norme où les records sont tombés.",
    imageUrl: "https://images.unsplash.com/photo-1605218427368-35b8dd5a7461?auto=format&fit=crop&q=80&w=200",
    relevance: "Lié aux records actuels de température",
  },
  {
    slug: "ocean-cry",
    title: "Le cri silencieux de l'océan",
    summary: "L'acidification des océans, l'autre problème du CO₂.",
    imageUrl: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&q=80&w=200",
    relevance: "Comprendre l'impact du CO₂ sur les océans",
  },
  {
    slug: "empreinte-carbone-individuelle",
    title: "L'Empreinte Carbone : Mythe ou Levier ?",
    summary: "L'action individuelle sert-elle vraiment face aux géants ?",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5c73?auto=format&fit=crop&q=80&w=200",
    relevance: "Passer à l'action après avoir compris les données",
  },
];

// Composant Insight du jour
function DailyInsight() {
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sélectionner un insight aléatoire basé sur le jour
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % dailyInsights.length;
    setCurrentInsight(dailyInsights[index]);
  }, []);

  const refreshInsight = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * dailyInsights.length);
      setCurrentInsight(dailyInsights[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  if (!currentInsight) return null;

  const categoryColors = {
    fact: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    comparison: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    milestone: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    projection: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  };

  const categoryLabels = {
    fact: 'Fait',
    comparison: 'Comparaison',
    milestone: 'Jalon',
    projection: 'Projection',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              {currentInsight.icon}
            </div>
            <div>
              <Badge className={cn("text-xs", categoryColors[currentInsight.category])}>
                {categoryLabels[currentInsight.category]}
              </Badge>
              <CardTitle className="text-lg mt-1">{currentInsight.title}</CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshInsight}
            className={cn(isRefreshing && "animate-spin")}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Nouvel insight</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">{currentInsight.content}</p>

        {currentInsight.highlight && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{currentInsight.highlight}</span>
            {currentInsight.trend === 'up' && <TrendingUp className="h-5 w-5 text-red-500" />}
            {currentInsight.trend === 'down' && <TrendingDown className="h-5 w-5 text-blue-500" />}
          </div>
        )}

        {currentInsight.source && (
          <p className="text-xs text-muted-foreground mt-3">
            Source : {currentInsight.source}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Composant Comparaisons
function ComparisonCards() {
  const comparisons = generateComparisons();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Évolution 2000 → 2025
        </CardTitle>
        <CardDescription>
          Comparaison des indicateurs climatiques sur 25 ans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisons.map((comp) => (
            <div
              key={comp.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <h4 className="font-semibold text-sm">{comp.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{comp.description}</p>

              <div className="flex items-center justify-between gap-2">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{comp.before.label}</p>
                  <p className="font-mono font-medium">{comp.before.value}</p>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge
                    variant={comp.changeType === 'increase' ? 'destructive' : 'default'}
                    className="text-xs mt-1"
                  >
                    {comp.change}
                  </Badge>
                </div>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{comp.after.label}</p>
                  <p className="font-mono font-medium">{comp.after.value}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center italic">
                {comp.context}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Composant Articles Recommandés
function RecommendedArticles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Articles Recommandés
        </CardTitle>
        <CardDescription>
          Pour approfondir votre compréhension des enjeux climatiques
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors group"
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-16 h-16 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {article.summary}
                </p>
                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {article.relevance}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-5" />
            </Link>
          ))}
        </div>

        <Link href="/articles">
          <Button variant="outline" className="w-full mt-4">
            Voir tous les articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Composant principal combinant tout
export function ClimateInsights() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Lightbulb className="h-6 w-6" />
        Analyses & Insights
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insight du jour - occupe toute la largeur sur mobile */}
        <DailyInsight />

        {/* Articles recommandés */}
        <RecommendedArticles />
      </div>

      {/* Comparaisons - pleine largeur */}
      <ComparisonCards />
    </div>
  );
}

// Exports individuels pour flexibilité
export { DailyInsight, ComparisonCards, RecommendedArticles };
