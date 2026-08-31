'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PersistentHeader } from './components/PersistentHeader'
import { NavComparisonBar } from './components/NavComparisonBar'
import { VerificationFooter } from './components/VerificationFooter'
import { SoftNavProvider } from './components/SoftNavContext'

export default function SoftNavigationRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SoftNavProvider>
      <DemoContainer className="space-y-6">
        {/* 1단. 상단 가이드 필드셋 */}
        <DemoGuideCard
          title="Next.js <Link> Soft Navigation & scroll={false} 스크롤 보존"
          concept="Next.js <Link>는 브라우저 전체 새로고침 없이 변경된 RSC 세그먼트만 교체(Soft Navigation)하여 메모 상태를 보존하며, scroll={false}를 지정하면 페이지 전환 시 스크롤 위치가 최상단으로 튀지 않습니다."
          steps={[
            {
              step: 1,
              title: '[메모 작성 후 아래 링크를 클릭해 보세요] 텍스트 입력',
              description: '클라이언트 입력창에 메모를 입력하여 React 상태를 생성합니다.',
              actionBadge: '상태 생성',
            },
            {
              step: 2,
              title: '[신상품 (기본 스크롤 상단)] 링크 클릭',
              description: 'Soft Navigation으로 신상품 카탈로그로 이동하며 스크롤 위치를 확인합니다.',
              actionBadge: '링크 이동',
            },
            {
              step: 3,
              title: '[베스트 상품], [추천 상품 (홈)] 이동',
              description: '다른 카테고리 링크를 연이어 클릭하여 하드 네비게이션 없이 이동하는지 확인합니다.',
              actionBadge: '카테고리 전환',
            },
            {
              step: 4,
              title: 'Soft Navigation 시 클라이언트 상태 보존 관찰',
              description: '페이지를 여러 번 이동해도 입력 중이던 메모 텍스트가 사라지지 않고 유지되는지 관찰합니다.',
              actionBadge: '상태 보존 관찰',
              observe: 'Soft Navigation 이동 중 React 상태 트리가 보존되어 메모 입력값이 초기화되지 않음',
              observeAt: 'playground',
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
    </SoftNavProvider>
  )
}
