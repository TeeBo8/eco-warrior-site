import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DashboardSection =
  | 'kpi-cards'
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
  { id: 'comparison', label: 'Comparaison 2000 vs 2025', visible: true, order: 1 },
  { id: 'historical-charts', label: 'Évolution historique', visible: true, order: 2 },
  { id: 'gauges', label: 'Seuils critiques', visible: true, order: 3 },
  { id: 'human-impact', label: 'Impact humain', visible: true, order: 4 },
  { id: 'advanced-stats', label: 'Statistiques avancées', visible: true, order: 5 },
  { id: 'country-rankings', label: 'Données par pays', visible: true, order: 6 },
  { id: 'insights', label: 'Analyses & Insights', visible: true, order: 7 },
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
    }
  )
);
