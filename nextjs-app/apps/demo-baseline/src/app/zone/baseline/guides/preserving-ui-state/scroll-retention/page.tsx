import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ScrollRetentionDemo } from './components/ScrollRetentionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"카탈로그 필터 변경 시 스크롤 위치 유지(scroll={false})"}
        concept={"<Link scroll={false}> 또는 얕은 상태 변경을 적용하여 정렬 필터(최신순/인기순/낮은가격순)를 바꿀 때 페이지 상단으로 불필요하게 스크롤 점프하는 DOM 스크롤 리셋 현상을 방지합니다."}
        steps={[
          {
            step: 1,
            title: "[최신순], [인기순], [낮은가격순] 필터 버튼 확인",
            description: "카탈로그 목록 상단에 배치된 정렬 필터 버튼들을 점검합니다.",
            actionBadge: "필터 점검",
          },
          {
            step: 2,
            title: "[인기순] 또는 [낮은가격순] 버튼 클릭",
            description: "정렬 필터를 변경하여 상품 목록 정렬 순서를 갱신합니다.",
            actionBadge: "필터 전환",
          },
          {
            step: 3,
            title: "페이지 상단 튐 없는 정렬 갱신 및 스크롤 위치 보존 관찰",
            description: "필터 변경 후에도 현재 스크롤 위치가 유지되며 상품 리스트만 부드럽게 재배열되는지 확인합니다.",
            actionBadge: "스크롤 보존 검증",
            observe: "필터 옵션 전환 시 스크롤 상단 점프 없이 목록 정렬 순서만 갱신되는 스크롤 보존 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"searchParams 필터 스크롤 위치 보존 실습"}>
        <ScrollRetentionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
