import { ImageResponse } from 'next/og';
import articlesData from '@/data/articles.json';

export const runtime = 'edge';

export const alt = 'EcoWarrior Article';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Icônes par catégorie
const categoryIcons: Record<string, string> = {
  "Climat": "🌡️",
  "Océans": "🌊",
  "Énergie": "⚡",
  "Biodiversité": "🦋",
  "Solutions": "💡",
};

export default async function Image({ params }: { params: { slug: string } }) {
  const article = articlesData.find(a => a.slug === params.slug);

  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #166534 0%, #059669 50%, #14b8a6 100%)',
            fontFamily: 'system-ui',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 'bold', color: 'white' }}>
            EcoWarrior
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const category = article.category || "Climat";
  const icon = categoryIcons[category] || "🌍";

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #166534 0%, #059669 50%, #14b8a6 100%)',
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                }}
              >
                🌍
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'white' }}>
                EcoWarrior
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '40px',
                fontSize: 22,
                color: 'white',
                fontWeight: 600,
              }}
            >
              <span>{icon}</span>
              <span>{category}</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: article.titleFr.length > 60 ? 48 : 56,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              }}
            >
              {article.titleFr}
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '40px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ opacity: 0.7 }}>Par</span>
              <span style={{ fontWeight: 600 }}>{article.author}</span>
            </div>
            <div style={{ opacity: 0.7 }}>
              {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            height: 8,
            background: 'linear-gradient(90deg, #22c55e 0%, #10b981 50%, #14b8a6 100%)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
