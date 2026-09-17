import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/unauthorized/anonymous-401')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnauthorizedAccessDemo } from './components/UnauthorizedAccessDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCurrentSession } from './actions'

export default async function DemoPage() {
  const currentSession = await getCurrentSession()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="unauthorized.tsx 파일 배치가 결정하는 401 화면"
        concept="unauthorized()이 던지는 예외는 어디서 호출하든 동일하지만, 실제로 렌더링되는 UI는 그 세그먼트 기준 '가장 가까운 조상' unauthorized.tsx 파일이 결정합니다. 같은 예외라도 unauthorized.tsx가 어느 폴더에 있느냐에 따라 다른 화면이 뜹니다."
        steps={[
          {
            step: 1,
            title: '[비로그인 방문자 (ANONYMOUS)] 선택',
            description: '실제 서버 세션 쿠키를 전환합니다. 페이지 로딩 시 초기값은 ANONYMOUS입니다.',
            actionBadge: '세션 선택',
          },
          {
            step: 2,
            title: '[주문 내역 조회 →] 클릭',
            description:
              'order-history 폴더에는 전용 unauthorized.tsx가 없습니다. unauthorized() 예외가 상위로 전파되어 anonymous-401/unauthorized.tsx(공통 파일)가 렌더링됩니다.',
            actionBadge: '상위 파일 상속',
          },
          {
            step: 3,
            title: '[결제 수단 관리 →] 클릭',
            description:
              'payment-methods 폴더에는 같은 위치에 전용 unauthorized.tsx가 있습니다. 같은 unauthorized() 호출이지만 상위 파일 대신 이 전용 파일이 렌더링됩니다.',
            actionBadge: '전용 파일 우선',
            observe: '두 경로 모두 실제 401이지만, 렌더링된 unauthorized.tsx의 파일 경로와 문구가 서로 다름을 확인',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="unauthorized.tsx 파일 배치 규칙 실습">
        <UnauthorizedAccessDemo currentSession={currentSession} />
      </DemoPlaygroundCard>
      <VerificationFooter currentSession={currentSession} />
    </DemoContainer>
  )
}
