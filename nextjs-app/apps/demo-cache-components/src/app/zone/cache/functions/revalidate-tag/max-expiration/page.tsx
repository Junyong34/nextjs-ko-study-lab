import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidateTagMaxDemo } from './components/RevalidateTagMaxDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="revalidateTag max 즉시 만료 제어"
        concept="장기 보존(max TTL) 설정된 캐시 항목이라도 Server Action 내 revalidateTag() 호출을 통해 즉시 강제 만료시키고 최신 상태로 동기화합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "장기 캐시(max)가 적용된 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "Server Action에서 revalidateTag를 호출하여 max 캐시 엔트리를 즉시 만료시킵니다.",
            actionBadge: "만료 실행",
          },
          {
            step: 3,
            title: "강제 만료 및 실시간 재검증 로그 관찰",
            description: "max TTL 캐시가 즉시 파기되고 새로운 주문 및 재고 상태가 실시간 로그에 반영되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "max 수명의 캐시 엔트리가 revalidateTag 호출로 즉각 만료되고 최신값으로 갱신됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidateTag max 즉시 만료 제어 실습"}>
        <RevalidateTagMaxDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
