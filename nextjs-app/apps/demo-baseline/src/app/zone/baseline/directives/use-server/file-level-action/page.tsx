import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'directives/use-server/file-level-action')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DirectiveUseServerDemo } from './components/DirectiveUseServerDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use server' 파일 단위 Server Action 모듈 분리"}
        concept={"파일 최상단에 'use server'를 선언한 별도 모듈(actions.ts)의 모든 export 함수는 브라우저에 번들링되지 않고, 실제 HTTP POST 엔드포인트를 가진 Server Action으로 컴파일되어 클라이언트에서 일반 함수처럼 직접 호출됩니다."}
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
        "description": "actions.ts에 정의된 applyCouponAction() 함수를 일반 함수처럼 호출합니다. 실제로는 서버로 요청이 전송됩니다.",
        "actionBadge": "Server Action"
        },
        {
        "step": 3,
        "title": "브라우저 개발자 도구 Network 탭 확인",
        "description": "쿠폰 적용 클릭 시 발생한 POST 요청을 Network 탭에서 확인합니다. 파일 레벨 'use server' 함수가 실제 RPC 엔드포인트로 컴파일됐다는 직접 증거입니다.",
        "actionBadge": "네트워크 확인",
        "observe": "쿠폰 적용 클릭마다 Network 탭에 새 POST 요청이 기록됨",
        "observeAt": "network"
        },
        {
        "step": 4,
        "title": "쿠폰 할인율 적용 및 검증 패널 확인",
        "description": "정상 코드는 할인 적용 성공, 잘못된 코드나 최소 주문금액 미달은 실패로 표시되는지 3단 검증 패널에서 확인합니다.",
        "actionBadge": "할인 적용",
        "observe": "쿠폰 적용 후 할인된 결제 금액과 3단 검증 패널의 Server Action 응답 상태 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DirectiveUseServerDemo />
    </DemoContainer>
  )
}
