'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChartIcon, TrendingUp, Users } from 'lucide-react';

interface Post {
  id: number;
  category?: string | null;
  difficulty?: string | null;
  likes: number;
}

interface MythStatsChartsProps {
  posts: Post[];
  readCount: number;
  totalLearned: number;
}

// Couleurs pour les catégories
const CATEGORY_COLORS: Record<string, string> = {
  science: '#3B82F6',
  energie: '#EAB308',
  solutions: '#22C55E',
  economie: '#A855F7',
};

const CATEGORY_LABELS: Record<string, string> = {
  science: 'Science',
  energie: 'Énergie',
  solutions: 'Solutions',
  economie: 'Économie',
};

// Couleurs pour les difficultés
const DIFFICULTY_COLORS: Record<string, string> = {
  debutant: '#22C55E',
  intermediaire: '#EAB308',
  avance: '#EF4444',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};

export function MythStatsCharts({ posts, readCount, totalLearned }: MythStatsChartsProps) {
  // Données par catégorie
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      const cat = post.category || 'solutions';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: CATEGORY_LABELS[name] || name,
      value,
      color: CATEGORY_COLORS[name] || '#6B7280',
    }));
  }, [posts]);

  // Données par difficulté
  const difficultyData = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      const diff = post.difficulty || 'debutant';
      counts[diff] = (counts[diff] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: DIFFICULTY_LABELS[name] || name,
      value,
      color: DIFFICULTY_COLORS[name] || '#6B7280',
    }));
  }, [posts]);

  // Top 5 mythes les plus likés
  const topLikedMyths = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map((post, index) => ({
        rank: index + 1,
        likes: post.likes,
        id: post.id,
      }));
  }, [posts]);

  // Stats d'engagement
  const engagementStats = useMemo(() => {
    const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
    const avgLikes = posts.length > 0 ? Math.round(totalLikes / posts.length) : 0;
    const readPercentage = posts.length > 0 ? Math.round((readCount / posts.length) * 100) : 0;

    return { totalLikes, avgLikes, readPercentage };
  }, [posts, readCount]);

  // Custom tooltip pour les graphiques
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} mythe{payload[0].value > 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Statistiques des Mythes</h2>
          <p className="text-sm text-muted-foreground">
            Vue d&apos;ensemble de notre base de connaissances
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{posts.length}</div>
            <p className="text-sm text-blue-700 dark:text-blue-400">Mythes démontés</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{engagementStats.readPercentage}%</div>
            <p className="text-sm text-green-700 dark:text-green-400">Progression</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{engagementStats.totalLikes}</div>
            <p className="text-sm text-purple-700 dark:text-purple-400">Likes totaux</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{totalLearned}</div>
            <p className="text-sm text-orange-700 dark:text-orange-400">Apprentissages</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Catégories */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-blue-500" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Difficultés */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Répartition par niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    barSize={30}
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {difficultyData.map((diff) => (
                <div key={diff.name} className="flex items-center gap-1.5 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: diff.color }}
                  />
                  <span>{diff.name}: {diff.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top mythes likés */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-purple-500" />
            Top 5 des mythes les plus appréciés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLikedMyths}>
                <XAxis dataKey="rank" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="font-medium">Mythe #{payload[0].payload.rank}</p>
                          <p className="text-sm text-muted-foreground">
                            {payload[0].value} likes
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="likes"
                  fill="#A855F7"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
