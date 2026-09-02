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
          concept="Next.js <Link>는 브라우저 전체 새로고침 없이 변경된 RSC 세그먼트만 교체(Soft Navigation)하여 메모와 타이머 상태를 보존하며, scroll={false}를 지정하면 페이지 전환 시 스크롤 위치가 유지됩니다."
          steps={[
            {
              step: 1,
              title: '상단 [메모 입력창]에 텍스트 작성',
              description: 'Client Navigation Monitor의 메모 입력창에 텍스트를 작성하여 클라이언트 React 상태를 생성합니다.',
              actionBadge: '메모 작성',
            },
            {
              step: 2,
              title: '[⬇️ 스크롤 아래로 내리기] 클릭 또는 휠 스크롤',
              description: '예제 스크롤 박스 내부를 아래로 스크롤하여 스크롤 Y 위치(Y > 200px)를 만듭니다.',
              actionBadge: '스크롤 이동',
            },
            {
              step: 3,
              title: '[베스트 상품 (scroll=false)] 링크 클릭',
              description: '소프트 내비게이션으로 이동하며 작성 중이던 메모/타이머와 스크롤 위치가 모두 유지되는 것을 확인합니다.',
              actionBadge: '상태·스크롤 보존',
            },
            {
              step: 4,
              title: '[신상품 (기본 Link)] 클릭하여 상단 스크롤 비교',
              description: '기본 <Link> 클릭 시 메모는 보존되면서 페이지 최상단(Y=0px)으로 자동 스크롤 점프하는 차이를 비교합니다.',
              actionBadge: '상단 스크롤',
            },
            {
              step: 5,
              title: '[베스트 (a 태그)] 클릭하여 Hard Reload 대조',
              description: '표준 <a> 태그 클릭 시 브라우저 전체 새로고침이 일어나 작성 중이던 메모, 타이머, 스크롤이 전부 초기화되는 것을 관찰합니다.',
              actionBadge: '하드 리로드 대조',
              observe: '<Link> 이동 시 메모와 타이머가 유지되며 scroll={false}로 스크롤 위치가 보존됨',
              observeAt: 'playground',
            },
          ]}
        />

        {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
        <DemoPlaygroundCard title="쇼핑몰 카테고리 탭 네비게이션 & 스크롤 실습" className="space-y-6">
          {/* 클라이언트 상태 모니터 (메모 & 타이머 & 실시간 스크롤) */}
          <PersistentHeader />

          {/* 네비게이션 제어 바 & 스크롤 도우미 버튼 & 스펙 안내 */}
          <NavComparisonBar />

          {/* 실제 라우트 페이지 콘텐츠 (높이 제한 및 전용 스크롤바 영역) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 px-1">
              <span>📦 카탈로그 전용 스크롤 영역 (높이 제한 컨테이너)</span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                스크롤바를 아래로 내려 상품을 확인해 보세요 ↓
              </span>
            </div>
            <div
              id="product-scroll-container"
              className="h-[360px] sm:h-[400px] overflow-y-auto rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 p-4 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/60"
            >
              {children}
            </div>
          </div>
        </DemoPlaygroundCard>

        {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
        <VerificationFooter />
      </DemoContainer>
    </SoftNavProvider>
  )
}
