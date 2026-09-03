import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'config/cache-life/custom-presets')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigCacheLifePresetsDemo } from './components/ConfigCacheLifePresetsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="experimental.cacheLife 커스텀 수명 프리셋 전역 정의"
        concept="next.config.ts experimental.cacheLife에 전역 비즈니스 프리셋을 정의하여 stale/revalidate/expire 기간을 엔터프라이즈 전역에서 일관되게 재사용합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "전역 cacheLife 프리셋이 적용된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "전역 설정된 cacheLife 프리셋 수명에 따라 데이터를 조회하고 캐시를 생성합니다.",
            actionBadge: "프리셋 조회",
          },
          {
            step: 3,
            title: "전역 cacheLife 프리셋 TTL 동작 로그 관찰",
            description: "설정된 stale 및 revalidate 주기에 맞춰 캐시 신선도가 유지되는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "next.config.ts에 정의된 전역 cacheLife 프리셋 규칙에 따라 캐시 수명이 제어됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"experimental.cacheLife 커스텀 수명 프리셋 전역 정의 실습"}>
        <ConfigCacheLifePresetsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
