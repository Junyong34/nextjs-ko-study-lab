import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-selected-layout-segments/breadcrumb')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseSelectedSegmentsBreadcrumbDemo } from './components/UseSelectedSegmentsBreadcrumbDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useSelectedLayoutSegments() 계층형 브레드크럼 생성"
        concept="useSelectedLayoutSegments() 훅을 호출하여 현재 활성 중첩 라우트의 전체 세그먼트 문자열 배열(['shop', 'shoes', 'detail'])을 0ms 일괄 반환받고 계층형 브레드크럼(Breadcrumb) 경로를 자동 구성합니다."
        steps={[
          {
                    "step": 1,
                    "title": "중첩 라우트 세그먼트 구조 확인 및 useSelectedLayoutSegments 세그먼트 배열 파싱",
                    "description": "쇼핑몰 카테고리/상세 페이지로 이어지는 다계층 라우트 구조를 확인합니다. 훅이 반환한 전체 하위 세그먼트 배열을 순회하여 계층별 링크 경로를 생성합니다.",
                    "actionBadge": "구조 점검"
          },
          {
                    "step": 2,
                    "title": "계층형 브레드크럼 UI 렌더링 관찰",
                    "description": "상단 네비게이션 영역에 홈 > 카테고리 > 상세 형태의 브레드크럼이 올바른 순서로 렌더링되는지 확인합니다.",
                    "actionBadge": "브레드크럼 검증",
                    "observe": "활성 중첩 라우트의 전체 세그먼트 배열이 계층형 브레드크럼 UI로 순차 렌더링됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"useSelectedLayoutSegments() 계층형 브레드크럼 생성 실습"}>
        <UseSelectedSegmentsBreadcrumbDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
