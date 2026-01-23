import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardSection =
  | 'kpi-cards'
  | 'extra-indicators'
  | 'global-performance'
  | 'comparison'
  | 'historical-charts'
  | 'gauges'
  | 'human-impact'
  | 'advanced-stats'
  | 'country-rankings'
  | 'insights';

export interface SectionConfig {
  id: DashboardSection;
  label: string;
  visible: boolean;
  order: number;
}

interface DashboardPreferencesState {
  sections: SectionConfig[];
  setSectionVisibility: (id: DashboardSection, visible: boolean) => void;
  reorderSections: (newOrder: DashboardSection[]) => void;
  resetToDefaults: () => void;
}

const defaultSections: SectionConfig[] = [
  { id: 'kpi-cards', label: 'Indicateurs clés (KPI)', visible: true, order: 0 },
  { id: 'extra-indicators', label: 'Indicateurs supplémentaires', visible: true, order: 1 },
  { id: 'global-performance', label: 'Performance Globale', visible: true, order: 2 },
  { id: 'comparison', label: 'Comparaison 2000 vs 2025', visible: true, order: 3 },
  { id: 'historical-charts', label: 'Évolution historique', visible: true, order: 4 },
  { id: 'gauges', label: 'Seuils critiques', visible: true, order: 5 },
  { id: 'human-impact', label: 'Impact humain', visible: true, order: 6 },
  { id: 'advanced-stats', label: 'Statistiques avancées', visible: true, order: 7 },
  { id: 'country-rankings', label: 'Données par pays', visible: true, order: 8 },
  { id: 'insights', label: 'Analyses & Insights', visible: true, order: 9 },
];

export const useDashboardPreferences = create<DashboardPreferencesState>()(
  persist(
    (set) => ({
      sections: defaultSections,

      setSectionVisibility: (id, visible) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, visible } : section
          ),
        })),

      reorderSections: (newOrder) =>
        set((state) => ({
          sections: state.sections
            .map((section) => ({
              ...section,
              order: newOrder.indexOf(section.id),
            }))
            .sort((a, b) => a.order - b.order),
        })),

      resetToDefaults: () => set({ sections: defaultSections }),
    }),
    {
      name: 'dashboard-preferences',
      version: 3, // Version 3 pour Phase 10
      migrate: (persistedState, version) => {
        // Migration automatique des anciennes préférences
        if (version < 3) {
          const state = persistedState as { sections: SectionConfig[] };
          // Vérifier si la section global-performance existe déjà
          const hasGlobalPerformance = state.sections?.some(s => s.id === 'global-performance');
          if (!hasGlobalPerformance) {
            // Ajouter la nouvelle section et réordonner
            return {
              sections: defaultSections,
            };
          }
        }
        return persistedState as DashboardPreferencesState;
      },
    }
  )
);
