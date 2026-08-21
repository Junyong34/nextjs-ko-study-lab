'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RouteSimulator } from './components/RouteSimulator'
import { VerificationFooter } from './components/VerificationFooter'

export default function RouteGroupsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Route Groups `(folder)` 및 다중 레이아웃 분리"
        concept="(shop), (auth) 같은 괄호 폴더는 개발자가 코드를 정리하기 위한 그룹일 뿐 URL에는 전혀 노출되지 않습니다. 이를 통해 동일한 레벨의 URL(/products, /login)에 서로 완전히 다른 독립 레이아웃을 입힐 수 있습니다."
        steps={[
          {
            step: 1,
            title: '로그인 라우트 Link 클릭',
            description: '상단의 [회원 로그인 페이지 (/login)] 링크를 클릭합니다.',
            actionBadge: '인증 라우트 이동',
          },
          {
            step: 2,
            title: 'URL 및 레이아웃 대조',
            description: '주소창에 (auth)가 생략된 /login이 표시되고, GNB가 없는 뷰가 적용된 것을 봅니다.',
            actionBadge: '독립 레이아웃 확인',
          },
          {
            step: 3,
            title: '상점 라우트 복귀',
            description: '[상점 상품 카탈로그 (/products)]를 눌러 GNB와 배너가 있는 상점 레이아웃을 봅니다.',
            actionBadge: '다중 레이아웃 대조',
          },
        ]}
      />

      {/* 2단. 실습 화면 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Route Groups 다중 레이아웃 뷰어" className="space-y-4">
        <RouteSimulator />

        {/* 실제 Route Groups 하위 레이아웃 + 페이지 슬롯 */}
        <div className="pt-1">{children}</div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단. 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
