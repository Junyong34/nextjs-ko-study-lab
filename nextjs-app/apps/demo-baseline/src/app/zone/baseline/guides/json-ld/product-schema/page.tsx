import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { JsonLdProductDemo } from './components/JsonLdProductDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"JSON-LD 구조화 데이터(Schema.org) 주입 및 SEO 최적화"}
        concept={"상품 상세 페이지에 Schema.org 표준 Product 타입 JSON-LD 객체를 <script type=\"application/ld+json\">으로 SSR HTML에 삽입하여 검색 엔진 리치 스니펫(가격, 재고, 평점) 노출을 극대화합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "주입된 Schema.org Product 구조화 데이터 확인 및 상품 가격(129,000 KRW) 및 재고(InStock) 필드 검사",
                    "description": "서버 렌더링 시점에 생성된 JSON-LD 스크립트 블록의 @context와 @type을 점검합니다. 검색 엔진 봇이 인식하는 통화, 가격(offers.price), 재고 상태 메타데이터를 확인합니다.",
                    "actionBadge": "JSON-LD 점검"
          },
          {
                    "step": 2,
                    "title": "검색 엔진 리치 스니펫 유효성 및 SEO 마크업 관찰",
                    "description": "구글 검색 결과에 별점과 가격이 올바르게 노출될 수 있는 JSON 직렬화 구조를 검증합니다.",
                    "actionBadge": "SEO 검증",
                    "observe": "HTML <head> 내 application/ld+json 스크립트 태그 및 상품 스키마(129,000 KRW, InStock) 삽입 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Schema.org Product 구조화 데이터 (JSON-LD) 실습"}>
        <JsonLdProductDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
