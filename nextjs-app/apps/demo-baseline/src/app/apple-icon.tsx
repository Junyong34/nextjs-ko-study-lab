import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#09090B',
          color: '#FFFFFF',
          fontSize: 96,
          fontWeight: 700,
        }}
      >
        N
      </div>
    ),
    { ...size }
  )
}
