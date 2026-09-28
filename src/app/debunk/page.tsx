import { Metadata } from 'next';
import { db } from '@/server/db';
import { DebunkContent } from './debunk-content';
import { FAQSchema } from '@/components/debunk/faq-schema';

export const metadata: Metadata = {
  title: 'Mythes & Réalités du Climat',
  description: 'Des faits scientifiques solides pour démonter les idées reçues sur le changement climatique. Basé sur le GIEC et les sources scientifiques.',
  keywords: ['mythes climatiques', 'fact-checking climat', 'changement climatique', 'GIEC', 'debunk'],
  openGraph: {
    title: 'Mythes & Réalités du Climat | EcoWarrior',
    description: 'Des faits scientifiques solides pour démonter les idées reçues sur le changement climatique.',
    type: 'website',
  },
};

async function getPostsForSchema() {
  return await db.query.posts.findMany({
    columns: {
      id: true,
      mythFr: true,
      realityFr: true,
      slug: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.likes)],
  });
}

export default async function DebunkPage() {
  const postsForSchema = await getPostsForSchema();

  return (
    <>
      <FAQSchema myths={postsForSchema} />
      <DebunkContent />
    </>
  );
}
