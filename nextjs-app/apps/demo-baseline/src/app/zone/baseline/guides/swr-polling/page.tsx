import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/swr-polling')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SwrDeliveryClient } from './components/SwrDeliveryClient'

export default function SwrPollingDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="SWR 실시간 자동 폴링 및 주문 배송 추적"
        concept="useSWR의 refreshInterval(2500ms) 옵션을 설정하여 백엔드 배송 상태를 주기적으로 자동 갱신하고 mutate() 호출 시 즉각적인 온디맨드 revalidation을 수행합니다."
        steps={[
          {
            step: 1,
            title: '[● 자동 폴링 중] 상태 및 2500ms 주기 수신 확인',
            description: 'SWR 주기적 폴링이 활성화되어 2.5초 간격으로 배송 현황 단계가 자동 갱신되는지 확인합니다.',
            actionBadge: '자동 폴링 확인',
          },
          {
            step: 2,
            title: '[mutate() 즉시 수동 갱신] 버튼 클릭',
            description: '타이머를 기다리지 않고 mutate()를 호출하여 즉시 다음 배송 상태로 갱신을 트리거합니다.',
            actionBadge: '수동 갱신 실행',
          },
          {
            step: 3,
            title: '[⏸ 일시 정지] 토글로 백그라운드 폴링 제어',
            description: '자동 폴링 버튼을 눌러 일시 정지 상태로 전환하여 불필요한 네트워크 요청을 차단합니다.',
            actionBadge: '폴링 제어',
          },
          {
            step: 4,
            title: '총 폴링 횟수 및 실시간 배송 STEP 전이 관찰',
            description: '폴링 카운트 증가와 STEP 1(결제 완료)부터 STEP 4(배송 완료)까지의 단계별 UI 전이를 대조합니다.',
            actionBadge: '상태 검증',
            observe: '2500ms 간격의 폴링 카운터 증가 및 운송장 배송 STEP 1~4 활성화 상태 전이 관찰',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="SWR 실시간 택배 배송 트래커 시뮬레이터" className="space-y-4">
        <SwrDeliveryClient />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
