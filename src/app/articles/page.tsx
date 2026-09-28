import ArticlesList from '@/components/articles-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Analyses',
  description: 'Analyses approfondies des enjeux climatiques actuels par nos experts.',
};

export default function ArticlesPage() {
  return <ArticlesList />;
}