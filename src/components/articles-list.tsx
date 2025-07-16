'use client';
import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ArticlesList() {
  const articlesQuery = trpc.article.getAll.useQuery();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8">{locale === 'fr' ? 'Nos Analyses' : 'Our Analysis'}</h1>
      <p className="text-muted-foreground mb-8">{locale === 'fr' ? 'Analyses approfondies des enjeux climatiques actuels par nos experts.' : 'In-depth analysis of current climate issues by our experts.'}</p>
      {articlesQuery.isLoading && <div className="text-center py-8">{locale === 'fr' ? 'Chargement des articles...' : 'Loading articles...'}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesQuery.data?.map((article) => (
          <Card key={article.id} className="flex flex-col h-full">
            {article.imageUrl && (
              <div className="relative h-48 w-full">
                <Image src={article.imageUrl} alt={locale === 'fr' ? article.titleFr : article.titleEn} fill className="object-cover rounded-t-lg" />
              </div>
            )}
            <CardHeader>
              <CardTitle>{locale === 'fr' ? article.titleFr : article.titleEn}</CardTitle>
              <CardDescription>{new Date(article.publishedAt).toLocaleDateString(locale)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">{locale === 'fr' ? article.summaryFr : article.summaryEn}</p>
            </CardContent>
            <div className="p-4 mt-auto">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/articles/${article.slug}`}>{locale === 'fr' ? 'Lire l\'article' : 'Read article'}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 