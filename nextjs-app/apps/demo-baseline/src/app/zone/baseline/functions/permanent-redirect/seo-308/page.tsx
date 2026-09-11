import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/permanent-redirect/seo-308')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PermanentRedirectSeoDemo } from './components/PermanentRedirectSeoDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="permanentRedirect() 영구 URL 변경 (308 Permanent)"
        concept="상품 URL 체계가 영구히 개편되면 permanentRedirect()로 실제 HTTP 308을 반환해 검색엔진이 새 URL로 색인을 영구 이전하게 합니다. 반면 조만간 되돌아올 일시적 이동에는 redirect()의 307을 써야 검색엔진이 기존 URL 색인을 그대로 유지합니다."
        steps={[
          {
            step: 1,
            title: '[/legacy/items/1001] 또는 [/legacy/items/1002] 선택',
            description: '숫자 ID 기반 구형 상품 URL을 선택합니다. 신규 URL은 SEO 슬러그(/shop/running-shoes)로 개편됐습니다.',
            actionBadge: '레거시 URL 선택',
          },
          {
            step: 2,
            title: '[실제 상태 코드 측정] 클릭',
            description: 'Node http 클라이언트가 실제 Route Handler에 요청을 보내 permanentRedirect()/redirect()가 반환한 진짜 상태 코드를 읽어옵니다.',
            actionBadge: '308 vs 307 측정',
            observe: '영구 이전 카드는 308, 프로모션 카드는 307이 실제 측정값으로 표시됨',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[새 탭에서 직접 이동] 클릭',
            description: '실제 브라우저 내비게이션으로 legacy URL에 접속해 Network 탭에서 308/307 응답과 Location 헤더를 직접 확인합니다.',
            actionBadge: '실제 이동 검증',
            observe: 'Network 탭 요청 상태 코드와 신규 URL(/shop/{slug}) 도착 화면',
            observeAt: 'network',
          },
        ]}
      />
      <DemoPlaygroundCard title="permanentRedirect() 영구 URL 변경 (308 Permanent) 실습">
        <PermanentRedirectSeoDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
