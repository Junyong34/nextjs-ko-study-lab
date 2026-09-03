import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/generate-static-params/multiple-segments')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GenerateStaticParamsMultiDemo } from './components/GenerateStaticParamsMultiDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="generateStaticParams [category]/[id] 다중 세그먼트 조합"
        concept="다중 동적 세그먼트 [category]/[id] 구조에서 generateStaticParams를 조합하여 10개 카테고리와 상품 ID의 데카르트 곱 전체 조합을 빌드 타임에 사전 0ms SSG로 생성합니다."
        steps={[
          {
                    "step": 1,
                    "title": "다중 세그먼트 ([category]/[id]) 파라미터 행렬 점검 및 generateStaticParams 2단계 중첩 생성 실행",
                    "description": "패션/전자기기 등의 카테고리와 하위 상품 ID 간의 조합 목록을 확인합니다. 상위 카테고리 세그먼트와 하위 상품 세그먼트 파라미터 객체 배열을 순차 반환합니다.",
                    "actionBadge": "조합 행렬 점검"
          },
          {
                    "step": 2,
                    "title": "사전 렌더링된 다중 세그먼트 라우트 맵 관찰",
                    "description": "빌드 시점에 /shop/shoes/001, /shop/clothing/002 등 모든 조합이 정적 생성되었는지 확인합니다.",
                    "actionBadge": "결과 검증",
                    "observe": "다중 동적 세그먼트([category]/[id]) 전체 조합이 빌드 타임 정적 라우트로 사전 생성됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"generateStaticParams [category]/[id] 다중 세그먼트 조합 실습"}>
        <GenerateStaticParamsMultiDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
