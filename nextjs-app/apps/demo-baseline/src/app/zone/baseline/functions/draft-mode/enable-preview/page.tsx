import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/draft-mode/enable-preview')

import React from 'react'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DraftModeEnableDemo } from './components/DraftModeEnableDemo'
import { VerificationFooter } from './components/VerificationFooter'
import type { DraftPreviewSnapshot } from './types'

const ENABLE_ROUTE = '/zone/baseline/functions/draft-mode/enable-preview/enable'

// revalidate 시간을 지정하지 않으면 재검증 전까지 계속 캐시된다.
// draftMode가 켜지면 이 함수는 Next.js에 의해 자동으로 캐시를 건너뛰고 매번 재실행된다.
const getPreviewSnapshot = unstable_cache(
  async (): Promise<DraftPreviewSnapshot> => ({
    renderedAt: new Date().toISOString(),
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
  }),
  ['draft-mode-enable-preview-snapshot']
)

export default async function DemoPage() {
  const { isEnabled } = await draftMode()
  const snapshot = await getPreviewSnapshot()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="draftMode().enable() 초안 모드 활성화"
        concept="draftMode().enable()은 Route Handler에서 __prerender_bypass 쿠키를 Set-Cookie 응답 헤더로 실제 발급합니다. 이 쿠키가 있는 요청은 unstable_cache/fetch 캐시를 우회해 매번 새로 렌더링됩니다."
        steps={[
          {
            step: 1,
            title: '최초 진입 시 renderedAt 확인',
            description: 'draftMode가 꺼진 상태에서 unstable_cache로 감싼 함수가 반환한 최초 렌더링 시각을 확인합니다.',
            actionBadge: '초기 상태 확인',
          },
          {
            step: 2,
            title: '[다시 요청]을 2~3회 클릭',
            description: 'router.refresh()로 서버 컴포넌트를 재실행해도 renderedAt이 그대로인지 확인합니다.',
            actionBadge: '캐시 HIT 확인',
            observe: 'draftMode가 꺼진 동안에는 재요청해도 renderedAt/requestId가 바뀌지 않음',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '[draftMode().enable() 실행] 클릭',
            description: '실제 Route Handler(/enable)로 이동합니다. 응답의 Set-Cookie: __prerender_bypass 헤더를 확인합니다.',
            actionBadge: '쿠키 발급 확인',
            observe: 'Network 탭에서 /enable 요청의 응답 헤더에 Set-Cookie: __prerender_bypass=... 가 실제로 찍힘',
            observeAt: 'network',
          },
          {
            step: 4,
            title: '되돌아온 뒤 [다시 요청]을 여러 번 클릭',
            description: 'draftMode가 켜진 상태에서는 재요청마다 renderedAt/requestId가 매번 새로 나오는지 확인합니다.',
            actionBadge: '캐시 우회 확인',
            observe: 'draftMode 활성화 후에는 재요청할 때마다 renderedAt이 매번 달라짐 (정적 캐시 우회)',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="draftMode().enable() 초안 모드 활성화 실습">
        <DraftModeEnableDemo isEnabled={isEnabled} snapshot={snapshot} enableHref={ENABLE_ROUTE} />
      </DemoPlaygroundCard>
      <VerificationFooter isEnabled={isEnabled} snapshot={snapshot} />
    </DemoContainer>
  )
}
