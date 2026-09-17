import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-router/refresh-server-sync')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { getCurrentStock } from './lib/inventoryStore'
import { RefreshSyncPlayground } from './components/RefreshSyncPlayground'

export default async function DemoPage() {
  const renderedStock = getCurrentStock()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="서버 데이터 갱신 상태 표시"
        concept="다른 사용자의 구매로 서버 재고가 실제로 바뀌어도, 이 화면은 다시 렌더링되기 전까지 예전 값을 보여줍니다. router.refresh()를 호출해야 서버 컴포넌트가 다시 렌더링되어 최신 재고가 반영되며, 그 사이 입력해 둔 메모 같은 클라이언트 상태는 그대로 유지됩니다."
        steps={[
          {
            step: 1,
            title: '[다른 사용자가 구매함 → 재고 1개 감소] 클릭',
            description: 'Server Action이 서버 메모리의 실제 재고를 1개 줄입니다. 화면의 재고 표시는 아직 바뀌지 않습니다.',
            actionBadge: 'Server Action',
            observe: '검증 패널의 서버 실제 재고(Expected)와 화면 재고(Actual)가 서로 달라짐(불일치)',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '메모 입력창에 임의 텍스트 입력',
            description: '새로고침 후에도 이 값이 남아 있는지 확인하기 위한 클라이언트 상태입니다.',
            actionBadge: '클라이언트 상태',
          },
          {
            step: 3,
            title: '[새로고침 → router.refresh()] 클릭',
            description: 'router.refresh()가 서버 컴포넌트를 다시 렌더링해 최신 재고를 가져옵니다.',
            actionBadge: 'router.refresh()',
            observe: '화면 재고가 서버 실제 재고와 일치로 바뀌고, 메모 입력값은 사라지지 않음',
            observeAt: 'playground',
          },
        ]}
      />
      <RefreshSyncPlayground renderedStock={renderedStock} />
    </DemoContainer>
  )
}
