// src/app/[locale]/dashboard/page.tsx

import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { DashboardContent } from './dashboard-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'DashboardPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function DashboardPage() {
  return <DashboardContent />;
} 