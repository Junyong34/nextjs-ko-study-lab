import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SwrDeliveryClient } from './components/SwrDeliveryClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function SwrPollingDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="SWR 실시간 배송 조회 자동 폴링 & mutate() 갱신"
        concept="SWR은 클라이언트 사이드에서 Stale-While-Revalidate 캐싱 전략을 적용하여, 실시간 배송 조회 같은 동적 데이터를 주기적으로 백그라운드 폴링하고 mutate()를 통해 즉각적인 로컬 캐시 갱신을 지원합니다."
        steps={[
          {
            step: 1,
            title: '2.5초 주기 자동 폴링 관찰',
            description: '배송 단계(STEP 1~4)가 2.5초 주기로 자동 전진하며 폴링 횟수가 증가하는 것을 확인합니다.',
            actionBadge: 'SWR 주기적 폴링',
          },
          {
            step: 2,
            title: '자동 폴링 일시 정지 / 재개',
            description: '상단 [일시 정지] 버튼을 눌러 불필요한 백그라운드 요청을 스마트하게 중단합니다.',
            actionBadge: '트래픽 제어',
          },
          {
            step: 3,
            title: 'mutate() 즉시 수동 갱신',
            description: '[mutate() 즉시 수동 갱신]을 눌러 다음 단계로 0ms만에 즉각 전환되는 것을 봅니다.',
            actionBadge: '낙관적 로컬 갱신',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="SWR 실시간 택배 배송 트래커 시뮬레이터" className="space-y-4">
        <SwrDeliveryClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
