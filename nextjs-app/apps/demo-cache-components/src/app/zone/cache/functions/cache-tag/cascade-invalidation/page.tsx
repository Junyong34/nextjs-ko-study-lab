import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-tag/cascade-invalidation')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheTagCascadeDemo } from './components/CacheTagCascadeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cacheTag 연쇄 무효화 (Cascade Invalidation)"
        concept="상위 카테고리 태그를 revalidateTag로 무효화할 때 하위 10개 상품 및 연관 뷰 캐시가 0ms 내에 일괄 퍼지(Purge)되는 연쇄 무효화(Cascade Invalidation) 메커니즘을 검증합니다."
        steps={[
          {
            step: 1,
            title: "[상위 카테고리 태그 연쇄 무효화] 클릭",
            description: "상위 태그(category-fashion)를 대상으로 revalidateTag를 호출합니다.",
            actionBadge: "연쇄 무효화",
          },
          {
            step: 2,
            title: "하위 종속 캐시 태그 일괄 퍼지 처리",
            description: "상위 태그에 종속된 모든 하위 상품 및 필터 캐시 엔트리가 동시 만료 처리됩니다.",
            actionBadge: "퍼지 처리",
          },
          {
            step: 3,
            title: "연쇄 무효화 결과 및 캐시 재생성 관찰",
            description: "무효화된 하위 캐시 엔트리들이 최신 데이터로 동시 갱신되는지 확인합니다.",
            actionBadge: "상태 검증",
            observe: "상위 태그 무효화 시 하위 종속 캐시들이 일괄 무효화되고 최신 상태로 갱신됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cacheTag 연쇄 무효화 (Cascade Invalidation) 실습"}>
        <CacheTagCascadeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
