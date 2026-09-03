import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-og/discount-banner-og')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataOgBannerDemo } from './components/MetadataOgBannerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"opengraph-image.tsx 동적 SNS 공유 카드"}
        concept={"opengraph-image.tsx에서 ImageResponse를 사용하여 상품명, 할인율(30%), 가격이 합성된 1200x630 SNS 미리보기 배너를 실시간 렌더링합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "ImageResponse JSX 템플릿 점검 및 동적 파라미터 기반 가격/할인율 주입",
                    "description": "1200x630 크기의 Open Graph 배너 레이아웃과 폰트 스타일 선언을 확인합니다. 상품 ID에 따라 상품명과 30% 할인 뱃지 텍스트가 동적으로 렌더링되는 로직을 점검합니다.",
                    "actionBadge": "OG 템플릿"
          },
          {
                    "step": 2,
                    "title": "og:image 메타 태그 주입 검증",
                    "description": "HTML <head> 내에 <meta property=\\\"og:image\\\"> 태그가 자동 생성되어 SNS 크롤러에 노출되는지 검증합니다.",
                    "actionBadge": "태그 검증",
                    "observe": "3단 검증 패널에서 opengraph-image.tsx의 1200x630 이미지 생성 사양 및 태그 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"ImageResponse 실시간 할인율 OG 이미지 실습"}>
        <MetadataOgBannerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
