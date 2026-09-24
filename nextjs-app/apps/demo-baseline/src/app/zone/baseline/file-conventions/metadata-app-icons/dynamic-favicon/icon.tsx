import { ImageResponse } from 'next/og'
import { ICON_VARIANTS } from './specs'

/**
 * generateImageMetadata: 한 icon.tsx에서 여러 아이콘을 만든다.
 * 반환 배열의 각 항목이 <link rel="icon">
 * 한 개가 되고, id는 기본 export 함수의 props로 전달된다.
 */
export function generateImageMetadata() {
  return ICON_VARIANTS.map(({ id, size, contentType }) => ({
    id,
    size: { ...size },
    contentType,
  }))
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = String(await id)
  const variant = ICON_VARIANTS.find((v) => v.id === iconId) ?? ICON_VARIANTS[0]
  const { width, height } = variant.size
  const isLarge = width >= 64

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
          background: '#18181b',
          color: '#fafafa',
          borderRadius: Math.round(width * 0.2),
        }}
      >
        <div style={{ display: 'flex', fontSize: Math.round(height * 0.62), fontWeight: 700, lineHeight: 1 }}>
          N
        </div>
        {isLarge ? (
          <div style={{ display: 'flex', marginTop: 8, fontSize: 22, color: '#a1a1aa' }}>
            {`${iconId} ${width}x${height}`}
          </div>
        ) : null}
      </div>
    ),
    { width, height },
  )
}
