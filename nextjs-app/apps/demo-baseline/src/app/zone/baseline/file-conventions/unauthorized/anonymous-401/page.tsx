import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnauthorizedSessionDemo } from './components/UnauthorizedSessionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"unauthorized.tsx 401 비인증 세션 로그인 유도"}
        concept={"비로그인(Anonymous) 상태에서 마이페이지 주문 내역에 접근 시 unauthorized()가 호출되어 401 상태 코드와 unauthorized.tsx 로그인 유도 화면을 표시합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "비인증 상태로 접근할 주문 항목을 선택합니다.",
        "actionBadge": "항목 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "세션 인증 쿠키 없이 회원 전용 라우트 접근을 시도하여 unauthorized()를 호출합니다.",
        "actionBadge": "401 호출"
        },
        {
        "step": 3,
        "title": "401 상태 및 unauthorized.tsx 로그인 화면 확인",
        "description": "비인증 요청이 차단되고 로그인 유도 CTA가 포함된 unauthorized.tsx가 렌더링되는지 확인합니다.",
        "actionBadge": "401 확인",
        "observe": "3단 검증 패널에서 401 Unauthorized 상태 코드와 로그인 유도 화면 전환 결과 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"미인증 세션 401 로그인 요구 화면 (unauthorized.tsx) 실습"}>
        <UnauthorizedSessionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
