import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/update-tag/instant-memory-sync')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CartSection, CartSectionFallback } from './components/CartSection'
import { UpdateTagDeepDive } from './components/UpdateTagDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="장바구니 수량 상태 변경"
        concept="Server Action에서 수량을 바꾼 뒤 updateTag(tag)를 호출하면 그 태그의 캐시가 즉시 만료되어, 같은 액션 응답에서 사용자가 자신의 변경을 바로 봅니다(read-your-own-writes). revalidateTag(tag, 'max')는 stale 표시만 하므로 액션 응답에 새 렌더가 없고, 이어진 첫 재요청에서도 이전 수량이 보입니다."
        steps={[
          {
            step: 1,
            title: '두 상품의 캐시 값과 원본 값 확인',
            description: '각 줄은 독립된 \'use cache\' 엔트리입니다. 캐시 함수가 반환한 수량·cacheId·생성 시각과 서버 메모리 원본 수량을 나란히 봅니다.',
            actionBadge: '초기 상태',
          },
          {
            step: 2,
            title: '무선 이어폰 [+] 클릭 (updateTag)',
            description: '원본 수량을 바꾸고 updateTag()를 호출합니다. 액션 응답 한 번으로 캐시 수량이 원본과 같아지는지 봅니다.',
            actionBadge: 'updateTag',
          },
          {
            step: 3,
            title: 'USB-C 케이블 [+] 클릭 (revalidateTag max)',
            description: "원본 수량을 바꾸고 revalidateTag(tag, 'max')를 호출합니다. 액션 응답과 바로 이어진 재요청(router.refresh)에서 캐시 수량이 이전 값으로 남는지 봅니다.",
            actionBadge: '대조군',
            observe: 'updateTag 줄은 액션 응답에서 새 cacheId·원본과 같은 수량, revalidateTag max 줄은 첫 재요청에서도 쓰기 이전 엔트리(캐시 ≠ 원본)',
            observeAt: 'playground',
          },
          {
            step: 4,
            title: 'Route Handler에서 updateTag 호출',
            description: 'Server Action이 아닌 곳에서 updateTag()를 호출하면 실제로 에러가 나는지 확인합니다.',
            actionBadge: '호출 제약',
          },
        ]}
      />
      <Suspense fallback={<CartSectionFallback />}>
        <CartSection />
      </Suspense>
      <UpdateTagDeepDive />
    </DemoContainer>
  )
}
