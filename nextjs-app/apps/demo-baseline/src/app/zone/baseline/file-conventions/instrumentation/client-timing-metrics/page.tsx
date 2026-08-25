import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InstrumentationClientTimingDemo } from './components/InstrumentationClientTimingDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"instrumentation-client 성능 메트릭 수집"}
        concept={"클라이언트 사이드에서 페이지 로딩, FCP, LCP 메트릭을 수집하여 성능 모니터링 API 엔드포인트로 0ms 비동기 전송합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "클라이언트 타이밍 메트릭 초기화 확인 및 페이지 인터랙션 및 타이밍 측정",
                    "description": "브라우저 성능 API(PerformanceObserver)를 통해 웹 바이탈 수집기가 등록되는지 확인합니다. 사용자 인터랙션을 수행하며 FCP, LCP, TTFB 지표가 측정되는 과정을 관찰합니다.",
                    "actionBadge": "메트릭 초기화"
          },
          {
                    "step": 2,
                    "title": "성능 데이터 비동기 전송 검증",
                    "description": "측정된 성능 메트릭이 분석 서버로 정상 전송되는지 확인합니다.",
                    "actionBadge": "전송 검증",
                    "observe": "3단 검증 패널에서 클라이언트 웹 바이탈 수집 상태와 타이밍 수치 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"클라이언트 성능 측정 훅 (instrumentation-client.ts) 실습"}>
        <InstrumentationClientTimingDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
