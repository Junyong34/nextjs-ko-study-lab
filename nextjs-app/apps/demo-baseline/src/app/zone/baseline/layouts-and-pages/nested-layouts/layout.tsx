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
          title="Next.js 실제 중첩 레이아웃 (layout.tsx) & 라우팅 (Link)"
          concept="layout.tsx에 선언된 상단 GNB(검색창 & 타이머)와 사이드바는 하위 URL이 /shoes든 /clothing이든 아무리 바뀌어도 절대 언마운트되지 않고 영구히 살아있습니다. 오직 그 안의 {children} 자리에 들어오는 페이지만 쏙 교체됩니다."
          steps={[
            {
              step: 1,
              title: 'GNB 검색창에 단어 입력',
              description: '상단 GNB 검색창에 "러닝화" 또는 "신발"을 입력하여 실시간 필터링을 확인합니다.',
              actionBadge: '실시간 필터링',
            },
            {
              step: 2,
              title: '사이드바 Next.js Link 클릭',
              description: '좌측 사이드바에서 [신발 (Shoes)], [의류 (Clothing)] 링크를 클릭합니다.',
              actionBadge: '실제 라우트 이동',
            },
            {
              step: 3,
              title: '상태 유지 & 부분 렌더링 확인',
              description: '실제 URL이 바뀌며 Page 영역만 교체되고, GNB 검색어와 타이머가 유지됩니다.',
              actionBadge: 'Layout 보존 확인',
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
