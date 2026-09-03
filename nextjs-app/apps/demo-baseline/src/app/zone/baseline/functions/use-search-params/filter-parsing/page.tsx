import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-search-params/filter-parsing')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FilterParsingDemo } from './components/FilterParsingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useSearchParams() URL 쿼리 파싱 및 필터링"
        concept="useSearchParams() 읽기 전용 훅을 사용하여 현재 URL의 쿼리 스트링(?category=electronics&sort=best)을 파싱하고 100개 상품 카탈로그 필터링 상태와 동기화합니다."
        steps={[
          {
            step: 1,
            title: "[카테고리] 셀렉트에서 [전자기기] 또는 [패션/의류] 선택",
            description: "카테고리 필터 옵션을 변경하여 URL 쿼리 스트링의 category 값을 갱신합니다.",
            actionBadge: "카테고리 필터",
          },
          {
            step: 2,
            title: "[정렬 기준] 및 [최대 가격] 슬라이더 조절",
            description: "정렬 기준(인기순/가격순)과 최대 가격 슬라이더를 조절하여 복합 쿼리를 구성합니다.",
            actionBadge: "복합 쿼리",
          },
          {
            step: 3,
            title: "파싱된 쿼리 스트링 및 필터링 결과 목록 관찰",
            description: "useSearchParams()가 반환한 쿼리 파라미터와 실시간 필터링된 상품 목록 수가 화면에 일치하는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "URL 쿼리 스트링 변경에 따라 useSearchParams() 파싱 값과 필터링된 상품 목록이 즉시 동기화됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useSearchParams() URL 쿼리 파싱 및 필터링 실습"}>
        <FilterParsingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
