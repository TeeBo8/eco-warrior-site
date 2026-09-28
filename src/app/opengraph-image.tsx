import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'EcoWarrior';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

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
              gap: '12px',
              marginBottom: '40px',
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

          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                margin: 0,
                maxWidth: '90%',
                textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              }}
            >
              Chaque argument climatosceptique, sa réponse sourcée
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '40px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <span>NASA • NOAA • IPCC • GIEC</span>
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
