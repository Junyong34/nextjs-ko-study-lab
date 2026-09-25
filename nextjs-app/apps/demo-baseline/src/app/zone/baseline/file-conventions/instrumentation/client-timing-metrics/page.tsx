import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/instrumentation/client-timing-metrics')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstrumentationClientTimingDemo } from './components/InstrumentationClientTimingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="클라이언트 성능 측정 훅 (instrumentation-client.ts)"
        concept="instrumentation-client.ts가 내보내는 onRouterTransitionStart는 라우터 전환이 시작되는 순간을 알려준다. 이 데모는 그 시작 시각과 도착 페이지가 실제로 마운트되는 시각의 차이를 계산해 실제 클라이언트 전환 지연(ms)을 화면에 보여준다."
        steps={[
          {
            step: 1,
            title: '[상세 리포트로 이동 →] 클릭',
            description: '실제 Next.js Link로 /station-b로 이동합니다. 이 순간 onRouterTransitionStart(url, navigationType, event)가 호출됩니다.',
            actionBadge: '실제 이동',
          },
          {
            step: 2,
            title: '도착 페이지에서 전환 시간 확인',
            description: '상세 리포트 페이지가 마운트되는 순간 종료 시각이 기록되어, 표에 실측 전환 시간(ms)이 채워집니다.',
            actionBadge: '실측 기록',
            observe: '전환 표의 durationMs 값이 "측정 중…"에서 실제 ms 값으로 바뀌는지 확인',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[성능 대시보드로 이동 →]으로 왕복',
            description: '되돌아오는 전환도 새 기록으로 쌓입니다. 검증 패널에서 누적된 실측 결과를 확인합니다.',
            actionBadge: '검증 확인',
            observe: '3단 검증 패널이 [대기 중]에서 [검증 완료]로 전환되는지 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="instrumentation-client.ts 실습 — /zone/baseline/.../client-timing-metrics">
        <InstrumentationClientTimingDemo station="dashboard" />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
