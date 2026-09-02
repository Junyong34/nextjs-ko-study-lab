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
              title: '[⬇️ 스크롤 아래로 내리기] 클릭 또는 휠 스크롤',
              description: '상품 목록을 아래로 스크롤하여 스크롤 Y 위치(Y > 400px)를 생성합니다.',
              actionBadge: '스크롤 이동',
            },
            {
              step: 2,
              title: '[베스트 상품 (scroll=false)] 링크 클릭',
              description: 'Soft Navigation으로 베스트 상품으로 이동하며 스크롤 위치가 유지되는 것을 확인합니다.',
              actionBadge: '스크롤 보존',
            },
            {
              step: 3,
              title: '[신상품 (기본 Link)] 클릭하여 상단 스크롤 비교',
              description: '기본 <Link> 클릭 시 페이지 최상단(Y=0px)으로 자동 스크롤 점프하는 차이를 비교합니다.',
              actionBadge: '상단 스크롤',
            },
            {
              step: 4,
              title: '[베스트 (a 태그)] 클릭하여 Hard Reload 대조',
              description: '표준 <a> 태그 클릭 시 브라우저 전체 새로고침이 일어나 타이머와 메모가 초기화되는 것을 관찰합니다.',
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

          {/* 네비게이션 제어 바 & 스크롤 도우미 버튼 */}
          <NavComparisonBar />

          {/* 실제 라우트 페이지 콘텐츠 (스크롤 목록) */}
          <div className="pt-2">{children}</div>
        </DemoPlaygroundCard>

        {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
        <VerificationFooter />
      </DemoContainer>
    </SoftNavProvider>
  )
}
