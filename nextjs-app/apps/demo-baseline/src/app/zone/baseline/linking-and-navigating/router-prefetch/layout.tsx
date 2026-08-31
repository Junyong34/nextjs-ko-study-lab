'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrefetchController } from './components/PrefetchController'
import { VerificationFooter } from './components/VerificationFooter'
import { PrefetchProvider } from './components/PrefetchContext'

export default function RouterPrefetchRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrefetchProvider>
      <DemoContainer className="space-y-6">
        {/* 1단. 상단 가이드 필드셋 */}
        <DemoGuideCard
          title="Next.js useRouter 프로그래밍 네비게이션 & router.prefetch() 사전 로드"
          concept="router.prefetch()는 백그라운드에서 대상 라우트의 RSC Payload를 사전 다운로드하여, router.push() 실행 시 네트워크 대기 시간을 최소화하고 대상 페이지로 신속하게 전환합니다."
          steps={[
            {
              step: 1,
              title: '[1. 특가 상품 백그라운드 프리패치] 클릭',
              description: 'router.prefetch() API를 실행하여 타깃 라우트(/deals)의 RSC 페이로드를 백그라운드 프리로드 요청합니다.',
              actionBadge: '프리패치 실행',
            },
            {
              step: 2,
              title: '프리패치 상태 및 네트워크 동작 확인',
              description: '프리패치 완료 상태를 확인합니다. (참고: Next.js 개발 모드에서는 백그라운드 자동 다운로드가 제한되며, 프로덕션 빌드에서 .rsc 청크가 사전 적재됩니다.)',
              actionBadge: '프리패치 확인',
            },
            {
              step: 3,
              title: '[2. 특가 상품으로 이동] 클릭',
              description: '프리패치된 상품 링크를 클릭하여 지연 없이 대상 페이지로 즉시 전환되는지 확인합니다.',
              actionBadge: '페이지 진입',
            },
            {
              step: 4,
              title: '사전 로드된 라우트의 즉각 렌더링 관찰',
              description: '사전 적재된 캐시를 활용하여 즉시 화면이 전환되는 프리패치 가속 효과를 관찰합니다.',
              actionBadge: '즉시 전환 관찰',
              observe: 'router.prefetch() 후 router.push() 실행 시 추가 서버 렌더링 대기 없이 즉각 화면이 전환됨',
              observeAt: 'playground',
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
    </PrefetchProvider>
  )
}
