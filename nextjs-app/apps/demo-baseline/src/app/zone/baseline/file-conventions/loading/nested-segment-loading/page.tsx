import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/loading/nested-segment-loading')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NestedSegmentLoadingDemo } from './components/NestedSegmentLoadingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"중첩 세그먼트별 독립 loading.tsx 스트리밍"}
        concept={"상위 레이아웃과 하위 세그먼트에 각각 loading.tsx를 두면, 상위 UI(GNB)가 즉시 노출된 상태에서 지연(1000ms)되는 하위 세그먼트만 독립 Suspense 스켈레톤으로 스트리밍됩니다."}
        steps={[
          {
                    "step": 1,
                    "title": "상위 세그먼트 loading.tsx 동작 확인 및 하위 세그먼트 독립 loading.tsx 확인",
                    "description": "상위 레이아웃 레벨의 로딩 바운더리가 페이지 전체 전환 시 어떻게 반응하는지 확인합니다. 지연 시간이 긴 하위 세그먼트만 국소적으로 스켈레톤을 띄우는 중첩 스트리밍 구조를 점검합니다.",
                    "actionBadge": "상위 로딩"
          },
          {
                    "step": 2,
                    "title": "세그먼트 격리 렌더링 검증",
                    "description": "상위 네비게이션이 블로킹되지 않고 하위 콘텐츠만 점진적으로 마운트되는지 검증합니다.",
                    "actionBadge": "격리 검증",
                    "observe": "3단 검증 패널에서 중첩 세그먼트별 loading.tsx 경계 분리 사양이 정상 충족되는지 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"중첩 라우트 세그먼트 로딩 격리 실습"}>
        <NestedSegmentLoadingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
