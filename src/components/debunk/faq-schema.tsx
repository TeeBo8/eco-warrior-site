import Script from 'next/script';

interface Myth {
  id: number;
  mythFr: string;
  realityFr: string;
  slug?: string | null;
}

interface FAQSchemaProps {
  myths: Myth[];
}

export function FAQSchema({ myths }: FAQSchemaProps) {
  // Construire le schema FAQ à partir des mythes
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: myths.slice(0, 50).map((myth) => ({
      '@type': 'Question',
      name: myth.mythFr,
      acceptedAnswer: {
        '@type': 'Answer',
        text: myth.realityFr,
      },
    })),
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

// Schema pour une page mythe individuelle
interface MythPageSchemaProps {
  myth: {
    mythFr: string;
    realityFr: string;
    slug?: string | null;
    category?: string | null;
    sources?: string | null;
  };
  url: string;
}

export function MythPageSchema({ myth, url }: MythPageSchemaProps) {
  // Parse sources si disponible
  let sourcesList: { name: string; url?: string }[] = [];
  if (myth.sources) {
    try {
      sourcesList = JSON.parse(myth.sources);
    } catch {
      // Ignore parse errors
    }
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${myth.mythFr} - Vrai ou Faux ?`,
    description: myth.realityFr.substring(0, 160),
    url: url,
    author: {
      '@type': 'Organization',
      name: 'EcoWarrior',
      url: 'https://ecowarrior.fr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EcoWarrior',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ecowarrior.fr/logo.png',
      },
    },
    articleSection: myth.category || 'Climat',
    citation: sourcesList.map((s) => ({
      '@type': 'CreativeWork',
      name: s.name,
      url: s.url,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: myth.mythFr,
        acceptedAnswer: {
          '@type': 'Answer',
          text: myth.realityFr,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
