import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-report-web-vitals/telemetry')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseReportWebVitalsDemo } from './components/UseReportWebVitalsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useReportWebVitals() 클라이언트 웹 바이탈 측정"
        concept="useReportWebVitals(metric => {}) 훅을 선언하여 브라우저 핵심 성능 지표(LCP, FID, CLS, FCP, TTFB)를 실시간 수집하고 원격 분석 서버로 전송합니다."
        steps={[
          {
                    "step": 1,
                    "title": "useReportWebVitals 클라이언트 훅 등록 점검 및 Core Web Vitals (LCP, CLS, FID) 메트릭 이벤트 감지",
                    "description": "루트 레이아웃 또는 성능 모니터링 컴포넌트에 등록된 훅 선언부를 확인합니다. 브라우저 렌더링 과정에서 발생하는 실시간 성능 측정 객체(name, value, rating)를 캡처합니다.",
                    "actionBadge": "훅 등록 점검"
          },
          {
                    "step": 2,
                    "title": "수집된 텔레메트리 데이터 및 성능 지표 관찰",
                    "description": "밀리초(ms) 단위의 로딩 시간과 CLS 레이아웃 이동 수치가 콘솔 및 분석 로그에 정상 기록되는지 확인합니다.",
                    "actionBadge": "지표 검증",
                    "observe": "useReportWebVitals가 브라우저 LCP/CLS/TTFB 성능 지표를 정상 캡처하여 출력함",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"useReportWebVitals() 클라이언트 웹 바이탈 측정 실습"}>
        <UseReportWebVitalsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
