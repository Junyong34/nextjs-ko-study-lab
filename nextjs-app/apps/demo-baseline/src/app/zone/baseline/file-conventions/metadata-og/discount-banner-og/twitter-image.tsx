import { ImageResponse } from 'next/og'
import { getDiscountAt } from './discount-data'
import { IMAGE_HEADERS, TWITTER_IMAGE } from './image-config'
import { DiscountBannerArt } from './components/DiscountBannerArt'

// config export → <head>의 twitter:image:alt / width·height / type 으로 주입된다.
export const alt = TWITTER_IMAGE.alt
export const size = TWITTER_IMAGE.size
export const contentType = TWITTER_IMAGE.contentType

/**
 * 대조군: Request-time API도, 캐시되지 않는 fetch도 쓰지 않는다.
 * 공식 문서대로 기본값인 정적 최적화가 적용되어 `next build` 때 한 번 생성된 PNG가 계속 서빙된다
 * (next dev에서는 매 요청 새로 생성). 그래서 이미지 안 할인율은 "빌드 시점"의 스냅샷이다.
 */
export default async function Image() {
  const generatedAt = new Date()
  const snapshot = getDiscountAt(generatedAt)

  return new ImageResponse(
    (
      <DiscountBannerArt
        snapshot={snapshot}
        generatedAt={generatedAt.toISOString()}
        channel="twitter:image"
        strategy="no request-time API"
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
