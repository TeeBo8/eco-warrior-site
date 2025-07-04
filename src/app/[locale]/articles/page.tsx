"use client";
import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ArticlesPage() {
  const articlesQuery = trpc.article.getAll.useQuery();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8">
        {locale === 'fr' ? 'Nos Analyses' : 'Our Analysis'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {locale === 'fr' 
          ? 'Analyses approfondies des enjeux climatiques actuels par nos experts.'
          : 'In-depth analysis of current climate issues by our experts.'
        }
      </p>
      
      {articlesQuery.isLoading && (
        <div className="text-center py-8">
          {locale === 'fr' ? 'Chargement des articles...' : 'Loading articles...'}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {articlesQuery.data?.map(article => (
          <Link key={article.slug} href={`/${locale}/articles/${article.slug}`}>
            <Card className="h-full overflow-hidden hover:border-green-500 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="p-0">
                {article.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image 
                      src={article.imageUrl} 
                      alt="" 
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  </div>
                )}
                <div className="p-6 pb-2">
                  <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {locale === 'fr' ? article.titleFr : article.titleEn}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <CardDescription className="line-clamp-3 text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {locale === 'fr' ? article.summaryFr : article.summaryEn}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {new Date(article.publishedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                    {locale === 'fr' ? 'Lire →' : 'Read →'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Section d'encouragement en bas */}
      <div className="mt-16 p-8 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
        <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
          {locale === 'fr' ? 'Restez informé(e)' : 'Stay informed'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'fr' 
            ? 'De nouveaux articles d\'analyse sont publiés régulièrement pour vous tenir au courant des derniers développements climatiques.'
            : 'New analysis articles are published regularly to keep you updated on the latest climate developments.'
          }
        </p>
      </div>
    </div>
  );
} 