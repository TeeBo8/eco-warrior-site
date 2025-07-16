'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function MapWrapper() {
  const t = useTranslations('MapPage');
  const AdvancedImpactMap = useMemo(() => dynamic(() => import('@/components/advanced-impact-map'), { ssr: false, loading: () => <p>{t('loading')}</p> }), [t]);
  return <AdvancedImpactMap />;
} 