import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigCacheHandlersDemo } from './components/ConfigCacheHandlersDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동"
        concept="next.config.ts experimental.cacheHandlers에 분산 Redis/KV 어댑터를 등록하여 멀티 인스턴스 서버 환경에서 Data Cache를 중앙 집중형으로 동기화합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "분산 Redis 캐시 핸들러와 연동된 상품 데이터를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "커스텀 CacheHandler의 get/set/revalidateTag 인터페이스를 호출합니다.",
            actionBadge: "핸들러 실행",
          },
          {
            step: 3,
            title: "분산 Redis 캐시 적재 및 태그 무효화 관찰",
            description: "로컬 파일시스템이 아닌 분산 Redis 저장소에 캐시가 적재되고 실시간 동기화되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "custom cacheHandlers를 통해 분산 Redis 저장소로 캐시 엔트리가 정상 동기화됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"experimental.cacheHandlers 분산 Redis 캐시 핸들러 연동 실습"}>
        <ConfigCacheHandlersDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
