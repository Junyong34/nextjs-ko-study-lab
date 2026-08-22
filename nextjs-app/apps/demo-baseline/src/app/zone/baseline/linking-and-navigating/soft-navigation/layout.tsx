'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PersistentHeader } from './components/PersistentHeader'
import { NavComparisonBar } from './components/NavComparisonBar'
import { VerificationFooter } from './components/VerificationFooter'

export default function SoftNavigationRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js <Link> Soft Navigation & 스크롤 위치 제어"
        concept="Next.js의 <Link>는 전체 화면을 새로고침하지 않고 필요한 부분만 갈아 끼우는 Soft Navigation을 수행합니다. scroll={false}를 설정하면 탭을 바꿔도 스크롤 위치가 맨 위로 튀지 않고 그대로 유지됩니다."
        steps={[
          {
            step: 1,
            title: '메모 입력 & 스크롤 다운',
            description: '상단 입력창에 메모를 작성하고, 화면을 아래로 스크롤합니다.',
            actionBadge: '상태 생성',
          },
          {
            step: 2,
            title: '<Link scroll={false}> 클릭',
            description: '[베스트 상품] 링크를 클릭하여 스크롤 위치와 메모가 유지되는지 확인합니다.',
            actionBadge: 'Soft Navigation',
          },
          {
            step: 3,
            title: '<a> 하드 리로드와 대조',
            description: '[베스트 상품 (하드 리로드)]를 눌러 브라우저가 깜빡이며 메모가 날아가는 것을 대조합니다.',
            actionBadge: '차이 대조',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="쇼핑몰 카테고리 탭 네비게이션" className="space-y-4">
        {/* 클라이언트 상태 모니터 (메모 & 타이머) */}
        <PersistentHeader />

        {/* 네비게이션 제어 바 */}
        <NavComparisonBar />

        {/* 실제 라우트 페이지 콘텐츠 */}
        <div className="pt-2">{children}</div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
