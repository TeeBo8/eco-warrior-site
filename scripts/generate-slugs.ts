import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '@/server/db';
import { posts } from '@/server/db/schema';
import { eq, isNull } from 'drizzle-orm';

function generateBaseSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  const postList = await db.query.posts.findMany({
    where: isNull(posts.slug),
  });

  for (const p of postList) {
    let baseSlug = generateBaseSlug(p.mythFr);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await db.update(posts)
      .set({ slug, updatedAt: new Date() })
      .where(eq(posts.id, p.id));

    console.log(`Updated post ${p.id} with slug ${slug}`);
  }

  console.log('Done');
}

main().catch(console.error); 