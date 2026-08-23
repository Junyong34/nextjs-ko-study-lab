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
        title="Next.js <Link> Soft Navigation & scroll={false} 스크롤 보존"
        concept="Next.js <Link>는 브라우저 전체 새로고침 없이 변경 세그먼트만 교체(Soft Navigation)하여 메모 상태를 보존하며, scroll={false}를 지정하면 0ms 전환 시 스크롤 위치가 최상단으로 튀지 않습니다."
        steps={[
          {
            step: 1,
            title: '상단 메모 입력창에 텍스트 입력 및 스크롤 이동',
            description: '상단 입력창에 메모를 입력하고 페이지 하단으로 스크롤을 내려 조작 준비를 합니다.',
            actionBadge: '상태 및 스크롤 생성',
          },
          {
            step: 2,
            title: '[베스트 상품] <Link scroll={false}> 클릭',
            description: '[베스트 상품] Soft Navigation 링크를 클릭하여 스크롤 위치와 메모 텍스트가 유지된 채 페이지만 교체되는 것을 확인합니다.',
            actionBadge: 'Soft Navigation',
          },
          {
            step: 3,
            title: '[베스트 상품 (하드 리로드)] 클릭 대조',
            description: '일반 <a> 링크를 클릭하여 브라우저 전체가 새로고침되며 스크롤이 맨 위로 튀고 메모가 초기화되는 동작과 대조합니다.',
            actionBadge: 'Hard Navigation 대조',
            observe: 'Soft Nav는 입력 메모와 스크롤이 유지되나, Hard Nav(<a>)는 전체 리로드로 메모가 소실되고 스크롤이 0px로 초기화됨',
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
  )
}
