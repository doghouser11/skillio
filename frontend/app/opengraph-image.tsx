import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Skillio - Детски дейности и курсове в България';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex' }} />
        
        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 100, display: 'flex' }}>🎓</div>
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: 'white',
            letterSpacing: '-2px',
          }}>
            Skillio
          </div>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 36,
          color: 'rgba(255,255,255,0.95)',
          textAlign: 'center',
          maxWidth: 900,
          fontWeight: 600,
          lineHeight: 1.3,
        }}>
          Детски дейности и курсове в България
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: 16,
          marginTop: 40,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['⚽ Спорт', '🎨 Изкуство', '🌍 Езици', '🎵 Музика', '🔬 Науки', '🥋 Бойни изкуства'].map((cat) => (
            <div key={cat} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 24,
              padding: '8px 20px',
              fontSize: 22,
              color: 'white',
              fontWeight: 500,
              display: 'flex',
            }}>
              {cat}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute',
          bottom: 30,
          fontSize: 22,
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 500,
        }}>
          skillio.live
        </div>
      </div>
    ),
    { ...size }
  );
}
