'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  ExternalLink,
  Calendar,
  BookOpen,
  Users,
  Car,
  Factory,
  Flame,
  Waves,
  ThermometerSun,
  Wind
} from "lucide-react";

// Types
type MetricKey = 'co2' | 'tempAnomaly' | 'seaLevel' | 'iceMelt';

interface MetricInfo {
  name: string;
  fullName: string;
  description: string;
  howMeasured: string;
  whyMatters: string;
  unit: string;
  sources: {
    name: string;
    url: string;
    description: string;
  }[];
  lastUpdate: string;
  updateFrequency: string;
  humanImpact: {
    icon: React.ReactNode;
    text: string;
    equivalent: string;
  }[];
  keyFacts: string[];
  references: {
    title: string;
    authors: string;
    journal: string;
    year: number;
    url: string;
  }[];
}

// Données contextuelles pour chaque métrique
const metricsInfo: Record<MetricKey, MetricInfo> = {
  co2: {
    name: "CO₂",
    fullName: "Dioxyde de carbone atmosphérique",
    description: "Concentration de CO₂ dans l'atmosphère mesurée en parties par million (ppm). C'est le principal gaz à effet de serre d'origine humaine responsable du réchauffement climatique.",
    howMeasured: "Mesuré en continu depuis 1958 à l'observatoire de Mauna Loa (Hawaï) par spectroscopie infrarouge. Des mesures supplémentaires sont prises dans plus de 100 stations à travers le monde.",
    whyMatters: "Le CO₂ piège la chaleur dans l'atmosphère. Chaque augmentation de 1 ppm équivaut à environ 7,8 milliards de tonnes de CO₂ supplémentaires dans l'atmosphère.",
    unit: "ppm",
    sources: [
      {
        name: "NOAA Global Monitoring Laboratory",
        url: "https://gml.noaa.gov/ccgg/trends/",
        description: "Données officielles de référence mondiale"
      },
      {
        name: "Scripps Institution of Oceanography",
        url: "https://scripps.ucsd.edu/programs/keelingcurve/",
        description: "Courbe de Keeling historique"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Mensuelle",
    humanImpact: [
      {
        icon: <Car className="h-4 w-4" />,
        text: "Équivalent voitures",
        equivalent: "1 ppm = 2,1 milliards de voitures roulant 1 an"
      },
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Émissions industrielles",
        equivalent: "Hausse de 50% depuis l'ère pré-industrielle"
      },
      {
        icon: <Flame className="h-4 w-4" />,
        text: "Combustibles fossiles",
        equivalent: "85% du CO₂ vient du charbon, pétrole et gaz"
      }
    ],
    keyFacts: [
      "Niveau pré-industriel : ~280 ppm",
      "Seuil de sécurité estimé : 350 ppm (dépassé en 1988)",
      "Record historique sur 800 000 ans dépassé",
      "Augmentation de ~2,5 ppm/an actuellement"
    ],
    references: [
      {
        title: "Global Carbon Budget 2024",
        authors: "Friedlingstein et al.",
        journal: "Earth System Science Data",
        year: 2024,
        url: "https://essd.copernicus.org/articles/16/2249/2024/"
      },
      {
        title: "The Keeling Curve: A Story of CO2",
        authors: "Scripps CO2 Program",
        journal: "Scripps Institution of Oceanography",
        year: 2023,
        url: "https://scripps.ucsd.edu/programs/keelingcurve/"
      }
    ]
  },
  tempAnomaly: {
    name: "Température",
    fullName: "Anomalie de température globale",
    description: "Écart de la température moyenne mondiale par rapport à la période de référence 1951-1980. Une anomalie positive indique un réchauffement.",
    howMeasured: "Calculée à partir de milliers de stations météo terrestres, bouées océaniques et données satellites. NASA GISS utilise plus de 26 000 stations.",
    whyMatters: "Chaque dixième de degré compte. +1°C a déjà intensifié les événements extrêmes. +1.5°C est le seuil de l'Accord de Paris. +2°C serait catastrophique.",
    unit: "°C",
    sources: [
      {
        name: "NASA GISS Surface Temperature",
        url: "https://data.giss.nasa.gov/gistemp/",
        description: "Analyse de température de surface GISTEMP"
      },
      {
        name: "NOAA Global Temperature",
        url: "https://www.ncei.noaa.gov/access/monitoring/global-temperature-anomalies/",
        description: "Anomalies globales de température"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Mensuelle",
    humanImpact: [
      {
        icon: <Flame className="h-4 w-4" />,
        text: "Canicules",
        equivalent: "+1°C = vagues de chaleur 5x plus fréquentes"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Population à risque",
        equivalent: "3,5 milliards de personnes exposées d'ici 2050"
      },
      {
        icon: <ThermometerSun className="h-4 w-4" />,
        text: "Records battus",
        equivalent: "2024 : année la plus chaude jamais enregistrée"
      }
    ],
    keyFacts: [
      "Réchauffement de +1.2°C depuis l'ère pré-industrielle",
      "Les 10 années les plus chaudes : toutes après 2010",
      "Rythme actuel : +0.2°C par décennie",
      "Objectif Paris : limiter à +1.5°C (presque atteint)"
    ],
    references: [
      {
        title: "IPCC AR6 Climate Change 2021",
        authors: "GIEC",
        journal: "Cambridge University Press",
        year: 2021,
        url: "https://www.ipcc.ch/report/ar6/wg1/"
      },
      {
        title: "Global Surface Temperature Change",
        authors: "Hansen et al.",
        journal: "Reviews of Geophysics",
        year: 2010,
        url: "https://pubs.giss.nasa.gov/abs/ha00510u.html"
      }
    ]
  },
  seaLevel: {
    name: "Niveau mer",
    fullName: "Élévation du niveau moyen des mers",
    description: "Hausse du niveau moyen mondial des océans par rapport à l'année 2000. Causée par la dilatation thermique de l'eau et la fonte des glaces.",
    howMeasured: "Mesuré par satellites altimétriques (Jason, Sentinel) avec une précision millimétrique, complété par des marégraphes côtiers.",
    whyMatters: "Menace directe pour 1 milliard de personnes vivant en zone côtière. Chaque centimètre de hausse = millions de personnes supplémentaires à risque d'inondation.",
    unit: "mm",
    sources: [
      {
        name: "NASA Sea Level Portal",
        url: "https://sealevel.nasa.gov/",
        description: "Données satellites officielles NASA"
      },
      {
        name: "NOAA Sea Level Rise",
        url: "https://tidesandcurrents.noaa.gov/sltrends/",
        description: "Tendances et projections"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Mensuelle",
    humanImpact: [
      {
        icon: <Waves className="h-4 w-4" />,
        text: "Îles menacées",
        equivalent: "Tuvalu, Maldives, Kiribati pourraient disparaître"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Réfugiés climatiques",
        equivalent: "200 millions de déplacés d'ici 2100"
      },
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Infrastructures",
        equivalent: "14 000 milliards $ de dégâts potentiels"
      }
    ],
    keyFacts: [
      "Hausse de 101 mm depuis 2000 (+4 mm/an)",
      "Accélération : taux doublé depuis 1993",
      "Projection 2100 : +0.5m à +1m selon les scénarios",
      "Irréversible sur plusieurs siècles"
    ],
    references: [
      {
        title: "Sea Level Rise Technical Report",
        authors: "NOAA",
        journal: "NOAA Technical Report",
        year: 2022,
        url: "https://oceanservice.noaa.gov/hazards/sealevelrise/sealevelrise-tech-report.html"
      },
      {
        title: "Ice Sheet Contributions to Future Sea Level Rise",
        authors: "DeConto & Pollard",
        journal: "Nature",
        year: 2016,
        url: "https://www.nature.com/articles/nature17145"
      }
    ]
  },
  iceMelt: {
    name: "Fonte glace",
    fullName: "Perte de masse des calottes glaciaires",
    description: "Bilan massique annuel des calottes glaciaires (Antarctique + Groenland). Valeur négative = perte nette de glace. Mesuré en gigatonnes par an.",
    howMeasured: "Satellites GRACE et GRACE-FO mesurent les variations de gravité terrestre causées par les mouvements de masse (fonte des glaces).",
    whyMatters: "Les calottes contiennent assez d'eau pour élever le niveau des mers de 65 mètres. Leur fonte s'accélère et pourrait devenir irréversible.",
    unit: "Gt/an",
    sources: [
      {
        name: "NASA GRACE-FO",
        url: "https://grace.jpl.nasa.gov/",
        description: "Mission satellite de mesure gravimétrique"
      },
      {
        name: "IMBIE Ice Sheet Mass Balance",
        url: "https://imbie.org/",
        description: "Intercomparaison des bilans de masse"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Mensuelle",
    humanImpact: [
      {
        icon: <Waves className="h-4 w-4" />,
        text: "Contribution mer",
        equivalent: "150 Gt = +0.4 mm de niveau marin/an"
      },
      {
        icon: <Wind className="h-4 w-4" />,
        text: "Courants océaniques",
        equivalent: "Eau douce perturbe la circulation atlantique"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Écosystèmes",
        equivalent: "Ours polaires, phoques, manchots menacés"
      }
    ],
    keyFacts: [
      "Perte actuelle : ~150 Gt/an (Antarctique)",
      "Groenland : perte de 270 Gt/an supplémentaires",
      "Accélération de 3x depuis les années 1990",
      "Point de basculement possible si T > +1.5°C"
    ],
    references: [
      {
        title: "Mass Balance of the Greenland Ice Sheet",
        authors: "IMBIE Team",
        journal: "Nature",
        year: 2020,
        url: "https://www.nature.com/articles/s41586-019-1855-2"
      },
      {
        title: "Antarctic Ice Sheet Mass Balance",
        authors: "Rignot et al.",
        journal: "PNAS",
        year: 2019,
        url: "https://www.pnas.org/doi/10.1073/pnas.1812883116"
      }
    ]
  }
};

// Composant Tooltip rapide pour les cartes KPI
export function MetricTooltip({ metricKey, children }: { metricKey: MetricKey; children: React.ReactNode }) {
  const info = metricsInfo[metricKey];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4">
          <p className="font-semibold mb-2">{info.fullName}</p>
          <p className="text-sm text-muted-foreground">{info.description}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Mis à jour : {info.lastUpdate}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Composant bouton info pour ouvrir le modal détaillé
export function MetricInfoButton({ metricKey }: { metricKey: MetricKey }) {
  const [open, setOpen] = useState(false);
  const info = metricsInfo[metricKey];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
          <Info className="h-4 w-4" />
          <span className="sr-only">Plus d&apos;informations sur {info.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {info.fullName}
            <Badge variant="outline">{info.unit}</Badge>
          </DialogTitle>
          <DialogDescription>{info.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Comment c'est mesuré */}
          <section>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4" />
              Comment c&apos;est mesuré
            </h4>
            <p className="text-sm text-muted-foreground">{info.howMeasured}</p>
          </section>

          {/* Pourquoi c'est important */}
          <section>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Info className="h-4 w-4" />
              Pourquoi c&apos;est important
            </h4>
            <p className="text-sm text-muted-foreground">{info.whyMatters}</p>
          </section>

          {/* Impact humain */}
          <section>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              Impact humain
            </h4>
            <div className="grid gap-3">
              {info.humanImpact.map((impact, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="mt-0.5">{impact.icon}</div>
                  <div>
                    <p className="font-medium text-sm">{impact.text}</p>
                    <p className="text-sm text-muted-foreground">{impact.equivalent}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Faits clés */}
          <section>
            <h4 className="font-semibold mb-2">Faits clés</h4>
            <ul className="space-y-1">
              {info.keyFacts.map((fact, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </section>

          {/* Sources */}
          <section>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <ExternalLink className="h-4 w-4" />
              Sources officielles
            </h4>
            <div className="space-y-2">
              {info.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </section>

          {/* Références scientifiques */}
          <section>
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4" />
              Références scientifiques
            </h4>
            <div className="space-y-2">
              {info.references.map((ref, i) => (
                <a
                  key={i}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:border-primary transition-colors"
                >
                  <p className="font-medium text-sm">{ref.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {ref.authors} • {ref.journal} ({ref.year})
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Metadata */}
          <section className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Dernière mise à jour : {info.lastUpdate}</span>
              </div>
              <Badge variant="secondary">{info.updateFrequency}</Badge>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant section "Impact Humain" pour le dashboard
export function HumanImpactSection() {
  const impacts = [
    {
      metric: "CO₂ à 422 ppm",
      icon: <Factory className="h-6 w-6" />,
      equivalents: [
        "Équivalent à 2,8 milliards de voitures roulant toute l'année",
        "50% de plus que le niveau pré-industriel (280 ppm)",
        "Niveau jamais atteint depuis 4 millions d'années"
      ],
      color: "bg-orange-100 dark:bg-orange-950 border-orange-500"
    },
    {
      metric: "Température +1.29°C",
      icon: <ThermometerSun className="h-6 w-6" />,
      equivalents: [
        "5x plus de canicules mortelles qu'en 1980",
        "15% d'ouragans de catégorie 4-5 en plus",
        "30% de sécheresses en plus"
      ],
      color: "bg-red-100 dark:bg-red-950 border-red-500"
    },
    {
      metric: "Mer +101 mm",
      icon: <Waves className="h-6 w-6" />,
      equivalents: [
        "300 millions de personnes exposées aux inondations annuelles",
        "20 mégapoles côtières menacées d'ici 2050",
        "Disparition programmée d'îles entières"
      ],
      color: "bg-blue-100 dark:bg-blue-950 border-blue-500"
    },
    {
      metric: "Glace -150 Gt/an",
      icon: <Wind className="h-6 w-6" />,
      equivalents: [
        "Équivalent à 60 millions de piscines olympiques par an",
        "Suffisant pour couvrir la France de 27 cm d'eau",
        "Accélération de 3x depuis les années 1990"
      ],
      color: "bg-cyan-100 dark:bg-cyan-950 border-cyan-500"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6" />
        Impact Humain Concret
      </h2>
      <p className="text-muted-foreground">
        Ce que ces chiffres signifient pour notre vie quotidienne et notre avenir.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impacts.map((impact, i) => (
          <div key={i} className={`p-4 rounded-lg border-l-4 ${impact.color}`}>
            <div className="flex items-center gap-3 mb-3">
              {impact.icon}
              <h3 className="font-semibold">{impact.metric}</h3>
            </div>
            <ul className="space-y-2">
              {impact.equivalents.map((eq, j) => (
                <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-bold">→</span>
                  {eq}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export des données pour usage externe
export { metricsInfo };
export type { MetricKey, MetricInfo };
