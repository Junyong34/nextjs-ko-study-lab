import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidateTagBasicDemo } from './components/RevalidateTagBasicDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="revalidateTag() 기본 무효화와 SWR"
        concept="revalidateTag('inventory')를 호출하면 해당 태그가 붙은 캐시가 stale 상태로 바뀝니다. 이 데모는 액션이 반환한 재고 목록을 화면에 표시하고, 캐시는 다음 요청에서 갱신됩니다."
        steps={[
          {
            step: 1,
            title: "[revalidateTag('inventory') 실행] 클릭",
            description: "inventory 태그가 붙은 캐시를 stale 상태로 표시합니다.",
            actionBadge: "태그 무효화",
          },
          {
            step: 2,
            title: "액션 응답의 새 재고 상태 확인",
            description: "액션이 반환한 재고 목록과 버전 ID가 화면에 표시되는지 확인합니다.",
            actionBadge: "응답 확인",
          },
          {
            step: 3,
            title: "다음 요청의 캐시 갱신 확인",
            description: "revalidateTag가 캐시를 stale 상태로 표시하고 다음 요청에서 새 값을 사용하게 하는지 확인합니다.",
            actionBadge: "결과 확인",
            observe: "액션 응답으로 재고 목록이 화면에 갱신되고, 캐시는 다음 요청에서 새 값을 사용함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"revalidateTag() 기본 무효화와 SWR 실습"}>
        <RevalidateTagBasicDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
