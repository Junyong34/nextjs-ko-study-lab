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
        title="Route Groups (folder) 파일 컨벤션 & 다중 레이아웃 분리"
        concept="(shop), (auth) 등 괄호로 감싼 Route Groups 폴더는 URL 경로(/products, /login)에 전혀 영향을 주지 않으면서 동일 계층의 라우트에 완전히 독립된 레이아웃을 분리 적용합니다."
        steps={[
          {
            step: 1,
            title: '[회원 로그인 페이지 (/login)] 링크 클릭',
            description: '상단 시뮬레이터에서 [회원 로그인 페이지 (/login)] 링크를 클릭하여 [로그인] 인증 라우트로 이동합니다.',
            actionBadge: '인증 라우트 이동',
          },
          {
            step: 2,
            title: '독립 (auth) 레이아웃 적용 확인',
            description: 'URL 경로에는 (auth)가 생략된 /login만 표시되고 GNB가 제거된 단독 로그인 레이아웃이 렌더링되는 것을 확인합니다.',
            actionBadge: '레이아웃 분리',
          },
          {
            step: 3,
            title: '[상점 상품 카탈로그 (/products)] 링크 클릭',
            description: '[상점 상품 카탈로그 (/products)]를 클릭하여 GNB와 장바구니 요약이 포함된 (shop) 레이아웃으로 즉각 전환되는 것을 관찰합니다.',
            actionBadge: '상점 레이아웃 전환',
            observe: 'URL 구조(/login ↔ /products)를 유지하면서 GNB 포함 여부와 레이아웃 구조가 완전히 전환됨',
            observeAt: 'playground',
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
