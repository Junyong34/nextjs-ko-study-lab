import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PgSdkOnloadDemo } from './components/PgSdkOnloadDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/script onLoad 콜백을 통한 외부 결제 SDK 안전 초기화"}
        concept={"<Script src=\"...\" onLoad={...}> 콜백을 등록하여 외부 결제 라이브러리(PG SDK)의 다운로드 및 초기화가 완료된 시점에만 결제 버튼을 활성화(disabled 해제)하여 런타임 undefined 오류를 100% 방지합니다."}
        steps={[
          {
            step: 1,
            title: "결제 SDK 상태([확인] PG사 결제 모듈 준비 완료 (onLoad)) 점검",
            description: "Script 컴포넌트의 onLoad 이벤트가 정상 트리거되어 SDK 인스턴스가 준비되었는지 확인합니다.",
            actionBadge: "SDK 상태 확인",
          },
          {
            step: 2,
            title: "[안전 결제창 열기] 버튼 클릭",
            description: "초기화가 보장된 전역 PG 객체 함수를 안전하게 호출하여 결제 다이얼로그를 실행합니다.",
            actionBadge: "결제 모듈 호출",
          },
          {
            step: 3,
            title: "결제 모듈 안전 호출 및 런타임 에러 방지 관찰",
            description: "SDK 미로드 상태에서의 클릭으로 인한 undefined 참조 에러가 원천 차단되었음을 검증합니다.",
            actionBadge: "안전성 검증",
            observe: "onLoad 콜백 완료 후 활성화된 [안전 결제창 열기] 버튼 및 PG 결제 모듈 정상 호출 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"외부 PG사 결제 SDK onLoad 이벤트 핸들링 실습"}>
        <PgSdkOnloadDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
