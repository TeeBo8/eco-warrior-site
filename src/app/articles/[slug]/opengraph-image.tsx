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
    // Image par défaut si article non trouvé
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
          background: `linear-gradient(135deg, #166534 0%, #059669 50%, #14b8a6 100%)`,
          fontFamily: 'system-ui',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        {/* Main content */}
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
          {/* Top bar with logo and category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '40px',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
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
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                EcoWarrior
              </span>
            </div>

            {/* Category badge */}
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

          {/* Title */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: article.titleFr.length > 60 ? 48 : 56,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                maxWidth: '100%',
                textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              }}
            >
              {article.titleFr}
            </h1>
          </div>

          {/* Bottom bar with author and date */}
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

        {/* Bottom gradient bar */}
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
