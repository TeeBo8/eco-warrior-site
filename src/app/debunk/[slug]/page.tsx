import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { MythDetailContent } from './myth-detail-content';
import { MythPageSchema } from '@/components/debunk/faq-schema';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  return await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });
}

async function getRelatedPosts(relatedMythsJson: string | null) {
  if (!relatedMythsJson) return [];
  try {
    const relatedIds: number[] = JSON.parse(relatedMythsJson);
    if (relatedIds.length === 0) return [];

    const allPosts = await db.query.posts.findMany();
    return allPosts.filter(p => relatedIds.includes(p.id)).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) return { title: 'Mythe non trouvé' };

  const title = post.mythFr;
  const description = post.shortExplanation || post.realityFr.substring(0, 160) + '...';

  // URL pour l'image OG dynamique
  const ogImageUrl = `/api/og/myth?myth=${encodeURIComponent(title)}&category=${post.category || 'solutions'}&difficulty=${post.difficulty || 'debutant'}`;

  return {
    title: `${title} - Vrai ou Faux ? | EcoWarrior`,
    description,
    keywords: ['mythe climatique', 'changement climatique', 'fact-checking', post.category || 'climat'],
    openGraph: {
      title: `${title} - Vrai ou Faux ?`,
      description,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Vrai ou Faux ?`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function MythPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.relatedMyths);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ecowarrior.fr';
  const pageUrl = `${baseUrl}/debunk/${post.slug}`;

  return (
    <>
      <MythPageSchema myth={post} url={pageUrl} />
      <MythDetailContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}

// Générer les routes statiques pour tous les mythes
export async function generateStaticParams() {
  const allPosts = await db.query.posts.findMany({
    columns: { slug: true },
  });

  return allPosts
    .filter(post => post.slug)
    .map(post => ({
      slug: post.slug!,
    }));
}
