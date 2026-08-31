import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, MOCK_PRODUCTS } from '@study/demo-kit'
import { CacheKeyCompareDemo } from './components/CacheKeyCompareDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getProductPrice, type Currency, type Tier } from './cachedData'

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string; currency?: string; tier?: string }>
}) {
  const sp = await searchParams
  const selectedSku = MOCK_PRODUCTS.some((p) => p.id === sp.sku) ? sp.sku! : MOCK_PRODUCTS[0].id
  const currency: Currency = sp.currency === 'USD' ? 'USD' : 'KRW'
  const userTier: Tier = sp.tier === 'VVIP' ? 'VVIP' : sp.tier === 'NORMAL' ? 'NORMAL' : 'VIP'
  const data = await getProductPrice(selectedSku, currency, userTier)

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Cache Components 복합 인자 캐시 키 자동 직렬화"}
        concept={"Next.js 16 'use cache'는 함수의 매개변수(SKU, 통화, 회원등급) 조합마다 자동으로 별도의 캐시 항목을 만든다. 개발자가 수동으로 키 문자열을 조합할 필요가 없다 — 실제 cacheId가 인자 조합에 따라 달라지는지 직접 확인한다."}
        steps={[
          {
            step: 1,
            title: "선택 SKU, 통화(KRW), 회원등급(VIP) 옵션 확인",
            description: "복합 캐시 키를 구성하는 3가지 파라미터 조합의 초기 상태를 점검합니다.",
            actionBadge: "파라미터 점검",
          },
          {
            step: 2,
            title: "회원등급을 VVIP로 변경하거나 통화를 USD로 전환",
            description: "인자 값을 변경하여 새로운 조합의 캐시 키 생성을 유도합니다.",
            actionBadge: "인자 조합 변경",
          },
          {
            step: 3,
            title: "인자 조합별 고유 캐시 키 분기 및 캐시 분리 관찰",
            description: "동일 함수 내에서도 인자 변경에 따라 독립된 캐시 엔트리가 자동 생성·조회되는지 검증합니다.",
            actionBadge: "캐시 키 검증",
            observe: "SKU/통화/등급 파라미터 조합에 따른 고유 캐시 키 자동 생성 및 할인 금액 정확 계산 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"캐시 키 생성 방식 비교 (수동 vs 자동) 실습"}>
        <CacheKeyCompareDemo
          selectedSku={selectedSku}
          currency={currency}
          userTier={userTier}
          productName={data.productName}
          finalPrice={data.finalPrice}
          cacheId={data.cacheId}
          generatedAt={data.generatedAt}
        />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(data.cacheId)}
        actual={`- sku=${selectedSku}, currency=${currency}, tier=${userTier}\n- cacheId: #${data.cacheId}`}
        expected="세 인자 중 하나라도 바뀌면 cacheId가 바뀌고, 동일 조합으로 돌아오면 cacheId가 재사용되어야 한다."
      />
    </DemoContainer>
  )
}
