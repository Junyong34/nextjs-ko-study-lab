import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/after/analytics-batch')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AfterAnalyticsBatchDemo } from './components/AfterAnalyticsBatchDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="after() 비동기 데이터 분석 배치 파이프라인"
        concept="주요 사용자 이벤트 발생 시 after() 비동기 컨텍스트에서 데이터 웨어하우스 전송 배치를 실행하여 사용자 체감 지연(TTFB)을 0ms로 유지합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "분석 이벤트를 발생시킬 대상 상품을 선택합니다.",
            actionBadge: "이벤트 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "after() 기반 데이터 수집 파이프라인이 포함된 비즈니스 로직을 실행합니다.",
            actionBadge: "배치 트리거",
          },
          {
            step: 3,
            title: "비동기 분석 배치 로그 관찰",
            description: "사용자 응답과 분리되어 백그라운드에서 실행된 분석 배치 큐 상태가 실시간 로그에 기록되는지 확인합니다.",
            actionBadge: "배치 검증",
            observe: "사용자 응답 블로킹 없이 after()를 통한 비동기 분석 배치 작업이 정상 완료됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"after() 비동기 데이터 분석 배치 파이프라인 실습"}>
        <AfterAnalyticsBatchDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
