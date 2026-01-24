import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Couleurs pour les catégories
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  science: { bg: '#3B82F6', text: '#DBEAFE' },
  energie: { bg: '#EAB308', text: '#FEF3C7' },
  solutions: { bg: '#22C55E', text: '#DCFCE7' },
  economie: { bg: '#A855F7', text: '#F3E8FF' },
};

const CATEGORY_LABELS: Record<string, string> = {
  science: 'Science',
  energie: 'Énergie',
  solutions: 'Solutions',
  economie: 'Économie',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const myth = searchParams.get('myth') || 'Mythe climatique';
  const category = searchParams.get('category') || 'solutions';
  const difficulty = searchParams.get('difficulty') || 'debutant';

  const categoryColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.solutions;
  const categoryLabel = CATEGORY_LABELS[category] || 'Solutions';

  const difficultyLabel =
    difficulty === 'debutant'
      ? 'Débutant'
      : difficulty === 'intermediaire'
      ? 'Intermédiaire'
      : 'Avancé';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F172A',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#22C55E',
              }}
            >
              🌍 EcoWarrior
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                backgroundColor: categoryColor.bg,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 600,
              }}
            >
              {categoryLabel}
            </div>
            <div
              style={{
                backgroundColor: '#374151',
                color: '#9CA3AF',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '18px',
              }}
            >
              {difficultyLabel}
            </div>
          </div>
        </div>

        {/* Label "Mythe" */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            💭 Mythe à débunker
          </div>
        </div>

        {/* Mythe */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: myth.length > 80 ? '42px' : myth.length > 50 ? '52px' : '60px',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              maxWidth: '100%',
            }}
          >
            &ldquo;{myth}&rdquo;
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #374151',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: '#9CA3AF',
            }}
          >
            Mythes & Réalités du Climat
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#22C55E',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            ✅ Découvrir la réalité →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
