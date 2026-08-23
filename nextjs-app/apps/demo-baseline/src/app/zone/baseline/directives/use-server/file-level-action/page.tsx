import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseServerDemo } from './components/DirectiveUseServerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"파일 최상단 'use server' 쿠폰 검증 액션"}
        concept={"actions.ts 첫 줄에 'use server'를 선언하면 그 파일의 export 함수 전체가 Server Action이 됩니다. applyCouponAction은 클라이언트 번들에 코드가 실려 나가지 않고, 쿠폰 목록 검증은 서버에서만 수행됩니다."}
        steps={[
          {
            step: 1,
            title: "쿠폰 코드 입력",
            description: "[쿠폰 코드 입력 (예: WELCOME2026, VIPSPECIAL)] 칸에 유효한 코드를 넣습니다.",
            actionBadge: "입력",
          },
          {
            step: 2,
            title: "[쿠폰 적용] 클릭",
            description: "applyCouponAction이 서버에서 실행됩니다. 400ms 동안 버튼이 [검증 중...]으로 바뀝니다.",
            actionBadge: "Server Action",
          },
          {
            step: 3,
            title: "할인 반영 결과 확인",
            description: "검증에 성공하면 할인액이 차감되어 최종 결제 예정 금액이 다시 계산됩니다.",
            actionBadge: "400ms 후",
            observe: "유효 코드는 할인액이 붙고 없는 코드는 \"유효하지 않은 쿠폰 코드입니다\" 메시지가 뜨는지 — 판정 로직이 클라이언트가 아닌 서버에서 오는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"파일 레벨 'use server' Server Action 모듈 분리 실습"}>
        <DirectiveUseServerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
