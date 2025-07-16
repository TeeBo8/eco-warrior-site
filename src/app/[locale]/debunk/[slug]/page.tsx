import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { CommentSection } from '@/components/comment-section';
import { and } from 'drizzle-orm';
import { likes } from '@/server/db/schema';
import { auth } from '@clerk/nextjs/server';
import LikeButton from '@/components/like-button';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

async function getPost(slug: string) {
  return await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) return { title: 'Mythe non trouvé' };
  const title = resolvedParams.locale === 'fr' ? post.mythFr : post.mythEn;
  const description = (resolvedParams.locale === 'fr' ? post.realityFr : post.realityEn).substring(0, 160) + '...';
  return {
    title: `${title} | Mythes du Climat - EcoWarrior`,
    description,
    openGraph: {
      title: `${title} | EcoWarrior`,
      description,
      type: 'article',
    },
  };
}

export default async function MythPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);
  if (!post) notFound();
  const title = resolvedParams.locale === 'fr' ? post.mythFr : post.mythEn;
  const reality = resolvedParams.locale === 'fr' ? post.realityFr : post.realityEn;
  const source = post.source;
  const { userId } = await auth();
  const isSignedIn = userId !== null;
  const initialIsLiked = isSignedIn ? !!await db.query.likes.findFirst({ where: and(eq(likes.postId, post.id), eq(likes.userId, userId)) }) : false;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-red-600">💭 {title}</h1>
      <div className="mt-4 space-y-4">
        <h2 className="text-2xl font-semibold text-green-600">✅ Réalité</h2>
        <p className="text-gray-700 dark:text-gray-300">{reality}</p>
        {source && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>Source:</strong> {source}
          </div>
        )}
      </div>
      <LikeButton postId={post.id} initialLikes={post.likes} initialIsLiked={initialIsLiked} />
      <CommentSection postId={post.id} />
    </div>
  );
} 