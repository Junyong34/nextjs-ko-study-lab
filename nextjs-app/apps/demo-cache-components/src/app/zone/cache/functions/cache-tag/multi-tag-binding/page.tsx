import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/cache-tag/multi-tag-binding')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { CacheTagMultiBindingDemo } from './components/CacheTagMultiBindingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cacheTag 다중 태그 바인딩 및 연관 캐시 구성"
        concept="cacheTag() 함수를 사용하여 단일 캐시 엔트리에 다중 태그('products', 'category-shoes', 'brand-nike')를 바인딩하고 정밀한 연관 무효화 체계를 구축합니다."
        steps={[
          {
                    "step": 1,
                    "title": "다중 캐시 태그 바인딩 구조 확인 및 cacheTag() 선언부 파라미터 점검",
                    "description": "단일 상품 데이터에 전역 태그, 카테고리 태그, 브랜드 태그가 함께 지정된 구조를 확인합니다. cacheTag('products', 'category-shoes') 호출로 다중 태그가 캐시 레코드에 등록되는 방식을 확인합니다.",
                    "actionBadge": "태그 구조 점검"
          },
          {
                    "step": 2,
                    "title": "태그 계층별 캐시 연관 관계 관찰",
                    "description": "각 태그별로 개별 또는 일괄 무효화가 가능하도록 구성된 연관 맵을 확인합니다.",
                    "actionBadge": "연관 관계 검증",
                    "observe": "다중 태그 바인딩 목록과 캐시 엔트리 간 1:N 연관 관계가 정상 매핑됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"cacheTag 다중 태그 바인딩 및 연관 캐시 구성 실습"}>
        <CacheTagMultiBindingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
