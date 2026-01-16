// src/app/dashboard/page.tsx

import { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';

export const metadata: Metadata = {
  title: 'Tableau de Bord du Climat',
  description: 'Les indicateurs clés de notre planète en temps réel.',
};

export default function DashboardPage() {
  return <DashboardContent />;
}