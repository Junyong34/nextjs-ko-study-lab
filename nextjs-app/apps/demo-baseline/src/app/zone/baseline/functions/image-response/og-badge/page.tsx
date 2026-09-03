import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/image-response/og-badge')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImageResponseOgBadgeDemo } from './components/ImageResponseOgBadgeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지"
        concept="next/og의 ImageResponse와 Satori 엔진을 사용하여 상품명, 할인율(-30%), 실시간 가격이 렌더링된 소셜 오픈그래프(OG) PNG 이미지를 50ms 미만으로 동적 생성합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "OG 이미지를 생성할 대상 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "ImageResponse JSX 템플릿에 동적 파라미터를 주입하여 OG 이미지를 렌더링합니다.",
            actionBadge: "OG 렌더링",
          },
          {
            step: 3,
            title: "동적 OG 이미지 생성 로그 및 메타데이터 관찰",
            description: "Satori가 렌더링한 1200x630 규격의 실시간 할인 뱃지 이미지 생성 결과가 실시간 로그에 반영되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "선택한 상품의 할인율과 가격이 합성된 ImageResponse OG 이미지가 실시간 생성됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지 실습"}>
        <ImageResponseOgBadgeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
