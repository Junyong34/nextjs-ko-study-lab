import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ScriptPgSdkOnloadDemo } from './components/ScriptPgSdkOnloadDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/script onLoad 이벤트 콜백 및 PG SDK 초기화"}
        concept={"<Script src=\"...\" onLoad={...}> 콜백을 사용하여 외부 결제 PG SDK JS 파일이 완전히 로드된 후에만 [카드 결제하기] 버튼을 활성화하고 결제창(189,000원)을 안전하게 호출합니다."}
        steps={[
        {
        "step": 1,
        "title": "[onLoad 강제 시뮬레이션] 클릭",
        "description": "외부 결제 SDK JS 파일 다운로드가 완료되어 onLoad 이벤트가 트리거되는 상황을 실행합니다.",
        "actionBadge": "onLoad 트리거"
        },
        {
        "step": 2,
        "title": "결제 버튼 활성화 상태 확인",
        "description": "window.TossPayments 또는 SDK 인스턴스가 준비되어 결제 버튼이 활성 상태로 전환되는지 확인합니다.",
        "actionBadge": "버튼 활성화"
        },
        {
        "step": 3,
        "title": "결제 요청 실행 및 완료 확인",
        "description": "활성화된 결제 버튼을 클릭하여 PG 결제창 호출 및 주문 결제 완료(189,000원) 처리를 검증합니다.",
        "actionBadge": "결제 완료",
        "observe": "3단 검증 패널에서 next/script의 onLoad 이벤트 핸들러 실행 및 SDK 초기화 상태 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"외부 PG사 결제 SDK onLoad 이벤트 실습"}>
        <ScriptPgSdkOnloadDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
