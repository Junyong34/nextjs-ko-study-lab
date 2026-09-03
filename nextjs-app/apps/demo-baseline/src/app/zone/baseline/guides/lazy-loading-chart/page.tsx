import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/lazy-loading-chart')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LazyChartContainer } from './components/LazyChartContainer'

export default function LazyLoadingChartDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/dynamic을 통한 대용량 차트 컴포넌트 지연 로딩"
        concept="next/dynamic({ ssr: false })을 적용하여 초기 로딩 시 무거운 차트 컴포넌트 번들을 메인 번들에서 분리하고, 사용자가 버튼을 클릭하는 시점에 청크를 온디맨드 다운로드합니다."
        steps={[
          {
            step: 1,
            title: '초기 번들 분리(지연 로드 대기) 상태 확인',
            description: '차트가 마운트되지 않은 초기 상태에서 메인 번들에 차트 컴포넌트가 포함되지 않음을 확인합니다.',
            actionBadge: '초기 상태 점검',
          },
          {
            step: 2,
            title: '[[분석] 매출 분석 차트 동적 로드 (next/dynamic)] 클릭',
            description: '버튼을 클릭하여 next/dynamic 청크 로더를 트리거하고 로딩 fallback 스켈레톤을 노출합니다.',
            actionBadge: '청크 로드 트리거',
          },
          {
            step: 3,
            title: '[차트 닫기 (메모리 해제)] 클릭 및 렌더링 대조',
            description: '동적으로 로드된 6개월 매출 차트를 확인한 뒤 차트 닫기 버튼으로 언마운트 동작을 테스트합니다.',
            actionBadge: '동적 마운트 검증',
            observe: 'next/dynamic 호출 후 fallback 스켈레톤 표시 및 2026 상반기 월별 매출 추이 바 차트 렌더링 관찰',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="이커머스 매출 분석 대시보드 (next/dynamic 지연 로딩)" className="space-y-4">
        <LazyChartContainer />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
