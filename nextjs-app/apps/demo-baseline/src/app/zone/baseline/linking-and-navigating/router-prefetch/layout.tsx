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
          title="Next.js useRouter 프로그래밍 방식 내비게이션과 router.prefetch()"
          concept="router.prefetch()는 백그라운드에서 대상 라우트의 RSC Payload를 사전 다운로드하여, router.push() 실행 시 네트워크 대기 시간을 최소화하고 대상 페이지로 신속하게 전환합니다."
          steps={[
            {
              step: 1,
              title: '[1. 특가 상품 백그라운드 prefetch] 클릭',
              description: 'router.prefetch() API로 대상 라우트(/deals)의 RSC 페이로드를 백그라운드에서 미리 요청합니다.',
              actionBadge: 'prefetch 실행',
            },
            {
              step: 2,
              title: 'prefetch 상태 및 네트워크 동작 확인',
              description: 'prefetch 호출 상태를 확인합니다. (참고: Next.js 개발 모드에서는 백그라운드 자동 다운로드가 제한될 수 있으며, 프로덕션 빌드에서 .rsc 청크가 미리 로드됩니다.)',
              actionBadge: 'prefetch 확인',
            },
            {
              step: 3,
              title: '[2. 특가 상품으로 이동] 클릭',
              description: 'prefetch된 상품 링크를 클릭해 대상 페이지로 전환되는지 확인합니다.',
              actionBadge: '페이지 진입',
            },
            {
              step: 4,
              title: '미리 로드한 라우트의 렌더링 관찰',
              description: '미리 로드한 캐시를 사용해 화면이 전환되는 과정을 관찰합니다.',
              actionBadge: '전환 관찰',
              observe: 'router.prefetch() 후 router.push()를 실행하면 대상 페이지로 전환됨',
              observeAt: 'playground',
            },
          ]}
        />

        {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
        <DemoPlaygroundCard title="useRouter 제어 콘솔 및 프로그래밍 내비게이션" className="space-y-4">
          {/* prefetch 및 내비게이션 컨트롤러 */}
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
