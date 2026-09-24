import { ImageResponse } from 'next/og'
import { APPLE_ICON_CONTENT_TYPE, APPLE_ICON_SIZE } from './specs'

// 단일 export 방식: size / contentType이 <link rel="apple-touch-icon">의
// sizes / type 속성과 응답 Content-Type으로 반영된다.
export const size = APPLE_ICON_SIZE
export const contentType = APPLE_ICON_CONTENT_TYPE

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          color: '#18181b',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, lineHeight: 1 }}>N</div>
        <div style={{ display: 'flex', marginTop: 10, fontSize: 20, color: '#52525b' }}>
          {`apple ${size.width}x${size.height}`}
        </div>
      </div>
    ),
    { ...size },
  )
}
