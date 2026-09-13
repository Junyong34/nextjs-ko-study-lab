import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/draft-mode/disable-preview')

import React from 'react'
import { draftMode, cookies } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DraftModeDisableDemo } from './components/DraftModeDisableDemo'
import type { RenderSnapshot } from './types'

// Draft Mode가 켜진 요청에서는 이 캐시의 읽기/쓰기가 우회되어 매번 새 시각이 계산되고,
// 꺼진 요청에서는 revalidate(45초) 동안 같은 값을 반환한다 (공식 문서: What Draft Mode does).
// 이 바이패스는 페이지 렌더링 파이프라인에서만 적용되므로, 반드시 이 Server Component
// 안에서 호출해야 한다 (Route Handler 안에서 호출하면 적용되지 않는다).
const getCachedRenderedAt = unstable_cache(
  async () => new Date().toISOString(),
  ['baseline-functions-draft-mode-disable-preview-rendered-at'],
  { tags: ['baseline-draft-mode-disable-preview-render'], revalidate: 45 }
)

export default async function DemoPage() {
  const draft = await draftMode()
  const cookieStore = await cookies()
  const renderedAt = await getCachedRenderedAt()
  const initial: RenderSnapshot = {
    isEnabled: draft.isEnabled,
    hasBypassCookie: Boolean(cookieStore.get('__prerender_bypass')?.value),
    renderedAt,
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="draftMode().disable() 정적 캐시 모드 복귀"
        concept="draftMode().disable()을 호출하면 __prerender_bypass 쿠키가 실제로 삭제되고, 이후 요청은 unstable_cache로 캐시된 정적 렌더링 시각을 다시 사용합니다."
        steps={[
          {
            step: 1,
            title: '사전 준비: [0. 사전 준비: 초안 모드 켜기] 클릭',
            description: 'draftMode().enable()을 먼저 실행해 __prerender_bypass 쿠키를 발급하고 캐시 우회 상태를 만듭니다.',
            actionBadge: '초안 모드 시작',
          },
          {
            step: 2,
            title: '[draftMode().disable() 실행 (미리보기 닫기)] 클릭',
            description: 'Route Handler(disable/route.ts)에서 draftMode().disable()을 호출해 바이패스 쿠키를 삭제합니다.',
            actionBadge: '쿠키 파기',
            observe: '개발자 도구 Network 탭에서 disable 요청의 Set-Cookie 응답 헤더(과거 만료일)를 직접 확인',
            observeAt: 'network',
          },
          {
            step: 3,
            title: '[정적 캐시 렌더링 시각 다시 요청]을 연속 2회 이상 클릭',
            description: 'disable() 이후에는 unstable_cache 읽기가 다시 활성화되어, 반복 요청해도 렌더링 시각이 고정되는지 확인합니다.',
            actionBadge: '정적 복귀 확인',
            observe: 'draftMode().disable() 이후 쿠키가 사라지고 렌더링 시각이 더 이상 바뀌지 않고 고정됨',
            observeAt: 'playground',
          },
        ]}
      />
      <DraftModeDisableDemo initial={initial} />
    </DemoContainer>
  )
}
