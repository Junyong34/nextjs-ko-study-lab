import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-static-params/basic-ssg')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GenerateStaticParamsBasicDemo } from './components/GenerateStaticParamsBasicDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="generateStaticParams 인기 상품 사전 SSG 빌드 생성"
        concept="generateStaticParams() 함수를 선언하여 상위 100개 인기 상품 ID를 빌드 타임에 사전 렌더링(SSG)하고 배포 즉시 0ms 정적 HTML 응답을 제공합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "사전 빌드 대상 상품 ID를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "generateStaticParams()로 사전 빌드된 정적 세그먼트 페칭을 실행합니다.",
            actionBadge: "SSG 조회",
          },
          {
            step: 3,
            title: "사전 생성된 정적 HTML 페이로드 관찰",
            description: "서버 런타임 렌더링 오버헤드 없이 빌드 타임에 생성된 정적 HTML/RSC 페이로드가 즉시 서빙되는지 확인합니다.",
            actionBadge: "정적 서빙 검증",
            observe: "generateStaticParams에 정의된 인기 상품 파라미터가 사전 SSG 빌드되어 즉시 서빙됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"generateStaticParams 인기 상품 사전 SSG 빌드 생성 실습"}>
        <GenerateStaticParamsBasicDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
