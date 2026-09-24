import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OgImageInspector } from './components/OgImageInspector'

/**
 * 같은 세그먼트의 metadata에 openGraph.images / twitter.images가 있으면
 * Next.js는 opengraph-image.tsx / twitter-image.tsx를 <head>에 반영하지 않는다.
 * 공용 메타데이터에서 images만 제거해 파일 기반 이미지가 주입되게 한다.
 */
function omitImages<T extends object | null | undefined>(value: T): T {
  if (!value) return value
  const copy: Record<string, unknown> = { ...value }
  delete copy.images
  return copy as T
}

const baseMetadata = getDemoMetadata('baseline', 'file-conventions/metadata-og/discount-banner-og')

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: omitImages(baseMetadata.openGraph),
  twitter: omitImages(baseMetadata.twitter),
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="ImageResponse 실시간 할인율 OG 이미지"
        concept="opengraph-image.tsx / twitter-image.tsx는 ImageResponse로 PNG를 만드는 특수 Route Handler이자 <head> 메타 태그의 원천이다. 파일 안에서 Request-time API를 쓰면 요청 시, 안 쓰면 빌드 시 이미지가 생성된다."
        steps={[
          {
            step: 1,
            title: '[HTML <head> 파싱 + 이미지 2회 요청] 클릭',
            description:
              '이 페이지 HTML 원문을 다시 받아 <head>의 og:image / twitter:image 태그(width·height·type·alt)를 읽고, 태그에 적힌 이미지 URL을 실제로 두 번씩 요청합니다.',
            actionBadge: '실제 요청',
          },
          {
            step: 2,
            title: '할인율 슬롯이 바뀐 뒤(30초) 다시 클릭',
            description:
              'og:image(connection())는 새 할인율과 새 생성 시각을 보여 주고, twitter:image(정적)는 프로덕션 빌드에서 빌드 시점 값에 머뭅니다.',
            actionBadge: '시점 비교',
            observe: '미리보기 이미지의 할인율과 생성 시각, 3단 검증 패널의 원본 대조 결과',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="opengraph-image.tsx / twitter-image.tsx → <head> 태그와 PNG 응답">
        <OgImageInspector />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
