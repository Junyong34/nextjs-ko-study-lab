import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/remote-redis-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseCacheRemoteDemo } from './components/DirectiveUseCacheRemoteDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache: remote' 분산 원격 Redis 캐시 계층 연동"}
        concept={"Next.js 16 'use cache'에 분산 Redis CacheHandler를 연동하여 다중 서버리스 인스턴스(Seoul, Tokyo) 간에 동일한 실시간 재고(25개) 캐시를 공유하고 콜드스타트 지연을 제거합니다."}
        steps={[
        {
        "step": 1,
        "title": "[재고 보충 (+25)] 클릭",
        "description": "원격 분산 Redis 캐시의 재고 수량을 25개로 초기화 및 동기화합니다.",
        "actionBadge": "재고 동기화"
        },
        {
        "step": 2,
        "title": "[주문 구매 (재고 -1)] 버튼 클릭",
        "description": "특정 인스턴스(Seoul-1)에서 재고를 차감하여 원격 Redis HSET에 변경 사항을 즉시 반영합니다.",
        "actionBadge": "재고 차감"
        },
        {
        "step": 3,
        "title": "다중 리전 인스턴스 간 원격 캐시 동기화 확인",
        "description": "Tokyo 인스턴스에서도 동일하게 차감된 재고(24개)가 즉시 조회되는 분산 캐시 정합성을 확인합니다.",
        "actionBadge": "분산 동기화",
        "observe": "다중 리전 인스턴스 간 실시간 재고 수량 일치 여부와 3단 검증 패널의 Redis 원격 캐시 상태 대조",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"'use cache: remote' 분산 원격 캐시 계층 연동 실습"}>
        <DirectiveUseCacheRemoteDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
