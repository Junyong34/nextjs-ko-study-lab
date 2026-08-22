import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ParallelFetchingController } from './components/ParallelFetchingController'
import { VerificationFooter } from './components/VerificationFooter'

export default function ParallelFetchingDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조"
        concept="독립적인 여러 데이터 요청(예: 상품 기본 정보 + 연관 추천 상품)을 순차적으로 await하면 지연 시간이 누적됩니다(Waterfall). Promise.all을 적용하면 모든 요청이 동시에 시작되어 가장 느린 요청 시간 하나만큼만 소요됩니다."
        steps={[
          {
            step: 1,
            title: '직렬 Waterfall 실행',
            description: '[1. 직렬 Waterfall 실행]을 눌러 600ms + 800ms = 약 1,400ms 소요를 확인합니다.',
            actionBadge: '순차 요청',
          },
          {
            step: 2,
            title: '병렬 Promise.all 실행',
            description: '[2. 병렬 Promise.all 실행]을 눌러 동시 시작으로 약 800ms에 완료되는 것을 확인합니다.',
            actionBadge: '병렬 요청',
          },
          {
            step: 3,
            title: '소요 시간 대조',
            description: '하단 검증 패널에서 약 40%의 렌더링 지연 시간 단축 효과를 비교합니다.',
            actionBadge: '성능 최적화 확인',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="데이터 패칭 전략 시뮬레이터" className="space-y-4">
        <ParallelFetchingController />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
