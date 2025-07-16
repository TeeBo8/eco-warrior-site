import ArticlesList from '@/components/articles-list';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: resolvedParams.locale === 'fr' ? 'Nos Analyses | EcoWarrior' : 'Our Analysis | EcoWarrior',
    description: resolvedParams.locale === 'fr' ? 'Analyses approfondies des enjeux climatiques actuels par nos experts.' : 'In-depth analysis of current climate issues by our experts.',
  };
}

export default function ArticlesPage() {
  return <ArticlesList />;
} 