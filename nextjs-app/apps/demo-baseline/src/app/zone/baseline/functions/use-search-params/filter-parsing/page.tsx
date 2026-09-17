import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-search-params/filter-parsing')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FilterParsingDemo } from './components/FilterParsingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useSearchParams() URL 쿼리 파싱 및 필터링"
        concept="useSearchParams() 읽기 전용 훅으로 현재 URL의 쿼리 스트링(?category=electronics&sort=best&maxPrice=200000)을 실제로 읽고, 그 값을 검증·변환해 상품 목록을 필터링/정렬합니다."
        steps={[
          {
            step: 1,
            title: "[카테고리] 셀렉트에서 [전자기기] 또는 [패션/의류] 선택",
            description: "router.push()가 주소창의 category 쿼리를 실제로 갱신합니다.",
            actionBadge: "카테고리 필터",
          },
          {
            step: 2,
            title: "[정렬 기준] 및 [최대 가격] 슬라이더 조절",
            description: "정렬 기준과 최대 가격을 조절해 복합 쿼리를 구성하고, 새로고침해도 값이 유지되는지 확인합니다.",
            actionBadge: "복합 쿼리",
          },
          {
            step: 3,
            title: "잘못된 값으로 직접 이동 또는 브라우저 [뒤로가기]",
            description: "실습 화면의 '잘못된 쿼리로 직접 이동' 링크를 누르거나 브라우저 뒤로가기를 눌러 URL만 바뀐 상태로 진입합니다.",
            actionBadge: "URL 직접 진입",
            observe: "useSearchParams()가 새 URL 값을 다시 파싱해 필터가 안전하게 복원/보정되고, 검증 패널의 조건 위반 건수가 0으로 유지됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useSearchParams() URL 쿼리 파싱 및 필터링 실습"}>
        <Suspense fallback={<div className="text-xs text-zinc-400">로딩 중...</div>}>
          <FilterParsingDemo />
        </Suspense>
      </DemoPlaygroundCard>
      <Suspense fallback={<div className="text-xs text-zinc-400">검증 결과 확인 중...</div>}>
        <VerificationFooter />
      </Suspense>
    </DemoContainer>
  )
}
