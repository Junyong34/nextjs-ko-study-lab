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

  const defaultExpected = "• Trace ID 발급 및 Server Component Span의 동작과 기대 결과를 확인합니다."
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
        title="Trace ID 발급 및 Server Component Span 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || "이 예제의 동작과 검증 결과를 표시합니다."}
      />
      <DemoDeepDiveCard title="Trace ID 발급 및 Server Component Span">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 개념 요약</h5>
            <p>OpenTelemetry 분산 추적(Distributed Tracing)은 W3C Trace Context 표준에 따라 모든 서버 요청에 고유한 <code>Trace ID</code>를 부여하고, 서버 컴포넌트 렌더링, DB 쿼리, 외부 API 호출 구간을 <code>Span</code> 단위로 계측하여 마이크로서비스 병목을 시각화하는 엔터프라이즈 옵저버빌리티 표준입니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>본 데모에서는 주문 상세 요청 인입 시 발급된 Trace ID(<code>4bf92f3577b34da6a3ce929d0e0e4736</code>)를 기반으로 상품 DB 조회(42ms), 결제 PG 검증(120ms), RSC 직렬화(15ms)의 개별 스팬 실행 시간과 상태 코드를 계측 패널에 표시합니다.</p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>정밀한 성능 병목 핀포인트 탐지</strong>: 복잡한 서버 컴포넌트 트리 중 어느 하위 위젯이나 외부 API가 전체 렌더링을 지연시키는지 밀리초(ms) 단위로 즉각 파악합니다.</li>
              <li><strong>엔드투엔드 마이크로서비스 추적 연계</strong>: 프론트엔드 Next.js부터 백엔드 Spring/Go 서버 및 데이터베이스까지 단일 Trace ID로 연결된 통합 트레이스를 확인합니다.</li>
              <li><strong>벤더 종속성 없는 오픈 표준</strong>: Datadog, Jaeger, Zipkin, AWS X-Ray 등 다양한 모니터링 백엔드로 자유롭게 트레이스 데이터를 전송할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>전자상거래 결제 승인 및 재고 차감 트랜잭션의 구간별 지연 시간 분석</li>
              <li>대규모 트래픽 세일 이벤트 시 서버리스 RSC 렌더링 병목 구간 모니터링</li>
              <li>외부 배송사/PG사 API 타임아웃 및 일시적 네트워크 장애 추적</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>트레이스 헤더 전파(Propagation) 필수</strong>: 서버 컴포넌트에서 백엔드 API로 <code>fetch</code> 요청을 보낼 때 <code>traceparent</code> HTTP 헤더를 전달해야 분산 스팬이 끊기지 않고 이어집니다.</li>
              <li><strong>오버헤드 방지를 위한 샘플링 레이트 조절</strong>: 모든 요청을 100% 추적하면 네트워크 및 스토리지 비용이 증가하므로 프로덕션에서는 <code>Sampler</code>를 통해 적절한 샘플링 비율(예: 5~10%)을 설정해야 합니다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
