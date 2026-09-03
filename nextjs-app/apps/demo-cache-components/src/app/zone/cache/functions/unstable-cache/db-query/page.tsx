import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/unstable-cache/db-query')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnstableCacheDbDemo } from './components/UnstableCacheDbDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="unstable_cache를 통한 DB 쿼리 결과 캐싱"
        concept="unstable_cache()를 활용하여 무거운 데이터베이스 쿼리 및 외부 API 결과를 메모리/Data Cache에 캐싱하고 revalidateTag로 수동 무효화합니다."
        steps={[
          {
            step: 1,
            title: "[조회 (HIT/MISS)] 클릭",
            description: "unstable_cache로 래핑된 DB 쿼리 함수를 호출하여 첫 번째 조회(MISS) 및 캐시 적재를 수행합니다.",
            actionBadge: "캐시 조회",
          },
          {
            step: 2,
            title: "반복 조회 시 캐시 HIT 및 응답 지연 0ms 확인",
            description: "동일 버튼을 다시 클릭하여 DB 재조회 없이 캐시 메모리에서 즉시 0ms로 반환되는지 확인합니다.",
            actionBadge: "HIT 확인",
          },
          {
            step: 3,
            title: "[태그 무효화 (revalidateTag)] 클릭 및 캐시 MISS 관찰",
            description: "태그 무효화 버튼을 눌러 캐시를 퍼지하고 다음 조회가 MISS로 재계산되는지 확인합니다.",
            actionBadge: "무효화 검증",
            observe: "캐시 무효화 전후로 HIT/MISS 상태 및 쿼리 실행 타임스탬프가 즉시 전환됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"unstable_cache를 통한 DB 쿼리 결과 캐싱 실습"}>
        <UnstableCacheDbDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
