import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'ProfilePage' });
  return { 
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'ProfilePage' });
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('subtitle')}
        </p>
        <p className="text-sm text-muted-foreground">
          La fonctionnalité de profil sera bientôt disponible.
        </p>
      </div>
    </div>
  );
}
