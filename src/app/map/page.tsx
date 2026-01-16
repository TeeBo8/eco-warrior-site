import { Metadata } from 'next';
import MapPageContent from '@/components/map-page-content';

export const metadata: Metadata = {
  title: 'Carte des Impacts Climatiques',
  description: 'Découvrez les effets concrets du changement climatique près de chez vous.',
};

export default function MapPage() {
  return <MapPageContent />;
}