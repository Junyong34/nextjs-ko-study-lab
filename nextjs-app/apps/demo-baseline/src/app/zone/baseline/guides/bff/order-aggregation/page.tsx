'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AggregationPlayground } from './components/AggregationPlayground'
import { VerificationFooter } from './components/VerificationFooter'
import { useAggregationRuns } from './hooks/useAggregationRuns'

export default function DemoPage() {
  const { results, running, error, lastBff, run, reset } = useAggregationRuns()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Handler 하나로 레거시 주문·재고·배송 API 취합 (BFF)"
        concept="브라우저가 레거시 API 3개를 각각 부르는 대신, bff/route.ts가 서버에서 세 시스템을 Promise.all로 동시에 호출해 화면에 필요한 JSON 1개로 합쳐 보냅니다. 요청 수와 서버 대기 시간을 실제로 재서 비교합니다."
        steps={[
          {
            step: 1,
            title: '[클라이언트 직접 호출] 클릭',
            description: '브라우저가 legacy/orders·inventory·shipping Route Handler를 직접 3번 호출합니다.',
            actionBadge: '직접 호출',
            observe: '요청 수 3건과 요청 경로 3개가 브라우저 Resource Timing에 기록되는지',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[BFF 1회 (내부 직렬)] → [BFF 1회 (내부 Promise.all)] 차례로 클릭',
            description: '두 경우 모두 브라우저 요청은 bff 1건이며, 서버 내부에서 레거시를 부르는 방식만 다릅니다.',
            actionBadge: 'BFF 호출',
            observe: '서버 측정 소요가 직렬은 지연 합계, 병렬은 가장 느린 호출 수준인지와 구간 막대의 겹침',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 판정 확인',
            description: '요청 수(3 → 1)와 서버 소요(직렬 > 병렬)를 기대 조건과 대조합니다. DevTools Network 탭에서도 같은 요청을 확인할 수 있습니다.',
            actionBadge: '검증',
            observe: '세 시나리오를 모두 실행한 뒤 "검증 완료" 표시',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="레거시 주문/재고/배송 API 취합 — 직접 호출 vs BFF">
        <AggregationPlayground
          results={results}
          running={running}
          error={error}
          lastBff={lastBff}
          onRun={run}
          onReset={reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter results={results} />
    </DemoContainer>
  )
}
