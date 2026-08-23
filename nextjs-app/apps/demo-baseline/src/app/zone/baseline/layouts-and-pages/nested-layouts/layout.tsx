'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SearchProvider } from './components/SearchContext'
import { GnbHeader } from './components/GnbHeader'
import { SidebarNav } from './components/SidebarNav'
import { VerificationFooter } from './components/VerificationFooter'

export default function NestedLayoutsRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SearchProvider>
      <DemoContainer className="space-y-6">
        {/* 1. 상단 가이드 필드셋 */}
        <DemoGuideCard
          title="Next.js 중첩 레이아웃 (layout.tsx) & 부분 렌더링 (Partial Rendering)"
          concept="상위 layout.tsx의 GNB 검색창과 사이드바 상태는 하위 URL(/shoes, /clothing) 이동 시 언마운트되지 않고 영구 보존되며, {children} 슬롯의 페이지만 부분 렌더링(Partial Rendering)으로 즉시 교체됩니다."
          steps={[
            {
              step: 1,
              title: '[상품명, 카테고리 검색...] 입력',
              description: '상단 GNB 검색창에 "러닝화" 또는 "신발"을 입력하여 실시간 필터링 상태를 생성합니다.',
              actionBadge: '상태 생성',
            },
            {
              step: 2,
              title: '[신발 (Shoes)] 링크 클릭',
              description: '좌측 사이드바에서 [신발 (Shoes)] 또는 [의류 (Clothing)] Link를 클릭하여 서브 라우트로 이동합니다.',
              actionBadge: '라우트 전환',
            },
            {
              step: 3,
              title: '부분 렌더링 & GNB 상태 보존 확인',
              description: 'URL이 변경되어도 GNB 검색창 입력 텍스트와 타이머가 리셋되지 않고 상품 목록 영역만 교체되는 것을 관찰합니다.',
              actionBadge: '부분 렌더링',
              observe: 'GNB 검색어와 타이머 상태가 유지된 채 중앙 상품 목록({children})만 즉시 교체됨',
              observeAt: 'playground',
            },
          ]}
        />

        {/* 2. 쇼핑몰 중첩 레이아웃 실습 화면 (DemoPlaygroundCard) */}
        <DemoPlaygroundCard title="쇼핑몰 중첩 레이아웃">
          <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
            {/* Root Layout GNB */}
            <GnbHeader />

            {/* Shop Nested Layout & Real Route Page Slot */}
            <div className="flex flex-col sm:flex-row">
              <SidebarNav />
              {children}
            </div>
          </div>
        </DemoPlaygroundCard>

        {/* 3. 하단 기대값 vs 실제값 검증 패널 & [개념 정리] 카드 */}
        <VerificationFooter />
      </DemoContainer>
    </SearchProvider>
  )
}
