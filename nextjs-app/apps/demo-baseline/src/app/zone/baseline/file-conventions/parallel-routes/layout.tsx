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
        title={"Parallel Routes (@slots) 다중 슬롯 병렬 렌더링"}
        concept={"layout.tsx가 children 외에 analytics·team 두 개의 props를 더 받습니다. @analytics/page.tsx와 @team/page.tsx가 각각 그 props로 주입되어, 한 번의 라우트 진입에서 3개 페이지 파일이 동시에 렌더링됩니다."}
        steps={[
          {
            step: 1,
            title: "메인 [쇼핑몰 통합 관제 센터] 확인",
            description: "page.tsx가 children 자리에 렌더링되어 시스템 상태 99.99%를 표시합니다.",
            actionBadge: "children 슬롯",
          },
          {
            step: 2,
            title: "좌측 [@analytics] 슬롯 확인",
            description: "@analytics/page.tsx가 오늘 방문자 12,840명과 결제 전환율 4.82%를 독립 렌더링합니다.",
            actionBadge: "슬롯 1",
          },
          {
            step: 3,
            title: "우측 [@team] 슬롯 확인",
            description: "@team/page.tsx가 CS 대응팀·물류 출고팀의 ONLINE 상태를 같은 레이아웃 안에 병렬 주입합니다.",
            actionBadge: "슬롯 2",
            observe: "세 영역이 각각 [슬롯 1 (독립 렌더)] · [슬롯 2 (독립 렌더)] 배지를 달고 동시에 표시됨 — 탭 전환이나 조건 분기 없이 파일 3개가 한 화면에 조립됨",
            observeAt: "playground",
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
