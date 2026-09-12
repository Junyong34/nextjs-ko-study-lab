import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/not-found/trigger-404')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StoreLayoutDemo } from './components/StoreLayoutDemo'
import { InventoryApiDemo } from './components/InventoryApiDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="notFound() 404 트리거 및 not-found.tsx 렌더"
        concept="notFound()는 Server Component, Server Function, Route Handler 어디서 호출되든 동일한 NEXT_HTTP_ERROR_FALLBACK;404 예외를 던져 렌더링/응답을 즉시 중단시킵니다. 이 데모는 page.tsx가 아니라 layout.tsx와 Route Handler, 두 위치에서 그 공통 동작을 직접 확인합니다."
        steps={[
          {
            step: 1,
            title: '[STORE-101 진입 →] 또는 [STORE-102 진입 →] 클릭',
            description: '존재하는 지점으로 이동해 stores/[storeId]/layout.tsx를 정상 통과하는지 확인합니다.',
            actionBadge: '정상 지점 진입',
          },
          {
            step: 2,
            title: '[STORE-999 진입 → (폐점, 404 유도)] 클릭',
            description: '존재하지 않는 지점으로 이동해 layout.tsx가 notFound()를 호출하도록 유도합니다.',
            actionBadge: 'layout.tsx notFound()',
            observe: '하위 page.tsx는 렌더링을 시도하지 않고 stores/[storeId]/not-found.tsx가 즉시 렌더링됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[SKU-100/101 조회] 또는 [SKU-999 조회] 클릭',
            description: 'Route Handler(api/inventory/[sku]/route.ts)에 실제 fetch 요청을 보내 응답을 관찰합니다.',
            actionBadge: 'Route Handler notFound()',
            observe: 'SKU-999 조회 시 Route Handler의 notFound() 호출로 실제 HTTP 404 응답(HTML 없음)이 옴',
            observeAt: 'playground',
          },
          {
            step: 4,
            title: '이동한 not-found.tsx 하단 및 재고 API 응답 로그의 실측 상태 코드 확인',
            description: '두 경로 모두 실제 404 상태 코드가 반환되는지 curl 또는 브라우저 Network 탭으로 재확인합니다.',
            actionBadge: '404 실측 검증',
            observe: '두 위치 모두 동일한 예외 메커니즘으로 실제 HTTP 404를 반환',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="notFound() 404 트리거 및 not-found.tsx 렌더 실습">
        <div className="space-y-4">
          <StoreLayoutDemo />
          <InventoryApiDemo />
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
