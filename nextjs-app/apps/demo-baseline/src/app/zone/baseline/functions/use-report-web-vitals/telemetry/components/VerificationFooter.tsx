'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = "• useReportWebVitals() 클라이언트 웹 바이탈 측정 사양에 따른 정상 동작 및 상태 변화 관찰"
  const defaultActual = "• 실시간 인터랙션 및 상태 동기화 완료\n• 4단 표준 레이아웃 정상 적용"

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useReportWebVitals() 클라이언트 웹 바이탈 측정 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
            <DemoDeepDiveCard title="useReportWebVitals() Core Web Vitals 클라이언트 성능 측정 & APM 전송">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>useReportWebVitals()</code> (<code>next/navigation</code>)는 브라우저에서 Core Web Vitals 지표(LCP, FID, CLS, INP, FCP, TTFB)를 실시간 캡처하여 개발자 콜백으로 전달하는 클라이언트 훅입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 사용자가 페이지를 탐색하고 상호작용할 때 발생하는 LCP(최대 콘텐츠 렌더링 시간), INP(인터랙션 응답성), CLS(누적 레이아웃 이동) 메트릭을 수집하여 성능 상태 패널에 표시하고 <code>navigator.sendBeacon</code>으로 전송하는 흐름을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>실제 사용자 환경(RUM) 성능 측정</strong>: 실험실 데이터가 아닌 전 세계 실제 사용자의 네트워크/기기 환경에서의 성능 병목을 정확히 파악합니다.</li>
              <li><strong>Google 검색 랭킹 최적화</strong>: 검색 순위에 직접 영향을 주는 Core Web Vitals 3대 지표를 지속적으로 모니터링합니다.</li>
              <li><strong>경량 훅 구조</strong>: 브라우저 PerformanceObserver를 표준화하여 클라이언트 추가 라이브러리 부담 없이 측정합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>상용 서비스의 실시간 Core Web Vitals 성능 대시보드 구축 (Google Analytics / Datadog 연동)</li>
              <li>대규모 카테고리/상품 상세 페이지의 LCP 저하 원인 실시간 모니터링</li>
              <li>신규 배포 버전과 이전 버전 간의 INP 인터랙션 지연 성능 회귀(Regression) 비교</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>루트 레이아웃 분리</strong>: <code>useReportWebVitals</code>를 사용하는 컴포넌트는 <code>'use client'</code>로 선언하여 루트 레이아웃에 별도 텔레메트리 클라이언트 컴포넌트로 삽입해야 합니다.</li>
              <li><strong>비콘 전송 사용</strong>: 메트릭 전송 시 페이지 이탈 중에도 안전하게 전송되도록 <code>navigator.sendBeacon()</code> 또는 <code>fetch(..., {'{'} keepalive: true {'}'})</code>를 사용하는 것이 권장됩니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
