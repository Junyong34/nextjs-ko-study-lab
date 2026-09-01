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

  const defaultExpected = "• 서버 부팅 register() 실행 훅의 동작과 기대 결과를 확인합니다."
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
        title="서버 부팅 register() 실행 훅 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="서버 부팅 register() 실행 훅">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p><code>instrumentation.ts</code>의 <code>register()</code> 함수는 Next.js 서버 인스턴스가 부팅(Cold Start)될 때 최초 1회 비동기로 실행되는 표준 라이프사이클 훅으로, OpenTelemetry 추적 에이전트 초기화, Sentry SDK 구성, 데이터베이스 커넥션 풀 사전 웜업을 수행하는 서버 계측 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 서버 기동 시 <code>register()</code>가 실행되어 APM 모니터링 에이전트를 등록하고 환경 설정 유효성을 검증한 후, 서버 런타임(Node.js vs Edge)에 따른 초기화 성공 로그를 출력하는 과정을 검증합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 부팅 시점 단 1회 안전 실행</strong>: 요청(Request) 핸들링 단계에서 중복 초기화되지 않고 서버 프로세스 시작 시점에 필수 SDK를 신뢰성 있게 기동합니다.</li>
              <li><strong>런타임별 분기 초기화 지원</strong>: <code>process.env.NEXT_RUNTIME === 'nodejs'</code> 조건을 통해 Node.js 전용 모니터링 SDK와 Edge 호환 로거를 안전하게 분리 실행합니다.</li>
              <li><strong>모니터링 사각지대 제로</strong>: 첫 번째 HTTP 요청이 인입되기 전에 추적 컨텍스트가 활성화되어 서버 콜드 스타트 지연과 초기 에러를 완벽히 캡처합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>OpenTelemetry / Datadog / NewRelic APM 분산 추적 에이전트 초기화</li>
              <li>Sentry 서버사이드 에러 모니터링 및 성능 프로파일러 구성</li>
              <li>서버 기동 시 필수 비밀키 환경변수 누락 여부 사전 검증(Health Check)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>experimental 플래그 설정 확인</strong>: Next.js 버전에 따라 <code>next.config.ts</code>에서 <code>experimental.instrumentationHook: true</code> 옵션이 필요할 수 있습니다.</li>
              <li><strong>클라이언트 코드 임포트 금지</strong>: <code>instrumentation.ts</code>는 오직 서버 런타임에서만 구동되므로 브라우저 전용 모듈을 임포트하면 서버 구동이 실패합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
