'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Scale,
  Search,
  Shield,
  Users,
} from 'lucide-react';

const METHODOLOGY_STEPS = [
  {
    icon: Search,
    title: 'Identification',
    description:
      'Nous identifions les mythes climatiques les plus répandus sur les réseaux sociaux, dans les médias et dans les discussions publiques.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: BookOpen,
    title: 'Recherche documentaire',
    description:
      'Chaque mythe fait l\'objet d\'une recherche approfondie dans la littérature scientifique peer-reviewed et les rapports officiels.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    icon: Scale,
    title: 'Vérification croisée',
    description:
      'Les informations sont croisées avec plusieurs sources indépendantes pour garantir leur exactitude et leur fiabilité.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    icon: FileText,
    title: 'Rédaction accessible',
    description:
      'Les explications sont rédigées dans un langage clair et accessible, sans jargon technique inutile.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
];

const MAIN_SOURCES = [
  {
    name: 'GIEC (IPCC)',
    description: 'Groupe d\'experts intergouvernemental sur l\'évolution du climat',
    url: 'https://www.ipcc.ch/',
    type: 'Institution internationale',
    badge: 'Référence mondiale',
  },
  {
    name: 'Jean-Marc Jancovici',
    description: 'Ingénieur, président du Shift Project, expert énergie-climat',
    url: 'https://jancovici.com/',
    type: 'Expert',
    badge: 'Vulgarisation',
  },
  {
    name: 'NASA Climate',
    description: 'Données et recherches de l\'agence spatiale américaine',
    url: 'https://climate.nasa.gov/',
    type: 'Agence scientifique',
    badge: 'Données satellite',
  },
  {
    name: 'Météo-France',
    description: 'Service météorologique et climatologique national',
    url: 'https://meteofrance.com/changement-climatique',
    type: 'Institution nationale',
    badge: 'Données France',
  },
  {
    name: 'The Shift Project',
    description: 'Think tank de la transition carbone',
    url: 'https://theshiftproject.org/',
    type: 'Think tank',
    badge: 'Prospective',
  },
  {
    name: 'Skeptical Science',
    description: 'Base de données des mythes climatiques et leurs réfutations',
    url: 'https://skepticalscience.com/',
    type: 'Plateforme',
    badge: 'Fact-checking',
  },
];

const QUALITY_CRITERIA = [
  {
    icon: Shield,
    title: 'Sources vérifiées',
    description: 'Uniquement des sources peer-reviewed ou d\'institutions reconnues',
  },
  {
    icon: Users,
    title: 'Consensus scientifique',
    description: 'Basé sur le consensus de 97%+ des climatologues',
  },
  {
    icon: GraduationCap,
    title: 'Mis à jour régulièrement',
    description: 'Contenu actualisé selon les dernières publications',
  },
  {
    icon: CheckCircle2,
    title: 'Transparence totale',
    description: 'Toutes les sources sont citées et accessibles',
  },
];

export function SourcesMethodology() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* En-tête */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Badge variant="outline" className="mb-4">
          <Shield className="h-3 w-3 mr-1" />
          Transparence
        </Badge>
        <h2 className="text-3xl font-bold mb-4">Sources & Méthodologie</h2>
        <p className="text-muted-foreground">
          Notre engagement : une information scientifique fiable, sourcée et accessible à tous.
          Découvrez comment nous construisons et vérifions chaque contenu.
        </p>
      </div>

      {/* Critères de qualité */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUALITY_CRITERIA.map((criterion, index) => (
          <motion.div
            key={criterion.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full text-center hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <criterion.icon className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{criterion.title}</h3>
                <p className="text-xs text-muted-foreground">{criterion.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Méthodologie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Notre processus de vérification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {METHODOLOGY_STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${step.bgColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    <step.icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-muted-foreground">
                        Étape {index + 1}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources principales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Nos sources principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MAIN_SOURCES.map((source, index) => (
              <motion.a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group block p-4 rounded-xl border hover:border-green-500 hover:shadow-md transition-all bg-card"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {source.type}
                  </Badge>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                </div>
                <h4 className="font-semibold mb-1 group-hover:text-green-600 transition-colors">
                  {source.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                <Badge variant="outline" className="text-xs">
                  {source.badge}
                </Badge>
              </motion.a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Note de transparence */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <span className="text-2xl">⚖️</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Note de transparence</h3>
              <p className="text-sm text-muted-foreground">
                Nous nous efforçons de présenter les faits scientifiques de manière objective.
                Si vous repérez une erreur ou souhaitez suggérer une amélioration,
                n&apos;hésitez pas à nous contacter. La science progresse grâce au débat constructif
                et à la remise en question permanente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
