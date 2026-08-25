import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FetchExtendedRevalidateDemo } from './components/FetchExtendedRevalidateDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Next.js 확장 fetch revalidate 옵션"
        concept="Next.js 확장 fetch API의 { next: { revalidate: 60 } } 옵션을 사용하여 HTTP 요청 레벨에서 ISR 시간 기반 캐시 수명과 재검증 주기를 제어합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "시간 기반 ISR 캐시가 적용된 카탈로그 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "revalidate: 60 옵션이 지정된 확장 fetch 함수를 호출합니다.",
            actionBadge: "fetch 호출",
          },
          {
            step: 3,
            title: "캐시 수명 주기 및 실시간 도메인 로그 관찰",
            description: "60초 TTL 동안 캐시 HIT가 유지되고 만료 후 비동기 SWR 갱신이 일어나는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "fetch next.revalidate 옵션에 따른 캐시 적재 및 갱신 상태가 실시간 로그에 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Next.js 확장 fetch revalidate 옵션 실습"}>
        <FetchExtendedRevalidateDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
