import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-path/page-vs-layout')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathScopeDemo } from './components/RevalidatePathScopeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="revalidatePath page vs layout 레벨 일괄 무효화 대조"
        concept="revalidatePath('/shop', 'page')와 revalidatePath('/shop', 'layout')의 무효화 범위를 대조하여 단일 페이지만 갱신할지 하위 모든 세그먼트를 일괄 갱신할지 제어합니다."
        steps={[
          {
            step: 1,
            title: "[revalidatePath('/shop', 'page')] 클릭",
            description: "특정 단일 페이지(/shop) 경로의 페칭 캐시만 선택적으로 무효화합니다.",
            actionBadge: "page 무효화",
          },
          {
            step: 2,
            title: "[revalidatePath('/shop', 'layout')] 클릭",
            description: "레이아웃과 그 하위에 속한 모든 중첩 페이지(/shop/item, /shop/category)를 일괄 무효화합니다.",
            actionBadge: "layout 무효화",
          },
          {
            step: 3,
            title: "무효화 범위(단일 페이지 vs 하위 전체) 결과 관찰",
            description: "각 무효화 방식에 따른 하위 세그먼트 캐시 퍼지 범위가 화면에 명확히 구분되는지 확인합니다.",
            actionBadge: "범위 검증",
            observe: "page 옵션은 단일 라우트만, layout 옵션은 하위 전체 세그먼트를 일괄 무효화함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidatePath page vs layout 레벨 일괄 무효화 대조 실습"}>
        <RevalidatePathScopeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
