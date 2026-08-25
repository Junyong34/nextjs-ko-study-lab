import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnstableNoStoreDemo } from './components/UnstableNoStoreDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="unstable_noStore() 동적 렌더링 명시적 선언"
        concept="unstable_noStore()를 컴포넌트나 데이터 페칭 함수 내에 선언하여 0ms 정적 캐시 생성을 건너뛰고(Bailout) 매 요청마다 항상 최신 동적 렌더링(SSR)을 수행하도록 강제합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "실시간 주문 상태를 확인할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "unstable_noStore()가 선언된 데이터 페칭 로직을 호출하여 동적 렌더링을 트리거합니다.",
            actionBadge: "동적 호출",
          },
          {
            step: 3,
            title: "동적 렌더링 타임스탬프 및 실시간 도메인 로그 관찰",
            description: "정적 캐시가 적용되지 않고 요청 시점의 실시간 타임스탬프와 주문 상태가 로그에 기록되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "unstable_noStore() 호출로 정적 캐시가 차단되고 매 요청마다 실시간 로그가 갱신됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"unstable_noStore() 동적 렌더링 명시적 선언 실습"}>
        <UnstableNoStoreDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
