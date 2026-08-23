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

  const defaultExpected = "• 서버 부팅 register() 로그 (instrumentation.ts) 사양에 따른 정상 동작 및 상태 변화 관찰"
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
        title="서버 부팅 register() 로그 (instrumentation.ts) 실증 검증"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "Next.js App Router 공식 표준 스펙 및 실무 이커머스 도메인 규칙을 기반으로 기술 동작을 검증했습니다."}
      />
      <DemoDeepDiveCard title="서버 부팅 register() 훅 (instrumentation.ts) 및 모니터링 초기화">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>
              <code>instrumentation.ts</code>는 Next.js 서버 인스턴스가 시작(Cold Boot)될 때 단 한 번 실행되는 <code>register()</code> 함수를 export하여 OpenTelemetry, Sentry, Datadog 등 APM 모니터링 SDK를 초기화하고 서버 생명주기를 관찰하는 표준 파일 컨벤션입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              본 데모에서는 서버 프로세스가 기동될 때 <code>register()</code> 훅이 트리거되어 런타임 환경(Node.js vs Edge), Node 버전, 환경변수 유효성을 검증하고 시스템 부팅 로그와 OpenTelemetry 트레이싱 프로바이더를 등록하는 메커니즘을 검증합니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>서버 생명주기 최초 1회 실행 보장</strong>: 다중 요청이나 렌더링과 무관하게 서버 인스턴스 초기화 시점에 안전하게 전역 설정을 마칩니다.</li>
              <li><strong>OpenTelemetry 표준 추적 지원</strong>: 분산 트레이싱 및 APM 메트릭을 프레임워크 레벨에서 완벽하게 바인딩합니다.</li>
              <li><strong>런타임 분기 안전성</strong>: <code>process.env.NEXT_RUNTIME === 'nodejs'</code> 조건을 통해 Node.js 전용 SDK와 Edge 전용 SDK를 안전하게 분기 초기화합니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>OpenTelemetry / Sentry / Datadog 분산 트레이싱 SDK 초기화</li>
              <li>서버 부팅 시 데이터베이스 커넥션 풀 웜업 및 캐시 프리로딩</li>
              <li>필수 환경변수 누락 여부 사전 검증(Fail-Fast Booting)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>onRequestError 훅 지원 (Next.js 15+)</strong>: <code>instrumentation.ts</code>에서 <code>export async function onRequestError(err, request, context)</code>를 선언하면 서버/클라이언트/미들웨어에서 발생하는 모든 미처리 에러를 전역 캡처할 수 있습니다.</li>
              <li><strong>루트 디렉토리 배치</strong>: <code>instrumentation.ts</code>는 `src` 디렉토리를 사용하는 경우 `src/instrumentation.ts`, 아닐 경우 루트 `instrumentation.ts`에 배치해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
