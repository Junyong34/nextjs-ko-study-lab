import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PrecisionTagPurgeDemo } from './components/PrecisionTagPurgeDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getProduct101Cache, getProduct205Cache } from './cachedData'

export default async function DemoPage() {
  const [product101, product205] = await Promise.all([getProduct101Cache(), getProduct205Cache()])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Cache Components 정밀 태그 기반 타겟 무효화"}
        concept={"전체 페이지를 다시 빌드하지 않고 updateTag('product-101') 또는 updateTag('category-electronics')를 호출하여 특정 SKU 또는 카테고리 캐시만 정밀 타겟 무효화합니다."}
        steps={[
          {
            step: 1,
            title: "최근 무효화된 태그 상태((없음)) 확인",
            description: "현재 캐시 무효화 기록이 없는 초기 상태를 점검합니다.",
            actionBadge: "초기 태그 확인",
          },
          {
            step: 2,
            title: "[101번 상품 무효화] 버튼 클릭",
            description: "단일 상품 태그(product-101)만 선택적으로 무효화하여 키보드 캐시를 퍼지합니다.",
            actionBadge: "단일 상품 퍼지",
          },
          {
            step: 3,
            title: "[전자기기 카테고리 무효화] 버튼 클릭",
            description: "상위 카테고리 태그(category-electronics)를 퍼지하여 하위 모든 전자기기 캐시를 일괄 갱신합니다.",
            actionBadge: "카테고리 퍼지",
          },
          {
            step: 4,
            title: "무효화된 태그 식별자 및 타겟 캐시 갱신 관찰",
            description: "화면 상단에 최근 무효화된 태그 이름이 정확히 출력되고 연관 캐시만 갱신되는지 검증합니다.",
            actionBadge: "정밀 퍼지 검증",
            observe: "버튼 클릭에 따른 최근 무효화 태그(product-101 / category-electronics) 출력 및 타겟 캐시 분리 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"초정밀 온디맨드 태그 무효화 (cacheTag) 실습"}>
        <PrecisionTagPurgeDemo product101={product101} product205={product205} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(product101.cacheId && product205.cacheId)}
        actual={`- product-101 cacheId: #${product101.cacheId}\n- product-205 cacheId: #${product205.cacheId}`}
        expected="product-101만 무효화하면 그 cacheId만 바뀌고, category-electronics를 무효화하면 두 cacheId가 모두 바뀐다."
      />
    </DemoContainer>
  )
}
