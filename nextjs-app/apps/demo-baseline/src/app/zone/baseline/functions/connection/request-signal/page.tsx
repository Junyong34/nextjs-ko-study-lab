import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConnectionRequestSignalDemo } from './components/ConnectionRequestSignalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="connection() 비동기 연결 준비 대기"
        concept="Next.js 15+ connection()을 호출하여 정적 사전 렌더링(PPR/SSG) 단계에서 실행을 중단하고 실제 클라이언트 HTTP 요청이 수신될 때까지 안전하게 대기합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "연결 신호 대기를 테스트할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "await connection()이 선언된 동적 요청 처리 파이프라인을 실행합니다.",
            actionBadge: "연결 요청",
          },
          {
            step: 3,
            title: "요청 수신 시점 비동기 연결 완료 로그 관찰",
            description: "사전 렌더링 빌드 타임이 아닌 실제 런타임 연결 신호가 감지되어 데이터가 처리되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "connection() 비동기 신호 수신 후 동적 렌더링 파이프라인이 정상 완수됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"connection() 비동기 연결 준비 대기 실습"}>
        <ConnectionRequestSignalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
