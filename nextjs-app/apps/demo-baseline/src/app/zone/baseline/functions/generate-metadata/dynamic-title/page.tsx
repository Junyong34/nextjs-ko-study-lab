import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-metadata/dynamic-title')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GenerateMetadataTitleDemo } from './components/GenerateMetadataTitleDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="generateMetadata 동적 SEO 타이틀 및 메타태그 생성"
        concept="generateMetadata() 비동기 함수에서 DB 상품 정보를 조회하여 페이지별 고유 title, description, openGraph 메타태그를 서버 렌더링 시점에 동적으로 주입합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "동적 메타데이터를 생성할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "generateMetadata()가 상품 정보를 페칭하여 HTML head 메타태그를 생성하도록 실행합니다.",
            actionBadge: "메타 생성",
          },
          {
            step: 3,
            title: "생성된 SEO 타이틀 및 OG 태그 관찰",
            description: "HTML <title> 및 og:title 메타태그에 상품명과 가격이 올바르게 주입되었는지 실시간 로그에서 확인합니다.",
            actionBadge: "태그 검증",
            observe: "선택한 상품명과 상세 정보가 주입된 dynamic generateMetadata 결과가 실시간 로그에 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"generateMetadata 동적 SEO 타이틀 및 메타태그 생성 실습"}>
        <GenerateMetadataTitleDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
