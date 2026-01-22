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
type MetricKey = 'co2' | 'tempAnomaly' | 'seaLevel' | 'iceMelt' | 'globalEmissions' | 'biodiversity' | 'airQuality' | 'renewableEnergy' | 'climateRefugees';

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
  },
  // Phase 9 - Indicateurs supplémentaires
  globalEmissions: {
    name: "Émissions CO₂",
    fullName: "Émissions mondiales de CO₂",
    description: "Total des émissions de dioxyde de carbone produites par l'activité humaine à l'échelle mondiale, principalement par la combustion de combustibles fossiles, l'industrie et la déforestation.",
    howMeasured: "Calculé à partir des données de consommation énergétique, de production industrielle et de changement d'utilisation des terres de chaque pays. L'IEA compile ces données annuellement.",
    whyMatters: "Les émissions globales déterminent directement la concentration de CO₂ dans l'atmosphère et donc l'ampleur du réchauffement climatique. Réduire ces émissions est essentiel pour atteindre les objectifs de l'Accord de Paris.",
    unit: "Gt/an",
    sources: [
      {
        name: "IEA - International Energy Agency",
        url: "https://www.iea.org/data-and-statistics/data-browser",
        description: "Données mondiales sur les émissions de CO₂"
      },
      {
        name: "Global Carbon Project",
        url: "https://www.globalcarbonproject.org/",
        description: "Bilan carbone mondial annuel"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Annuelle",
    humanImpact: [
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Industrie & énergie",
        equivalent: "73% des émissions viennent de l'énergie et l'industrie"
      },
      {
        icon: <Car className="h-4 w-4" />,
        text: "Transport",
        equivalent: "16% des émissions mondiales"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Par habitant",
        equivalent: "Moyenne mondiale : 4.7 tonnes CO₂/personne/an"
      }
    ],
    keyFacts: [
      "Record historique de 37.4 Gt en 2025",
      "Chine : 31%, USA : 14%, UE : 8% des émissions",
      "Objectif 2030 : réduire de 45% pour limiter à 1.5°C",
      "Besoin de zéro émission nette d'ici 2050"
    ],
    references: [
      {
        title: "Global Energy Review 2025",
        authors: "IEA",
        journal: "International Energy Agency",
        year: 2025,
        url: "https://www.iea.org/reports/global-energy-review-2025"
      },
      {
        title: "Global Carbon Budget 2024",
        authors: "Friedlingstein et al.",
        journal: "Earth System Science Data",
        year: 2024,
        url: "https://essd.copernicus.org/articles/16/2249/2024/"
      }
    ]
  },
  biodiversity: {
    name: "Biodiversité",
    fullName: "Déclin de la biodiversité mondiale",
    description: "Pourcentage de déclin des populations d'espèces sauvages depuis 1970, mesuré par l'Indice Planète Vivante du WWF qui suit près de 32 000 populations de plus de 5 000 espèces.",
    howMeasured: "L'Indice Planète Vivante compile les données de milliers d'études scientifiques sur les populations de mammifères, oiseaux, reptiles, amphibiens et poissons à travers le monde.",
    whyMatters: "La biodiversité est essentielle pour la santé des écosystèmes dont dépend l'humanité : pollinisation, purification de l'eau, régulation du climat, alimentation. Son effondrement menace notre survie.",
    unit: "%",
    sources: [
      {
        name: "WWF Living Planet Report",
        url: "https://livingplanet.panda.org/",
        description: "Rapport biennal sur l'état de la biodiversité"
      },
      {
        name: "IPBES Global Assessment",
        url: "https://ipbes.net/global-assessment",
        description: "Évaluation mondiale de la biodiversité"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Biennale",
    humanImpact: [
      {
        icon: <Users className="h-4 w-4" />,
        text: "Alimentation",
        equivalent: "75% des cultures dépendent des pollinisateurs"
      },
      {
        icon: <Waves className="h-4 w-4" />,
        text: "Océans",
        equivalent: "90% des grands poissons ont disparu"
      },
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Déforestation",
        equivalent: "10 millions d'hectares perdus par an"
      }
    ],
    keyFacts: [
      "69% de déclin des populations sauvages depuis 1970",
      "1 million d'espèces menacées d'extinction",
      "Taux d'extinction 1000x plus rapide que naturel",
      "Amérique latine : -94% de déclin"
    ],
    references: [
      {
        title: "Living Planet Report 2024",
        authors: "WWF",
        journal: "World Wildlife Fund",
        year: 2024,
        url: "https://livingplanet.panda.org/"
      },
      {
        title: "Global Assessment Report on Biodiversity",
        authors: "IPBES",
        journal: "UN Environment Programme",
        year: 2019,
        url: "https://ipbes.net/global-assessment"
      }
    ]
  },
  airQuality: {
    name: "Qualité air",
    fullName: "Indice de qualité de l'air mondial (AQI)",
    description: "L'indice de qualité de l'air (AQI) mesure la concentration de polluants atmosphériques. Un AQI de 0-50 est bon, 51-100 modéré, au-delà c'est nocif pour la santé.",
    howMeasured: "Mesuré en temps réel par des milliers de stations dans le monde, basé sur les concentrations de PM2.5, PM10, ozone, NO₂, SO₂ et CO. IQAir agrège ces données globalement.",
    whyMatters: "La pollution de l'air cause 7 millions de décès prématurés par an. Elle aggrave les maladies respiratoires, cardiovasculaires et augmente les risques de cancer.",
    unit: "AQI",
    sources: [
      {
        name: "IQAir World Air Quality",
        url: "https://www.iqair.com/world-air-quality",
        description: "Données en temps réel de qualité de l'air"
      },
      {
        name: "WHO Air Quality Guidelines",
        url: "https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health",
        description: "Directives OMS sur la qualité de l'air"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Temps réel",
    humanImpact: [
      {
        icon: <Users className="h-4 w-4" />,
        text: "Santé publique",
        equivalent: "7 millions de morts/an liées à la pollution"
      },
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Villes polluées",
        equivalent: "99% de la population respire un air pollué"
      },
      {
        icon: <Wind className="h-4 w-4" />,
        text: "PM2.5",
        equivalent: "Particules fines : principal danger sanitaire"
      }
    ],
    keyFacts: [
      "AQI moyen mondial : 58 (modéré)",
      "Asie du Sud : région la plus polluée (AQI > 100)",
      "Coût économique : 8% du PIB mondial",
      "Objectif OMS : AQI < 25"
    ],
    references: [
      {
        title: "World Air Quality Report 2024",
        authors: "IQAir",
        journal: "IQAir",
        year: 2024,
        url: "https://www.iqair.com/world-air-quality-report"
      },
      {
        title: "Health Effects of Air Pollution",
        authors: "WHO",
        journal: "World Health Organization",
        year: 2024,
        url: "https://www.who.int/health-topics/air-pollution"
      }
    ]
  },
  renewableEnergy: {
    name: "Renouvelables",
    fullName: "Part d'énergie renouvelable mondiale",
    description: "Pourcentage de l'électricité mondiale produite à partir de sources renouvelables : solaire, éolien, hydraulique, géothermie et biomasse.",
    howMeasured: "L'IEA compile les données de production électrique de tous les pays, distinguant les sources fossiles (charbon, gaz, pétrole), nucléaire et renouvelables.",
    whyMatters: "La transition vers les énergies renouvelables est essentielle pour décarboner l'économie. Chaque point de pourcentage gagné représente des millions de tonnes de CO₂ évitées.",
    unit: "%",
    sources: [
      {
        name: "IEA Renewables",
        url: "https://www.iea.org/energy-system/renewables",
        description: "Données mondiales sur les énergies renouvelables"
      },
      {
        name: "IRENA Statistics",
        url: "https://www.irena.org/Statistics",
        description: "Statistiques de l'Agence internationale pour les énergies renouvelables"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Annuelle",
    humanImpact: [
      {
        icon: <ThermometerSun className="h-4 w-4" />,
        text: "Solaire",
        equivalent: "Croissance de 25%/an, la plus rapide"
      },
      {
        icon: <Wind className="h-4 w-4" />,
        text: "Éolien",
        equivalent: "Capacité doublée en 5 ans"
      },
      {
        icon: <Factory className="h-4 w-4" />,
        text: "Emplois",
        equivalent: "13 millions d'emplois dans les renouvelables"
      }
    ],
    keyFacts: [
      "30.1% d'électricité renouvelable en 2025",
      "Solaire + éolien : 15% du mix électrique",
      "Objectif 2030 : tripler les capacités",
      "Prix du solaire : -90% en 10 ans"
    ],
    references: [
      {
        title: "Renewables 2024",
        authors: "IEA",
        journal: "International Energy Agency",
        year: 2024,
        url: "https://www.iea.org/reports/renewables-2024"
      },
      {
        title: "World Energy Transitions Outlook",
        authors: "IRENA",
        journal: "International Renewable Energy Agency",
        year: 2024,
        url: "https://www.irena.org/publications/2024/World-Energy-Transitions-Outlook-2024"
      }
    ]
  },
  climateRefugees: {
    name: "Déplacés",
    fullName: "Déplacés climatiques annuels",
    description: "Nombre de personnes forcées de quitter leur foyer chaque année à cause d'événements climatiques extrêmes : tempêtes, inondations, sécheresses, montée des eaux.",
    howMeasured: "L'IDMC (Internal Displacement Monitoring Centre) suit les déplacements causés par les catastrophes naturelles dans chaque pays, en distinguant les causes météorologiques.",
    whyMatters: "Les déplacements climatiques créent des crises humanitaires, des tensions géopolitiques et menacent la stabilité de régions entières. Ce nombre va fortement augmenter.",
    unit: "M/an",
    sources: [
      {
        name: "IDMC Global Report",
        url: "https://www.internal-displacement.org/",
        description: "Rapport mondial sur les déplacements internes"
      },
      {
        name: "UNHCR Climate Action",
        url: "https://www.unhcr.org/climate-action",
        description: "Action climatique du HCR"
      }
    ],
    lastUpdate: "Décembre 2025",
    updateFrequency: "Annuelle",
    humanImpact: [
      {
        icon: <Waves className="h-4 w-4" />,
        text: "Inondations",
        equivalent: "Cause n°1 des déplacements climatiques"
      },
      {
        icon: <Flame className="h-4 w-4" />,
        text: "Tempêtes",
        equivalent: "Cyclones de plus en plus intenses"
      },
      {
        icon: <Users className="h-4 w-4" />,
        text: "Projection 2050",
        equivalent: "200+ millions de réfugiés climatiques"
      }
    ],
    keyFacts: [
      "26.4 millions de déplacés climatiques en 2025",
      "3x plus de déplacés qu'il y a 20 ans",
      "Asie : 80% des déplacements",
      "1 personne déplacée toutes les 2 secondes"
    ],
    references: [
      {
        title: "Global Report on Internal Displacement 2024",
        authors: "IDMC",
        journal: "Internal Displacement Monitoring Centre",
        year: 2024,
        url: "https://www.internal-displacement.org/global-report"
      },
      {
        title: "Climate Change and Displacement",
        authors: "UNHCR",
        journal: "UN Refugee Agency",
        year: 2024,
        url: "https://www.unhcr.org/climate-action"
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
