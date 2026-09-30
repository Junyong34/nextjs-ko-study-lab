import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { getPrivateCart } from './cachedData'
import { PrivateCacheDemo } from './components/PrivateCacheDemo'

export const metadata: Metadata = getDemoMetadata('cache', 'guides/auth-cache-components/private-cache-user')

async function PrivateCartContent() {
  const data = await getPrivateCart()
  return <PrivateCacheDemo data={data} />
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use cache: private'로 사용자별 장바구니 캐시 격리"
        concept="'use cache: private' 함수는 스코프 안에서 cookies()를 직접 읽는다. 어느 사용자의 데이터인지는 인자가 아니라 요청의 쿠키가 정하고, 결과는 서버가 아닌 그 사용자의 브라우저 메모리에만 남는다."
        steps={[
          {
            step: 1,
            title: '[초기 진입] 쿠키가 없는 게스트 상태 확인',
            description: '세션 쿠키가 없으면 getPrivateCart()는 빈 장바구니를 반환한다. 서버 실행 횟수(bodyRuns)는 함수 본문이 서버에서 실제로 돈 횟수다.',
            actionBadge: '초기 상태',
          },
          {
            step: 2,
            title: '[사용자 A로 전환] → [사용자 B로 전환]',
            description: 'Server Action이 실제 Set-Cookie로 쿠키를 바꾼 뒤 router.refresh()로 다시 렌더한다. 사용자마다 장바구니와 cacheId가 다르게 발급된다.',
            actionBadge: '사용자 전환',
            observe: '전환한 사용자의 장바구니가 표시되고, 두 사용자의 cacheId·상품이 서로 섞이지 않는지 확인',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[다시 조회]로 서버 실행 횟수 비교',
            description: 'router.refresh()는 항상 서버에 재요청하므로 bodyRuns가 증가한다. private 결과는 서버에 저장되지 않는다는 뜻이다.',
            actionBadge: '서버 미저장 확인',
            observe: '같은 사용자에서 bodyRuns와 cacheId가 바뀌는지 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <Suspense
        fallback={<div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">[대기] 쿠키 기반 장바구니 로딩 중...</div>}
      >
        <PrivateCartContent />
      </Suspense>
    </DemoContainer>
  )
}
