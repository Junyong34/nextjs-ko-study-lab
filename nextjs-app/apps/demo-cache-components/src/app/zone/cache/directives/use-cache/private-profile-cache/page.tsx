import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/private-profile-cache')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DirectiveUseCachePrivateDemo } from './components/DirectiveUseCachePrivateDemo'
import { getPrivateOrderHistory } from './cachedData'

async function PrivateProfileContent() {
  const data = await getPrivateOrderHistory()
  return <DirectiveUseCachePrivateDemo data={data} />
}

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache: private' 개인화 주문 내역 캐시 격리"}
        concept={
          "일반 'use cache'와 달리 'use cache: private'는 캐시 스코프 안에서 cookies()를 직접 호출할 수 있다. 세션 쿠키로 읽은 사용자만의 주문 내역을 캐시하되, 그 결과는 서버에 저장되지 않고 브라우저 메모리에만 남는다."
        }
        steps={[
          {
            step: 1,
            title: '초기 진입 — 게스트(비로그인) 상태 확인',
            description: '세션 쿠키가 없으면 getPrivateOrderHistory()가 빈 주문 내역을 반환한다.',
            actionBadge: '초기 상태',
          },
          {
            step: 2,
            title: '[김쇼핑]/[이우수]/[박관리] 버튼으로 세션 전환',
            description: 'Server Action이 실제 Set-Cookie 헤더로 세션 쿠키를 바꾸면, private 캐시 함수가 새 쿠키 값으로 즉시 다시 계산된다.',
            actionBadge: '세션 전환',
            observe: '전환한 사용자의 주문 내역과 sessionId가 일치하는지, cacheInstanceId가 새로 발급되는지 확인',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[페이지 새로고침]으로 캐시 소멸 관찰',
            description: '같은 세션이라도 새로고침하면 cacheInstanceId와 조회 시각이 다시 발급된다 — 서버에 저장되지 않는다는 증거다.',
            actionBadge: '메모리 전용 확인',
            observe: '새로고침 전/후 cacheInstanceId 비교 메모',
            observeAt: 'verification',
          },
        ]}
      />
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
            [대기] 세션 쿠키 기반 개인화 주문 내역 로딩 중...
          </div>
        }
      >
        <PrivateProfileContent />
      </Suspense>
    </DemoContainer>
  )
}
