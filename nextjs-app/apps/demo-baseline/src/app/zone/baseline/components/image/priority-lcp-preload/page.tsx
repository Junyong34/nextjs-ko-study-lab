import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/image/priority-lcp-preload')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ImagePriorityLcpDemo } from './components/ImagePriorityLcpDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/image priority 속성 LCP 프리로드"}
        concept={"히어로 배너에 <Image priority> 속성을 부여하면 HTML <head>에 <link rel=\"preload\">가 자동 주입되어 이미지 다운로드를 앞당기고 LCP 시간을 40% 이상 단축합니다."}
        steps={[
        {
        "step": 1,
        "title": "[PROD-001] 또는 [PROD-002] 상품 탭 선택",
        "description": "LCP 대상 히어로 이미지 상품 카드를 선택합니다.",
        "actionBadge": "상품 선택"
        },
        {
            "step": 2,
            "title": "[priority=true] 체크박스 토글",
            "description": "priority 속성을 켜거나 꺼서 HTML head 내부 preload 링크의 생성 여부를 전환합니다.",
            "actionBadge": "priority 토글"
        },
        {
        "step": 3,
        "title": "LCP 로딩 성능 최적화 검증",
        "description": "lazy loading이 비활성화되고 즉시 다운로드되어 LCP 지표가 향상되는 것을 검증합니다.",
        "actionBadge": "LCP 최적화",
        "observe": "3단 검증 패널에서 priority 속성 유무에 따른 LCP 프리로드 및 렌더링 사양 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"priority 속성을 통한 LCP 이미지 사전 로드 실습"}>
        <ImagePriorityLcpDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
