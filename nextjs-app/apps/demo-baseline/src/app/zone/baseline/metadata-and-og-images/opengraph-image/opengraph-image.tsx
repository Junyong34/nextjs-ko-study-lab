import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090b',
          color: '#ffffff',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            Next.js App Router
          </div>
          <div style={{ fontSize: '24px', color: '#a1a1aa' }}>
            한국어 학습 랩
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
            }}
          >
            ImageResponse 동적 OG 이미지 생성 파이프라인
          </div>
          <div style={{ fontSize: '28px', color: '#71717a' }}>
            Satori + Resvg 기반 JSX-to-PNG 초고속 서버 렌더링
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #27272a',
            paddingTop: '30px',
            fontSize: '22px',
            color: '#a1a1aa',
          }}
        >
          <div>1200 × 630 px (OpenGraph Standard)</div>
          <div>nextjs-ko-lab.dev</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
