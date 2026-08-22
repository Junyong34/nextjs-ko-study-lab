import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from './components/VerificationFooter'

export default function ParallelRoutesLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Parallel Routes (@slots) 다중 슬롯 병렬 렌더링"
        concept="Next.js의 Parallel Routes(@폴더명)를 사용하면 동일한 레이아웃 안에서 @analytics, @team 등 여러 개의 독립된 슬롯 컴포넌트를 props로 전달받아 동시에 병렬로 조립할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '메인 콘텐츠 (children) 확인',
            description: '상단 메인 대시보드 요약 카드(children)가 정상 렌더링됩니다.',
            actionBadge: '기본 슬롯',
          },
          {
            step: 2,
            title: '@analytics 슬롯 확인',
            description: '좌측 파란색 매출 분석 슬롯(@analytics)이 독립 렌더링됩니다.',
            actionBadge: '@analytics 슬롯',
          },
          {
            step: 3,
            title: '@team 슬롯 확인',
            description: '우측 보라색 팀 당직 슬롯(@team)이 동시에 병렬 주입되는 것을 확인합니다.',
            actionBadge: '@team 슬롯',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 운영 대시보드 (3단 병렬 슬롯 구조)" className="space-y-4">
        {/* 메인 뷰 (children) */}
        {children}

        {/* 2단 병렬 슬롯 그리드 (analytics + team) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {analytics}
          {team}
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
