import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RevalidatePathDynamicDemo } from './components/RevalidatePathDynamicDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="다이나믹 라우트 세그먼트의 revalidatePath 동작"
        concept="다이나믹 라우트 세그먼트(revalidatePath('/shop/[category]/[id]', 'page'))를 지정하여 특정 파라미터 패턴과 일치하는 페이지 캐시를 선택해 무효화합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "무효화할 다이나믹 세그먼트 상품을 선택합니다.",
            actionBadge: "세그먼트 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "다이나믹 경로 패턴에 revalidatePath를 호출해 해당 세그먼트 캐시를 갱신합니다.",
            actionBadge: "revalidatePath 실행",
          },
          {
            step: 3,
            title: "다이나믹 세그먼트 캐시 갱신 결과 관찰",
            description: "지정한 상품 ID 세그먼트 경로의 캐시가 갱신되는지 확인합니다.",
            actionBadge: "동기화 검증",
            observe: "다이나믹 라우트 세그먼트에 대한 revalidatePath 실행 결과가 검증 패널 로그에 기록됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"다이나믹 라우트 세그먼트의 revalidatePath 동작 실습"}>
        <RevalidatePathDynamicDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
