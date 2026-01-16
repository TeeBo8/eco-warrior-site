'use client';

import MapWrapper from '@/components/map-wrapper';

export default function MapPageContent() {
  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Carte des Impacts Climatiques</h1>
          <p className="text-lg text-muted-foreground mt-2">Découvrez les effets concrets du changement climatique près de chez vous.</p>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <MapWrapper />
        </div>
      </main>
    </div>
  );
}