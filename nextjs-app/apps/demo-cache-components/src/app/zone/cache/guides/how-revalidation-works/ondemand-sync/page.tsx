import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { OndemandSyncDemo } from './components/OndemandSyncDemo'
import { VerificationFooter } from './components/VerificationFooter'
import { getCachedProducts } from './cachedData'

export default async function DemoPage() {
  const data = await getCachedProducts()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="revalidateTag 온디맨드 캐시 갱신"
        concept="Server Action에서 revalidateTag('products')를 호출해 특정 태그가 붙은 캐시를 stale 상태로 표시하고, 이후 요청에서 새 데이터를 준비합니다."
        steps={[
          {
            step: 1,
            title: "초기 태그 상태(캐시 유효 (Fresh)) 점검",
            description: "현재 캐시된 상품 태그의 상태를 확인합니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: '[revalidateTag("products") 캐시 갱신] 버튼 클릭',
            description: "Server Action을 호출하여 태그가 붙은 캐시를 갱신 대상으로 표시합니다.",
            actionBadge: "태그 무효화 실행",
          },
          {
            step: 3,
            title: "태그 상태 변경 및 다음 요청의 데이터 갱신 관찰",
            description: "태그가 stale 상태로 바뀌고 이후 요청에서 새 데이터가 계산되는 과정을 확인합니다.",
            actionBadge: "결과 검증",
            observe: 'revalidateTag("products") 클릭 후 태그의 stale 상태 전환 및 이후 데이터 갱신 관찰',
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="온디맨드 캐시 무효화와 상태 갱신 실습">
        <OndemandSyncDemo cacheId={data.cacheId} generatedAt={data.generatedAt} products={data.products} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={Boolean(data.cacheId)}
        actual={`- 캐시 ID: #${data.cacheId}\n- 생성 시각: ${data.generatedAt}\n- 상품 ${data.products.length}건`}
        expected="'use cache' + cacheTag('products')로 캐시된 값이 렌더링되고, revalidateTag 이후 재방문 시 캐시 ID가 바뀐다."
      />
    </DemoContainer>
  )
}
