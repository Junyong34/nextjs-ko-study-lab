import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstrumentationServerLogDemo } from './components/InstrumentationServerLogDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"instrumentation.ts 서버 부팅 훅 및 모니터링"}
        concept={"Next.js 서버 인스턴스가 기동될 때 instrumentation.ts의 register() 함수가 최초 1회 실행되어 OpenTelemetry SDK 초기화와 서버 헬스체크를 수행합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "서버 인스트루멘테이션 로깅을 트리거할 항목을 선택합니다.",
        "actionBadge": "항목 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "서버 요청을 발생시켜 register() 및 onRequestError 훅의 로깅을 유도합니다.",
        "actionBadge": "요청 발생"
        },
        {
        "step": 3,
        "title": "서버 부팅 및 에러 모니터링 로그 확인",
        "description": "instrumentation.ts에서 캡처된 서버 생명주기 로그가 올바르게 기록되는지 확인합니다.",
        "actionBadge": "로그 확인",
        "observe": "3단 검증 패널에서 instrumentation.ts 훅의 실행 결과와 모니터링 상태 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"서버 부팅 register() 로그 (instrumentation.ts) 실습"}>
        <InstrumentationServerLogDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
