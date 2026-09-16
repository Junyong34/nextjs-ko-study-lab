'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BranchNav } from './components/BranchNav'
import { VerificationFooter } from './components/VerificationFooter'

export default function DynamicBailoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="unstable_noStore()로 다이나믹 렌더링 선언"
        concept="unstable_noStore()를 컴포넌트 안에서 호출하면 그 지점에서 정적 prerender가 옵트아웃되어, 이후 코드는 매 요청마다 새로 실행됩니다. 이 데모는 unstable_noStore()를 쓰지 않은 [정적 브랜치]와, 사용한 [unstable_noStore() 브랜치]를 실제 서브 라우트로 나란히 두어 같은 타임세일 참여 인원 위젯이 어떻게 다르게 렌더링되는지 비교합니다."
        steps={[
          {
            step: 1,
            title: '[정적 브랜치 (미사용)] 탭 클릭 후 새로고침 반복',
            description: 'unstable_noStore()가 없는 라우트는 정적으로 캐시되어 값이 고정될 수 있습니다.',
            actionBadge: '정적 시도',
          },
          {
            step: 2,
            title: '[unstable_noStore() 브랜치] 탭 클릭 후 새로고침 반복',
            description: '컴포넌트 최상단에서 noStore()가 호출되어 참여 인원과 렌더 시각이 매번 새로 계산됩니다.',
            actionBadge: '다이나믹 강제',
          },
          {
            step: 3,
            title: '하단 [검증] 패널에서 두 브랜치를 실제로 재요청한 결과 확인',
            description: '패널이 실제 fetch()로 두 라우트를 다시 호출해 서버 렌더 시각을 비교합니다.',
            actionBadge: '재실행 검증',
            observe: 'unstable_noStore() 브랜치의 렌더 시각만 요청마다 달라져야 함',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="unstable_noStore()로 다이나믹 렌더링 선언 — 실제 서브 라우트(/static-branch, /no-store-branch) 비교">
        <div className="space-y-3">
          <BranchNav />
          <div className="pt-1">{children}</div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
