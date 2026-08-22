import { ImageResponse } from 'next/og'

export const alt = '이커머스 타임세일 트위터 카드 배너'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 44,
          background: 'linear-gradient(to bottom right, #09090b, #18181b, #27272a)',
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
        <div style={{ fontSize: 22, color: '#a1a1aa', marginBottom: 8 }}>
          TWITTER CARD METADATA PREVIEW
        </div>
        <div style={{ fontSize: 52, color: '#38bdf8' }}>
          ⚡ 쇼핑몰 30% 타임세일 이벤트 ⚡
        </div>
      </div>
    ),
    { ...size }
  )
}
