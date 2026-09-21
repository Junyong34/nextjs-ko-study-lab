import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StatePreservationProvider } from './components/StatePreservationContext'
import { LayoutStatePreserveDemo } from './components/LayoutStatePreserveDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function StatePreservationLayout({ children }: { children: React.ReactNode }) {
  return (
    <StatePreservationProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="중첩 레이아웃의 클라이언트 상태 보존 (State Preservation)"
          concept="이 layout.tsx는 도서/전자기기/패션 세 실제 서브 라우트의 공통 부모다. 하위 page.tsx가 실제 Link 이동으로 교체되어도 layout은 리마운트되지 않으므로, 그 안의 검색어 입력과 기준 기록이 유지된다."
          steps={[
            {
              step: 1,
              title: '[상품 검색어] 입력 후 [현재 입력값·경로를 기준으로 기록] 클릭',
              description: '레이아웃 프레임의 검색어 상태를 바꾸고 현재 경로·카테고리를 기준으로 기록합니다.',
              actionBadge: '상태 변경',
            },
            {
              step: 2,
              title: '[전자기기] 또는 [패션] 카테고리로 실제 이동',
              description: '실제 Link로 다른 서브 라우트(page.tsx)로 이동합니다. 상품 목록 화면이 실제로 바뀝니다.',
              actionBadge: '실제 이동',
            },
            {
              step: 3,
              title: '검색어와 mount ID가 유지되는지 확인',
              description: '경로와 화면 속 상품 카테고리는 바뀌었지만, 검색어와 layout mount ID는 그대로인지 검증 패널에서 확인합니다.',
              actionBadge: '상태 보존 검증',
              observe: '카테고리 이동 전후 검색어·mount ID 유지, 입력을 바꾸면 불일치로 전환되는지 관찰',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="카테고리 이동과 공유 검색어" className="min-w-0">
          <LayoutStatePreserveDemo />
          <div className="mt-4">{children}</div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </StatePreservationProvider>
  )
}
