import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/script/pg-sdk-onload')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { PgSdkWorkspace } from './components/PgSdkWorkspace'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="next/script onLoad · onReady · onError 콜백 수명주기"
        concept="onLoad는 스크립트가 처음 로드될 때 한 번, onReady는 그 직후와 컴포넌트가 다시 마운트될 때마다, onError는 로드 실패 때 호출됩니다. 로컬 결제 SDK를 실제로 로드해 호출 횟수와 시점을 기록합니다."
        steps={[
          {
            step: 1,
            title: '페이지 진입 직후 로그 확인',
            description: '마운트 직후 window.DemoPay.init() 호출이 TypeError로 실패하고, 약 1.5초 뒤 onLoad → onReady가 차례로 기록됩니다. 로드 전에 [직접 호출] 버튼을 눌러 실패를 재현할 수도 있습니다.',
            actionBadge: '로드 전 호출 실패',
          },
          {
            step: 2,
            title: '[주문 내역 페이지로 이동] 후 [결제 페이지로 돌아가기]',
            description: 'Link로 하위 라우트를 왕복해 SDK 컴포넌트를 언마운트·재마운트합니다. onReady만 다시 호출되고 onLoad와 스크립트 실행은 늘지 않는지 봅니다.',
            actionBadge: 'Link 왕복',
          },
          {
            step: 3,
            title: '[HTTP 500 / 404 SDK 로드 시도] 클릭',
            description: '실제 오류 응답에 onError만 호출되는지 확인합니다.',
            actionBadge: 'onError',
            observe: '검증 패널의 6개 항목이 실측 로그로 판정되는지 확인',
            observeAt: 'verification',
          },
        ]}
      />
      <PgSdkWorkspace />
    </DemoContainer>
  )
}
