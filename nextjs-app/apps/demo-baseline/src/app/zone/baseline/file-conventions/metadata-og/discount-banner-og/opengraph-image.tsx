import { ImageResponse } from 'next/og'
import { connection } from 'next/server'
import { getDiscountAt } from './discount-data'
import { IMAGE_HEADERS, OG_IMAGE } from './image-config'
import { DiscountBannerArt } from './components/DiscountBannerArt'

// config export → <head>의 og:image:alt / og:image:width·height / og:image:type 으로 주입된다.
export const alt = OG_IMAGE.alt
export const size = OG_IMAGE.size
export const contentType = OG_IMAGE.contentType

/**
 * 요청 시(request-time) 생성되는 OG 이미지.
 * connection()은 Request-time API라서 이 특수 Route Handler는 빌드 시 프리렌더되지 않고,
 * 매 요청마다 할인율 데이터를 다시 읽어 새 PNG를 만든다.
 */
export default async function Image() {
  await connection()
  const generatedAt = new Date()
  const snapshot = getDiscountAt(generatedAt)

  return new ImageResponse(
    (
      <DiscountBannerArt
        snapshot={snapshot}
        generatedAt={generatedAt.toISOString()}
        channel="og:image"
        strategy="connection()"
      />
    ),
    {
      ...size,
      headers: {
        [IMAGE_HEADERS.generatedAt]: generatedAt.toISOString(),
        [IMAGE_HEADERS.rate]: String(snapshot.rate),
        [IMAGE_HEADERS.slot]: String(snapshot.slot),
      },
    },
  )
}
