import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFF5EB',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            padding: 48,
            border: '8px solid #FF6B35',
            borderRadius: 24,
          }}
        >
          <div
            style={{
              background: '#FF6B35',
              color: '#FFFFFF',
              fontSize: 72,
              fontWeight: 800,
              padding: '24px 32px',
              borderRadius: 16,
              lineHeight: 1,
            }}
          >
            OJ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 56, color: '#2D2D2D', fontWeight: 800 }}>Orange Jelly</div>
            <div style={{ fontSize: 36, color: '#2C5F5F', fontWeight: 600 }}>
              Hospitality marketing that works
            </div>
            <div style={{ fontSize: 28, color: '#2D2D2D' }}>
              Fill tables for pubs, restaurants, and bars. Save up to 25 hours weekly.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
