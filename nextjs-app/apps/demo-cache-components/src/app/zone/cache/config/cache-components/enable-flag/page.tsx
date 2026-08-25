import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigCacheComponentsDemo } from './components/ConfigCacheComponentsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="cacheComponents: true Next.js 16 플래그 활성화"
        concept="next.config.ts에서 experimental.cacheComponents: true를 활성화하여 컴포넌트 단위의 'use cache' 지시어 선언과 정밀 캐싱 기능을 켭니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "'use cache' 컴포넌트 캐싱이 적용된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "cacheComponents 활성화 플래그 기반의 캐시 컴포넌트 렌더링을 실행합니다.",
            actionBadge: "컴포넌트 렌더",
          },
          {
            step: 3,
            title: "컴포넌트 레벨 캐시 적재 및 도메인 로그 관찰",
            description: "'use cache' 지시어가 선언된 하위 컴포넌트가 개별 캐시 엔트리로 독립 적재되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "cacheComponents 플래그 활성화로 컴포넌트 레벨 use cache 기능이 정상 동작함",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"cacheComponents: true Next.js 16 플래그 활성화 실습"}>
        <ConfigCacheComponentsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
