'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrefetchController } from './components/PrefetchController'
import { VerificationFooter } from './components/VerificationFooter'

export default function RouterPrefetchRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js useRouter 프로그래밍 네비게이션 & prefetch 최적화"
        concept="router.prefetch()는 사용자가 이동하기 전에 대상 라우트의 데이터(RSC Payload)를 백그라운드에서 미리 다운로드합니다. 이후 router.push() 실행 시 네트워크 지연 없이 즉시 화면이 전환됩니다."
        steps={[
          {
            step: 1,
            title: '특가 상품 백그라운드 프리패치',
            description: '[1. 특가 상품 백그라운드 프리패치]를 눌러 router.prefetch()를 실행합니다.',
            actionBadge: '사전 데이터 로드',
          },
          {
            step: 2,
            title: '특가 상품으로 이동',
            description: '[2. 특가 상품으로 이동]을 눌러 캐시된 라우트로 즉각 전환되는 것을 확인합니다.',
            actionBadge: '즉시 전환 (0ms)',
          },
          {
            step: 3,
            title: '비프리패치 경로와 대조',
            description: '[3. VIP 라운지 이동]을 눌러 사전 로드되지 않은 경로의 전환 동작과 대조합니다.',
            actionBadge: '비교 대조',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="useRouter 제어 콘솔 및 프로그래밍 네비게이션" className="space-y-4">
        {/* 프리패치 및 네비게이션 컨트롤러 */}
        <PrefetchController />

        {/* 실제 라우트 페이지 콘텐츠 */}
        <div className="pt-2">{children}</div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
