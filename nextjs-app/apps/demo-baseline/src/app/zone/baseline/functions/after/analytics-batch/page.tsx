import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/after/analytics-batch')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AfterAnalyticsBatchDemo } from './components/AfterAnalyticsBatchDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="after() 비동기 데이터 분석 배치 파이프라인"
        concept="Server Action이 배치 등록만 하고 즉시 응답을 반환한 뒤, after() 콜백 안에서 여러 분석 이벤트를 순차 또는 병렬로 실제 처리합니다. 응답이 먼저 오고 배치는 그 이후에 완료되는 순서를 실측으로 증명합니다."
        steps={[
          {
            step: 1,
            title: "[순차 처리] 또는 [병렬 처리] 모드 선택",
            description: "동일한 이벤트 3건을 for 루프(순차) 또는 Promise.all(병렬) 중 어떤 방식으로 처리할지 선택합니다.",
            actionBadge: "모드 선택",
          },
          {
            step: 2,
            title: "[배치 트리거] 클릭 후 클라이언트 RTT 확인",
            description: "runAnalyticsBatch() Server Action이 배치 완료를 기다리지 않고 즉시 반환하는 응답 왕복 시간(RTT)을 확인합니다.",
            actionBadge: "배치 트리거",
          },
          {
            step: 3,
            title: "실시간 진행 상황에서 이벤트별 시작/완료 시각 관찰",
            description: "150ms 간격 폴링으로 after() 콜백이 백그라운드에서 이벤트를 하나씩(순차) 또는 동시에(병렬) 처리하는 실제 타임스탬프를 확인합니다.",
            actionBadge: "진행 관찰",
            observe: "응답이 반환된 시각(responseReturnedAt)보다 배치 완료 시각(batchCompletedAt)이 항상 나중임",
            observeAt: "verification",
          },
          {
            step: 4,
            title: "순차 모드와 병렬 모드를 각각 실행해 실행 기록 비교",
            description: "검증 패널 하단의 실행 기록에서 두 모드의 총 소요 시간과 이벤트 소요 시간 합계를 비교합니다.",
            actionBadge: "모드 비교",
            observe: "병렬 처리의 총 소요 시간이 이벤트별 소요 시간의 합보다 짧음",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"after() 비동기 데이터 분석 배치 파이프라인 실습"}>
        <AfterAnalyticsBatchDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
