import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidateTagBasicDemo } from './components/RevalidateTagBasicDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="revalidateTag() 기본 무효화 및 SWR 재검증"
        concept="revalidateTag('inventory') 함수를 실행하여 해당 태그가 부여된 모든 캐시 엔트리를 즉시 무효화하고 백그라운드 SWR 재검증을 트리거합니다."
        steps={[
          {
            step: 1,
            title: "[revalidateTag('inventory') 실행] 클릭",
            description: "재고 태그(inventory)에 바인딩된 캐시 레코드를 즉각 퍼지(Purge)합니다.",
            actionBadge: "태그 퍼지",
          },
          {
            step: 2,
            title: "캐시 무효화 및 신규 버전 ID 발급 확인",
            description: "기존 캐시가 만료되고 새로운 캐시 엔트리 타임스탬프와 버전 ID가 생성되는 과정을 확인합니다.",
            actionBadge: "버전 확인",
          },
          {
            step: 3,
            title: "SWR 백그라운드 재검증 결과 관찰",
            description: "화면의 재고 상태가 최신 DB 값으로 갱신되며 캐시 HIT 상태로 재적재되는지 확인합니다.",
            actionBadge: "결과 검증",
            observe: "revalidateTag 실행 즉시 재고 캐시가 만료되고 최신 데이터로 재검증 완료됨",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidateTag() 기본 무효화 및 SWR 재검증 실습"}>
        <RevalidateTagBasicDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
