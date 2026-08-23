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
        title="Next.js useRouter 프로그래밍 네비게이션 & router.prefetch() 사전 로드"
        concept="router.prefetch()는 백그라운드에서 대상 라우트의 RSC Payload를 사전 다운로드하여, router.push() 실행 시 네트워크 지연(0ms) 없이 대상 페이지로 즉각 전환합니다."
        steps={[
          {
            step: 1,
            title: '[1. 특가 상품 백그라운드 프리패치 router.prefetch()] 클릭',
            description: '버튼을 클릭하여 백그라운드에서 /deals 라우트 데이터를 사전 로드(prefetch)합니다.',
            actionBadge: '사전 로드',
          },
          {
            step: 2,
            title: '[2. 특가 상품으로 이동] 클릭',
            description: 'router.push("/deals")를 실행하여 사전 로드된 캐시를 통해 0ms 즉시 화면이 전환되는 것을 확인합니다.',
            actionBadge: '즉시 전환',
          },
          {
            step: 3,
            title: '[3. VIP 라운지 이동] 클릭 및 [대시보드 복귀] 대조',
            description: '프리패치되지 않은 /vip 라우트와 대시보드 복귀 네비게이션 동작 및 로그를 대조합니다.',
            actionBadge: '온디맨드 로드 대조',
            observe: '프리패치된 /deals 경로는 0ms 즉각 전환되고, 제어 콘솔 로그에 router.prefetch 및 router.push 완료 상태가 기록됨',
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
  )
}
