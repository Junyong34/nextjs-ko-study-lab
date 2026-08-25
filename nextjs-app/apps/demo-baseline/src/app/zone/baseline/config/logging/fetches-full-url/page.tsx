import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigLoggingFetchesDemo } from './components/ConfigLoggingFetchesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅"
        concept="next.config.ts의 logging: { fetches: { fullUrl: true } } 설정을 활성화하여 개발 서버 콘솔에 모든 서버 fetch 요청의 전체 URL, 캐시 HIT/MISS 상태, 응답 시간을 출력합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "서버 fetch 로깅을 발생시킬 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "서버 컴포넌트 fetch 요청을 실행하여 전체 URL 상세 로깅을 트리거합니다.",
            actionBadge: "fetch 로깅",
          },
          {
            step: 3,
            title: "터미널 상세 로그(fullUrl / 캐시 상태 / 응답 시간) 관찰",
            description: "전체 요청 URL과 캐시 상태가 콘솔에 상세 기록되는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "logging.fetches.fullUrl 설정에 따라 서버 fetch 요청의 전체 URL과 캐시 상태가 기록됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"logging.fetches.fullUrl: true 서버 fetch 콘솔 상세 로깅 실습"}>
        <ConfigLoggingFetchesDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
