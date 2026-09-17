import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/dynamic-params-toggle')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ToggleOverviewDemo } from './components/ToggleOverviewDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="export const dynamicParams = true | false"
        concept="generateStaticParams()가 반환하지 않은 다이나믹 세그먼트(PROD-999)에 접근했을 때, dynamicParams=true(기본값)면 요청 시점에 온디맨드로 서버 렌더링되고, false면 실제 404가 반환됩니다. 이 두 동작은 런타임 토글이 아니라 서로 다른 서브 라우트로 만들어야 대조할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '[사전 생성됨: PROD-101] 링크로 두 브랜치 모두 진입',
            description: 'generateStaticParams에 포함된 ID는 dynamicParams 설정과 무관하게 두 브랜치 모두 정상 렌더링됩니다.',
            actionBadge: '기준선 확인',
          },
          {
            step: 2,
            title: '[사전 생성 안 됨: PROD-999] 링크로 on-demand 브랜치 진입',
            description: 'dynamicParams=true 라우트는 목록에 없는 ID도 요청 시점에 SSR로 렌더링합니다.',
            actionBadge: 'on-demand 확인',
          },
          {
            step: 3,
            title: '같은 [사전 생성 안 됨: PROD-999] 링크로 blocked 브랜치 진입',
            description: 'dynamicParams=false 라우트는 동일한 ID를 실제 404(사이트 전역 404 화면)로 거절합니다.',
            actionBadge: 'blocked 확인',
            observe: 'on-demand 브랜치 화면 하단과, blocked 브랜치의 정상 상품 페이지 하단 "형제 경로 검증" 패널에서 실시간 fetch로 측정한 200 vs 404 차이를 직접 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="dynamicParams true vs false 대조 실습">
        <ToggleOverviewDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
