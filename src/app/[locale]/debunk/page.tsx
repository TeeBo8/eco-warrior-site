import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { DebunkContent } from './debunk-content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations({ locale: resolvedParams.locale, namespace: 'DebunkPage' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function DebunkPage() {
  return <DebunkContent />;
} 