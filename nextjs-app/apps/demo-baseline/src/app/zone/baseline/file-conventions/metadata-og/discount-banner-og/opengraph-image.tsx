import { ImageResponse } from 'next/og'

export const alt = '이커머스 타임세일 할인 배너'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom right, #1e1b4b, #312e81, #4338ca)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 24, color: '#38bdf8', marginBottom: 12 }}>
          NEXT.JS 16 APP ROUTER STUDY LAB
        </div>
        <div style={{ fontSize: 56, color: '#facc15' }}>
          🔥 2026 시즌 오픈 특별 30% 타임 세일 🔥
        </div>
        <div style={{ fontSize: 22, color: '#cbd5e1', marginTop: 20 }}>
          프리미엄 러닝화 & 테크 웨어 전 품목 즉시 할인 적용
        </div>
      </div>
    ),
    { ...size }
  )
}
