import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { LazyChartContainer } from './components/LazyChartContainer'
import { VerificationFooter } from './components/VerificationFooter'

export default function LazyLoadingChartDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="next/dynamic 지연 로딩 & 클라이언트 번들 최적화"
        concept="next/dynamic을 사용하면 용량이 큰 서드파티 라이브러리(차트, 에디터 등)를 초기 JS 번들에서 분리하여 사용자가 실제로 해당 기능을 열었을 때만 비동기 청크로 다운로드하도록 최적화할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '초기 번들 최소화 상태 확인',
            description: '차트가 마운트되기 전에는 차트 관련 스크립트가 로드되지 않음을 확인합니다.',
            actionBadge: '0 KB 초기 번들',
          },
          {
            step: 2,
            title: '[[분석] 매출 분석 차트 동적 로드] 클릭',
            description: '버튼을 눌러 next/dynamic에 의한 청크 다운로드 및 스켈레톤 로딩을 관찰합니다.',
            actionBadge: '동적 청크 수신',
          },
          {
            step: 3,
            title: '차트 렌더링 완료 및 번들 분리 확인',
            description: '화면에 차트가 렌더링되고 하단 개념 정리에서 ssr: false의 역할을 학습합니다.',
            actionBadge: '지연 렌더링 성공',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 매출 분석 대시보드 (next/dynamic 지연 로딩)" className="space-y-4">
        <LazyChartContainer />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
