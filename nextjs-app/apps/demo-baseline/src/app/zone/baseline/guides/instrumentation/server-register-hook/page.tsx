import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/instrumentation/server-register-hook')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstrumentationDemo } from './components/InstrumentationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"instrumentation.ts register() 서버 부팅 라이프사이클 훅"}
        concept={"Next.js 서버가 최초 시작될 때 단 한 번 실행되는 instrumentation.ts의 register() 훅에서 DB 커넥션 풀 초기화, 에러 모니터링(Sentry), APM SDK를 안전하게 부트스트랩합니다."}
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "인스트루멘테이션 모니터링이 활성화된 카탈로그 품목을 선택합니다.",
            actionBadge: "품목 선택",
          },
          {
            step: 2,
            title: "[+] 또는 [-] 버튼으로 인스트루멘테이션 이벤트 발생",
            description: "서버 런타임으로 전송할 모니터링 페이로드를 생성합니다.",
            actionBadge: "수량 조절",
          },
          {
            step: 3,
            title: "[동작 실행] 클릭으로 서버 이벤트 전송",
            description: "register() 훅에서 초기화된 서버 인프라를 통해 요청을 처리합니다.",
            actionBadge: "서버 이벤트 트리거",
          },
          {
            step: 4,
            title: "서버 부팅 register() 훅 초기화 상태 및 실행 로그 관찰",
            description: "서버 인스턴스 기동 시점에 등록된 APM 훅이 정상 동작하며 로그를 남기는지 확인합니다.",
            actionBadge: "훅 검증",
            observe: "instrumentation.ts register() 훅을 통한 서버 라이프사이클 초기화 및 동기화 로그 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"서버 부팅 register() 실행 훅 실습"}>
        <InstrumentationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
