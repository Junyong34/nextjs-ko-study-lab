import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseServerDemo } from './components/DirectiveUseServerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use server' 파일 단위 Server Action 모듈 분리"}
        concept={"파일 최상단에 'use server'를 선언한 모듈의 모든 함수는 브라우저에 번들링되지 않는 보안 RPC 엔드포인트로 노출되어 폼 제출 및 데이터 변이를 안전하게 처리합니다."}
        steps={[
        {
        "step": 1,
        "title": "[쿠폰 코드 입력 (예: WELCOME2026, VIPSPECIAL)] 입력",
        "description": "할인 쿠폰 코드를 입력 필드에 작성합니다.",
        "actionBadge": "코드 입력"
        },
        {
        "step": 2,
        "title": "[쿠폰 적용] 클릭",
        "description": "actions.ts에 정의된 applyCoupon() Server Action을 호출하여 서버에서 할인율을 검증합니다.",
        "actionBadge": "Server Action"
        },
        {
        "step": 3,
        "title": "쿠폰 할인율 적용 및 보안 처리 확인",
        "description": "쿠폰 검증 로직이 서버 내부에서만 실행되고 클라이언트에 검증 비밀키가 노출되지 않는지 확인합니다.",
        "actionBadge": "할인 적용",
        "observe": "쿠폰 적용 후 할인된 결제 금액과 3단 검증 패널의 Server Action 응답 상태 대조",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"파일 레벨 'use server' Server Action 모듈 분리 실습"}>
        <DirectiveUseServerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
