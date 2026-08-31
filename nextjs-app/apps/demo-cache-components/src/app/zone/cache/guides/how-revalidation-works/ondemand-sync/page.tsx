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
        title="revalidateTag 온디맨드 즉각 캐시 동기화"
        concept="Server Action에서 revalidateTag('products')를 호출하여 특정 태그가 부여된 서버 캐시를 즉시 퍼지하고, 다음 요청 방문자에게 0ms 지연 없이 최신 데이터베이스 상태를 서빙합니다."
        steps={[
          {
            step: 1,
            title: "초기 태그 상태(캐시 유효 (Fresh)) 점검",
            description: "현재 캐시된 상품 태그의 상태를 확인합니다.",
            actionBadge: "초기 상태 확인",
          },
          {
            step: 2,
            title: '[revalidateTag("products") 즉시 무효화] 버튼 클릭',
            description: "Server Action을 호출하여 태그 무효화와 데이터베이스 동기화를 동시에 수행합니다.",
            actionBadge: "태그 무효화 실행",
          },
          {
            step: 3,
            title: "실시간 태그 상태 변경 및 즉각 재계산 관찰",
            description: "태그 상태가 만료됨으로 즉시 전환되고 새 데이터가 계산되는 과정을 검증합니다.",
            actionBadge: "결과 검증",
            observe: 'revalidateTag("products") 클릭 후 태그 만료 상태 전환 및 신규 데이터 즉각 동기화 관찰',
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title="온디맨드 캐시 무효화 및 즉시 동기화 실습">
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
