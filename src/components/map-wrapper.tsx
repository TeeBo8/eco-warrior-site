'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function MapWrapper() {
  const AdvancedImpactMap = useMemo(() => dynamic(() => import('@/components/advanced-impact-map'), { ssr: false, loading: () => <p>Chargement de la carte...</p> }), []);
  return <AdvancedImpactMap />;
}