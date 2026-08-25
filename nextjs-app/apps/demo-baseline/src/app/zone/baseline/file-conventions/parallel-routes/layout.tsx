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
        title={"병렬 라우트 (@slot) 독립 슬롯 동시 렌더링"}
        concept={"단일 세그먼트 layout.tsx에서 @feed와 @analytics 슬롯을 병렬로 주입받아, 2개 슬롯이 독립적인 로딩과 렌더링 수명 주기를 유지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[@feed 슬롯] 렌더링 확인",
        "description": "@feed 폴더가 layout.tsx의 feed props로 전달되어 독립 피드 카드로 마운트됩니다.",
        "actionBadge": "feed 슬롯"
        },
        {
        "step": 2,
        "title": "[@analytics 슬롯] 렌더링 확인",
        "description": "@analytics 폴더가 analytics props로 전달되어 동일 화면에 병렬 렌더링됩니다.",
        "actionBadge": "analytics 슬롯"
        },
        {
        "step": 3,
        "title": "병렬 슬롯 독립 동작 확인",
        "description": "두 슬롯이 독립적으로 상태를 유지하며 단일 layout.tsx 구조 내에서 공존합니다.",
        "actionBadge": "병렬 렌더링",
        "observe": "3단 검증 패널에서 @feed와 @analytics 두 슬롯이 독립 props로 결합되어 200 OK 상태를 반환하는지 대조",
        "observeAt": "verification"
        }
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
