'use client';
import { trpc } from '@/app/_trpc/client';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export default function ArticleDetail() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const locale = typeof params.locale === 'string' ? params.locale : 'en';

  // Suppression de la condition isSignedIn, accès libre pour tous
  const articleQuery = trpc.article.getBySlug.useQuery({ slug }, { enabled: !!slug, retry: 1 });

  if (articleQuery.isLoading) {
    return <div className="w-full max-w-4xl mx-auto text-center py-8">{locale === 'fr' ? 'Chargement de l\'article...' : 'Loading article...'}</div>;
  }

  const article = articleQuery.data;

  if (!article) {
    return <div className="w-full max-w-4xl mx-auto text-center py-8">{locale === 'fr' ? 'Article non trouvé' : 'Article not found'}</div>;
  }

  const title = locale === 'fr' ? article.titleFr : article.titleEn;
  const content = locale === 'fr' ? article.contentFr : article.contentEn;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-6">{locale === 'fr' ? 'Par' : 'By'} {article.author} - {new Date(article.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}</p>
      {article.imageUrl && (
        <div className="relative w-full h-96 mb-8">
          <Image src={article.imageUrl} alt={title} fill className="rounded-lg object-cover" />
        </div>
      )}
      <article className="prose dark:prose-invert max-w-none prose-lg prose-headings:text-green-700 dark:prose-headings:text-green-400 prose-headings:font-bold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-strong:text-green-600 dark:prose-strong:text-green-400 prose-strong:font-semibold prose-ul:space-y-2 prose-li:text-gray-700 dark:prose-li:text-gray-300">
        <ReactMarkdown components={{ h3: ({ ...props }) => <h3 className="text-2xl font-bold text-green-700 dark:text-green-400 mt-8 mb-4" {...props} />, h2: ({ ...props }) => <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mt-10 mb-6" {...props} />, p: ({ ...props }) => <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300" {...props} />, strong: ({ ...props }) => <strong className="font-semibold text-green-600 dark:text-green-400" {...props} />, ul: ({ ...props }) => <ul className="mb-6 space-y-3 ml-6" {...props} />, li: ({ ...props }) => <li className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 list-disc" {...props} /> }}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}