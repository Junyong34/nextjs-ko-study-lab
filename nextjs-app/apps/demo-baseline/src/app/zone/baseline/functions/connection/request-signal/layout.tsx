'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { BranchNav } from './components/BranchNav'
import { VerificationFooter } from './components/VerificationFooter'

export default function RequestSignalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="connection() 비동기 연결 준비 대기"
        concept="connection()을 호출하면 정적 prerender가 그 지점에서 멈추고, 이후 코드는 실제 요청이 들어온 시점에만 실행됩니다. 이 데모는 connection()을 쓰지 않은 [정적 브랜치]와, 사용한 [connection() 브랜치]를 실제 서브 라우트로 나란히 두어 같은 재고 위젯이 어떻게 다르게 렌더링되는지 비교합니다."
        steps={[
          {
            step: 1,
            title: '[정적 브랜치 (미사용)] 탭 클릭 후 새로고침 반복',
            description: 'connection()이 없는 라우트는 로딩 화면 없이 재고 카드가 즉시 나타납니다.',
            actionBadge: '즉시 렌더링',
          },
          {
            step: 2,
            title: '[connection() 브랜치] 탭 클릭',
            description: '정적 App Shell 문구가 먼저 뜨고, 약 0.9초 뒤 connection() 이후 코드가 실행되어 재고 카드가 스트리밍됩니다.',
            actionBadge: '스트리밍 관찰',
          },
          {
            step: 3,
            title: '하단 [검증] 패널에서 connection() 브랜치를 연속 재요청한 결과 확인',
            description: '패널이 실제 fetch()로 두 라우트를 다시 호출해 서버 렌더 시각을 비교합니다.',
            actionBadge: '재실행 검증',
            observe: '두 렌더 시각이 서로 다르게 기록되어야 함',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="connection() 비동기 연결 준비 대기 — 실제 서브 라우트(/static-branch, /dynamic-branch) 비교">
        <div className="space-y-3">
          <BranchNav />
          <div className="pt-1">{children}</div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
