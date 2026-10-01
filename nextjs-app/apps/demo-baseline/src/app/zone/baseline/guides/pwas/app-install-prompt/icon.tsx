import { ImageResponse } from 'next/og'
import { BACKGROUND_COLOR, ICON_SIZES, THEME_COLOR } from './constants'

// public/ 아이콘 파일 없이 코드로 아이콘을 만든다. generateImageMetadata가 192/512 두 장을 선언하고,
// manifest.ts의 icons[].src는 이 라우트가 서빙하는 /icon/192, /icon/512를 가리킨다.
export function generateImageMetadata() {
  return ICON_SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: 'image/png',
    alt: `PWA 설치 실습 아이콘 ${size}px`,
  }))
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const size = Number(await id)
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: THEME_COLOR,
          color: BACKGROUND_COLOR,
          fontSize: size * 0.42,
          fontWeight: 700,
        }}
      >
        PWA
      </div>
    ),
    { width: size, height: size },
  )
}
