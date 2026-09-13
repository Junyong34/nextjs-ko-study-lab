import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-report-web-vitals/telemetry')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseReportWebVitalsDemo } from './components/UseReportWebVitalsDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useReportWebVitals() 클라이언트 웹 바이탈 측정"
        concept="next/web-vitals의 useReportWebVitals(callback)을 등록하면, 브라우저 PerformanceObserver가 실측한 Core Web Vitals(FCP, TTFB, LCP, CLS, INP)가 지표별로 정해진 시점에 콜백으로 전달됩니다."
        steps={[
          {
            step: 1,
            title: '페이지 진입 직후 FCP·TTFB 자동 수신 확인',
            description: '별도 조작 없이 페이지 로드 직후 FCP(첫 콘텐츠 표시)와 TTFB(첫 바이트 수신) 값이 로그에 자동으로 채워지는지 확인합니다.',
            actionBadge: '자동 수신',
          },
          {
            step: 2,
            title: '[담기] 버튼 클릭으로 LCP 확정',
            description: 'LCP는 사용자의 첫 클릭/키 입력 시점에 최종값이 확정됩니다. 아무 상품이나 [담기] 또는 [찜하기]를 눌러 LCP가 로그에 나타나는지 확인합니다.',
            actionBadge: '클릭 상호작용',
          },
          {
            step: 3,
            title: '다른 탭으로 전환했다가 되돌아와서 CLS·INP 확정',
            description: 'CLS·INP는 기본 옵션에서 탭이 백그라운드로 전환되는 visibilitychange 시점에 세션 누적값이 계산됩니다. 브라우저 탭을 전환했다가 이 페이지로 돌아와 값이 채워지는지 확인합니다.',
            actionBadge: '탭 전환',
            observe: '수신 로그와 검증 패널에 지표 이름·실측값·rating이 실시간으로 추가됨',
            observeAt: 'playground',
          },
        ]}
      />
      <DemoPlaygroundCard title="useReportWebVitals() 실측 지표 수집 실습 — src/.../components/UseReportWebVitalsDemo.tsx">
        <UseReportWebVitalsDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
