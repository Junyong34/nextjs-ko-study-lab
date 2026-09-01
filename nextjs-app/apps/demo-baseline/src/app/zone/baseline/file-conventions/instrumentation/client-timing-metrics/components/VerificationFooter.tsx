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

  const defaultExpected = "• 클라이언트 성능 측정 훅 (instrumentation-client.ts)의 동작과 기대 결과를 확인합니다."
  const defaultActual = "• 사용자 조작 후 실제 결과를 표시합니다."

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="클라이언트 성능 측정 훅 (instrumentation-client.ts) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="클라이언트 성능 측정 훅 (instrumentation-client.ts) & Core Web Vitals">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>instrumentation-client.ts</code> 또는 <code>useReportWebVitals</code> 훅은 클라이언트 브라우저에서 측정되는 Core Web Vitals 지표(LCP, FID, CLS, INP, TTFB, FCP)를 실시간으로 수집하여 분석 플랫폼으로 전송하는 성능 관측 아키텍처입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 페이지 로드 및 사용자 인터랙션 발생 시 Next.js 성능 측정기가 LCP(최대 콘텐츠 렌더링 시간), INP(다음 페인트에 대한 상호작용 지연), CLS(누적 레이아웃 이동) 수치를 밀리초 단위로 집계하여 콘솔 및 분석 엔드포인트로 로깅하는 과정을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정량적 사용자 경험 측정</strong>: 사용자가 체감하는 로딩 속도와 인터랙션 반응성을 브라우저 실측 데이터로 수치화합니다.</li>
              <li><strong>구글 검색 순위(SEO) 최적화</strong>: Google의 Core Web Vitals 평가 기준에 부합하도록 병목 컴포넌트와 렌더링 지연 요소를 조기 발견합니다.</li>
              <li><strong>서드파티 분석 툴 완벽 연동</strong>: Google Analytics, Datadog RUM, Mixpanel 등으로 성능 지표를 즉각 전송합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>프로덕션 쇼핑몰 메인 홈 및 상품 상세의 LCP/INP 성능 모니터링</li>
              <li>신규 배포 버전과 이전 버전 간의 Core Web Vitals A/B 성능 비교</li>
              <li>결제 체크아웃 화면의 렌더링 딜레이 및 프레임 드랍 실시간 추적</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>INP(Interaction to Next Paint) 지표 대응</strong>: FID를 대체하여 구글 코어 웹 바이탈 핵심 지표로 승격된 INP 지표를 면밀히 추적해야 합니다.</li>
              <li><strong>비동기 비콘 전송</strong>: 분석 서버로 메트릭을 전송할 때는 페이지 언로드 시에도 안전한 <code>navigator.sendBeacon()</code> 또는 비동기 fetch를 사용해야 메인 스레드를 블로킹하지 않습니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
