import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseRouterRefreshDemo } from './components/UseRouterRefreshDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="서버 데이터 갱신 상태 표시"
        concept="이 화면은 서버 데이터 갱신을 가정한 상태 표시를 보여줍니다. 현재 버튼은 로컬 상태만 바꾸며 실제 router.refresh()를 호출하지 않습니다."
        steps={[
          {
            step: 1,
            title: "[데이터 갱신] 버튼 클릭",
            description: "버튼을 눌러 갱신 상태 표시를 바꿉니다.",
            actionBadge: "상태 변경",
          },
          {
            step: 2,
            title: "갱신 횟수와 상태 표시 관찰",
            description: "버튼을 누를 때 갱신 횟수가 1회씩 증가하는지 확인합니다.",
            actionBadge: "결과 확인",
            observe: "버튼을 누를 때 로컬 갱신 횟수가 1씩 증가함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"서버 데이터 갱신 상태 표시 실습"}>
        <UseRouterRefreshDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
