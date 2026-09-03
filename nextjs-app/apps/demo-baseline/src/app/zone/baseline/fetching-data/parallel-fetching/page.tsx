import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'fetching-data/parallel-fetching')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { ParallelFetchingController } from './components/ParallelFetchingController'

export default function ParallelFetchingDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Promise.all 병렬 데이터 페칭과 직렬 Waterfall 비교 지연 대조"
        concept="독립적인 데이터 요청을 직렬로 await하면 600ms + 800ms = 약 1,400ms의 Waterfall 지연이 발생하지만, Promise.all을 적용하면 동시 시작되어 가장 긴 800ms 시점에 완료됩니다."
        steps={[
          {
            step: 1,
            title: '[1. 직렬 Waterfall 실행 (순차 await) ~1,400ms] 클릭',
            description: '상품 정보(600ms)와 추천 상품(800ms)이 순차 실행되어 약 1,400ms가 소요되는 과정을 확인합니다.',
            actionBadge: '순차 패칭',
          },
          {
            step: 2,
            title: '[2. 병렬 Promise.all 실행 (동시 시작) ~800ms] 클릭',
            description: '두 비동기 요청이 동시 발송되어 max(600ms, 800ms)인 약 800ms에 완료되는 것을 확인합니다.',
            actionBadge: '병렬 패칭',
          },
          {
            step: 3,
            title: '지연 시간 및 타임라인 대조',
            description: '약 40%(600ms) 단축된 총 실행 시간과 네트워크 타임라인 막대 그래프를 대조 관찰합니다.',
            actionBadge: '성능 대조',
            observe: '직렬(약 1,400ms) 대비 병렬(약 800ms) 모드에서 총 응답 시간이 대폭 단축되어 완료됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <ParallelFetchingController />
    </DemoContainer>
  )
}
